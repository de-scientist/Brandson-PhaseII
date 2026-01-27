import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { phoneNumber, amount, reference } = body

  // NOTE: This is a scaffold. You must plug in real Daraja OAuth + STK Push logic
  // and switch sandbox URLs to production when ready.

  try {
    // TODO: Implement Daraja OAuth token retrieval and STK push call here.
    // This placeholder response ensures the API route is wired without breaking the app.
    return NextResponse.json({
      success: true,
      message: "M-Pesa STK Push endpoint scaffolded. Implement Daraja calls before going live.",
      data: { phoneNumber, amount, reference },
    })
  } catch (e) {
    return NextResponse.json({ success: false, error: "MpesaError" }, { status: 500 })
  }
}

