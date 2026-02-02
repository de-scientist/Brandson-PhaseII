import { NextResponse } from "next/server"
import { getInvoiceById, sendInvoiceEmail } from '@/lib/invoices'

interface RouteParams {
  params: Promise<{
    invoiceId: string
  }>
}

// POST /api/invoices/[invoiceId]/send - Send invoice via email
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { invoiceId } = await params
    
    // Get the invoice
    const invoice = await getInvoiceById(invoiceId)
    
    if (!invoice) {
      return NextResponse.json({
        success: false,
        error: 'Invoice not found',
      }, { status: 404 })
    }
    
    // Send invoice email
    const success = await sendInvoiceEmail(invoice)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to send invoice email',
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: `Invoice ${invoice.invoiceNumber} sent to ${invoice.customerEmail}`,
    })
  } catch (error) {
    console.error('Error sending invoice email:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send invoice email',
    }, { status: 500 })
  }
}
