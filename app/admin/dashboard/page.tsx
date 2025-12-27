import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client"

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("admin_session")

  if (!sessionCookie) {
    redirect("/admin/login")
  }

  let session
  try {
    session = JSON.parse(sessionCookie.value)
  } catch {
    redirect("/admin/login")
  }

  const supabase = await createClient()

  // Fetch all data for admin dashboard
  const [
    { data: hospitals },
    { data: patients },
    { data: records },
    { data: violations },
    { data: contacts },
    { data: auditLogs },
    { data: officials },
  ] = await Promise.all([
    supabase.from("hospitals").select("*").order("created_at", { ascending: false }),
    supabase.from("patients").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("medical_records").select("*, hospitals(name)").order("created_at", { ascending: false }).limit(100),
    supabase.from("hospital_violations").select("*, hospitals(name)").order("created_at", { ascending: false }),
    supabase.from("contact_info").select("*").order("display_order", { ascending: true }),
    supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("system_officials").select("id, official_id, name, role, department, is_active, created_at"),
  ])

  return (
    <AdminDashboardClient
      session={session}
      hospitals={hospitals || []}
      patients={patients || []}
      records={records || []}
      violations={violations || []}
      contacts={contacts || []}
      auditLogs={auditLogs || []}
      officials={officials || []}
    />
  )
}
