export interface Order {
  id: string
  orderNumber: string
  customerId?: string
  customerEmail: string
  customerName: string
  customerPhone: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  currency: string
  shippingAddress?: Address
  billingAddress?: Address
  deliveryInstructions?: string
  notes?: string
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
  completedAt?: Date
}

export interface OrderItem {
  id: string
  productId?: string
  productName: string
  productDescription?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  metadata: Record<string, any>
  specifications?: ProductSpecifications
}

export interface ProductSpecifications {
  paperType?: string
  finish?: string
  size?: string
  colors?: string
  sides?: 'single' | 'double'
  binding?: string
  finishing?: string[]
  customRequirements?: string
  uploadedFiles?: string[]
}

export interface Address {
  street: string
  city: string
  state?: string
  postalCode?: string
  country: string
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'printing'
  | 'quality_check'
  | 'ready_for_delivery'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'

export type PaymentMethod = 
  | 'mpesa'
  | 'stripe'
  | 'cash'
  | 'bank_transfer'
  | 'other'

export interface OrderCreateInput {
  customerEmail: string
  customerName: string
  customerPhone: string
  items: Omit<OrderItem, 'id' | 'totalPrice'>[]
  shippingAddress?: Address
  billingAddress?: Address
  deliveryInstructions?: string
  notes?: string
  metadata?: Record<string, any>
  dueDate?: Date
}

export interface OrderUpdateInput {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  shippingAddress?: Address
  billingAddress?: Address
  deliveryInstructions?: string
  notes?: string
  metadata?: Record<string, any>
  dueDate?: Date
  completedAt?: Date
}

export interface OrderFilter {
  status?: OrderStatus[]
  paymentStatus?: PaymentStatus[]
  paymentMethod?: PaymentMethod[]
  customerId?: string
  customerEmail?: string
  dateFrom?: Date
  dateTo?: Date
  search?: string
}

// In-memory storage for development (replace with database in production)
let orders: Order[] = []
let orderIdCounter = 1000

/**
 * Generate unique order number
 */
export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const sequence = String(orderIdCounter++).padStart(4, '0')
  
  return `BRD${year}${month}${day}${sequence}`
}

/**
 * Create new order
 */
export async function createOrder(input: OrderCreateInput): Promise<Order> {
  const order: Order = {
    id: crypto.randomUUID(),
    orderNumber: generateOrderNumber(),
    customerEmail: input.customerEmail,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'other',
    items: input.items.map(item => ({
      ...item,
      id: crypto.randomUUID(),
      totalPrice: item.quantity * item.unitPrice,
    })),
    subtotal: input.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
    tax: 0, // Calculate tax based on Kenyan tax rules
    total: 0, // Will be calculated below
    currency: 'kes',
    shippingAddress: input.shippingAddress,
    billingAddress: input.billingAddress,
    deliveryInstructions: input.deliveryInstructions,
    notes: input.notes,
    metadata: input.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: input.dueDate,
  }

  // Calculate total (subtotal + tax)
  order.total = order.subtotal + order.tax

  // Store order (in production, this would be a database operation)
  orders.push(order)

  return order
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  const order = orders.find(o => o.id === orderId)
  return order || null
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const order = orders.find(o => o.orderNumber === orderNumber)
  return order || null
}

/**
 * Update order
 */
export async function updateOrder(orderId: string, updates: OrderUpdateInput): Promise<Order | null> {
  const orderIndex = orders.findIndex(o => o.id === orderId)
  if (orderIndex === -1) return null

  orders[orderIndex] = {
    ...orders[orderIndex],
    ...updates,
    updatedAt: new Date(),
  }

  return orders[orderIndex]
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
  return updateOrder(orderId, { status })
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus, paymentMethod?: PaymentMethod): Promise<Order | null> {
  const updates: OrderUpdateInput = { paymentStatus }
  if (paymentMethod) {
    updates.metadata = { ...orders.find(o => o.id === orderId)?.metadata, paymentMethod }
  }
  return updateOrder(orderId, updates)
}

/**
 * Get orders with filtering
 */
export async function getOrders(filter?: OrderFilter): Promise<Order[]> {
  let filteredOrders = [...orders]

  if (filter) {
    if (filter.status?.length) {
      filteredOrders = filteredOrders.filter(o => filter.status!.includes(o.status))
    }
    if (filter.paymentStatus?.length) {
      filteredOrders = filteredOrders.filter(o => filter.paymentStatus!.includes(o.paymentStatus))
    }
    if (filter.paymentMethod?.length) {
      filteredOrders = filteredOrders.filter(o => filter.paymentMethod!.includes(o.paymentMethod))
    }
    if (filter.customerId) {
      filteredOrders = filteredOrders.filter(o => o.customerId === filter.customerId)
    }
    if (filter.customerEmail) {
      filteredOrders = filteredOrders.filter(o => o.customerEmail === filter.customerEmail)
    }
    if (filter.dateFrom) {
      filteredOrders = filteredOrders.filter(o => o.createdAt >= filter.dateFrom!)
    }
    if (filter.dateTo) {
      filteredOrders = filteredOrders.filter(o => o.createdAt <= filter.dateTo!)
    }
    if (filter.search) {
      const search = filter.search.toLowerCase()
      filteredOrders = filteredOrders.filter(o => 
        o.orderNumber.toLowerCase().includes(search) ||
        o.customerName.toLowerCase().includes(search) ||
        o.customerEmail.toLowerCase().includes(search) ||
        o.customerPhone.includes(search)
      )
    }
  }

  // Sort by creation date (newest first)
  return filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

/**
 * Get customer orders
 */
export async function getCustomerOrders(customerEmail: string): Promise<Order[]> {
  return getOrders({ customerEmail })
}

/**
 * Delete order (soft delete by marking as cancelled)
 */
export async function deleteOrder(orderId: string): Promise<boolean> {
  const order = await updateOrderStatus(orderId, 'cancelled')
  return order !== null
}

/**
 * Get order statistics
 */
export async function getOrderStats(filter?: OrderFilter): Promise<{
  total: number
  pending: number
  confirmed: number
  processing: number
  completed: number
  cancelled: number
  totalRevenue: number
  averageOrderValue: number
}> {
  const orders = await getOrders(filter)
  
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    processing: orders.filter(o => ['processing', 'printing', 'quality_check'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0),
    averageOrderValue: 0,
  }

  stats.averageOrderValue = stats.total > 0 ? stats.totalRevenue / stats.total : 0

  return stats
}

/**
 * Calculate estimated completion date
 */
export function calculateEstimatedCompletionDate(items: OrderItem[]): Date {
  // Simple estimation based on item types and quantities
  // In production, this would be more sophisticated
  const baseDays = 3 // Base processing time
  const printingDays = Math.max(1, Math.ceil(items.reduce((sum, item) => sum + item.quantity, 0) / 100))
  const totalDays = baseDays + printingDays
  
  const date = new Date()
  date.setDate(date.getDate() + totalDays)
  
  return date
}

/**
 * Validate order data
 */
export function validateOrder(input: OrderCreateInput): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!input.customerEmail?.includes('@')) {
    errors.push('Valid customer email is required')
  }
  
  if (!input.customerName?.trim()) {
    errors.push('Customer name is required')
  }
  
  if (!input.customerPhone?.trim()) {
    errors.push('Customer phone number is required')
  }
  
  if (!input.items?.length) {
    errors.push('At least one item is required')
  } else {
    input.items.forEach((item, index) => {
      if (!item.productName?.trim()) {
        errors.push(`Item ${index + 1}: Product name is required`)
      }
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`)
      }
      if (item.unitPrice <= 0) {
        errors.push(`Item ${index + 1}: Unit price must be greater than 0`)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
