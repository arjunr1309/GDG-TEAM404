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

    // If setting as primary, unset other primary contacts
    if (data.is_primary) {
      await supabase.from("contact_info").update({ is_primary: false }).eq("is_primary", true)
    }

    const { data: contact, error } = await supabase
      .from("contact_info")
      .insert({
        name: data.name,
        designation: data.designation,
        department: data.department,
        email: data.email,
        phone: data.phone,
        office_address: data.office_address,
        office_hours: data.office_hours,
        is_primary: data.is_primary,
        is_active: data.is_active,
        display_order: data.display_order,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating contact:", error)
      return NextResponse.json({ error: "Failed to create contact" }, { status: 500 })
    }

    // Log the action
    await supabase.from("audit_logs").insert({
      action: "contact_created",
      table_name: "contact_info",
      record_id: contact.id,
      new_data: contact,
    })

    return NextResponse.json({ success: true, contact })
  } catch (error) {
    console.error("Contact creation error:", error)
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

    // If setting as primary, unset other primary contacts
    if (data.is_primary) {
      await supabase.from("contact_info").update({ is_primary: false }).eq("is_primary", true).neq("id", data.id)
    }

    const { data: contact, error } = await supabase
      .from("contact_info")
      .update({
        name: data.name,
        designation: data.designation,
        department: data.department,
        email: data.email,
        phone: data.phone,
        office_address: data.office_address,
        office_hours: data.office_hours,
        is_primary: data.is_primary,
        is_active: data.is_active,
        display_order: data.display_order,
      })
      .eq("id", data.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating contact:", error)
      return NextResponse.json({ error: "Failed to update contact" }, { status: 500 })
    }

    // Log the action
    await supabase.from("audit_logs").insert({
      action: "contact_updated",
      table_name: "contact_info",
      record_id: contact.id,
      new_data: contact,
    })

    return NextResponse.json({ success: true, contact })
  } catch (error) {
    console.error("Contact update error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
