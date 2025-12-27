import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="mt-2 text-muted-foreground">Last updated: December 2024</p>

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>The National Health Records System collects the following types of information:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    <strong>Patient Information:</strong> Name, contact details, government ID, medical history,
                    diagnoses, treatments, and prescriptions.
                  </li>
                  <li>
                    <strong>Hospital Information:</strong> Registration details, compliance certifications, staff
                    credentials, and violation records.
                  </li>
                  <li>
                    <strong>Viewer Information:</strong> Email address and authentication data for public directory
                    access.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide secure access to medical records</li>
                  <li>To facilitate healthcare coordination between providers</li>
                  <li>To maintain hospital compliance records</li>
                  <li>To improve healthcare services and system functionality</li>
                  <li>To comply with legal and regulatory requirements</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Data Protection & Security</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>We implement industry-standard security measures including:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>256-bit encryption for data in transit and at rest</li>
                  <li>Multi-factor authentication for sensitive access</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Role-based access controls</li>
                  <li>Comprehensive audit logging</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>Under Indian law and international standards, you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Access your personal and medical data</li>
                  <li>Request corrections to inaccurate information</li>
                  <li>Download your complete medical records</li>
                  <li>Know who has accessed your records</li>
                  <li>File complaints about data handling</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Compliance</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>This system complies with:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>HIPAA (Health Insurance Portability and Accountability Act)</li>
                  <li>Information Technology Act, 2000</li>
                  <li>Digital Personal Data Protection Act, 2023</li>
                  <li>Clinical Establishments Act, 2010</li>
                  <li>Indian Medical Council Regulations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>For privacy-related inquiries, contact our Data Protection Officer at:</p>
                <p className="mt-2">
                  <strong>Email:</strong> privacy@healthrecords.gov.in
                  <br />
                  <strong>Phone:</strong> 1800-123-4567
                  <br />
                  <strong>Address:</strong> Room 101, Health Ministry Building, New Delhi
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
