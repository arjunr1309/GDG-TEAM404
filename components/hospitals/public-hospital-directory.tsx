"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Search, MapPin, Filter, CheckCircle, Shield, X, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HospitalSummary {
  id: string
  hospital_id: string
  name: string
  director_name: string
  city: string
  state: string
  region: string
  type: string
  is_certified: boolean
  nabh_accredited: boolean
  hipaa_compliant: boolean
}

interface PublicHospitalDirectoryProps {
  hospitals: HospitalSummary[]
}

export function PublicHospitalDirectory({ hospitals }: PublicHospitalDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const regions = ["North", "South", "East", "West", "Central", "Northeast"]
  const types = ["Government", "Private", "Charitable", "Research", "Teaching"]

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.director_name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRegion = regionFilter === "all" || hospital.region === regionFilter
    const matchesType = typeFilter === "all" || hospital.type === typeFilter

    return matchesSearch && matchesRegion && matchesType
  })

  const hasActiveFilters = searchQuery || regionFilter !== "all" || typeFilter !== "all"

  const clearFilters = () => {
    setSearchQuery("")
    setRegionFilter("all")
    setTypeFilter("all")
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-viewer/10">
              <Building2 className="h-8 w-8 text-viewer" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Hospital Directory</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Browse the complete list of registered hospitals across India. Login to view detailed compliance
              information and violations.
            </p>
            <Link href="/viewer/login">
              <Button className="mt-6 gap-2">
                Login for Full Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="border-b border-border py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <strong>{filteredHospitals.length}</strong> of {hospitals.length} hospitals
            </p>
          </div>

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
              {filteredHospitals.map((hospital) => (
                <Card key={hospital.id} className="transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-1 text-lg">{hospital.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {hospital.city}, {hospital.state}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Director: </span>
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
                      {hospital.hipaa_compliant && (
                        <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
                          <Shield className="mr-1 h-3 w-3" />
                          HIPAA
                        </Badge>
                      )}
                    </div>

                    <Link href="/viewer/login" className="block">
                      <Button variant="outline" size="sm" className="mt-2 w-full gap-2 bg-transparent">
                        View Full Details
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
