"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Shield,
  LogOut,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Users,
  Calendar,
  Globe,
  Phone,
  Mail,
  Award,
  X,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Hospital, HospitalViolation } from "@/lib/types"

interface ViewerDashboardClientProps {
  user: User
  hospitals: Hospital[]
  violations: HospitalViolation[]
}

export function ViewerDashboardClient({ user, hospitals, violations }: ViewerDashboardClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [stateFilter, setStateFilter] = useState<string>("all")
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/viewer/login")
  }

  const regions = ["North", "South", "East", "West", "Central", "Northeast"]
  const types = ["Government", "Private", "Charitable", "Research", "Teaching"]
  const states = [...new Set(hospitals.map((h) => h.state))].sort()

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.director_name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRegion = regionFilter === "all" || hospital.region === regionFilter
    const matchesType = typeFilter === "all" || hospital.type === typeFilter
    const matchesState = stateFilter === "all" || hospital.state === stateFilter

    return matchesSearch && matchesRegion && matchesType && matchesState
  })

  const getHospitalViolations = (hospitalId: string) => {
    return violations.filter((v) => v.hospital_id === hospitalId)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setRegionFilter("all")
    setTypeFilter("all")
    setStateFilter("all")
  }

  const hasActiveFilters = searchQuery || regionFilter !== "all" || typeFilter !== "all" || stateFilter !== "all"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-viewer">
              <Building2 className="h-5 w-5 text-viewer-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Hospital Directory</h1>
              <p className="text-xs text-muted-foreground">NHRS - Public Viewer Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-viewer/10">
                <Building2 className="h-6 w-6 text-viewer" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hospitals.length}</p>
                <p className="text-sm text-muted-foreground">Total Hospitals</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hospitals.filter((h) => h.is_certified).length}</p>
                <p className="text-sm text-muted-foreground">Certified</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hospitals.filter((h) => h.nabh_accredited).length}</p>
                <p className="text-sm text-muted-foreground">NABH Accredited</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hospitals.filter((h) => h.hipaa_compliant).length}</p>
                <p className="text-sm text-muted-foreground">HIPAA Compliant</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search hospitals, cities, or directors..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-[140px]">
                    <MapPin className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="w-[160px]">
                    <MapPin className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{filteredHospitals.length}</strong> of {hospitals.length} hospitals
          </p>
        </div>

        {/* Hospital Grid */}
        {filteredHospitals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No hospitals found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredHospitals.map((hospital) => {
              const hospitalViolations = getHospitalViolations(hospital.id)
              const hasUnresolvedViolations = hospitalViolations.some((v) => !v.is_resolved)

              return (
                <Card
                  key={hospital.id}
                  className="group cursor-pointer transition-all hover:border-primary hover:shadow-md"
                  onClick={() => setSelectedHospital(hospital)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-1 text-lg group-hover:text-primary">{hospital.name}</CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {hospital.city}, {hospital.state}
                        </CardDescription>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Director:</span>
                      <span className="font-medium">{hospital.director_name}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary">{hospital.type}</Badge>
                      <Badge variant="outline">{hospital.region}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {hospital.is_certified && (
                        <Badge className="bg-success/10 text-success hover:bg-success/20">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Certified
                        </Badge>
                      )}
                      {hospital.nabh_accredited && (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">NABH</Badge>
                      )}
                      {hasUnresolvedViolations && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Violation
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      {/* Hospital Detail Dialog */}
      <Dialog open={!!selectedHospital} onOpenChange={() => setSelectedHospital(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          {selectedHospital && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedHospital.name}</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  <TabsTrigger value="violations">
                    Violations ({getHospitalViolations(selectedHospital.id).length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-4 space-y-6">
                  {/* Basic Info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Director</p>
                      <p className="font-medium">{selectedHospital.director_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Hospital Type</p>
                      <p className="font-medium">{selectedHospital.type}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Established</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {selectedHospital.established_year || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Bed Capacity</p>
                      <p className="font-medium">{selectedHospital.bed_count || "N/A"} beds</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="rounded-lg border border-border p-4">
                    <h4 className="mb-3 font-medium">Contact Information</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedHospital.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{selectedHospital.email}</span>
                      </div>
                      {selectedHospital.website && (
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={selectedHospital.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {selectedHospital.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="rounded-lg border border-border p-4">
                    <h4 className="mb-3 font-medium">Address</h4>
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p>{selectedHospital.address_line1}</p>
                        {selectedHospital.address_line2 && <p>{selectedHospital.address_line2}</p>}
                        <p>
                          {selectedHospital.city}, {selectedHospital.state} - {selectedHospital.pincode}
                        </p>
                        <p className="text-muted-foreground">{selectedHospital.region} India</p>
                      </div>
                    </div>
                  </div>

                  {/* Specializations */}
                  {selectedHospital.specializations && selectedHospital.specializations.length > 0 && (
                    <div>
                      <h4 className="mb-3 font-medium">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedHospital.specializations.map((spec, i) => (
                          <Badge key={i} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="compliance" className="mt-4 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <span>Certified & Approved</span>
                      {selectedHospital.is_certified && selectedHospital.is_approved ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <span>NABH Accredited</span>
                      {selectedHospital.nabh_accredited ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <span>NABL Accredited</span>
                      {selectedHospital.nabl_accredited ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <span>JCI Accredited</span>
                      {selectedHospital.jci_accredited ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <span>HIPAA Compliant</span>
                      {selectedHospital.hipaa_compliant ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <span>Indian Health Law Compliant</span>
                      {selectedHospital.indian_health_law_compliant ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </div>

                  {selectedHospital.certification_number && (
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">Certification Number</p>
                      <p className="font-mono font-medium">{selectedHospital.certification_number}</p>
                      {selectedHospital.certification_expiry && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Expires: {new Date(selectedHospital.certification_expiry).toLocaleDateString("en-IN")}
                        </p>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="violations" className="mt-4">
                  {getHospitalViolations(selectedHospital.id).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CheckCircle className="h-12 w-12 text-success" />
                      <h4 className="mt-4 font-medium">No Violations</h4>
                      <p className="mt-1 text-sm text-muted-foreground">This hospital has a clean compliance record</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {getHospitalViolations(selectedHospital.id).map((violation) => (
                        <div
                          key={violation.id}
                          className={`rounded-lg border p-4 ${
                            violation.is_resolved ? "border-border bg-card" : "border-destructive/30 bg-destructive/5"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-medium">{violation.violation_type}</h5>
                              <p className="mt-1 text-sm text-muted-foreground">{violation.description}</p>
                            </div>
                            <Badge variant={violation.is_resolved ? "secondary" : "destructive"}>
                              {violation.is_resolved ? "Resolved" : "Active"}
                            </Badge>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-4 text-sm">
                            <span className="text-muted-foreground">
                              Severity:{" "}
                              <span
                                className={`font-medium ${
                                  violation.severity === "Critical"
                                    ? "text-destructive"
                                    : violation.severity === "Major"
                                      ? "text-orange-600"
                                      : "text-foreground"
                                }`}
                              >
                                {violation.severity}
                              </span>
                            </span>
                            <span className="text-muted-foreground">
                              Reported: {new Date(violation.date_reported).toLocaleDateString("en-IN")}
                            </span>
                            {violation.date_resolved && (
                              <span className="text-muted-foreground">
                                Resolved: {new Date(violation.date_resolved).toLocaleDateString("en-IN")}
                              </span>
                            )}
                          </div>
                          {violation.corrective_action && (
                            <p className="mt-2 text-sm">
                              <span className="text-muted-foreground">Corrective Action:</span>{" "}
                              {violation.corrective_action}
                            </p>
                          )}
                          {violation.penalty_amount && (
                            <p className="mt-1 text-sm">
                              <span className="text-muted-foreground">Penalty:</span>{" "}
                              <span className="font-medium">₹{violation.penalty_amount.toLocaleString("en-IN")}</span>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
