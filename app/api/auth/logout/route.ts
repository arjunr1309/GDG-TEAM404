import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body

    const cookieStore = await cookies()

    if (type === "patient") {
      cookieStore.delete("patient_session")
    } else if (type === "hospital") {
      cookieStore.delete("hospital_session")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
