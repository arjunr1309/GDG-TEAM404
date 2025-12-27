"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface HospitalFormProps {
  hospital?: any
  onClose: () => void
}

export function HospitalForm({ hospital, onClose }: HospitalFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: hospital?.name || "",
    type: hospital?.type || "private",
    address: hospital?.address || "",
    city: hospital?.city || "",
    state: hospital?.state || "",
    pincode: hospital?.pincode || "",
    phone: hospital?.phone || "",
    email: hospital?.email || "",
    website: hospital?.website || "",
    director_name: hospital?.director_name || "",
    total_beds: hospital?.total_beds || "",
    specializations: hospital?.specializations?.join(", ") || "",
    is_verified: hospital?.is_verified || false,
    nabh_certified: hospital?.nabh_certified || false,
    nabl_certified: hospital?.nabl_certified || false,
    iso_certified: hospital?.iso_certified || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/hospitals", {
        method: hospital ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: hospital?.id,
          total_beds: Number.parseInt(formData.total_beds) || null,
          specializations: formData.specializations
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save hospital")
      }

      router.refresh()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name" className="text-slate-300">
            Hospital Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border-slate-600 bg-slate-900/50 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-slate-300">
            Type
          </Label>
          <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
            <SelectTrigger className="border-slate-600 bg-slate-900/50 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-slate-700 bg-slate-800">
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="trust">Trust</SelectItem>
              <SelectItem value="multi-specialty">Multi-Specialty</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="total_beds" className="text-slate-300">
            Total Beds
          </Label>
          <Input
            id="total_beds"
            type="number"
            value={formData.total_beds}
            onChange={(e) => setFormData({ ...formData, total_beds: e.target.value })}
            className="border-slate-600 bg-slate-900/50 text-white"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address" className="text-slate-300">
            Address
          </Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="border-slate-600 bg-slate-900/50 text-white"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-slate-300">
            City
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="border-slate-600 bg-slate-900/50 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-slate-300">
            State
          </Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="border-slate-600 bg-slate-900/50 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pincode" className="text-slate-300">
            Pincode
          </Label>
          <Input
            id="pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            className="border-slate-600 bg-slate-900/50 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-300">
            Phone
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="border-slate-600 bg-slate-900/50 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border-slate-600 bg-slate-900/50 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="director_name" className="text-slate-300">
            Director Name
          </Label>
          <Input
            id="director_name"
            value={formData.director_name}
            onChange={(e) => setFormData({ ...formData, director_name: e.target.value })}
            className="border-slate-600 bg-slate-900/50 text-white"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="specializations" className="text-slate-300">
            Specializations (comma-separated)
          </Label>
          <Input
            id="specializations"
            value={formData.specializations}
            onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
            placeholder="Cardiology, Neurology, Orthopedics"
            className="border-slate-600 bg-slate-900/50 text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Certifications */}
      <div className="space-y-4 rounded-lg border border-slate-700 p-4">
        <h4 className="font-medium text-white">Certifications & Status</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="is_verified" className="text-slate-300">
              Verified Hospital
            </Label>
            <Switch
              id="is_verified"
              checked={formData.is_verified}
              onCheckedChange={(v) => setFormData({ ...formData, is_verified: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="nabh_certified" className="text-slate-300">
              NABH Certified
            </Label>
            <Switch
              id="nabh_certified"
              checked={formData.nabh_certified}
              onCheckedChange={(v) => setFormData({ ...formData, nabh_certified: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="nabl_certified" className="text-slate-300">
              NABL Certified
            </Label>
            <Switch
              id="nabl_certified"
              checked={formData.nabl_certified}
              onCheckedChange={(v) => setFormData({ ...formData, nabl_certified: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="iso_certified" className="text-slate-300">
              ISO Certified
            </Label>
            <Switch
              id="iso_certified"
              checked={formData.iso_certified}
              onCheckedChange={(v) => setFormData({ ...formData, iso_certified: v })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-slate-600 text-slate-300 bg-transparent"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : hospital ? (
            "Update Hospital"
          ) : (
            "Add Hospital"
          )}
        </Button>
      </div>
    </form>
  )
}
