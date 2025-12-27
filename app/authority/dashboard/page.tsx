import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AuthorityDashboardClient } from "@/components/authority/authority-dashboard-client"

export default async function AuthorityDashboardPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("hospital_session")

  if (!sessionCookie) {
    redirect("/authority/login")
  }

  let session
  try {
    session = JSON.parse(sessionCookie.value)
  } catch {
    redirect("/authority/login")
  }

  const supabase = await createClient()

  // Fetch hospital details
  const { data: hospital } = await supabase.from("hospitals").select("*").eq("id", session.id).single()

  if (!hospital) {
    redirect("/authority/login")
  }

  // Fetch recent medical records created by this hospital
  const { data: recentRecords } = await supabase
    .from("medical_records")
    .select(
      `
      *,
      patient:patients(id, patient_id, first_name, last_name)
    `,
    )
    .eq("hospital_id", hospital.id)
    .order("created_at", { ascending: false })
    .limit(20)

  // Get stats
  const { count: totalRecords } = await supabase
    .from("medical_records")
    .select("*", { count: "exact", head: true })
    .eq("hospital_id", hospital.id)

  const { count: totalPatients } = await supabase
    .from("patients")
    .select("*", { count: "exact", head: true })
    .eq("created_by_hospital", hospital.id)

  return (
    <AuthorityDashboardClient
      hospital={hospital}
      recentRecords={recentRecords || []}
      stats={{
        totalRecords: totalRecords || 0,
        totalPatients: totalPatients || 0,
      }}
    />
  )
}
