import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { PublicHospitalDirectory } from "@/components/hospitals/public-hospital-directory"

export default async function PublicHospitalsPage() {
  const supabase = await createClient()

  const { data: hospitals } = await supabase
    .from("hospitals")
    .select(
      "id, hospital_id, name, director_name, city, state, region, type, is_certified, nabh_accredited, hipaa_compliant",
    )
    .eq("is_active", true)
    .order("name", { ascending: true })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <PublicHospitalDirectory hospitals={hospitals || []} />
      </main>
      <Footer />
    </div>
  )
}
