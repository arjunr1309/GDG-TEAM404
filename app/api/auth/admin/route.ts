import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { officialId, password } = await request.json()

    if (!officialId || !password) {
      return NextResponse.json({ error: "Official ID and password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Find the system official
    const { data: official, error } = await supabase
      .from("system_officials")
      .select("*")
      .eq("official_id", officialId)
      .eq("is_active", true)
      .single()

    if (error || !official) {
      // Log failed attempt
      await supabase.from("audit_logs").insert({
        action: "admin_login_failed",
        table_name: "system_officials",
        new_data: { attempted_id: officialId },
      })
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, official.password_hash)

    if (!isValidPassword) {
      // Log failed attempt
      await supabase.from("audit_logs").insert({
        action: "admin_login_failed",
        table_name: "system_officials",
        new_data: { official_id: official.id, reason: "invalid_password" },
      })
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Log successful login
    await supabase.from("audit_logs").insert({
      action: "admin_login_success",
      table_name: "system_officials",
      record_id: official.id,
      new_data: { official_id: official.official_id, role: official.role },
    })

    // Set session cookie
    const cookieStore = await cookies()
    const sessionData = {
      id: official.id,
      officialId: official.official_id,
      name: official.name,
      role: official.role,
      department: official.department,
      type: "admin",
    }

    cookieStore.set("admin_session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
    })

    return NextResponse.json({
      success: true,
      official: {
        name: official.name,
        role: official.role,
        department: official.department,
      },
    })
  } catch (error) {
    console.error("Admin auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
