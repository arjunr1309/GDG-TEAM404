"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ContactFormProps {
  contact?: any
  onClose: () => void
}

export function ContactForm({ contact, onClose }: ContactFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: contact?.name || "",
    designation: contact?.designation || "",
    department: contact?.department || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    office_address: contact?.office_address || "",
    office_hours: contact?.office_hours || "",
    is_primary: contact?.is_primary || false,
    is_active: contact?.is_active ?? true,
    display_order: contact?.display_order || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/contacts", {
        method: contact ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: contact?.id }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save contact")
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

      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-300">
          Name
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
        <Label htmlFor="designation" className="text-slate-300">
          Designation
        </Label>
        <Input
          id="designation"
          value={formData.designation}
          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
          className="border-slate-600 bg-slate-900/50 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department" className="text-slate-300">
          Department
        </Label>
        <Input
          id="department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
          required
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
        <Label htmlFor="office_address" className="text-slate-300">
          Office Address
        </Label>
        <Textarea
          id="office_address"
          value={formData.office_address}
          onChange={(e) => setFormData({ ...formData, office_address: e.target.value })}
          className="border-slate-600 bg-slate-900/50 text-white"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="office_hours" className="text-slate-300">
          Office Hours
        </Label>
        <Input
          id="office_hours"
          value={formData.office_hours}
          onChange={(e) => setFormData({ ...formData, office_hours: e.target.value })}
          placeholder="Mon-Fri, 9AM - 6PM"
          className="border-slate-600 bg-slate-900/50 text-white placeholder:text-slate-500"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="is_primary" className="text-slate-300">
          Primary Contact
        </Label>
        <Switch
          id="is_primary"
          checked={formData.is_primary}
          onCheckedChange={(v) => setFormData({ ...formData, is_primary: v })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="is_active" className="text-slate-300">
          Active
        </Label>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-slate-600 text-slate-300 bg-transparent"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-teal-500 hover:bg-teal-600">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : contact ? (
            "Update Contact"
          ) : (
            "Add Contact"
          )}
        </Button>
      </div>
    </form>
  )
}
