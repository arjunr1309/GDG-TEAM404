import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const idType = searchParams.get("idType")
    const idNumber = searchParams.get("idNumber")

    if (!idType || !idNumber) {
      return NextResponse.json({ error: "ID type and number are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: patient, error } = await supabase
      .from("patients")
      .select("id, patient_id, first_name, last_name")
      .eq("personal_id_type", idType)
      .eq("personal_id_number", idNumber)
      .eq("is_active", true)
      .single()

    if (error) {
      // No patient found is not an error in this context
      return NextResponse.json({ patient: null })
    }

    return NextResponse.json({ patient })
  } catch (error) {
    console.error("Patient search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
