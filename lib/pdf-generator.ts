import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface QuoteItem {
  id: string
  service: string
  category: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  specifications: Record<string, any>
  timeline: string
  features: string[]
}

interface QuoteData {
  customerInfo: {
    name: string
    email: string
    phone: string
    company: string
    address: string
  }
  items: QuoteItem[]
  subtotal: number
  tax: number
  total: number
  timeline: string
  notes: string
  status: 'draft' | 'pending' | 'approved' | 'rejected'
}

export async function generateQuotePDF(quoteData: QuoteData): Promise<Blob> {
  const doc = new jsPDF()
  
  // Set font to support special characters
  doc.setFont('helvetica')
  
  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  
  // Header with professional styling
  doc.setFillColor(59, 130, 246) // Primary blue
  doc.rect(0, 0, pageWidth, 80, 'F')
  
  // Company name
  doc.setFontSize(28)
  doc.setTextColor(255, 255, 255)
  doc.text('Brandson Media', margin, 35)
  
  // Tagline
  doc.setFontSize(14)
  doc.setTextColor(219, 234, 254) // Light blue
  doc.text('Professional Printing & Branding Solutions', margin, 50)
  
  // Contact info in header
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text('Nairobi, Kenya | +254 701 869 821 | brandsonmedia@gmail.com', margin, 65)
  doc.text('www.brandsonmedia.co.ke', margin, 75)
  
  // Quote details
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('QUOTATION', 20, 75)
  
  doc.setFontSize(10)
  doc.text(`Quote Number: QT-${Date.now()}`, 20, 85)
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 92)
  doc.text(`Valid Until: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 20, 99)
  
  // Customer Information
  doc.setFontSize(14)
  doc.text('Customer Information', 20, 115)
  
  doc.setFontSize(10)
  const customerData = [
    ['Name:', quoteData.customerInfo.name],
    ['Email:', quoteData.customerInfo.email],
    ['Phone:', quoteData.customerInfo.phone],
    ['Company:', quoteData.customerInfo.company],
    ['Address:', quoteData.customerInfo.address]
  ]
  
  autoTable(doc, {
    startY: 125,
    head: [],
    body: customerData,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 30 },
      1: { cellWidth: 150 }
    }
  })
  
  // Quote Items
  const finalY = (doc as any).lastAutoTable.finalY + 10
  doc.setFontSize(14)
  doc.text('Quote Items', 20, finalY)
  
  const itemsData = quoteData.items.map(item => [
    item.service,
    item.description,
    item.quantity.toString(),
    `KES ${item.unitPrice.toLocaleString()}`,
    `KES ${item.totalPrice.toLocaleString()}`
  ])
  
  autoTable(doc, {
    startY: finalY + 10,
    head: [['Service', 'Description', 'Quantity', 'Unit Price', 'Total']],
    body: itemsData,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 60 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' }
    }
  })
  
  // Pricing Summary
  const itemsFinalY = (doc as any).lastAutoTable.finalY + 10
  doc.setFontSize(14)
  doc.text('Pricing Summary', 20, itemsFinalY)
  
  const pricingData = [
    ['Subtotal:', `KES ${quoteData.subtotal.toLocaleString()}`],
    ['Tax (16%):', `KES ${quoteData.tax.toLocaleString()}`],
    ['Total:', `KES ${quoteData.total.toLocaleString()}`]
  ]
  
  autoTable(doc, {
    startY: itemsFinalY + 10,
    head: [],
    body: pricingData,
    theme: 'plain',
    styles: {
      fontSize: 11,
      cellPadding: 3,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 100 },
      1: { cellWidth: 100, halign: 'right', fontStyle: 'bold' }
    }
  })
  
  // Terms and Conditions
  const pricingFinalY = (doc as any).lastAutoTable.finalY + 15
  doc.setFontSize(14)
  doc.text('Terms and Conditions', 20, pricingFinalY)
  
  doc.setFontSize(9)
  const terms = [
    '1. This quotation is valid for 30 days from the date of issue.',
    '2. Prices include 16% VAT as applicable.',
    '3. Delivery timeline depends on order complexity and quantity.',
    '4. 50% advance payment required to commence work.',
    '5. Balance payment due upon completion before delivery.',
    '6. Warranty applies to manufacturing defects only.',
    '7. Brandson Media reserves the right to adjust prices based on final specifications.'
  ]
  
  let termsY = pricingFinalY + 10
  terms.forEach(term => {
    doc.text(term, 20, termsY)
    termsY += 7
  })
  
  // Notes
  if (quoteData.notes) {
    const notesY = termsY + 10
    doc.setFontSize(14)
    doc.text('Additional Notes', 20, notesY)
    
    doc.setFontSize(9)
    const splitNotes = doc.splitTextToSize(quoteData.notes, 170)
    doc.text(splitNotes, 20, notesY + 10)
  }
  
  // Footer
  const footerHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('Thank you for choosing Brandson Media!', 20, footerHeight - 30)
  doc.text('This is a computer-generated document and does not require a signature.', 20, footerHeight - 20)
  
  return new Blob([doc.output('blob')], { type: 'application/pdf' })
}
