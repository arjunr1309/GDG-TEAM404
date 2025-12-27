"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, CheckCircle, AlertCircle, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AddRecordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hospitalId: string
  hospitalName: string
}

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
}

interface PatientFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  bloodGroup: string
  phone: string
  email: string
  emergencyContactName: string
  emergencyContactPhone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  personalIdType: string
  personalIdNumber: string
  password: string
}

interface RecordFormData {
  visitDate: string
  visitType: string
  chiefComplaint: string
  diagnosis: string
  diagnosisCode: string
  symptoms: string
  treatmentGiven: string
  bloodPressure: string
  heartRate: string
  temperature: string
  weight: string
  height: string
  attendingDoctor: string
  doctorRegistrationNumber: string
  department: string
  followUpDate: string
  followUpNotes: string
}

export function AddRecordDialog({ open, onOpenChange, hospitalId, hospitalName }: AddRecordDialogProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingPatient, setExistingPatient] = useState<{
    id: string
    patient_id: string
    first_name: string
    last_name: string
  } | null>(null)
  const [searchingPatient, setSearchingPatient] = useState(false)
  const [submittedRecord, setSubmittedRecord] = useState<{
    recordId: string
    patientId: string
    patientName: string
    isNewPatient: boolean
  } | null>(null)

  const [patientForm, setPatientForm] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    email: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    personalIdType: "",
    personalIdNumber: "",
    password: "",
  })

  const [recordForm, setRecordForm] = useState<RecordFormData>({
    visitDate: new Date().toISOString().split("T")[0],
    visitType: "",
    chiefComplaint: "",
    diagnosis: "",
    diagnosisCode: "",
    symptoms: "",
    treatmentGiven: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
    height: "",
    attendingDoctor: "",
    doctorRegistrationNumber: "",
    department: "",
    followUpDate: "",
    followUpNotes: "",
  })

  const [medications, setMedications] = useState<Medication[]>([])

  const handleSearchPatient = async () => {
    if (!patientForm.personalIdType || !patientForm.personalIdNumber) return

    setSearchingPatient(true)
    setError(null)

    try {
      const res = await fetch(
        `/api/patients/search?idType=${patientForm.personalIdType}&idNumber=${patientForm.personalIdNumber}`,
      )
      const data = await res.json()

      if (res.ok && data.patient) {
        setExistingPatient(data.patient)
      } else {
        setExistingPatient(null)
      }
    } catch {
      setError("Failed to search for patient")
    } finally {
      setSearchingPatient(false)
    }
  }

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }])
  }

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications]
    updated[index][field] = value
    setMedications(updated)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/records/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId,
          existingPatientId: existingPatient?.id,
          patientData: existingPatient ? null : patientForm,
          recordData: {
            ...recordForm,
            medications: medications.filter((m) => m.name),
            symptoms: recordForm.symptoms
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create record")

      setSubmittedRecord({
        recordId: data.recordId,
        patientId: data.patientId,
        patientName: existingPatient
          ? `${existingPatient.first_name} ${existingPatient.last_name}`
          : `${patientForm.firstName} ${patientForm.lastName}`,
        isNewPatient: !existingPatient,
      })
      setStep(4)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setExistingPatient(null)
    setSubmittedRecord(null)
    setError(null)
    setPatientForm({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      phone: "",
      email: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      personalIdType: "",
      personalIdNumber: "",
      password: "",
    })
    setRecordForm({
      visitDate: new Date().toISOString().split("T")[0],
      visitType: "",
      chiefComplaint: "",
      diagnosis: "",
      diagnosisCode: "",
      symptoms: "",
      treatmentGiven: "",
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      weight: "",
      height: "",
      attendingDoctor: "",
      doctorRegistrationNumber: "",
      department: "",
      followUpDate: "",
      followUpNotes: "",
    })
    setMedications([])
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Medical Record</DialogTitle>
          <DialogDescription>
            {step === 1 && "Step 1: Patient Identification"}
            {step === 2 && "Step 2: Patient Details (New Patient)"}
            {step === 3 && "Step 3: Medical Record Details"}
            {step === 4 && "Record Submitted Successfully"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Patient Identification */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>ID Type *</Label>
                <Select
                  value={patientForm.personalIdType}
                  onValueChange={(v) => setPatientForm({ ...patientForm, personalIdType: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aadhaar">Aadhaar Card</SelectItem>
                    <SelectItem value="PAN">PAN Card</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
                    <SelectItem value="Voter ID">Voter ID</SelectItem>
                    <SelectItem value="Driving License">Driving License</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>ID Number *</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter ID number"
                    value={patientForm.personalIdNumber}
                    onChange={(e) => setPatientForm({ ...patientForm, personalIdNumber: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleSearchPatient}
                    disabled={!patientForm.personalIdType || !patientForm.personalIdNumber || searchingPatient}
                  >
                    {searchingPatient ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                  </Button>
                </div>
              </div>
            </div>

            {existingPatient && (
              <Alert className="border-success/50 bg-success/10">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertTitle>Existing Patient Found</AlertTitle>
                <AlertDescription>
                  <strong>
                    {existingPatient.first_name} {existingPatient.last_name}
                  </strong>{" "}
                  (ID: {existingPatient.patient_id})
                  <br />
                  The new record will be added to this patient's file.
                </AlertDescription>
              </Alert>
            )}

            {!existingPatient && patientForm.personalIdNumber && !searchingPatient && (
              <Alert>
                <User className="h-4 w-4" />
                <AlertTitle>New Patient</AlertTitle>
                <AlertDescription>
                  No existing patient found with this ID. You'll need to enter patient details.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose} className="bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={() => setStep(existingPatient ? 3 : 2)}
                disabled={!patientForm.personalIdType || !patientForm.personalIdNumber}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: New Patient Details */}
        {step === 2 && (
          <div className="space-y-6">
            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input
                      value={patientForm.firstName}
                      onChange={(e) => setPatientForm({ ...patientForm, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name *</Label>
                    <Input
                      value={patientForm.lastName}
                      onChange={(e) => setPatientForm({ ...patientForm, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth *</Label>
                    <Input
                      type="date"
                      value={patientForm.dateOfBirth}
                      onChange={(e) => setPatientForm({ ...patientForm, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select
                      value={patientForm.gender}
                      onValueChange={(v) => setPatientForm({ ...patientForm, gender: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Blood Group</Label>
                    <Select
                      value={patientForm.bloodGroup}
                      onValueChange={(v) => setPatientForm({ ...patientForm, bloodGroup: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                          <SelectItem key={bg} value={bg}>
                            {bg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Password (for patient login) *</Label>
                    <Input
                      type="password"
                      value={patientForm.password}
                      onChange={(e) => setPatientForm({ ...patientForm, password: e.target.value })}
                      placeholder="Set patient login password"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <Input
                      value={patientForm.phone}
                      onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                      placeholder="+91-XXXXXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={patientForm.email}
                      onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Emergency Contact Name</Label>
                    <Input
                      value={patientForm.emergencyContactName}
                      onChange={(e) => setPatientForm({ ...patientForm, emergencyContactName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Emergency Contact Phone</Label>
                    <Input
                      value={patientForm.emergencyContactPhone}
                      onChange={(e) => setPatientForm({ ...patientForm, emergencyContactPhone: e.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="mt-4 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Address Line 1 *</Label>
                    <Input
                      value={patientForm.addressLine1}
                      onChange={(e) => setPatientForm({ ...patientForm, addressLine1: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address Line 2</Label>
                    <Input
                      value={patientForm.addressLine2}
                      onChange={(e) => setPatientForm({ ...patientForm, addressLine2: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>City *</Label>
                      <Input
                        value={patientForm.city}
                        onChange={(e) => setPatientForm({ ...patientForm, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State *</Label>
                      <Input
                        value={patientForm.state}
                        onChange={(e) => setPatientForm({ ...patientForm, state: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pincode *</Label>
                      <Input
                        value={patientForm.pincode}
                        onChange={(e) => setPatientForm({ ...patientForm, pincode: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="bg-transparent">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={
                  !patientForm.firstName ||
                  !patientForm.lastName ||
                  !patientForm.dateOfBirth ||
                  !patientForm.gender ||
                  !patientForm.phone ||
                  !patientForm.addressLine1 ||
                  !patientForm.city ||
                  !patientForm.state ||
                  !patientForm.pincode ||
                  !patientForm.password
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Medical Record Details */}
        {step === 3 && (
          <div className="space-y-6">
            <Tabs defaultValue="visit">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="visit">Visit</TabsTrigger>
                <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
              </TabsList>

              <TabsContent value="visit" className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Visit Date *</Label>
                    <Input
                      type="date"
                      value={recordForm.visitDate}
                      onChange={(e) => setRecordForm({ ...recordForm, visitDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Visit Type *</Label>
                    <Select
                      value={recordForm.visitType}
                      onValueChange={(v) => setRecordForm({ ...recordForm, visitType: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select visit type" />
                      </SelectTrigger>
                      <SelectContent>
                        {["OPD", "IPD", "Emergency", "Follow-up", "Surgery", "Lab Test", "Radiology"].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Attending Doctor *</Label>
                    <Input
                      value={recordForm.attendingDoctor}
                      onChange={(e) => setRecordForm({ ...recordForm, attendingDoctor: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Doctor Registration No.</Label>
                    <Input
                      value={recordForm.doctorRegistrationNumber}
                      onChange={(e) => setRecordForm({ ...recordForm, doctorRegistrationNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Department</Label>
                    <Input
                      value={recordForm.department}
                      onChange={(e) => setRecordForm({ ...recordForm, department: e.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="diagnosis" className="mt-4 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Chief Complaint</Label>
                    <Textarea
                      value={recordForm.chiefComplaint}
                      onChange={(e) => setRecordForm({ ...recordForm, chiefComplaint: e.target.value })}
                      placeholder="Patient's primary complaint"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Diagnosis *</Label>
                      <Input
                        value={recordForm.diagnosis}
                        onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ICD-10 Code</Label>
                      <Input
                        value={recordForm.diagnosisCode}
                        onChange={(e) => setRecordForm({ ...recordForm, diagnosisCode: e.target.value })}
                        placeholder="e.g., J06.9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Symptoms (comma-separated)</Label>
                    <Input
                      value={recordForm.symptoms}
                      onChange={(e) => setRecordForm({ ...recordForm, symptoms: e.target.value })}
                      placeholder="e.g., Fever, Cough, Headache"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Treatment Given</Label>
                    <Textarea
                      value={recordForm.treatmentGiven}
                      onChange={(e) => setRecordForm({ ...recordForm, treatmentGiven: e.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vitals" className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Blood Pressure</Label>
                    <Input
                      value={recordForm.bloodPressure}
                      onChange={(e) => setRecordForm({ ...recordForm, bloodPressure: e.target.value })}
                      placeholder="e.g., 120/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Heart Rate (bpm)</Label>
                    <Input
                      type="number"
                      value={recordForm.heartRate}
                      onChange={(e) => setRecordForm({ ...recordForm, heartRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Temperature (°F)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={recordForm.temperature}
                      onChange={(e) => setRecordForm({ ...recordForm, temperature: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={recordForm.weight}
                      onChange={(e) => setRecordForm({ ...recordForm, weight: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={recordForm.height}
                      onChange={(e) => setRecordForm({ ...recordForm, height: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Follow-up Date</Label>
                    <Input
                      type="date"
                      value={recordForm.followUpDate}
                      onChange={(e) => setRecordForm({ ...recordForm, followUpDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Follow-up Notes</Label>
                    <Input
                      value={recordForm.followUpNotes}
                      onChange={(e) => setRecordForm({ ...recordForm, followUpNotes: e.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medications" className="mt-4 space-y-4">
                <div className="space-y-3">
                  {medications.map((med, index) => (
                    <div key={index} className="flex gap-2 rounded-lg border border-border p-3">
                      <div className="grid flex-1 gap-2 sm:grid-cols-4">
                        <Input
                          placeholder="Medicine name"
                          value={med.name}
                          onChange={(e) => updateMedication(index, "name", e.target.value)}
                        />
                        <Input
                          placeholder="Dosage"
                          value={med.dosage}
                          onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                        />
                        <Input
                          placeholder="Frequency"
                          value={med.frequency}
                          onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                        />
                        <Input
                          placeholder="Duration"
                          value={med.duration}
                          onChange={(e) => updateMedication(index, "duration", e.target.value)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMedication(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addMedication} className="w-full gap-2 bg-transparent">
                    <Plus className="h-4 w-4" />
                    Add Medication
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(existingPatient ? 1 : 2)} className="bg-transparent">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isLoading ||
                  !recordForm.visitDate ||
                  !recordForm.visitType ||
                  !recordForm.diagnosis ||
                  !recordForm.attendingDoctor
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Record"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && submittedRecord && (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Record Submitted Successfully</h3>
              <p className="mt-1 text-muted-foreground">The medical record has been added to the system.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Record Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Record ID</span>
                  <span className="font-mono font-medium">{submittedRecord.recordId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient ID</span>
                  <span className="font-mono font-medium">{submittedRecord.patientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient Name</span>
                  <span className="font-medium">{submittedRecord.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hospital</span>
                  <span className="font-medium">{hospitalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient Status</span>
                  <span className="font-medium">
                    {submittedRecord.isNewPatient ? "New Patient Created" : "Existing Patient Updated"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {submittedRecord.isNewPatient && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Patient Credentials</AlertTitle>
                <AlertDescription>
                  Please provide the patient their Patient ID ({submittedRecord.patientId}) and the password you set for
                  them to access their records.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={handleClose} className="bg-transparent">
                Close
              </Button>
              <Button
                onClick={() => {
                  setStep(1)
                  setExistingPatient(null)
                  setSubmittedRecord(null)
                  setError(null)
                  setPatientForm({
                    firstName: "",
                    lastName: "",
                    dateOfBirth: "",
                    gender: "",
                    bloodGroup: "",
                    phone: "",
                    email: "",
                    emergencyContactName: "",
                    emergencyContactPhone: "",
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    state: "",
                    pincode: "",
                    personalIdType: "",
                    personalIdNumber: "",
                    password: "",
                  })
                  setRecordForm({
                    visitDate: new Date().toISOString().split("T")[0],
                    visitType: "",
                    chiefComplaint: "",
                    diagnosis: "",
                    diagnosisCode: "",
                    symptoms: "",
                    treatmentGiven: "",
                    bloodPressure: "",
                    heartRate: "",
                    temperature: "",
                    weight: "",
                    height: "",
                    attendingDoctor: "",
                    doctorRegistrationNumber: "",
                    department: "",
                    followUpDate: "",
                    followUpNotes: "",
                  })
                  setMedications([])
                }}
              >
                Add Another Record
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
