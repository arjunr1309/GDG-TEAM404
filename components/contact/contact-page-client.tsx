"use client"

import { Phone, Mail, MapPin, Clock, User, Star, Building2, HelpCircle, AlertCircle, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ContactInfo } from "@/lib/types"

interface ContactPageClientProps {
  contacts: ContactInfo[]
}

export function ContactPageClient({ contacts }: ContactPageClientProps) {
  const primaryContact = contacts.find((c) => c.is_primary)
  const otherContacts = contacts.filter((c) => !c.is_primary)

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Contact Us</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Get in touch with the National Health Records System administration for queries, support, or grievances.
            </p>
          </div>
        </div>
      </section>

      {/* Primary Contact */}
      {primaryContact && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="overflow-hidden border-2 border-primary/20">
              <div className="grid md:grid-cols-2">
                <div className="bg-primary p-8 text-primary-foreground">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    <span className="text-sm font-medium uppercase tracking-wide">Primary Contact</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold">{primaryContact.name}</h2>
                  <p className="mt-1 text-primary-foreground/80">{primaryContact.designation}</p>
                  <p className="text-sm text-primary-foreground/60">{primaryContact.department}</p>
                </div>
                <CardContent className="flex flex-col justify-center gap-4 p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a href={`tel:${primaryContact.phone}`} className="font-medium hover:text-primary">
                        {primaryContact.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a href={`mailto:${primaryContact.email}`} className="font-medium hover:text-primary">
                        {primaryContact.email}
                      </a>
                    </div>
                  </div>
                  {primaryContact.office_address && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Office</p>
                        <p className="font-medium">{primaryContact.office_address}</p>
                      </div>
                    </div>
                  )}
                  {primaryContact.office_hours && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Office Hours</p>
                        <p className="font-medium">{primaryContact.office_hours}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* All Contacts */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-foreground">All Contacts</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherContacts.map((contact) => (
              <Card key={contact.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <Badge variant="secondary">{contact.department}</Badge>
                  </div>
                  <CardTitle className="mt-4">{contact.name}</CardTitle>
                  <CardDescription>{contact.designation}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${contact.phone}`} className="hover:text-primary">
                      {contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${contact.email}`} className="truncate hover:text-primary">
                      {contact.email}
                    </a>
                  </div>
                  {contact.office_address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="text-muted-foreground">{contact.office_address}</span>
                    </div>
                  )}
                  {contact.office_hours && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{contact.office_hours}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="border-t border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-foreground">Quick Help</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-patient/10">
                  <HelpCircle className="h-6 w-6 text-patient" />
                </div>
                <CardTitle className="mt-4">Patient Support</CardTitle>
                <CardDescription>
                  Need help accessing your records? Having trouble with your Patient ID or login?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Contact us at <strong>support@healthrecords.gov.in</strong> or call our toll-free number{" "}
                  <strong>1800-123-4567</strong>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-authority/10">
                  <Building2 className="h-6 w-6 text-authority" />
                </div>
                <CardTitle className="mt-4">Hospital Registration</CardTitle>
                <CardDescription>
                  Are you a healthcare provider looking to register with the National Health Records System?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Contact our registration desk at <strong>registration@healthrecords.gov.in</strong> for onboarding
                  assistance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="mt-4">Grievance Redressal</CardTitle>
                <CardDescription>Have a complaint or grievance regarding the system or a hospital?</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Submit your grievance at <strong>grievance@healthrecords.gov.in</strong> and we'll respond within 7
                  working days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance Info */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="bg-muted/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <CardTitle>Compliance & Legal</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium">Data Protection</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  All data is protected under the Information Technology Act, 2000 and subsequent amendments. We comply
                  with the Digital Personal Data Protection Act, 2023.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Health Records</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Medical records are maintained as per the Clinical Establishments Act, 2010 and HIPAA standards for
                  international compliance.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Patient Rights</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Patients have the right to access, download, and request corrections to their medical records as per
                  the Patient Charter of Rights.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Hospital Compliance</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  All registered hospitals must maintain NABH/NABL accreditation standards and comply with Indian
                  medical regulations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
