// Receipt database schema and mock data
export interface ReceiptItem {
  productId: string
  productName: string
  variantId: string
  variantName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Receipt {
  id: string
  receiptNumber: string
  orderId: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: ReceiptItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: 'mpesa' | 'stripe' | 'bank-transfer' | 'cash'
  transactionId: string
  paymentDate: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  qrCode?: string
  pdfUrl?: string
  createdAt: string
  updatedAt: string
  refundAmount?: number
  refundReason?: string
  refundDate?: string
}

// Mock receipts data
export const mockReceipts: Receipt[] = [
  {
    id: "receipt-1",
    receiptNumber: "R-2024-001",
    orderId: "order-1",
    customerId: "customer-2",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@company.com",
    customerPhone: "+254 712 345 678",
    items: [
      {
        productId: "pvc-banners",
        productName: "PVC Banners",
        variantId: "pb-4x2",
        variantName: "4ft x 2ft Banner",
        quantity: 2,
        unitPrice: 4500,
        totalPrice: 9000
      }
    ],
    subtotal: 9000,
    tax: 1440,
    total: 10940,
    paymentMethod: "mpesa",
    transactionId: "MPESA123456789",
    paymentDate: "2024-01-26T10:30:00Z",
    status: "completed",
    createdAt: "2024-01-26T10:30:00Z",
    updatedAt: "2024-01-26T10:30:00Z"
  },
  {
    id: "receipt-2",
    receiptNumber: "R-2024-002",
    orderId: "order-2",
    customerId: "customer-1",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "+254 700 000 000",
    items: [
      {
        productId: "business-cards-standard",
        productName: "Standard Business Cards",
        variantId: "bc-250-gloss",
        variantName: "250 Cards - Glossy",
        quantity: 250,
        unitPrice: 2500,
        totalPrice: 2500
      },
      {
        productId: "letterheads-a4",
        productName: "A4 Letterheads",
        variantId: "lh-100-120gsm",
        variantName: "100 Sheets - 120gsm",
        quantity: 100,
        unitPrice: 3500,
        totalPrice: 3500
      }
    ],
    subtotal: 6000,
    tax: 960,
    total: 7310,
    paymentMethod: "stripe",
    transactionId: "STRIPE987654321",
    paymentDate: "2024-02-05T14:15:00Z",
    status: "completed",
    createdAt: "2024-02-05T14:15:00Z",
    updatedAt: "2024-02-05T14:15:00Z"
  },
  {
    id: "receipt-3",
    receiptNumber: "R-2024-003",
    orderId: "order-3",
    customerId: "customer-3",
    customerName: "Acme Corporation",
    customerEmail: "procurement@acme.com",
    customerPhone: "+254 723 456 789",
    items: [
      {
        productId: "branded-tshirts",
        productName: "Custom Branded T-Shirts",
        variantId: "bt-m-50",
        variantName: "50 T-Shirts - Size M",
        quantity: 50,
        unitPrice: 800,
        totalPrice: 40000
      }
    ],
    subtotal: 40000,
    tax: 6400,
    total: 46400,
    paymentMethod: "bank-transfer",
    transactionId: "BANK456789123",
    paymentDate: "2024-02-10T09:45:00Z",
    status: "completed",
    createdAt: "2024-02-10T09:45:00Z",
    updatedAt: "2024-02-10T09:45:00Z"
  }
]

// Receipt management functions
export const generateReceiptNumber = (): string => {
  const year = new Date().getFullYear()
  const sequence = mockReceipts.length + 1
  return `R-${year}-${sequence.toString().padStart(3, '0')}`
}

export const createReceipt = (receiptData: Omit<Receipt, 'id' | 'receiptNumber' | 'createdAt' | 'updatedAt'>): Receipt => {
  const newReceipt: Receipt = {
    ...receiptData,
    id: `receipt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    receiptNumber: generateReceiptNumber(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  mockReceipts.push(newReceipt)
  return newReceipt
}

export const getReceiptById = (id: string): Receipt | undefined => {
  return mockReceipts.find(receipt => receipt.id === id)
}

export const getReceiptByNumber = (receiptNumber: string): Receipt | undefined => {
  return mockReceipts.find(receipt => receipt.receiptNumber === receiptNumber)
}

export const getReceiptsByCustomer = (customerId: string): Receipt[] => {
  return mockReceipts.filter(receipt => receipt.customerId === customerId)
}

export const getReceiptsByOrder = (orderId: string): Receipt[] => {
  return mockReceipts.filter(receipt => receipt.orderId === orderId)
}

export const updateReceiptStatus = (id: string, status: Receipt['status']): Receipt | undefined => {
  const receiptIndex = mockReceipts.findIndex(receipt => receipt.id === id)
  if (receiptIndex === -1) return undefined
  
  mockReceipts[receiptIndex].status = status
  mockReceipts[receiptIndex].updatedAt = new Date().toISOString()
  
  return mockReceipts[receiptIndex]
}

export const processRefund = (
  id: string, 
  refundAmount: number, 
  refundReason: string
): Receipt | undefined => {
  const receipt = getReceiptById(id)
  if (!receipt || receipt.status !== 'completed') return undefined
  
  receipt.status = 'refunded'
  receipt.refundAmount = refundAmount
  receipt.refundReason = refundReason
  receipt.refundDate = new Date().toISOString()
  receipt.updatedAt = new Date().toISOString()
  
  return receipt
}

export const getReceiptStats = () => {
  const totalReceipts = mockReceipts.length
  const completedReceipts = mockReceipts.filter(r => r.status === 'completed').length
  const refundedReceipts = mockReceipts.filter(r => r.status === 'refunded').length
  const totalRevenue = mockReceipts
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.total, 0)
  const totalRefunded = mockReceipts
    .filter(r => r.status === 'refunded')
    .reduce((sum, r) => sum + (r.refundAmount || 0), 0)

  return {
    totalReceipts,
    completedReceipts,
    refundedReceipts,
    totalRevenue,
    totalRefunded,
    netRevenue: totalRevenue - totalRefunded
  }
}

export const getReceiptsByDateRange = (startDate: Date, endDate: Date): Receipt[] => {
  return mockReceipts.filter(receipt => {
    const receiptDate = new Date(receipt.paymentDate)
    return receiptDate >= startDate && receiptDate <= endDate
  })
}

export const getReceiptsByPaymentMethod = (paymentMethod: Receipt['paymentMethod']): Receipt[] => {
  return mockReceipts.filter(receipt => receipt.paymentMethod === paymentMethod)
}
