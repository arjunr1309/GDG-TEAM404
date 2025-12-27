"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Stethoscope,
  LogOut,
  Shield,
  Plus,
  FileText,
  Users,
  Calendar,
  Activity,
  Search,
  Clock,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { Hospital, MedicalRecord, Patient } from "@/lib/types"
import { AddRecordDialog } from "./add-record-dialog"

interface AuthorityDashboardClientProps {
  hospital: Hospital
  recentRecords: (MedicalRecord & { patient: Pick<Patient, "id" | "patient_id" | "first_name" | "last_name"> | null })[]
  stats: {
    totalRecords: number
    totalPatients: number
  }
}

export function AuthorityDashboardClient({ hospital, recentRecords, stats }: AuthorityDashboardClientProps) {
  const router = useRouter()
  const [showAddRecord, setShowAddRecord] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "hospital" }),
    })
    router.push("/authority/login")
  }

  const filteredRecords = recentRecords.filter((record) => {
    const patientName = record.patient ? `${record.patient.first_name} ${record.patient.last_name}` : ""
    return (
      patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.record_id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const todayRecords = recentRecords.filter(
    (r) => new Date(r.created_at).toDateString() === new Date().toDateString(),
  ).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-authority">
              <Stethoscope className="h-5 w-5 text-authority-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Medical Authority Portal</h1>
              <p className="text-xs text-muted-foreground">NHRS - {hospital.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 md:flex">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{hospital.hospital_id}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hospital Info */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-authority/10">
                  <Building2 className="h-8 w-8 text-authority" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{hospital.name}</CardTitle>
                  <CardDescription>
                    {hospital.city}, {hospital.state} | Director: {hospital.director_name}
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {hospital.is_certified && <Badge className="bg-success/10 text-success">Certified</Badge>}
                {hospital.nabh_accredited && <Badge className="bg-primary/10 text-primary">NABH</Badge>}
                {hospital.hipaa_compliant && <Badge className="bg-accent/10 text-accent">HIPAA</Badge>}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-authority/10">
                <FileText className="h-6 w-6 text-authority" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalRecords}</p>
                <p className="text-sm text-muted-foreground">Total Records</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-patient/10">
                <Users className="h-6 w-6 text-patient" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPatients}</p>
                <p className="text-sm text-muted-foreground">Patients Registered</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <Calendar className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{todayRecords}</p>
                <p className="text-sm text-muted-foreground">{"Today's Records"}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <Activity className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{recentRecords.filter((r) => r.status === "Active").length}</p>
                <p className="text-sm text-muted-foreground">Active Cases</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Recent Records */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full gap-2 bg-authority text-authority-foreground hover:bg-authority/90"
                  onClick={() => setShowAddRecord(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add New Medical Record
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                  onClick={() => router.push("/authority/patients")}
                >
                  <Users className="h-4 w-4" />
                  View All Patients
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                  onClick={() => router.push("/authority/records")}
                >
                  <FileText className="h-4 w-4" />
                  View All Records
                </Button>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Compliance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">HIPAA Compliant</span>
                  <Badge
                    variant={hospital.hipaa_compliant ? "default" : "destructive"}
                    className={hospital.hipaa_compliant ? "bg-success text-success-foreground" : ""}
                  >
                    {hospital.hipaa_compliant ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Indian Health Laws</span>
                  <Badge
                    variant={hospital.indian_health_law_compliant ? "default" : "destructive"}
                    className={hospital.indian_health_law_compliant ? "bg-success text-success-foreground" : ""}
                  >
                    {hospital.indian_health_law_compliant ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">NABH Accredited</span>
                  <Badge
                    variant={hospital.nabh_accredited ? "default" : "secondary"}
                    className={hospital.nabh_accredited ? "bg-success text-success-foreground" : ""}
                  >
                    {hospital.nabh_accredited ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Records */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Recent Records
                    </CardTitle>
                    <CardDescription>Latest medical records added</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search records..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredRecords.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No records found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {searchQuery ? "Try adjusting your search" : "Add your first medical record"}
                    </p>
                    {!searchQuery && (
                      <Button className="mt-4 gap-2" onClick={() => setShowAddRecord(true)}>
                        <Plus className="h-4 w-4" />
                        Add Record
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredRecords.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="hidden h-10 w-10 items-center justify-center rounded-lg bg-muted sm:flex">
                            <Activity className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {record.patient
                                ? `${record.patient.first_name} ${record.patient.last_name}`
                                : "Unknown Patient"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {record.diagnosis} | {record.visit_type}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-muted-foreground">{record.record_id}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(record.created_at).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Add Record Dialog */}
      <AddRecordDialog
        open={showAddRecord}
        onOpenChange={setShowAddRecord}
        hospitalId={hospital.id}
        hospitalName={hospital.name}
      />
    </div>
  )
}
