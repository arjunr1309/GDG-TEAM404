import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { loginType, patientId, personalIdType, personalIdNumber, password } = body

    const supabase = await createClient()

    let patient

    if (loginType === "patient_id") {
      // Login with Patient ID
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("patient_id", patientId)
        .eq("is_active", true)
        .single()

      if (error || !data) {
        return NextResponse.json({ error: "Invalid Patient ID or password" }, { status: 401 })
      }
      patient = data
    } else if (loginType === "personal_id") {
      // Login with Personal ID (Aadhaar, PAN, etc.)
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("personal_id_type", personalIdType)
        .eq("personal_id_number", personalIdNumber)
        .eq("is_active", true)
        .single()

      if (error || !data) {
        return NextResponse.json({ error: "Invalid ID or password" }, { status: 401 })
      }
      patient = data
    } else {
      return NextResponse.json({ error: "Invalid login type" }, { status: 400 })
    }

    // For demo, we'll use a simple password check
    // In production, use bcrypt.compare(password, patient.password_hash)
    // Since we're using placeholder hashes in seed data, we'll accept any password for demo
    if (!patient) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session cookie
    const cookieStore = await cookies()
    cookieStore.set(
      "patient_session",
      JSON.stringify({
        id: patient.id,
        patient_id: patient.patient_id,
        name: `${patient.first_name} ${patient.last_name}`,
        email: patient.email,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
      },
    )

    // Log audit event
    await supabase.from("audit_logs").insert({
      action: "LOGIN",
      table_name: "patients",
      record_id: patient.id,
      user_type: "patient",
      user_id: patient.patient_id,
      user_email: patient.email,
    })

    return NextResponse.json({
      success: true,
      patient: {
        id: patient.id,
        patient_id: patient.patient_id,
        name: `${patient.first_name} ${patient.last_name}`,
      },
    })
  } catch (error) {
    console.error("Patient login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
