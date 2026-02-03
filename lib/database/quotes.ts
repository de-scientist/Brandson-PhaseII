// Quote database schema and mock data
export interface QuoteItem {
  productId: string
  productName: string
  variantId: string
  variantName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  description?: string
}

export interface Quote {
  id: string
  quoteNumber: string
  customerId: string
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
  items: QuoteItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted'
  quoteDate: string
  validUntil: string
  notes?: string
  qrCode?: string
  pdfUrl?: string
  createdAt: string
  updatedAt: string
  convertedToOrderId?: string
}

// Mock quotes data
export const mockQuotes: Quote[] = [
  {
    id: "quote-1",
    quoteNumber: "Q-2024-001",
    customerId: "customer-1",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "+254 700 000 000",
    customerAddress: {
      street: "123 Main Street",
      city: "Nairobi",
      state: "Nairobi County",
      postalCode: "00100",
      country: "Kenya"
    },
    items: [
      {
        productId: "business-cards-standard",
        productName: "Standard Business Cards",
        variantId: "bc-250-gloss",
        variantName: "250 Cards - Glossy",
        quantity: 250,
        unitPrice: 2500,
        totalPrice: 2500,
        description: "Premium quality business cards on 350gsm cardstock"
      },
      {
        productId: "letterheads-a4",
        productName: "A4 Letterheads",
        variantId: "lh-100-120gsm",
        variantName: "100 Sheets - 120gsm",
        quantity: 100,
        unitPrice: 3500,
        totalPrice: 3500,
        description: "Professional letterheads on premium paper"
      }
    ],
    subtotal: 6000,
    tax: 960,
    shipping: 350,
    total: 7310,
    status: "sent",
    quoteDate: "2024-01-20T10:00:00Z",
    validUntil: "2024-02-20T23:59:59Z",
    notes: "Please confirm by end of month for current pricing",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z"
  },
  {
    id: "quote-2",
    quoteNumber: "Q-2024-002",
    customerId: "customer-2",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@company.com",
    customerPhone: "+254 712 345 678",
    customerAddress: {
      street: "456 Business Ave",
      city: "Mombasa",
      state: "Mombasa County",
      postalCode: "80100",
      country: "Kenya"
    },
    items: [
      {
        productId: "pvc-banners",
        productName: "PVC Banners",
        variantId: "pb-4x2",
        variantName: "4ft x 2ft Banner",
        quantity: 2,
        unitPrice: 4500,
        totalPrice: 9000,
        description: "Weather-resistant outdoor banners"
      }
    ],
    subtotal: 9000,
    tax: 1440,
    shipping: 500,
    total: 10940,
    status: "accepted",
    quoteDate: "2024-01-25T14:30:00Z",
    validUntil: "2024-02-25T23:59:59Z",
    createdAt: "2024-01-25T14:30:00Z",
    updatedAt: "2024-01-26T09:15:00Z",
    convertedToOrderId: "order-1"
  },
  {
    id: "quote-3",
    quoteNumber: "Q-2024-003",
    customerId: "customer-3",
    customerName: "Acme Corporation",
    customerEmail: "procurement@acme.com",
    customerPhone: "+254 723 456 789",
    customerAddress: {
      street: "789 Corporate Plaza",
      city: "Kisumu",
      state: "Kisumu County",
      postalCode: "40100",
      country: "Kenya"
    },
    items: [
      {
        productId: "branded-tshirts",
        productName: "Custom Branded T-Shirts",
        variantId: "bt-m-50",
        variantName: "50 T-Shirts - Size M",
        quantity: 50,
        unitPrice: 40000,
        totalPrice: 40000,
        description: "Company branded t-shirts for team uniforms"
      },
      {
        productId: "vinyl-stickers",
        productName: "Custom Vinyl Stickers",
        variantId: "vs-100-round",
        variantName: "100 Round Stickers - 2 inch",
        quantity: 100,
        unitPrice: 2000,
        totalPrice: 2000,
        description: "Company logo stickers for promotional use"
      }
    ],
    subtotal: 42000,
    tax: 6720,
    shipping: 800,
    total: 49520,
    status: "draft",
    quoteDate: "2024-02-01T11:00:00Z",
    validUntil: "2024-03-01T23:59:59Z",
    notes: "Bulk pricing applied for 50+ t-shirts",
    createdAt: "2024-02-01T11:00:00Z",
    updatedAt: "2024-02-01T11:00:00Z"
  }
]

// Quote management functions
export const generateQuoteNumber = (): string => {
  const year = new Date().getFullYear()
  const sequence = mockQuotes.length + 1
  return `Q-${year}-${sequence.toString().padStart(3, '0')}`
}

export const createQuote = (quoteData: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt' | 'updatedAt'>): Quote => {
  const newQuote: Quote = {
    ...quoteData,
    id: `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    quoteNumber: generateQuoteNumber(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  mockQuotes.push(newQuote)
  return newQuote
}

export const getQuoteById = (id: string): Quote | undefined => {
  return mockQuotes.find(quote => quote.id === id)
}

export const getQuoteByNumber = (quoteNumber: string): Quote | undefined => {
  return mockQuotes.find(quote => quote.quoteNumber === quoteNumber)
}

export const getQuotesByCustomer = (customerId: string): Quote[] => {
  return mockQuotes.filter(quote => quote.customerId === customerId)
}

export const updateQuoteStatus = (id: string, status: Quote['status']): Quote | undefined => {
  const quoteIndex = mockQuotes.findIndex(quote => quote.id === id)
  if (quoteIndex === -1) return undefined
  
  mockQuotes[quoteIndex].status = status
  mockQuotes[quoteIndex].updatedAt = new Date().toISOString()
  
  return mockQuotes[quoteIndex]
}

export const convertQuoteToOrder = (quoteId: string, orderId: string): Quote | undefined => {
  const quote = getQuoteById(quoteId)
  if (!quote) return undefined
  
  quote.status = 'converted'
  quote.convertedToOrderId = orderId
  quote.updatedAt = new Date().toISOString()
  
  return quote
}

export const isQuoteExpired = (quote: Quote): boolean => {
  return new Date() > new Date(quote.validUntil)
}

export const getActiveQuotes = (): Quote[] => {
  return mockQuotes.filter(quote => 
    !['draft', 'rejected', 'expired', 'converted'].includes(quote.status) &&
    !isQuoteExpired(quote)
  )
}

export const getExpiredQuotes = (): Quote[] => {
  return mockQuotes.filter(quote => 
    isQuoteExpired(quote) && quote.status !== 'expired'
  )
}

export const updateExpiredQuotes = (): Quote[] => {
  const expiredQuotes = getExpiredQuotes()
  expiredQuotes.forEach(quote => {
    quote.status = 'expired'
    quote.updatedAt = new Date().toISOString()
  })
  return expiredQuotes
}
