-- Medical Records System Database Schema
-- HIPAA & Indian Health Laws Compliant

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. System Officials Table (for admin access)
CREATE TABLE IF NOT EXISTS system_officials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  official_id TEXT UNIQUE NOT NULL, -- Custom official ID for login
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'support')),
  department TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Hospitals Table
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id TEXT UNIQUE NOT NULL, -- Custom hospital ID for login
  name TEXT NOT NULL,
  director_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  
  -- Address
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT,
  region TEXT CHECK (region IN ('North', 'South', 'East', 'West', 'Central', 'Northeast')),
  
  -- Hospital Details
  type TEXT NOT NULL CHECK (type IN ('government', 'private', 'trust', 'multi-specialty', 'charitable', 'research', 'teaching')),
  specializations TEXT[],
  total_beds INTEGER,
  established_year INTEGER,
  website TEXT,
  
  -- Compliance & Certification
  is_verified BOOLEAN DEFAULT false,
  nabh_certified BOOLEAN DEFAULT false,
  nabl_certified BOOLEAN DEFAULT false,
  iso_certified BOOLEAN DEFAULT false,
  jci_accredited BOOLEAN DEFAULT false,
  hipaa_compliant BOOLEAN DEFAULT true,
  indian_health_law_compliant BOOLEAN DEFAULT true,
  
  -- Credentials (hashed password for hospital login)
  password_hash TEXT NOT NULL,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Hospital Violations Table
CREATE TABLE IF NOT EXISTS hospital_violations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  violation_type TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('minor', 'major', 'critical')),
  violation_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved')),
  fine_amount DECIMAL(12, 2),
  corrective_action TEXT,
  resolved_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Patients Table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id TEXT UNIQUE NOT NULL, -- Auto-generated patient ID
  
  -- Personal Information
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  blood_group TEXT,
  
  -- Contact Information
  email TEXT,
  phone TEXT NOT NULL,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  
  -- Address
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT,
  
  -- Government ID (for verification)
  personal_id_type TEXT CHECK (personal_id_type IN ('aadhaar', 'pan', 'passport', 'voter_id', 'driving_license')),
  personal_id_number TEXT NOT NULL,
  
  -- Credentials
  password_hash TEXT NOT NULL,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by_hospital UUID REFERENCES hospitals(id)
);

-- 5. Medical Records Table
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id TEXT UNIQUE NOT NULL, -- Auto-generated record ID
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES hospitals(id),
  
  -- Visit Information
  visit_date DATE NOT NULL,
  visit_type TEXT CHECK (visit_type IN ('opd', 'ipd', 'emergency', 'follow_up', 'surgery', 'lab_test', 'radiology')),
  
  -- Medical Details
  chief_complaint TEXT,
  diagnosis TEXT NOT NULL,
  diagnosis_code TEXT, -- ICD-10 code
  symptoms TEXT[],
  
  -- Treatment
  treatment_given TEXT,
  medications JSONB, -- Array of {name, dosage, frequency, duration}
  procedures TEXT[],
  
  -- Vitals
  blood_pressure TEXT,
  heart_rate INTEGER,
  temperature DECIMAL(4, 1),
  weight DECIMAL(5, 2),
  height DECIMAL(5, 2),
  spo2 INTEGER,
  
  -- Lab Results
  lab_results JSONB,
  
  -- Doctor Information
  doctor_name TEXT NOT NULL,
  doctor_registration_number TEXT,
  department TEXT,
  
  -- Follow-up
  follow_up_date DATE,
  follow_up_notes TEXT,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'transferred', 'archived')),
  
  -- Audit trail
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT NOT NULL
);

-- 6. Viewer/Public Users Table (for hospital directory access)
CREATE TABLE IF NOT EXISTS viewers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Contact Information Table
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  designation TEXT,
  department TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  office_address TEXT,
  office_hours TEXT,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Audit Log Table (for HIPAA compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  user_type TEXT CHECK (user_type IN ('patient', 'hospital', 'viewer', 'admin')),
  user_id TEXT,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_patient_id ON patients(patient_id);
CREATE INDEX IF NOT EXISTS idx_patients_personal_id ON patients(personal_id_number);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_hospital ON medical_records(hospital_id);
CREATE INDEX IF NOT EXISTS idx_hospitals_hospital_id ON hospitals(hospital_id);
CREATE INDEX IF NOT EXISTS idx_hospitals_region ON hospitals(region);
CREATE INDEX IF NOT EXISTS idx_hospitals_state ON hospitals(state);
CREATE INDEX IF NOT EXISTS idx_hospitals_type ON hospitals(type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_officials_official_id ON system_officials(official_id);

-- Enable Row Level Security on all tables
ALTER TABLE system_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
