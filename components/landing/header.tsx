import Link from "next/link"
import { Shield, Phone, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-foreground">NHRS</h1>
            <p className="text-xs text-muted-foreground">National Health Records System</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/#portals"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Access Portals
          </Link>
          <Link
            href="/hospitals"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Hospital Directory
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/admin/login" className="hidden sm:flex">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Button>
          </Link>
          <Link href="/contact" className="hidden sm:flex">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Phone className="h-4 w-4" />
              <span>Helpline</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
