import Link from "next/link"
import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">NHRS</h3>
                <p className="text-xs text-muted-foreground">National Health Records System</p>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Secure, compliant healthcare data management for India.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/patient/login" className="text-sm text-muted-foreground hover:text-foreground">
                  Patient Portal
                </Link>
              </li>
              <li>
                <Link href="/viewer/login" className="text-sm text-muted-foreground hover:text-foreground">
                  Hospital Directory
                </Link>
              </li>
              <li>
                <Link href="/authority/login" className="text-sm text-muted-foreground hover:text-foreground">
                  Medical Authority
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">Compliance</h4>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-muted-foreground">HIPAA Compliant</li>
              <li className="text-sm text-muted-foreground">Indian Health Laws</li>
              <li className="text-sm text-muted-foreground">Data Protection Act</li>
              <li className="text-sm text-muted-foreground">NABH Standards</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">Contact</h4>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-muted-foreground">Toll Free: 1800-123-4567</li>
              <li className="text-sm text-muted-foreground">support@healthrecords.gov.in</li>
              <li>
                <Link href="/contact" className="text-sm text-primary hover:underline">
                  View All Contacts
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} National Health Records System. Government of India. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
