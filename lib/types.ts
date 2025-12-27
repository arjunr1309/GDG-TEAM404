export interface Hospital {
  id: string
  hospital_id: string
  name: string
  director_name?: string
  email: string
  phone?: string
  address?: string
  city: string
  state: string
  pincode?: string
  region?: "North" | "South" | "East" | "West" | "Central" | "Northeast"
  type: "government" | "private" | "trust" | "multi-specialty" | "charitable" | "research" | "teaching"
  specializations?: string[]
  total_beds?: number
  established_year?: number
  website?: string
  is_verified: boolean
  nabh_certified: boolean
  nabl_certified: boolean
  iso_certified: boolean
  jci_accredited?: boolean
  hipaa_compliant: boolean
  indian_health_law_compliant: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface HospitalViolation {
  id: string
  hospital_id: string
  violation_type: string
  description: string
  severity: "minor" | "major" | "critical"
  violation_date: string
  status: "pending" | "under_review" | "resolved"
  fine_amount?: number
  corrective_action?: string
  resolved_date?: string
  created_at: string
  hospitals?: { name: string }
}

export interface Patient {
  id: string
  patient_id: string
  full_name: string
  date_of_birth: string
  gender?: "male" | "female" | "other"
  blood_group?: string
  email?: string
  phone: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  address: string
  city: string
  state: string
  pincode?: string
  personal_id_type: "aadhaar" | "pan" | "passport" | "voter_id" | "driving_license"
  personal_id_number: string
  is_active: boolean
  created_at: string
  updated_at: string
  created_by_hospital?: string
}

export interface MedicalRecord {
  id: string
  record_id: string
  patient_id: string
  hospital_id: string
  visit_date: string
  visit_type?: "opd" | "ipd" | "emergency" | "follow_up" | "surgery" | "lab_test" | "radiology"
  chief_complaint?: string
  diagnosis: string
  diagnosis_code?: string
  symptoms?: string[]
  treatment_given?: string
  medications?: {
    name: string
    dosage: string
    frequency: string
    duration: string
  }[]
  procedures?: string[]
  blood_pressure?: string
  heart_rate?: number
  temperature?: number
  weight?: number
  height?: number
  spo2?: number
  lab_results?: {
    test_name: string
    result: string
    normal_range: string
    unit: string
  }[]
  doctor_name: string
  doctor_registration_number?: string
  department?: string
  follow_up_date?: string
  follow_up_notes?: string
  status: "active" | "closed" | "transferred" | "archived"
  created_at: string
  updated_at: string
  created_by: string
  hospitals?: { name: string }
}

export interface ContactInfo {
  id: string
  name: string
  designation?: string
  department?: string
  email: string
  phone?: string
  office_address?: string
  office_hours?: string
  is_primary: boolean
  display_order: number
  is_active: boolean
  created_at: string
}

export interface SystemOfficial {
  id: string
  official_id: string
  name: string
  email: string
  role: "super_admin" | "admin" | "support"
  department?: string
  phone?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Viewer {
  id: string
  email: string
  full_name?: string
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  action: string
  table_name: string
  record_id?: string
  user_type?: "patient" | "hospital" | "viewer" | "admin"
  user_id?: string
  old_data?: Record<string, unknown>
  new_data?: Record<string, unknown>
  created_at: string
}
