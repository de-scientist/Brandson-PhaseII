import QRCode from 'qrcode'

export interface QRCodeData {
  type: 'cart' | 'order' | 'quote' | 'receipt'
  id: string
  timestamp: string
  data: any
}

export interface CartItemQRData {
  productId: string
  productName: string
  variantId: string
  variantName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  customerEmail?: string
}

export interface OrderQRData {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'quoted' | 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered'
  orderDate: string
  paymentMethod?: string
}

export interface QuoteQRData {
  quoteId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  tax: number
  total: number
  quoteDate: string
  validUntil: string
}

export interface ReceiptQRData {
  receiptId: string
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  transactionId: string
  paymentDate: string
}

class QRCodeGenerator {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brandsonmedia.co.ke'
  }

  /**
   * Generate QR code for cart item
   */
  async generateCartItemQR(cartItemData: CartItemQRData): Promise<string> {
    const qrData: QRCodeData = {
      type: 'cart',
      id: `${cartItemData.productId}-${cartItemData.variantId}`,
      timestamp: new Date().toISOString(),
      data: cartItemData
    }

    const verificationUrl = `${this.baseUrl}/verify/cart/${encodeURIComponent(JSON.stringify(qrData))}`
    
    try {
      return await QRCode.toDataURL(verificationUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: '#1e40af',
          light: '#ffffff'
        }
      })
    } catch (error) {
      console.error('Error generating cart item QR code:', error)
      throw new Error('Failed to generate cart item QR code')
    }
  }

  /**
   * Generate QR code for order
   */
  async generateOrderQR(orderData: OrderQRData): Promise<string> {
    const qrData: QRCodeData = {
      type: 'order',
      id: orderData.orderId,
      timestamp: new Date().toISOString(),
      data: orderData
    }

    const verificationUrl = `${this.baseUrl}/verify/order/${orderData.orderId}`
    
    try {
      return await QRCode.toDataURL(verificationUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#059669',
          light: '#ffffff'
        }
      })
    } catch (error) {
      console.error('Error generating order QR code:', error)
      throw new Error('Failed to generate order QR code')
    }
  }

  /**
   * Generate QR code for quote
   */
  async generateQuoteQR(quoteData: QuoteQRData): Promise<string> {
    const qrData: QRCodeData = {
      type: 'quote',
      id: quoteData.quoteId,
      timestamp: new Date().toISOString(),
      data: quoteData
    }

    const verificationUrl = `${this.baseUrl}/verify/quote/${quoteData.quoteId}`
    
    try {
      return await QRCode.toDataURL(verificationUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#7c3aed',
          light: '#ffffff'
        }
      })
    } catch (error) {
      console.error('Error generating quote QR code:', error)
      throw new Error('Failed to generate quote QR code')
    }
  }

  /**
   * Generate QR code for receipt
   */
  async generateReceiptQR(receiptData: ReceiptQRData): Promise<string> {
    const qrData: QRCodeData = {
      type: 'receipt',
      id: receiptData.receiptId,
      timestamp: new Date().toISOString(),
      data: receiptData
    }

    const verificationUrl = `${this.baseUrl}/verify/receipt/${receiptData.receiptId}`
    
    try {
      return await QRCode.toDataURL(verificationUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#dc2626',
          light: '#ffffff'
        }
      })
    } catch (error) {
      console.error('Error generating receipt QR code:', error)
      throw new Error('Failed to generate receipt QR code')
    }
  }

  /**
   * Generate QR code for full cart
   */
  async generateFullCartQR(cartItems: any[], customerEmail?: string): Promise<string> {
    const cartData = {
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        variantId: item.variant.id,
        variantName: item.variant.name,
        quantity: item.quantity,
        unitPrice: item.variant.price,
        totalPrice: item.variant.price * item.quantity
      })),
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: cartItems.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0),
      customerEmail
    }

    const qrData: QRCodeData = {
      type: 'cart',
      id: `cart-${Date.now()}`,
      timestamp: new Date().toISOString(),
      data: cartData
    }

    const verificationUrl = `${this.baseUrl}/verify/cart/${encodeURIComponent(JSON.stringify(qrData))}`
    
    try {
      return await QRCode.toDataURL(verificationUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#1e40af',
          light: '#ffffff'
        }
      })
    } catch (error) {
      console.error('Error generating full cart QR code:', error)
      throw new Error('Failed to generate full cart QR code')
    }
  }

  /**
   * Decode and validate QR code data
   */
  static decodeQRData(encodedData: string): QRCodeData | null {
    try {
      const decoded = JSON.parse(decodeURIComponent(encodedData))
      
      // Validate structure
      if (!decoded.type || !decoded.id || !decoded.timestamp || !decoded.data) {
        return null
      }

      // Validate type
      const validTypes = ['cart', 'order', 'quote', 'receipt']
      if (!validTypes.includes(decoded.type)) {
        return null
      }

      return decoded
    } catch (error) {
      console.error('Error decoding QR data:', error)
      return null
    }
  }

  /**
   * Generate verification URL for QR code
   */
  generateVerificationUrl(type: string, id: string): string {
    return `${this.baseUrl}/verify/${type}/${id}`
  }
}

export const qrGenerator = new QRCodeGenerator()
export { QRCodeGenerator }
export default QRCodeGenerator
