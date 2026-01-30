import { Order } from './orders'

export interface Invoice {
  id: string
  invoiceNumber: string
  orderId: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress?: {
    street: string
    city: string
    state?: string
    postalCode?: string
    country: string
  }
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  currency: string
  issueDate: Date
  dueDate: Date
  status: InvoiceStatus
  paymentMethod?: string
  paymentReference?: string
  notes?: string
  terms?: string
  companyInfo: CompanyInfo
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  metadata?: Record<string, any>
}

export type InvoiceStatus = 
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'refunded'

export interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  website: string
  taxId?: string
  logo?: string
}

// In-memory storage for development (replace with database in production)
let invoices: Invoice[] = []
let invoiceIdCounter = 1000

// Company information (would come from environment or CMS in production)
export const COMPANY_INFO: CompanyInfo = {
  name: 'Brandson Media',
  address: 'Nairobi, Kenya',
  phone: '+254 701 869821',
  email: 'brandsonmedia@gmail.com',
  website: 'https://brandsonmedia.co.ke',
  taxId: 'PVT-123456789',
}

/**
 * Generate unique invoice number
 */
export function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const sequence = String(invoiceIdCounter++).padStart(4, '0')
  
  return `INV${year}${month}${day}${sequence}`
}

/**
 * Create invoice from order
 */
export async function createInvoiceFromOrder(order: Order): Promise<Invoice> {
  const invoice: Invoice = {
    id: crypto.randomUUID(),
    invoiceNumber: generateInvoiceNumber(),
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    customerAddress: order.shippingAddress || order.billingAddress,
    items: order.items.map(item => ({
      id: crypto.randomUUID(),
      description: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      metadata: item.metadata,
    })),
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    currency: order.currency,
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: order.paymentStatus === 'paid' ? 'paid' : 'sent',
    paymentMethod: order.paymentMethod,
    paymentReference: order.metadata?.paymentReference,
    notes: order.notes,
    terms: 'Payment due within 30 days. Late payments subject to 5% monthly interest.',
    companyInfo: COMPANY_INFO,
  }

  // Store invoice (in production, this would be a database operation)
  invoices.push(invoice)

  return invoice
}

/**
 * Get invoice by ID
 */
export async function getInvoiceById(invoiceId: string): Promise<Invoice | null> {
  const invoice = invoices.find(i => i.id === invoiceId)
  return invoice || null
}

/**
 * Get invoice by invoice number
 */
export async function getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | null> {
  const invoice = invoices.find(i => i.invoiceNumber === invoiceNumber)
  return invoice || null
}

/**
 * Get invoice by order ID
 */
export async function getInvoiceByOrderId(orderId: string): Promise<Invoice | null> {
  const invoice = invoices.find(i => i.orderId === orderId)
  return invoice || null
}

/**
 * Update invoice status
 */
export async function updateInvoiceStatus(invoiceId: string, status: InvoiceStatus): Promise<Invoice | null> {
  const invoiceIndex = invoices.findIndex(i => i.id === invoiceId)
  if (invoiceIndex === -1) return null

  invoices[invoiceIndex].status = status
  return invoices[invoiceIndex]
}

/**
 * Get all invoices with optional filtering
 */
export async function getInvoices(filter?: {
  status?: InvoiceStatus[]
  customerId?: string
  dateFrom?: Date
  dateTo?: Date
  search?: string
}): Promise<Invoice[]> {
  let filteredInvoices = [...invoices]

  if (filter) {
    if (filter.status?.length) {
      filteredInvoices = filteredInvoices.filter(i => filter.status!.includes(i.status))
    }
    if (filter.customerId) {
      filteredInvoices = filteredInvoices.filter(i => i.customerEmail === filter.customerId)
    }
    if (filter.dateFrom) {
      filteredInvoices = filteredInvoices.filter(i => i.issueDate >= filter.dateFrom!)
    }
    if (filter.dateTo) {
      filteredInvoices = filteredInvoices.filter(i => i.issueDate <= filter.dateTo!)
    }
    if (filter.search) {
      const search = filter.search.toLowerCase()
      filteredInvoices = filteredInvoices.filter(i => 
        i.invoiceNumber.toLowerCase().includes(search) ||
        i.customerName.toLowerCase().includes(search) ||
        i.customerEmail.toLowerCase().includes(search) ||
        i.orderNumber.toLowerCase().includes(search)
      )
    }
  }

  // Sort by issue date (newest first)
  return filteredInvoices.sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime())
}

/**
 * Generate invoice HTML
 */
export function generateInvoiceHTML(invoice: Invoice): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoice.invoiceNumber}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .company-info h1 {
            margin: 0;
            color: #333;
            font-size: 24px;
        }
        .company-info p {
            margin: 5px 0;
            color: #666;
        }
        .invoice-details {
            text-align: right;
        }
        .invoice-details h2 {
            margin: 0;
            color: #333;
            font-size: 20px;
        }
        .invoice-details p {
            margin: 5px 0;
            color: #666;
        }
        .customer-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .customer-info, .invoice-info {
            flex: 1;
        }
        .customer-info h3, .invoice-info h3 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 16px;
        }
        .customer-info p, .invoice-info p {
            margin: 5px 0;
            color: #666;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .items-table th,
        .items-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        .items-table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        .items-table .text-right {
            text-align: right;
        }
        .totals {
            text-align: right;
            margin-top: 20px;
        }
        .totals p {
            margin: 5px 0;
            font-size: 16px;
        }
        .totals .total {
            font-weight: bold;
            font-size: 18px;
            color: #333;
            border-top: 2px solid #333;
            padding-top: 10px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
        .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status.paid { background-color: #d4edda; color: #155724; }
        .status.sent { background-color: #d1ecf1; color: #0c5460; }
        .status.overdue { background-color: #f8d7da; color: #721c24; }
        .status.draft { background-color: #fff3cd; color: #856404; }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="company-info">
                <h1>${invoice.companyInfo.name}</h1>
                <p>${invoice.companyInfo.address}</p>
                <p>Phone: ${invoice.companyInfo.phone}</p>
                <p>Email: ${invoice.companyInfo.email}</p>
                <p>Website: ${invoice.companyInfo.website}</p>
                ${invoice.companyInfo.taxId ? `<p>Tax ID: ${invoice.companyInfo.taxId}</p>` : ''}
            </div>
            <div class="invoice-details">
                <h2>INVOICE</h2>
                <p><strong>Number:</strong> ${invoice.invoiceNumber}</p>
                <p><strong>Date:</strong> ${invoice.issueDate.toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> ${invoice.dueDate.toLocaleDateString()}</p>
                <p><strong>Order:</strong> ${invoice.orderNumber}</p>
                <p><strong>Status:</strong> <span class="status ${invoice.status}">${invoice.status}</span></p>
            </div>
        </div>

        <div class="customer-section">
            <div class="customer-info">
                <h3>Bill To:</h3>
                <p><strong>${invoice.customerName}</strong></p>
                <p>${invoice.customerEmail}</p>
                <p>${invoice.customerPhone}</p>
                ${invoice.customerAddress ? `
                    <p>${invoice.customerAddress.street}</p>
                    <p>${invoice.customerAddress.city}, ${invoice.customerAddress.state || ''} ${invoice.customerAddress.postalCode || ''}</p>
                    <p>${invoice.customerAddress.country}</p>
                ` : ''}
            </div>
            <div class="invoice-info">
                <h3>Payment Details:</h3>
                ${invoice.paymentMethod ? `<p><strong>Method:</strong> ${invoice.paymentMethod}</p>` : ''}
                ${invoice.paymentReference ? `<p><strong>Reference:</strong> ${invoice.paymentReference}</p>` : ''}
                <p><strong>Currency:</strong> ${invoice.currency.toUpperCase()}</p>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="text-right">Quantity</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${invoice.items.map(item => `
                    <tr>
                        <td>${item.description}</td>
                        <td class="text-right">${item.quantity}</td>
                        <td class="text-right">KES ${item.unitPrice.toLocaleString()}</td>
                        <td class="text-right">KES ${item.totalPrice.toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="totals">
            <p><strong>Subtotal:</strong> KES ${invoice.subtotal.toLocaleString()}</p>
            <p><strong>Tax:</strong> KES ${invoice.tax.toLocaleString()}</p>
            <p class="total"><strong>Total:</strong> KES ${invoice.total.toLocaleString()}</p>
        </div>

        ${invoice.notes ? `
            <div style="margin-top: 30px;">
                <h3>Notes:</h3>
                <p>${invoice.notes}</p>
            </div>
        ` : ''}

        <div class="footer">
            <p><strong>Terms & Conditions:</strong> ${invoice.terms}</p>
            <p>Thank you for your business! For any questions, please contact us at ${invoice.companyInfo.email} or ${invoice.companyInfo.phone}.</p>
        </div>
    </div>
</body>
</html>
  `
}

/**
 * Generate invoice PDF (placeholder - would use a PDF library in production)
 */
export async function generateInvoicePDF(invoice: Invoice): Promise<Buffer> {
  // In production, this would use a library like puppeteer, pdfkit, or similar
  const html = generateInvoiceHTML(invoice)
  
  // For now, return the HTML as a buffer (placeholder implementation)
  return Buffer.from(html, 'utf-8')
}

/**
 * Send invoice via email (placeholder)
 */
export async function sendInvoiceEmail(invoice: Invoice): Promise<boolean> {
  try {
    // In production, this would integrate with an email service like SendGrid, Nodemailer, etc.
    console.log(`Sending invoice ${invoice.invoiceNumber} to ${invoice.customerEmail}`)
    
    // TODO: Implement email sending logic
    // - Generate PDF
    // - Send email with PDF attachment
    // - Log email delivery
    
    return true
  } catch (error) {
    console.error('Error sending invoice email:', error)
    return false
  }
}

/**
 * Get invoice statistics
 */
export async function getInvoiceStats(filter?: {
  dateFrom?: Date
  dateTo?: Date
  status?: InvoiceStatus[]
}): Promise<{
  total: number
  paid: number
  sent: number
  overdue: number
  totalAmount: number
  paidAmount: number
  outstandingAmount: number
}> {
  const invoices = await getInvoices(filter)
  
  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, i) => sum + i.total, 0),
    paidAmount: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0),
    outstandingAmount: 0,
  }
  
  stats.outstandingAmount = stats.totalAmount - stats.paidAmount
  
  return stats
}
