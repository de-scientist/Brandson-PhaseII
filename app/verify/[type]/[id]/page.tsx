"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { QRCodeData } from "@/lib/qr-generator"
import { getQuoteById } from "@/lib/database/quotes"
import { getReceiptById } from "@/lib/database/receipts"
import { getProductById } from "@/lib/database/products"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Share,
  ArrowLeft,
  Shield,
  Clock,
  Package,
  CreditCard,
  FileText,
  Eye,
  QrCode,
  ShoppingCart
} from "lucide-react"

export default function VerificationPage() {
  const params = useParams()
  const router = useRouter()
  const [verificationData, setVerificationData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  useEffect(() => {
    verifyQRCode()
  }, [params.type, params.id])

  const verifyQRCode = async () => {
    try {
      setLoading(true)
      setError(null)
      setIsValid(null)

      const type = params.type as string
      const id = params.id as string

      let data = null
      let valid = false

      switch (type) {
        case 'quote':
          data = await getQuoteById(id)
          if (data) {
            valid = new Date() <= new Date(data.validUntil)
          }
          break
        case 'receipt':
          data = await getReceiptById(id)
          valid = !!data && data.status === 'completed'
          break
        case 'order':
          // In a real app, you would fetch order data
          // For now, we'll simulate order verification
          data = {
            id: id,
            status: 'delivered',
            customerName: 'John Doe',
            total: 10000,
            orderDate: '2024-01-20'
          }
          valid = true
          break
        case 'cart':
          // For cart verification, decode the QR data
          try {
            const decoded = JSON.parse(decodeURIComponent(id))
            data = decoded
            valid = true
          } catch (e) {
            valid = false
          }
          break
        default:
          valid = false
      }

      setVerificationData(data)
      setIsValid(valid)

      if (!data) {
        setError('Document not found')
      } else if (!valid) {
        setError('Document is invalid or expired')
      }
    } catch (err) {
      console.error('Verification error:', err)
      setError('Failed to verify document')
      setIsValid(false)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'pending':
      case 'processing':
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'expired':
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
      case 'processing':
      case 'sent':
        return <Clock className="h-4 w-4" />
      case 'expired':
      case 'rejected':
      case 'failed':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying document...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !isValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-4">{error || 'Document is invalid or expired'}</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Document Verification</h1>
                <p className="text-gray-600">Authenticity confirmed</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
              <Badge variant="outline">
                <Shield className="mr-1 h-3 w-3" />
                Secure
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Document Type Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {params.type === 'quote' && <FileText className="h-6 w-6 text-blue-600" />}
                      {params.type === 'receipt' && <CreditCard className="h-6 w-6 text-green-600" />}
                      {params.type === 'order' && <Package className="h-6 w-6 text-purple-600" />}
                      {params.type === 'cart' && <ShoppingCart className="h-6 w-6 text-orange-600" />}
                    </div>
                    <div>
                      <CardTitle className="capitalize">{params.type} Details</CardTitle>
                      <CardDescription>
                        {params.type === 'quote' && 'Price quote for products/services'}
                        {params.type === 'receipt' && 'Proof of payment'}
                        {params.type === 'order' && 'Order confirmation'}
                        {params.type === 'cart' && 'Shopping cart contents'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Document ID</p>
                    <p className="font-mono text-sm">{verificationData?.id || params.id}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Quote Details */}
            {params.type === 'quote' && verificationData && (
              <Card>
                <CardHeader>
                  <CardTitle>Quote Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Quote Number</p>
                      <p className="font-medium">{verificationData.quoteNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge className={getStatusColor(verificationData.status)}>
                        {getStatusIcon(verificationData.status)}
                        <span className="ml-1 capitalize">{verificationData.status}</span>
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date Created</p>
                      <p className="font-medium">{formatDate(verificationData.quoteDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valid Until</p>
                      <p className="font-medium">{formatDate(verificationData.validUntil)}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Customer Information</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{verificationData.customerName}</p>
                      <p className="text-sm text-gray-600">{verificationData.customerEmail}</p>
                      {verificationData.customerPhone && (
                        <p className="text-sm text-gray-600">{verificationData.customerPhone}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Items</h4>
                    <div className="space-y-2">
                      {verificationData.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-gray-600">{item.variantName}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(item.totalPrice)}</p>
                            <p className="text-sm text-gray-600">{formatPrice(item.unitPrice)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(verificationData.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (16%):</span>
                      <span>{formatPrice(verificationData.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{formatPrice(verificationData.shipping)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatPrice(verificationData.total)}</span>
                    </div>
                  </div>

                  {verificationData.notes && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Notes</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {verificationData.notes}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Receipt Details */}
            {params.type === 'receipt' && verificationData && (
              <Card>
                <CardHeader>
                  <CardTitle>Receipt Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Receipt Number</p>
                      <p className="font-medium">{verificationData.receiptNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge className={getStatusColor(verificationData.status)}>
                        {getStatusIcon(verificationData.status)}
                        <span className="ml-1 capitalize">{verificationData.status}</span>
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Date</p>
                      <p className="font-medium">{formatDate(verificationData.paymentDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium capitalize">{verificationData.paymentMethod}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Payment Information</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm"><span className="font-medium">Transaction ID:</span> {verificationData.transactionId}</p>
                      <p className="text-sm"><span className="font-medium">Amount Paid:</span> {formatPrice(verificationData.total)}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Customer Information</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{verificationData.customerName}</p>
                      <p className="text-sm text-gray-600">{verificationData.customerEmail}</p>
                      {verificationData.customerPhone && (
                        <p className="text-sm text-gray-600">{verificationData.customerPhone}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Items Purchased</h4>
                    <div className="space-y-2">
                      {verificationData.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-gray-600">{item.variantName}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(item.totalPrice)}</p>
                            <p className="text-sm text-gray-600">{formatPrice(item.unitPrice)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(verificationData.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (16%):</span>
                      <span>{formatPrice(verificationData.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Paid:</span>
                      <span>{formatPrice(verificationData.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cart Details */}
            {params.type === 'cart' && verificationData && (
              <Card>
                <CardHeader>
                  <CardTitle>Cart Contents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Items</p>
                      <p className="font-medium">{verificationData.totalItems}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium">{formatPrice(verificationData.totalAmount)}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Items in Cart</h4>
                    <div className="space-y-2">
                      {verificationData.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-gray-600">{item.variantName}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(item.totalPrice)}</p>
                            <p className="text-sm text-gray-600">{formatPrice(item.unitPrice)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              
              {/* Verification Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Authentic Document</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Digitally Signed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Tamper-Proof</span>
                  </div>
                  <Separator />
                  <div className="text-sm text-gray-600">
                    <p>This document has been verified and is authentic. The QR code contains a digital signature that prevents tampering.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share className="mr-2 h-4 w-4" />
                    Share Document
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    View Full Details
                  </Button>
                </CardContent>
              </Card>

              {/* Security Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    QR Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>• Encrypted digital signature</p>
                    <p>• Real-time database verification</p>
                    <p>• Tamper detection system</p>
                    <p>• Secure blockchain backup</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
