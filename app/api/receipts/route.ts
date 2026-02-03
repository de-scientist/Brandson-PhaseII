import { NextResponse } from "next/server"
import { createReceipt, getReceiptsByCustomer, getReceiptsByOrder, getReceiptStats } from "@/lib/database/receipts"
import { qrGenerator } from "@/lib/qr-generator"
import { pdfGenerator } from "@/lib/pdf-generator-advanced"

// GET /api/receipts - Get receipts for a customer
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const customerId = searchParams.get('customerId')
    const orderId = searchParams.get('orderId')
    const stats = searchParams.get('stats') === 'true'
    
    if (stats) {
      const receiptStats = getReceiptStats()
      return NextResponse.json({
        success: true,
        data: receiptStats
      })
    }
    
    if (!customerId && !orderId) {
      return NextResponse.json({
        success: false,
        error: 'Customer ID or Order ID is required'
      }, { status: 400 })
    }

    let receipts
    if (customerId) {
      receipts = getReceiptsByCustomer(customerId)
    } else if (orderId) {
      receipts = getReceiptsByOrder(orderId)
    }

    return NextResponse.json({
      success: true,
      data: receipts
    })
  } catch (error) {
    console.error('Error fetching receipts:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch receipts'
    }, { status: 500 })
  }
}

// POST /api/receipts - Create new receipt
export async function POST(req: Request) {
  try {
    const receiptData = await req.json()
    
    // Validate required fields
    const requiredFields = ['orderId', 'customerId', 'customerName', 'customerEmail', 'items', 'paymentMethod', 'transactionId']
    for (const field of requiredFields) {
      if (!receiptData[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 })
      }
    }

    // Validate items
    if (!Array.isArray(receiptData.items) || receiptData.items.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'At least one item is required'
      }, { status: 400 })
    }

    // Set default values
    const newReceiptData = {
      ...receiptData,
      status: 'completed' as const,
      paymentDate: new Date().toISOString(),
      subtotal: receiptData.subtotal || 0,
      tax: receiptData.tax || 0,
      total: receiptData.total || 0
    }

    // Create receipt
    const receipt = createReceipt(newReceiptData)

    // Generate QR code
    const qrData = {
      receiptId: receipt.id,
      orderId: receipt.orderId,
      customerName: receipt.customerName,
      customerEmail: receipt.customerEmail,
      items: receipt.items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.unitPrice
      })),
      subtotal: receipt.subtotal,
      tax: receipt.tax,
      total: receipt.total,
      paymentMethod: receipt.paymentMethod,
      transactionId: receipt.transactionId,
      paymentDate: receipt.paymentDate
    }
    
    const qrCode = await qrGenerator.generateReceiptQR(qrData)
    receipt.qrCode = qrCode

    // Generate PDF
    const pdfData = {
      receiptId: receipt.id,
      orderId: receipt.orderId,
      customerName: receipt.customerName,
      customerEmail: receipt.customerEmail,
      items: receipt.items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      })),
      subtotal: receipt.subtotal,
      tax: receipt.tax,
      total: receipt.total,
      paymentMethod: receipt.paymentMethod,
      transactionId: receipt.transactionId,
      paymentDate: receipt.paymentDate,
      qrCode: qrCode
    }

    const pdfBlob = await pdfGenerator.generateReceiptPDF(pdfData)
    
    // In a real app, you would upload the PDF to cloud storage and save the URL
    // For now, we'll just return the base64 encoded PDF
    const pdfBuffer = await pdfBlob.arrayBuffer()
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')
    receipt.pdfUrl = `data:application/pdf;base64,${pdfBase64}`

    return NextResponse.json({
      success: true,
      data: receipt,
      message: 'Receipt created successfully'
    })
  } catch (error) {
    console.error('Error creating receipt:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create receipt'
    }, { status: 500 })
  }
}
