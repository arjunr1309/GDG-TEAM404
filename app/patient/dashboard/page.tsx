import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PatientDashboardClient } from "@/components/patient/patient-dashboard-client"

export default async function PatientDashboardPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("patient_session")

  if (!sessionCookie) {
    redirect("/patient/login")
  }

  let session
  try {
    session = JSON.parse(sessionCookie.value)
  } catch {
    redirect("/patient/login")
  }

  const supabase = await createClient()

  // Fetch patient details
  const { data: patient } = await supabase.from("patients").select("*").eq("id", session.id).single()

  if (!patient) {
    redirect("/patient/login")
  }

  // Fetch medical records for this patient
  const { data: records } = await supabase
    .from("medical_records")
    .select(
      `
      *,
      hospital:hospitals(id, name, city, state)
    `,
    )
    .eq("patient_id", patient.id)
    .order("visit_date", { ascending: false })

  return <PatientDashboardClient patient={patient} records={records || []} />
}
