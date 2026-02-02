import { NextResponse } from "next/server"
import { 
  getInvoiceById,
  updateInvoiceStatus,
  generateInvoiceHTML,
  generateInvoicePDF,
  sendInvoiceEmail,
  InvoiceStatus
} from '@/lib/invoices'

interface RouteParams {
  params: Promise<{
    invoiceId: string
  }>
}

// GET /api/invoices/[invoiceId] - Get specific invoice
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') // 'html', 'pdf', or default JSON
    const { invoiceId } = await params
    
    const invoice = await getInvoiceById(invoiceId)
    
    if (!invoice) {
      return NextResponse.json({
        success: false,
        error: 'Invoice not found',
      }, { status: 404 })
    }
    
    if (format === 'html') {
      // Return HTML invoice
      const html = generateInvoiceHTML(invoice)
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `inline; filename="invoice-${invoice.invoiceNumber}.html"`,
        },
      })
    } else if (format === 'pdf') {
      // Return PDF invoice (placeholder implementation)
      const pdf = await generateInvoicePDF(invoice)
      return new NextResponse(pdf.toString(), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
        },
      })
    } else {
      // Return JSON invoice
      return NextResponse.json({
        success: true,
        data: invoice,
      })
    }
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch invoice',
    }, { status: 500 })
  }
}

// PUT /api/invoices/[invoiceId] - Update invoice status
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { status }: { status: InvoiceStatus } = await req.json()
    
    if (!status) {
      return NextResponse.json({
        success: false,
        error: 'Status is required',
      }, { status: 400 })
    }
    
    const { invoiceId } = await params
    
    // Validate that invoice exists
    const existingInvoice = await getInvoiceById(invoiceId)
    if (!existingInvoice) {
      return NextResponse.json({
        success: false,
        error: 'Invoice not found',
      }, { status: 404 })
    }
    
    // Update invoice status
    const invoice = await updateInvoiceStatus(invoiceId, status)
    
    if (!invoice) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update invoice status',
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      data: invoice,
      message: `Invoice status updated to ${status}`,
    })
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update invoice',
    }, { status: 500 })
  }
}
