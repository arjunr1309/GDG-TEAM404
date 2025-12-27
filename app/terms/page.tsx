import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
          <p className="mt-2 text-muted-foreground">Last updated: December 2024</p>

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  By accessing and using the National Health Records System (NHRS), you agree to be bound by these Terms
                  of Service. If you do not agree to these terms, please do not use the system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  <strong>Patients must:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Keep login credentials secure and confidential</li>
                  <li>Report any unauthorized access immediately</li>
                  <li>Provide accurate information when required</li>
                </ul>
                <p className="mt-4">
                  <strong>Healthcare Providers must:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Maintain valid accreditation and licenses</li>
                  <li>Enter accurate and complete medical records</li>
                  <li>Follow data protection protocols</li>
                  <li>Report security incidents within 24 hours</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Prohibited Activities</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>Users are prohibited from:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Attempting to access records without authorization</li>
                  <li>Sharing login credentials with unauthorized persons</li>
                  <li>Uploading false or misleading medical information</li>
                  <li>Attempting to breach system security</li>
                  <li>Using the system for any illegal purpose</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Data Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  Healthcare providers are responsible for the accuracy of medical records entered into the system. The
                  NHRS administration does not verify the medical accuracy of records and cannot be held liable for
                  errors in medical data entered by healthcare providers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>The NHRS is provided "as is" without warranties of any kind. We are not liable for:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Service interruptions or technical failures</li>
                  <li>Errors in data entered by healthcare providers</li>
                  <li>Unauthorized access resulting from user negligence</li>
                  <li>Any indirect or consequential damages</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  These terms are governed by the laws of India. Any disputes shall be subject to the exclusive
                  jurisdiction of courts in New Delhi, India.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  We reserve the right to modify these terms at any time. Users will be notified of significant changes
                  via email or system notification. Continued use of the system after changes constitutes acceptance of
                  the new terms.
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
