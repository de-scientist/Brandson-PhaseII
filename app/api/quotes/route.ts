import { NextResponse } from "next/server"
import { createQuote, getQuotesByCustomer, updateExpiredQuotes } from "@/lib/database/quotes"
import { qrGenerator } from "@/lib/qr-generator"
import { pdfGenerator } from "@/lib/pdf-generator-advanced"

// GET /api/quotes - Get quotes for a customer
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const customerId = searchParams.get('customerId')
    
    if (!customerId) {
      return NextResponse.json({
        success: false,
        error: 'Customer ID is required'
      }, { status: 400 })
    }

    // Update expired quotes first
    updateExpiredQuotes()

    const quotes = getQuotesByCustomer(customerId)

    return NextResponse.json({
      success: true,
      data: quotes
    })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch quotes'
    }, { status: 500 })
  }
}

// POST /api/quotes - Create new quote
export async function POST(req: Request) {
  try {
    const quoteData = await req.json()
    
    // Validate required fields
    const requiredFields = ['customerId', 'customerName', 'customerEmail', 'items']
    for (const field of requiredFields) {
      if (!quoteData[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 })
      }
    }

    // Validate items
    if (!Array.isArray(quoteData.items) || quoteData.items.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'At least one item is required'
      }, { status: 400 })
    }

    // Set default values
    const newQuoteData = {
      ...quoteData,
      status: 'draft',
      quoteDate: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      subtotal: quoteData.subtotal || 0,
      tax: quoteData.tax || 0,
      shipping: quoteData.shipping || 0,
      total: quoteData.total || 0
    }

    // Create quote
    const quote = createQuote(newQuoteData)

    // Generate QR code
    const qrData = {
      quoteId: quote.id,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      items: quote.items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.unitPrice
      })),
      subtotal: quote.subtotal,
      tax: quote.tax,
      total: quote.total,
      quoteDate: quote.quoteDate,
      validUntil: quote.validUntil
    }
    
    const qrCode = await qrGenerator.generateQuoteQR(qrData)
    quote.qrCode = qrCode

    // Generate PDF
    const pdfData = {
      quoteId: quote.id,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerPhone: quote.customerPhone,
      customerAddress: quote.customerAddress,
      items: quote.items.map(item => ({
        name: item.productName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      })),
      subtotal: quote.subtotal,
      tax: quote.tax,
      shipping: quote.shipping,
      total: quote.total,
      quoteDate: quote.quoteDate,
      validUntil: quote.validUntil,
      notes: quote.notes,
      qrCode: qrCode
    }

    const pdfBlob = await pdfGenerator.generateQuotePDF(pdfData)
    
    // In a real app, you would upload the PDF to cloud storage and save the URL
    // For now, we'll just return the base64 encoded PDF
    const pdfBuffer = await pdfBlob.arrayBuffer()
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')
    quote.pdfUrl = `data:application/pdf;base64,${pdfBase64}`

    return NextResponse.json({
      success: true,
      data: quote,
      message: 'Quote created successfully'
    })
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create quote'
    }, { status: 500 })
  }
}
