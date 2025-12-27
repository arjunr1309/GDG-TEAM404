import Link from "next/link"
import { User, Building2, Stethoscope, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const portals = [
  {
    title: "Patient Portal",
    description: "Access your personal health records securely using your Patient ID or Personal ID.",
    icon: User,
    href: "/patient/login",
    color: "patient",
    features: ["View medical history", "Download records", "Track prescriptions"],
    note: "Login credentials provided by your healthcare provider",
  },
  {
    title: "Public Viewer",
    description: "Explore the directory of registered hospitals across India with compliance details.",
    icon: Building2,
    href: "/viewer/login",
    color: "viewer",
    features: ["Hospital directory", "Compliance status", "Search & filter"],
    note: "Registration available for public access",
  },
  {
    title: "Medical Authority",
    description: "Hospital staff portal for managing patient records and medical data entry.",
    icon: Stethoscope,
    href: "/authority/login",
    color: "authority",
    features: ["Add patient records", "Manage medical data", "Review submissions"],
    note: "Hospital credentials required for access",
  },
]

export function PortalCards() {
  return (
    <section id="portals" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Access Portals</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Choose your portal to access the National Health Records System
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {portals.map((portal) => (
            <Card
              key={portal.title}
              className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-lg"
            >
              <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: `var(--${portal.color})` }} />
              <CardHeader className="pb-4">
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `color-mix(in oklch, var(--${portal.color}) 15%, transparent)` }}
                >
                  <portal.icon className="h-7 w-7" style={{ color: `var(--${portal.color})` }} />
                </div>
                <CardTitle className="text-xl">{portal.title}</CardTitle>
                <CardDescription className="text-sm">{portal.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {portal.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground italic">{portal.note}</p>
                <Link href={portal.href} className="block">
                  <Button
                    className="w-full gap-2 transition-all duration-300"
                    style={{
                      backgroundColor: `var(--${portal.color})`,
                      color: `var(--${portal.color}-foreground)`,
                    }}
                  >
                    Access Portal
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
