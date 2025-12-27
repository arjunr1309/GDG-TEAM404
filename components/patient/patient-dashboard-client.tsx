"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  FileText,
  Calendar,
  LogOut,
  Shield,
  Activity,
  Pill,
  Building2,
  Download,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Patient, MedicalRecord } from "@/lib/types"

interface PatientDashboardClientProps {
  patient: Patient
  records: (MedicalRecord & { hospital: { id: string; name: string; city: string; state: string } | null })[]
}

export function PatientDashboardClient({ patient, records }: PatientDashboardClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string | null>(null)
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "patient" }),
    })
    router.push("/patient/login")
  }

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.attending_doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.hospital?.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = !filterType || record.visit_type === filterType

    return matchesSearch && matchesFilter
  })

  const visitTypes = [...new Set(records.map((r) => r.visit_type))]

  const getVisitTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      OPD: "bg-blue-100 text-blue-800",
      IPD: "bg-purple-100 text-purple-800",
      Emergency: "bg-red-100 text-red-800",
      "Follow-up": "bg-green-100 text-green-800",
      Surgery: "bg-orange-100 text-orange-800",
      "Lab Test": "bg-cyan-100 text-cyan-800",
      Radiology: "bg-indigo-100 text-indigo-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-patient">
              <Shield className="h-5 w-5 text-patient-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Patient Portal</h1>
              <p className="text-xs text-muted-foreground">NHRS - National Health Records System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {patient.first_name} {patient.last_name}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Patient Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-patient/10">
                  <User className="h-8 w-8 text-patient" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {patient.first_name} {patient.last_name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span>Patient ID: {patient.patient_id}</span>
                  </CardDescription>
                </div>
              </div>
              <Badge className="w-fit bg-success/10 text-success hover:bg-success/20">Active Patient</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">
                  {new Date(patient.date_of_birth).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <p className="font-medium">{patient.blood_group || "Not specified"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">
                  {patient.address_line1}, {patient.city}, {patient.state} - {patient.pincode}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{patient.personal_id_type}</p>
                <p className="font-medium">{patient.personal_id_number}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Emergency Contact</p>
                <p className="font-medium">{patient.emergency_contact_phone || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{records.length}</p>
                <p className="text-sm text-muted-foreground">Total Records</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-viewer/10">
                <Building2 className="h-6 w-6 text-viewer" />
              </div>
              <div>
                <p className="text-2xl font-bold">{new Set(records.map((r) => r.hospital_id)).size}</p>
                <p className="text-sm text-muted-foreground">Hospitals Visited</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Activity className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{records.filter((r) => r.status === "Active").length}</p>
                <p className="text-sm text-muted-foreground">Active Cases</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <Calendar className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{records.filter((r) => r.follow_up_date).length}</p>
                <p className="text-sm text-muted-foreground">Follow-ups</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Records Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Medical Records
                </CardTitle>
                <CardDescription>View your complete medical history</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search records..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-transparent">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilterType(null)}>All Types</DropdownMenuItem>
                    {visitTypes.map((type) => (
                      <DropdownMenuItem key={type} onClick={() => setFilterType(type)}>
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No records found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery || filterType
                    ? "Try adjusting your search or filter"
                    : "Your medical records will appear here"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-lg border border-border bg-card transition-all hover:border-primary/50"
                  >
                    <div
                      className="flex cursor-pointer items-center justify-between p-4"
                      onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-muted sm:flex">
                          <Activity className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{record.diagnosis}</h4>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {record.hospital?.name || "Unknown Hospital"}
                            </span>
                            <span className="text-muted-foreground/50">|</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(record.visit_date).toLocaleDateString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getVisitTypeColor(record.visit_type)}>{record.visit_type}</Badge>
                        {expandedRecord === record.id ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {expandedRecord === record.id && (
                      <div className="border-t border-border p-4">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-4">
                            <div>
                              <h5 className="text-sm font-medium text-muted-foreground">Attending Doctor</h5>
                              <p className="mt-1">{record.attending_doctor}</p>
                              {record.doctor_registration_number && (
                                <p className="text-sm text-muted-foreground">
                                  Reg: {record.doctor_registration_number}
                                </p>
                              )}
                            </div>
                            {record.chief_complaint && (
                              <div>
                                <h5 className="text-sm font-medium text-muted-foreground">Chief Complaint</h5>
                                <p className="mt-1">{record.chief_complaint}</p>
                              </div>
                            )}
                            {record.symptoms && record.symptoms.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium text-muted-foreground">Symptoms</h5>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {record.symptoms.map((symptom, i) => (
                                    <Badge key={i} variant="secondary">
                                      {symptom}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {record.treatment_given && (
                              <div>
                                <h5 className="text-sm font-medium text-muted-foreground">Treatment</h5>
                                <p className="mt-1">{record.treatment_given}</p>
                              </div>
                            )}
                          </div>
                          <div className="space-y-4">
                            {/* Vitals */}
                            {(record.blood_pressure || record.heart_rate || record.temperature) && (
                              <div>
                                <h5 className="text-sm font-medium text-muted-foreground">Vitals</h5>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                  {record.blood_pressure && (
                                    <div className="rounded bg-muted/50 p-2 text-center">
                                      <p className="text-xs text-muted-foreground">Blood Pressure</p>
                                      <p className="font-medium">{record.blood_pressure}</p>
                                    </div>
                                  )}
                                  {record.heart_rate && (
                                    <div className="rounded bg-muted/50 p-2 text-center">
                                      <p className="text-xs text-muted-foreground">Heart Rate</p>
                                      <p className="font-medium">{record.heart_rate} bpm</p>
                                    </div>
                                  )}
                                  {record.temperature && (
                                    <div className="rounded bg-muted/50 p-2 text-center">
                                      <p className="text-xs text-muted-foreground">Temperature</p>
                                      <p className="font-medium">{record.temperature}°F</p>
                                    </div>
                                  )}
                                  {record.weight && (
                                    <div className="rounded bg-muted/50 p-2 text-center">
                                      <p className="text-xs text-muted-foreground">Weight</p>
                                      <p className="font-medium">{record.weight} kg</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {/* Medications */}
                            {record.medications_prescribed && record.medications_prescribed.length > 0 && (
                              <div>
                                <h5 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                  <Pill className="h-4 w-4" />
                                  Medications Prescribed
                                </h5>
                                <div className="mt-2 space-y-2">
                                  {record.medications_prescribed.map((med, i) => (
                                    <div key={i} className="rounded bg-muted/50 p-2">
                                      <p className="font-medium">{med.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {med.dosage} | {med.frequency} | {med.duration}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* Follow-up */}
                            {record.follow_up_date && (
                              <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
                                <h5 className="flex items-center gap-2 text-sm font-medium text-warning">
                                  <Clock className="h-4 w-4" />
                                  Follow-up Scheduled
                                </h5>
                                <p className="mt-1 font-medium">
                                  {new Date(record.follow_up_date).toLocaleDateString("en-IN", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </p>
                                {record.follow_up_notes && (
                                  <p className="mt-1 text-sm text-muted-foreground">{record.follow_up_notes}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Download className="h-4 w-4" />
                            Download Record
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
