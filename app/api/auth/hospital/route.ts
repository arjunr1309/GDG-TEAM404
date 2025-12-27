import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hospitalId, password } = body

    const supabase = await createClient()

    // Find hospital by hospital_id
    const { data: hospital, error } = await supabase
      .from("hospitals")
      .select("*")
      .eq("hospital_id", hospitalId)
      .eq("is_active", true)
      .single()

    if (error || !hospital) {
      return NextResponse.json({ error: "Invalid Hospital ID or password" }, { status: 401 })
    }

    // For demo, we'll accept any password since we have placeholder hashes
    // In production, use bcrypt.compare(password, hospital.password_hash)
    if (!hospital) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session cookie
    const cookieStore = await cookies()
    cookieStore.set(
      "hospital_session",
      JSON.stringify({
        id: hospital.id,
        hospital_id: hospital.hospital_id,
        name: hospital.name,
        director: hospital.director_name,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 8, // 8 hours
      },
    )

    // Log audit event
    await supabase.from("audit_logs").insert({
      action: "LOGIN",
      table_name: "hospitals",
      record_id: hospital.id,
      user_type: "hospital",
      user_id: hospital.hospital_id,
      user_email: hospital.email,
    })

    return NextResponse.json({
      success: true,
      hospital: {
        id: hospital.id,
        hospital_id: hospital.hospital_id,
        name: hospital.name,
      },
    })
  } catch (error) {
    console.error("Hospital login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
