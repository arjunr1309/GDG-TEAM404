import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("admin_session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const supabase = await createClient()

    const { data: violation, error } = await supabase
      .from("hospital_violations")
      .insert({
        hospital_id: data.hospital_id,
        violation_type: data.violation_type,
        severity: data.severity,
        description: data.description,
        violation_date: data.violation_date,
        fine_amount: data.fine_amount,
        corrective_action: data.corrective_action,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating violation:", error)
      return NextResponse.json({ error: "Failed to record violation" }, { status: 500 })
    }

    // Log the action
    await supabase.from("audit_logs").insert({
      action: "violation_recorded",
      table_name: "hospital_violations",
      record_id: violation.id,
      new_data: violation,
    })

    return NextResponse.json({ success: true, violation })
  } catch (error) {
    console.error("Violation creation error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
