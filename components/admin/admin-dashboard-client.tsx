"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Shield,
  LogOut,
  Building2,
  Users,
  FileText,
  AlertTriangle,
  Phone,
  Activity,
  UserCog,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  CheckCircle,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HospitalForm } from "./hospital-form"
import { ContactForm } from "./contact-form"
import { ViolationForm } from "./violation-form"

interface AdminDashboardClientProps {
  session: {
    id: string
    officialId: string
    name: string
    role: string
    department: string
  }
  hospitals: any[]
  patients: any[]
  records: any[]
  violations: any[]
  contacts: any[]
  auditLogs: any[]
  officials: any[]
}

export function AdminDashboardClient({
  session,
  hospitals,
  patients,
  records,
  violations,
  contacts,
  auditLogs,
  officials,
}: AdminDashboardClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [showHospitalForm, setShowHospitalForm] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [showViolationForm, setShowViolationForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [viewingItem, setViewingItem] = useState<any>(null)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  const stats = [
    { label: "Total Hospitals", value: hospitals.length, icon: Building2, color: "text-blue-500" },
    { label: "Total Patients", value: patients.length, icon: Users, color: "text-green-500" },
    { label: "Medical Records", value: records.length, icon: FileText, color: "text-purple-500" },
    {
      label: "Active Violations",
      value: violations.filter((v) => v.status !== "resolved").length,
      icon: AlertTriangle,
      color: "text-red-500",
    },
    { label: "System Officials", value: officials.length, icon: UserCog, color: "text-orange-500" },
    { label: "Contact Entries", value: contacts.length, icon: Phone, color: "text-teal-500" },
  ]

  const filteredHospitals = hospitals.filter(
    (h) =>
      h.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.hospital_id?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredPatients = patients.filter(
    (p) =>
      p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patient_id?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Admin Control Panel</h1>
              <p className="text-sm text-slate-400">National Health Records System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{session.name}</p>
              <p className="text-xs text-slate-400">
                {session.role} - {session.department}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-white">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-slate-700 bg-slate-800/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="hospitals" className="data-[state=active]:bg-slate-700">
              Hospitals
            </TabsTrigger>
            <TabsTrigger value="patients" className="data-[state=active]:bg-slate-700">
              Patients
            </TabsTrigger>
            <TabsTrigger value="violations" className="data-[state=active]:bg-slate-700">
              Violations
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-slate-700">
              Contacts
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-slate-700">
              Audit Logs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Activity */}
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-slate-400">Latest system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-700">
                          <Activity className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{log.action}</p>
                          <p className="text-xs text-slate-400">
                            {log.table_name} - {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-slate-400">Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <Button
                    onClick={() => setShowHospitalForm(true)}
                    className="justify-start bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Hospital
                  </Button>
                  <Button
                    onClick={() => setShowContactForm(true)}
                    className="justify-start bg-teal-500/10 text-teal-400 hover:bg-teal-500/20"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Contact Information
                  </Button>
                  <Button
                    onClick={() => setShowViolationForm(true)}
                    className="justify-start bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Record Violation
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* System Officials */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">System Officials</CardTitle>
                <CardDescription className="text-slate-400">Authorized administrators</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-400">Official ID</TableHead>
                      <TableHead className="text-slate-400">Name</TableHead>
                      <TableHead className="text-slate-400">Role</TableHead>
                      <TableHead className="text-slate-400">Department</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {officials.map((official) => (
                      <TableRow key={official.id} className="border-slate-700">
                        <TableCell className="font-mono text-sm text-white">{official.official_id}</TableCell>
                        <TableCell className="text-white">{official.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {official.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400">{official.department}</TableCell>
                        <TableCell>
                          {official.is_active ? (
                            <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                          ) : (
                            <Badge className="bg-red-500/20 text-red-400">Inactive</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hospitals Tab */}
          <TabsContent value="hospitals" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search hospitals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500"
                />
              </div>
              <Button onClick={() => setShowHospitalForm(true)} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="mr-2 h-4 w-4" />
                Add Hospital
              </Button>
            </div>

            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-400">Hospital ID</TableHead>
                      <TableHead className="text-slate-400">Name</TableHead>
                      <TableHead className="text-slate-400">Type</TableHead>
                      <TableHead className="text-slate-400">Location</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHospitals.map((hospital) => (
                      <TableRow key={hospital.id} className="border-slate-700">
                        <TableCell className="font-mono text-sm text-white">{hospital.hospital_id}</TableCell>
                        <TableCell className="text-white">{hospital.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {hospital.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {hospital.city}, {hospital.state}
                        </TableCell>
                        <TableCell>
                          {hospital.is_verified ? (
                            <Badge className="bg-green-500/20 text-green-400">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/20 text-amber-400">
                              <Clock className="mr-1 h-3 w-3" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                Actions
                                <ChevronDown className="ml-1 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border-slate-700 bg-slate-800">
                              <DropdownMenuItem
                                onClick={() => setViewingItem({ type: "hospital", data: hospital })}
                                className="text-slate-300 focus:bg-slate-700 focus:text-white"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingItem(hospital)
                                  setShowHospitalForm(true)
                                }}
                                className="text-slate-300 focus:bg-slate-700 focus:text-white"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search patients by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-400">Patient ID</TableHead>
                      <TableHead className="text-slate-400">Name</TableHead>
                      <TableHead className="text-slate-400">Personal ID</TableHead>
                      <TableHead className="text-slate-400">Contact</TableHead>
                      <TableHead className="text-slate-400">Created</TableHead>
                      <TableHead className="text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id} className="border-slate-700">
                        <TableCell className="font-mono text-sm text-white">{patient.patient_id}</TableCell>
                        <TableCell className="text-white">{patient.full_name}</TableCell>
                        <TableCell className="text-slate-400">
                          {patient.personal_id_type}: {patient.personal_id_number}
                        </TableCell>
                        <TableCell className="text-slate-400">{patient.phone}</TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(patient.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                Actions
                                <ChevronDown className="ml-1 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border-slate-700 bg-slate-800">
                              <DropdownMenuItem
                                onClick={() => setViewingItem({ type: "patient", data: patient })}
                                className="text-slate-300 focus:bg-slate-700 focus:text-white"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Records
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-300 focus:bg-slate-700 focus:text-white">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Info
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Violations Tab */}
          <TabsContent value="violations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Hospital Violations</h2>
              <Button onClick={() => setShowViolationForm(true)} className="bg-red-500 hover:bg-red-600">
                <Plus className="mr-2 h-4 w-4" />
                Record Violation
              </Button>
            </div>

            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-400">Hospital</TableHead>
                      <TableHead className="text-slate-400">Violation Type</TableHead>
                      <TableHead className="text-slate-400">Severity</TableHead>
                      <TableHead className="text-slate-400">Date</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {violations.map((violation) => (
                      <TableRow key={violation.id} className="border-slate-700">
                        <TableCell className="text-white">{violation.hospitals?.name}</TableCell>
                        <TableCell className="text-slate-300">{violation.violation_type}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              violation.severity === "critical"
                                ? "bg-red-500/20 text-red-400"
                                : violation.severity === "major"
                                  ? "bg-orange-500/20 text-orange-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                            }
                          >
                            {violation.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(violation.violation_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              violation.status === "resolved"
                                ? "bg-green-500/20 text-green-400"
                                : violation.status === "under_review"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-red-500/20 text-red-400"
                            }
                          >
                            {violation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Contact Information</h2>
              <Button onClick={() => setShowContactForm(true)} className="bg-teal-500 hover:bg-teal-600">
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contacts.map((contact) => (
                <Card key={contact.id} className="border-slate-700 bg-slate-800/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">{contact.name}</CardTitle>
                        <CardDescription className="text-slate-400">{contact.designation}</CardDescription>
                      </div>
                      {contact.is_primary && <Badge className="bg-amber-500/20 text-amber-400">Primary</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-slate-400">
                      <strong className="text-slate-300">Department:</strong> {contact.department}
                    </p>
                    <p className="text-slate-400">
                      <strong className="text-slate-300">Email:</strong> {contact.email}
                    </p>
                    <p className="text-slate-400">
                      <strong className="text-slate-300">Phone:</strong> {contact.phone}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingItem(contact)
                          setShowContactForm(true)
                        }}
                        className="border-slate-600 text-slate-300"
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Audit Logs</h2>

            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-400">Timestamp</TableHead>
                      <TableHead className="text-slate-400">Action</TableHead>
                      <TableHead className="text-slate-400">Table</TableHead>
                      <TableHead className="text-slate-400">Record ID</TableHead>
                      <TableHead className="text-slate-400">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id} className="border-slate-700">
                        <TableCell className="text-slate-400">{new Date(log.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              log.action.includes("create")
                                ? "border-green-500/50 text-green-400"
                                : log.action.includes("delete")
                                  ? "border-red-500/50 text-red-400"
                                  : log.action.includes("update")
                                    ? "border-blue-500/50 text-blue-400"
                                    : "border-slate-500/50 text-slate-400"
                            }
                          >
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{log.table_name}</TableCell>
                        <TableCell className="font-mono text-xs text-slate-400">
                          {log.record_id?.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingItem({ type: "log", data: log })}
                            className="text-slate-400 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Hospital Form Dialog */}
      <Dialog open={showHospitalForm} onOpenChange={setShowHospitalForm}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-slate-700 bg-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">{editingItem ? "Edit Hospital" : "Add New Hospital"}</DialogTitle>
            <DialogDescription className="text-slate-400">Enter the hospital details below</DialogDescription>
          </DialogHeader>
          <HospitalForm
            hospital={editingItem}
            onClose={() => {
              setShowHospitalForm(false)
              setEditingItem(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Contact Form Dialog */}
      <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
        <DialogContent className="max-w-md border-slate-700 bg-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">{editingItem ? "Edit Contact" : "Add Contact"}</DialogTitle>
            <DialogDescription className="text-slate-400">Enter the contact information below</DialogDescription>
          </DialogHeader>
          <ContactForm
            contact={editingItem}
            onClose={() => {
              setShowContactForm(false)
              setEditingItem(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Violation Form Dialog */}
      <Dialog open={showViolationForm} onOpenChange={setShowViolationForm}>
        <DialogContent className="max-w-md border-slate-700 bg-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Record Violation</DialogTitle>
            <DialogDescription className="text-slate-400">Enter the violation details below</DialogDescription>
          </DialogHeader>
          <ViolationForm hospitals={hospitals} onClose={() => setShowViolationForm(false)} />
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
        <DialogContent className="max-w-2xl border-slate-700 bg-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {viewingItem?.type === "hospital"
                ? "Hospital Details"
                : viewingItem?.type === "patient"
                  ? "Patient Details"
                  : "Log Details"}
            </DialogTitle>
          </DialogHeader>
          {viewingItem && (
            <pre className="max-h-96 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-300">
              {JSON.stringify(viewingItem.data, null, 2)}
            </pre>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
