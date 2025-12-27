import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { PortalCards } from "@/components/landing/portal-cards"
import { ContactBanner } from "@/components/landing/contact-banner"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PortalCards />
        <ContactBanner />
      </main>
      <Footer />
    </div>
  )
}
