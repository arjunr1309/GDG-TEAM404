import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    // Verify hospital session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("hospital_session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let session
    try {
      session = JSON.parse(sessionCookie.value)
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const body = await request.json()
    const { hospitalId, existingPatientId, patientData, recordData } = body

    // Verify the session matches the hospital
    if (session.id !== hospitalId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    let patientId = existingPatientId
    let patientPublicId: string | undefined

    // If new patient, create patient record first
    if (!existingPatientId && patientData) {
      const passwordHash = await bcrypt.hash(patientData.password, 10)

      const { data: newPatient, error: patientError } = await supabase
        .from("patients")
        .insert({
          first_name: patientData.firstName,
          last_name: patientData.lastName,
          date_of_birth: patientData.dateOfBirth,
          gender: patientData.gender,
          blood_group: patientData.bloodGroup || null,
          phone: patientData.phone,
          email: patientData.email || null,
          emergency_contact_name: patientData.emergencyContactName || null,
          emergency_contact_phone: patientData.emergencyContactPhone || null,
          address_line1: patientData.addressLine1,
          address_line2: patientData.addressLine2 || null,
          city: patientData.city,
          state: patientData.state,
          pincode: patientData.pincode,
          personal_id_type: patientData.personalIdType,
          personal_id_number: patientData.personalIdNumber,
          password_hash: passwordHash,
          created_by_hospital: hospitalId,
        })
        .select("id, patient_id")
        .single()

      if (patientError) {
        console.error("Patient creation error:", patientError)
        return NextResponse.json({ error: "Failed to create patient record" }, { status: 500 })
      }

      patientId = newPatient.id
      patientPublicId = newPatient.patient_id
    } else {
      // Get existing patient's public ID
      const { data: existingPatient } = await supabase
        .from("patients")
        .select("patient_id")
        .eq("id", existingPatientId)
        .single()

      patientPublicId = existingPatient?.patient_id
    }

    // Create medical record
    const { data: newRecord, error: recordError } = await supabase
      .from("medical_records")
      .insert({
        patient_id: patientId,
        hospital_id: hospitalId,
        visit_date: recordData.visitDate,
        visit_type: recordData.visitType,
        chief_complaint: recordData.chiefComplaint || null,
        diagnosis: recordData.diagnosis,
        diagnosis_code: recordData.diagnosisCode || null,
        symptoms: recordData.symptoms.length > 0 ? recordData.symptoms : null,
        treatment_given: recordData.treatmentGiven || null,
        medications_prescribed: recordData.medications.length > 0 ? recordData.medications : null,
        blood_pressure: recordData.bloodPressure || null,
        heart_rate: recordData.heartRate ? Number.parseInt(recordData.heartRate) : null,
        temperature: recordData.temperature ? Number.parseFloat(recordData.temperature) : null,
        weight: recordData.weight ? Number.parseFloat(recordData.weight) : null,
        height: recordData.height ? Number.parseFloat(recordData.height) : null,
        attending_doctor: recordData.attendingDoctor,
        doctor_registration_number: recordData.doctorRegistrationNumber || null,
        department: recordData.department || null,
        follow_up_date: recordData.followUpDate || null,
        follow_up_notes: recordData.followUpNotes || null,
        created_by: session.name,
      })
      .select("record_id")
      .single()

    if (recordError) {
      console.error("Record creation error:", recordError)
      return NextResponse.json({ error: "Failed to create medical record" }, { status: 500 })
    }

    // Log audit event
    await supabase.from("audit_logs").insert({
      action: "CREATE_RECORD",
      table_name: "medical_records",
      record_id: newRecord.record_id,
      user_type: "hospital",
      user_id: session.hospital_id,
    })

    return NextResponse.json({
      success: true,
      recordId: newRecord.record_id,
      patientId: patientPublicId,
    })
  } catch (error) {
    console.error("Record creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
