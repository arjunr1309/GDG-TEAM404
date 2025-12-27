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
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ViolationFormProps {
  hospitals: any[]
  onClose: () => void
}

export function ViolationForm({ hospitals, onClose }: ViolationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    hospital_id: "",
    violation_type: "",
    severity: "minor",
    description: "",
    violation_date: new Date().toISOString().split("T")[0],
    fine_amount: "",
    corrective_action: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/violations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fine_amount: Number.parseFloat(formData.fine_amount) || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to record violation")
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
        <Label htmlFor="hospital_id" className="text-slate-300">
          Hospital
        </Label>
        <Select value={formData.hospital_id} onValueChange={(v) => setFormData({ ...formData, hospital_id: v })}>
          <SelectTrigger className="border-slate-600 bg-slate-900/50 text-white">
            <SelectValue placeholder="Select hospital" />
          </SelectTrigger>
          <SelectContent className="border-slate-700 bg-slate-800">
            {hospitals.map((h) => (
              <SelectItem key={h.id} value={h.id}>
                {h.name} ({h.hospital_id})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="violation_type" className="text-slate-300">
          Violation Type
        </Label>
        <Select value={formData.violation_type} onValueChange={(v) => setFormData({ ...formData, violation_type: v })}>
          <SelectTrigger className="border-slate-600 bg-slate-900/50 text-white">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="border-slate-700 bg-slate-800">
            <SelectItem value="hygiene">Hygiene Standards</SelectItem>
            <SelectItem value="documentation">Documentation Issues</SelectItem>
            <SelectItem value="staff_credentials">Staff Credentials</SelectItem>
            <SelectItem value="patient_safety">Patient Safety</SelectItem>
            <SelectItem value="equipment">Equipment Compliance</SelectItem>
            <SelectItem value="data_privacy">Data Privacy</SelectItem>
            <SelectItem value="billing">Billing Irregularities</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="severity" className="text-slate-300">
          Severity
        </Label>
        <Select value={formData.severity} onValueChange={(v) => setFormData({ ...formData, severity: v })}>
          <SelectTrigger className="border-slate-600 bg-slate-900/50 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-slate-700 bg-slate-800">
            <SelectItem value="minor">Minor</SelectItem>
            <SelectItem value="major">Major</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="violation_date" className="text-slate-300">
          Violation Date
        </Label>
        <Input
          id="violation_date"
          type="date"
          value={formData.violation_date}
          onChange={(e) => setFormData({ ...formData, violation_date: e.target.value })}
          className="border-slate-600 bg-slate-900/50 text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-slate-300">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="border-slate-600 bg-slate-900/50 text-white"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fine_amount" className="text-slate-300">
          Fine Amount (INR)
        </Label>
        <Input
          id="fine_amount"
          type="number"
          value={formData.fine_amount}
          onChange={(e) => setFormData({ ...formData, fine_amount: e.target.value })}
          placeholder="0.00"
          className="border-slate-600 bg-slate-900/50 text-white placeholder:text-slate-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="corrective_action" className="text-slate-300">
          Corrective Action Required
        </Label>
        <Textarea
          id="corrective_action"
          value={formData.corrective_action}
          onChange={(e) => setFormData({ ...formData, corrective_action: e.target.value })}
          className="border-slate-600 bg-slate-900/50 text-white"
          rows={2}
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
        <Button type="submit" disabled={isLoading} className="bg-red-500 hover:bg-red-600">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Recording...
            </>
          ) : (
            "Record Violation"
          )}
        </Button>
      </div>
    </form>
  )
}
