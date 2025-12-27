import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("admin_session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const supabase = await createClient()

    // Generate hospital ID
    const hospitalId = `HOSP${Date.now().toString().slice(-8)}`

    const { data: hospital, error } = await supabase
      .from("hospitals")
      .insert({
        hospital_id: hospitalId,
        name: data.name,
        type: data.type,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        phone: data.phone,
        email: data.email,
        website: data.website,
        director_name: data.director_name,
        total_beds: data.total_beds,
        specializations: data.specializations,
        is_verified: data.is_verified,
        nabh_certified: data.nabh_certified,
        nabl_certified: data.nabl_certified,
        iso_certified: data.iso_certified,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating hospital:", error)
      return NextResponse.json({ error: "Failed to create hospital" }, { status: 500 })
    }

    // Log the action
    await supabase.from("audit_logs").insert({
      action: "hospital_created",
      table_name: "hospitals",
      record_id: hospital.id,
      new_data: hospital,
    })

    return NextResponse.json({ success: true, hospital })
  } catch (error) {
    console.error("Hospital creation error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("admin_session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const supabase = await createClient()

    const { data: hospital, error } = await supabase
      .from("hospitals")
      .update({
        name: data.name,
        type: data.type,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        phone: data.phone,
        email: data.email,
        website: data.website,
        director_name: data.director_name,
        total_beds: data.total_beds,
        specializations: data.specializations,
        is_verified: data.is_verified,
        nabh_certified: data.nabh_certified,
        nabl_certified: data.nabl_certified,
        iso_certified: data.iso_certified,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating hospital:", error)
      return NextResponse.json({ error: "Failed to update hospital" }, { status: 500 })
    }

    // Log the action
    await supabase.from("audit_logs").insert({
      action: "hospital_updated",
      table_name: "hospitals",
      record_id: hospital.id,
      new_data: hospital,
    })

    return NextResponse.json({ success: true, hospital })
  } catch (error) {
    console.error("Hospital update error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
