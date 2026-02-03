import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { qrGenerator } from './qr-generator'

export interface QuoteData {
  quoteId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerAddress?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  items: Array<{
    name: string
    description?: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  quoteDate: string
  validUntil: string
  notes?: string
  qrCode?: string
}

export interface ReceiptData {
  receiptId: string
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  transactionId: string
  paymentDate: string
  qrCode?: string
}

export interface OrderData {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerAddress?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'quoted' | 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered'
  orderDate: string
  estimatedDelivery?: string
  qrCode?: string
}

class AdvancedPDFGenerator {
  private companyInfo = {
    name: 'Brandson Media',
    address: '123 Business Avenue, Nairobi, Kenya',
    phone: '+254 701 869 821',
    email: 'info@brandsonmedia.co.ke',
    website: 'www.brandsonmedia.co.ke',
    logo: '/logo.png' // This would be the actual logo path
  }

  /**
   * Generate Quote PDF
   */
  async generateQuotePDF(quoteData: QuoteData): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPosition = 20

    // Generate QR code if not provided
    if (!quoteData.qrCode) {
      const qrData = {
        quoteId: quoteData.quoteId,
        customerName: quoteData.customerName,
        customerEmail: quoteData.customerEmail,
        items: quoteData.items,
        subtotal: quoteData.subtotal,
        tax: quoteData.tax,
        total: quoteData.total,
        quoteDate: quoteData.quoteDate,
        validUntil: quoteData.validUntil
      }
      quoteData.qrCode = await qrGenerator.generateQuoteQR(qrData)
    }

    // Header
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text('QUOTE', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    pdf.setFontSize(16)
    pdf.text(`Quote #: ${quoteData.quoteId}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 20

    // Company Info
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(this.companyInfo.name, 20, yPosition)
    yPosition += 5
    pdf.text(this.companyInfo.address, 20, yPosition)
    yPosition += 5
    pdf.text(`Phone: ${this.companyInfo.phone}`, 20, yPosition)
    yPosition += 5
    pdf.text(`Email: ${this.companyInfo.email}`, 20, yPosition)
    yPosition += 5
    pdf.text(this.companyInfo.website, 20, yPosition)
    yPosition += 15

    // Customer Info
    pdf.setFont('helvetica', 'bold')
    pdf.text('Bill To:', 20, yPosition)
    yPosition += 7
    pdf.setFont('helvetica', 'normal')
    pdf.text(quoteData.customerName, 20, yPosition)
    yPosition += 5
    pdf.text(quoteData.customerEmail, 20, yPosition)
    yPosition += 5
    if (quoteData.customerPhone) {
      pdf.text(quoteData.customerPhone, 20, yPosition)
      yPosition += 5
    }
    if (quoteData.customerAddress) {
      pdf.text(quoteData.customerAddress.street, 20, yPosition)
      yPosition += 5
      pdf.text(`${quoteData.customerAddress.city}, ${quoteData.customerAddress.state} ${quoteData.customerAddress.postalCode}`, 20, yPosition)
      yPosition += 5
      pdf.text(quoteData.customerAddress.country, 20, yPosition)
      yPosition += 15
    }

    // Quote Details
    pdf.setFont('helvetica', 'bold')
    pdf.text('Quote Details:', 20, yPosition)
    yPosition += 7
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Quote Date: ${quoteData.quoteDate}`, 20, yPosition)
    yPosition += 5
    pdf.text(`Valid Until: ${quoteData.validUntil}`, 20, yPosition)
    yPosition += 15

    // Items Table Header
    pdf.setFont('helvetica', 'bold')
    pdf.text('Description', 20, yPosition)
    pdf.text('Qty', 120, yPosition)
    pdf.text('Unit Price', 140, yPosition)
    pdf.text('Total', 170, yPosition)
    yPosition += 7

    // Draw line
    pdf.setLineWidth(0.5)
    pdf.line(20, yPosition, 190, yPosition)
    yPosition += 5

    // Items
    pdf.setFont('helvetica', 'normal')
    quoteData.items.forEach((item, index) => {
      const descriptionLines = pdf.splitTextToSize(item.name, 90)
      descriptionLines.forEach((line: string) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage()
          yPosition = 20
        }
        pdf.text(line, 20, yPosition)
        yPosition += 5
      })
      
      pdf.text(item.quantity.toString(), 120, yPosition)
      pdf.text(`KES ${item.unitPrice.toLocaleString()}`, 140, yPosition)
      pdf.text(`KES ${item.totalPrice.toLocaleString()}`, 170, yPosition)
      yPosition += 8
    })

    // Draw line
    pdf.line(20, yPosition, 190, yPosition)
    yPosition += 8

    // Totals
    pdf.setFont('helvetica', 'bold')
    pdf.text('Subtotal:', 140, yPosition)
    pdf.text(`KES ${quoteData.subtotal.toLocaleString()}`, 170, yPosition)
    yPosition += 7
    pdf.text('Tax (16%):', 140, yPosition)
    pdf.text(`KES ${quoteData.tax.toLocaleString()}`, 170, yPosition)
    yPosition += 7
    pdf.text('Shipping:', 140, yPosition)
    pdf.text(`KES ${quoteData.shipping.toLocaleString()}`, 170, yPosition)
    yPosition += 7
    pdf.setFontSize(14)
    pdf.text('Total:', 140, yPosition)
    pdf.text(`KES ${quoteData.total.toLocaleString()}`, 170, yPosition)
    yPosition += 15

    // Notes
    if (quoteData.notes) {
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Notes:', 20, yPosition)
      yPosition += 7
      pdf.setFont('helvetica', 'normal')
      const notesLines = pdf.splitTextToSize(quoteData.notes, 170)
      notesLines.forEach((line: string) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage()
          yPosition = 20
        }
        pdf.text(line, 20, yPosition)
        yPosition += 5
      })
      yPosition += 10
    }

    // QR Code
    if (quoteData.qrCode) {
      if (yPosition > pageHeight - 80) {
        pdf.addPage()
        yPosition = 20
      }
      
      pdf.setFont('helvetica', 'bold')
      pdf.text('Scan to Verify:', 20, yPosition)
      yPosition += 5
      
      try {
        // Add QR code image
        const qrImg = new Image()
        qrImg.src = quoteData.qrCode
        pdf.addImage(qrImg, 'PNG', 20, yPosition, 40, 40)
      } catch (error) {
        console.error('Error adding QR code to PDF:', error)
        pdf.text('QR Code', 20, yPosition + 20)
      }
      
      yPosition += 50
    }

    // Footer
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'italic')
    pdf.text('Thank you for your business!', pageWidth / 2, pageHeight - 20, { align: 'center' })
    pdf.text('This quote is valid until the specified date.', pageWidth / 2, pageHeight - 15, { align: 'center' })
    pdf.text('Scan the QR code to verify authenticity.', pageWidth / 2, pageHeight - 10, { align: 'center' })

    return pdf.output('blob')
  }

  /**
   * Generate Receipt PDF
   */
  async generateReceiptPDF(receiptData: ReceiptData): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    let yPosition = 20

    // Generate QR code if not provided
    if (!receiptData.qrCode) {
      const qrData = {
        receiptId: receiptData.receiptId,
        orderId: receiptData.orderId,
        customerName: receiptData.customerName,
        customerEmail: receiptData.customerEmail,
        items: receiptData.items,
        total: receiptData.total,
        paymentMethod: receiptData.paymentMethod,
        transactionId: receiptData.transactionId,
        paymentDate: receiptData.paymentDate
      }
      receiptData.qrCode = await qrGenerator.generateReceiptQR(qrData)
    }

    // Header
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text('RECEIPT', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    pdf.setFontSize(16)
    pdf.text(`Receipt #: ${receiptData.receiptId}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10
    pdf.text(`Order #: ${receiptData.orderId}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 20

    // Company Info
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(this.companyInfo.name, 20, yPosition)
    yPosition += 5
    pdf.text(this.companyInfo.address, 20, yPosition)
    yPosition += 5
    pdf.text(`Phone: ${this.companyInfo.phone}`, 20, yPosition)
    yPosition += 5
    pdf.text(`Email: ${this.companyInfo.email}`, 20, yPosition)
    yPosition += 15

    // Customer Info
    pdf.setFont('helvetica', 'bold')
    pdf.text('Customer:', 20, yPosition)
    yPosition += 7
    pdf.setFont('helvetica', 'normal')
    pdf.text(receiptData.customerName, 20, yPosition)
    yPosition += 5
    pdf.text(receiptData.customerEmail, 20, yPosition)
    yPosition += 15

    // Payment Details
    pdf.setFont('helvetica', 'bold')
    pdf.text('Payment Details:', 20, yPosition)
    yPosition += 7
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Payment Method: ${receiptData.paymentMethod}`, 20, yPosition)
    yPosition += 5
    pdf.text(`Transaction ID: ${receiptData.transactionId}`, 20, yPosition)
    yPosition += 5
    pdf.text(`Payment Date: ${receiptData.paymentDate}`, 20, yPosition)
    yPosition += 15

    // Items Table Header
    pdf.setFont('helvetica', 'bold')
    pdf.text('Description', 20, yPosition)
    pdf.text('Qty', 120, yPosition)
    pdf.text('Unit Price', 140, yPosition)
    pdf.text('Total', 170, yPosition)
    yPosition += 7

    // Draw line
    pdf.setLineWidth(0.5)
    pdf.line(20, yPosition, 190, yPosition)
    yPosition += 5

    // Items
    pdf.setFont('helvetica', 'normal')
    receiptData.items.forEach((item) => {
      const descriptionLines = pdf.splitTextToSize(item.name, 90)
      descriptionLines.forEach((line: string) => {
        pdf.text(line, 20, yPosition)
        yPosition += 5
      })
      
      pdf.text(item.quantity.toString(), 120, yPosition)
      pdf.text(`KES ${item.unitPrice.toLocaleString()}`, 140, yPosition)
      pdf.text(`KES ${item.totalPrice.toLocaleString()}`, 170, yPosition)
      yPosition += 8
    })

    // Draw line
    pdf.line(20, yPosition, 190, yPosition)
    yPosition += 8

    // Totals
    pdf.setFont('helvetica', 'bold')
    pdf.text('Subtotal:', 140, yPosition)
    pdf.text(`KES ${receiptData.subtotal.toLocaleString()}`, 170, yPosition)
    yPosition += 7
    pdf.text('Tax (16%):', 140, yPosition)
    pdf.text(`KES ${receiptData.tax.toLocaleString()}`, 170, yPosition)
    yPosition += 7
    pdf.setFontSize(14)
    pdf.text('Total Paid:', 140, yPosition)
    pdf.text(`KES ${receiptData.total.toLocaleString()}`, 170, yPosition)
    yPosition += 15

    // QR Code
    if (receiptData.qrCode) {
      pdf.setFont('helvetica', 'bold')
      pdf.text('Scan to Verify:', 20, yPosition)
      yPosition += 5
      
      try {
        const qrImg = new Image()
        qrImg.src = receiptData.qrCode
        pdf.addImage(qrImg, 'PNG', 20, yPosition, 40, 40)
      } catch (error) {
        console.error('Error adding QR code to PDF:', error)
        pdf.text('QR Code', 20, yPosition + 20)
      }
      
      yPosition += 50
    }

    // Footer
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'italic')
    pdf.text('Thank you for your purchase!', pageWidth / 2, pdf.internal.pageSize.getHeight() - 20, { align: 'center' })
    pdf.text('This receipt serves as proof of payment.', pageWidth / 2, pdf.internal.pageSize.getHeight() - 15, { align: 'center' })
    pdf.text('Scan the QR code to verify authenticity.', pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' })

    return pdf.output('blob')
  }

  /**
   * Generate Order Confirmation PDF
   */
  async generateOrderPDF(orderData: OrderData): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    let yPosition = 20

    // Generate QR code if not provided
    if (!orderData.qrCode) {
      const qrData = {
        orderId: orderData.orderId,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        items: orderData.items,
        total: orderData.total,
        status: orderData.status,
        orderDate: orderData.orderDate
      }
      orderData.qrCode = await qrGenerator.generateOrderQR(qrData)
    }

    // Header
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text('ORDER CONFIRMATION', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    pdf.setFontSize(16)
    pdf.text(`Order #: ${orderData.orderId}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10

    // Status Badge
    const statusColors = {
      quoted: [255, 193, 7],    // yellow
      pending: [108, 117, 125],  // gray
      paid: [40, 167, 69],      // green
      processing: [0, 123, 255], // blue
      shipped: [255, 193, 7],   // yellow
      delivered: [40, 167, 69]   // green
    }
    
    const statusColor = statusColors[orderData.status] || [108, 117, 125]
    pdf.setFillColor(...statusColor)
    pdf.rect(pageWidth / 2 - 30, yPosition - 5, 60, 10, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.text(orderData.status.toUpperCase(), pageWidth / 2, yPosition, { align: 'center' })
    pdf.setTextColor(0, 0, 0)
    yPosition += 20

    // Company Info
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(this.companyInfo.name, 20, yPosition)
    yPosition += 5
    pdf.text(this.companyInfo.address, 20, yPosition)
    yPosition += 5
    pdf.text(`Phone: ${this.companyInfo.phone}`, 20, yPosition)
    yPosition += 5
    pdf.text(`Email: ${this.companyInfo.email}`, 20, yPosition)
    yPosition += 15

    // Customer Info
    pdf.setFont('helvetica', 'bold')
    pdf.text('Customer:', 20, yPosition)
    yPosition += 7
    pdf.setFont('helvetica', 'normal')
    pdf.text(orderData.customerName, 20, yPosition)
    yPosition += 5
    pdf.text(orderData.customerEmail, 20, yPosition)
    yPosition += 5
    if (orderData.customerPhone) {
      pdf.text(orderData.customerPhone, 20, yPosition)
      yPosition += 5
    }
    if (orderData.customerAddress) {
      pdf.text(orderData.customerAddress.street, 20, yPosition)
      yPosition += 5
      pdf.text(`${orderData.customerAddress.city}, ${orderData.customerAddress.state}`, 20, yPosition)
      yPosition += 15
    }

    // Order Details
    pdf.setFont('helvetica', 'bold')
    pdf.text('Order Details:', 20, yPosition)
    yPosition += 7
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Order Date: ${orderData.orderDate}`, 20, yPosition)
    yPosition += 5
    if (orderData.estimatedDelivery) {
      pdf.text(`Estimated Delivery: ${orderData.estimatedDelivery}`, 20, yPosition)
      yPosition += 15
    }

    // Items (similar to quote and receipt)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Description', 20, yPosition)
    pdf.text('Qty', 120, yPosition)
    pdf.text('Unit Price', 140, yPosition)
    pdf.text('Total', 170, yPosition)
    yPosition += 7

    pdf.setLineWidth(0.5)
    pdf.line(20, yPosition, 190, yPosition)
    yPosition += 5

    pdf.setFont('helvetica', 'normal')
    orderData.items.forEach((item) => {
      const descriptionLines = pdf.splitTextToSize(item.name, 90)
      descriptionLines.forEach((line: string) => {
        pdf.text(line, 20, yPosition)
        yPosition += 5
      })
      
      pdf.text(item.quantity.toString(), 120, yPosition)
      pdf.text(`KES ${item.unitPrice.toLocaleString()}`, 140, yPosition)
      pdf.text(`KES ${item.totalPrice.toLocaleString()}`, 170, yPosition)
      yPosition += 8
    })

    pdf.line(20, yPosition, 190, yPosition)
    yPosition += 8

    // Totals
    pdf.setFont('helvetica', 'bold')
    pdf.text('Subtotal:', 140, yPosition)
    pdf.text(`KES ${orderData.subtotal.toLocaleString()}`, 170, yPosition)
    yPosition += 7
    pdf.text('Tax (16%):', 140, yPosition)
    pdf.text(`KES ${orderData.tax.toLocaleString()}`, 170, yPosition)
    yPosition += 7
    pdf.text('Shipping:', 140, yPosition)
    pdf.text(`KES ${orderData.shipping.toLocaleString()}`, 170, yPosition)
    yPosition += 7
    pdf.setFontSize(14)
    pdf.text('Total:', 140, yPosition)
    pdf.text(`KES ${orderData.total.toLocaleString()}`, 170, yPosition)
    yPosition += 15

    // QR Code
    if (orderData.qrCode) {
      pdf.setFont('helvetica', 'bold')
      pdf.text('Scan to Track Order:', 20, yPosition)
      yPosition += 5
      
      try {
        const qrImg = new Image()
        qrImg.src = orderData.qrCode
        pdf.addImage(qrImg, 'PNG', 20, yPosition, 40, 40)
      } catch (error) {
        console.error('Error adding QR code to PDF:', error)
        pdf.text('QR Code', 20, yPosition + 20)
      }
    }

    return pdf.output('blob')
  }

  /**
   * Download PDF file
   */
  downloadPDF(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  /**
   * Share PDF via email
   */
  async sharePDFViaEmail(blob: Blob, filename: string, recipientEmail: string, subject: string): Promise<void> {
    // This would typically be handled by a backend service
    // For now, we'll create a mailto link with attachment info
    const body = `Please find the ${filename} attached. This document contains a QR code for verification.`
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    
    window.open(mailtoLink)
    
    // In a real implementation, you would:
    // 1. Upload the PDF to a cloud storage service
    // 2. Send an email via your backend with the PDF attachment
    // 3. Include a secure download link
  }

  /**
   * Share PDF via WhatsApp
   */
  sharePDFViaWhatsApp(filename: string, message: string): void {
    const whatsappMessage = `${message}\n\nI've shared a ${filename} with you. It contains a QR code for verification.`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, '_blank')
  }
}

export const pdfGenerator = new AdvancedPDFGenerator()
export default AdvancedPDFGenerator
