import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ViewerDashboardClient } from "@/components/viewer/viewer-dashboard-client"

export default async function ViewerDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/viewer/login")
  }

  // Fetch all hospitals (public data)
  const { data: hospitals } = await supabase
    .from("hospitals")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true })

  // Fetch violations for all hospitals
  const { data: violations } = await supabase.from("hospital_violations").select("*")

  return <ViewerDashboardClient user={user} hospitals={hospitals || []} violations={violations || []} />
}
