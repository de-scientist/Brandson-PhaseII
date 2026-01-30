import { NextResponse } from "next/server"
import { queryTransactionStatus } from '@/lib/mpesa'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const checkoutRequestID = searchParams.get('checkoutRequestID')
    
    if (!checkoutRequestID) {
      return NextResponse.json({
        success: false,
        message: 'Missing checkoutRequestID parameter',
      }, { status: 400 })
    }
    
    const result = await queryTransactionStatus(checkoutRequestID)
    
    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('M-Pesa status query error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to query transaction status',
      error: 'Status query failed',
    }, { status: 500 })
  }
}
