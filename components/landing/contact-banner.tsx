import Link from "next/link"
import { Phone, Mail, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContactBanner() {
  return (
    <section className="border-t border-border bg-muted/50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 rounded-2xl bg-card p-8 shadow-sm md:flex-row md:p-12">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-foreground">Need Assistance?</h3>
            <p className="mt-2 text-muted-foreground">
              Contact our support team for queries, grievances, or technical assistance.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="tel:1800-123-4567">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Phone className="h-4 w-4" />
                1800-123-4567
              </Button>
            </Link>
            <Link href="mailto:support@healthrecords.gov.in">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Mail className="h-4 w-4" />
                Email Support
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="gap-2">
                <HelpCircle className="h-4 w-4" />
                All Contacts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
