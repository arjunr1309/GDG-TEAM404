import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ContactPageClient } from "@/components/contact/contact-page-client"

export default async function ContactPage() {
  const supabase = await createClient()

  const { data: contacts } = await supabase
    .from("contact_info")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ContactPageClient contacts={contacts || []} />
      </main>
      <Footer />
    </div>
  )
}
