"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { qrGenerator, QRCodeGenerator } from "@/lib/qr-generator"
import { getQuoteById, mockQuotes } from "@/lib/database/quotes"
import { getReceiptById, mockReceipts } from "@/lib/database/receipts"
import {
  QrCode,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  CreditCard
} from "lucide-react"

export default function AdminVerificationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "quote" | "receipt" | "order">("all")
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    totalQuotes: mockQuotes.length,
    totalReceipts: mockReceipts.length,
    verifiedToday: 0,
    pendingVerification: 0
  })

  const handleQRScan = async (qrData: string) => {
    setIsLoading(true)
    try {
      // Decode QR data
      const decoded = QRCodeGenerator.decodeQRData(qrData)
      
      if (!decoded) {
        setVerificationResult({
          success: false,
          error: "Invalid QR code format"
        })
        return
      }

      let result = null
      switch (decoded.type) {
        case 'quote':
          result = await getQuoteById(decoded.id)
          break
        case 'receipt':
          result = await getReceiptById(decoded.id)
          break
        case 'order':
          // In a real app, fetch order from database
          result = { id: decoded.id, status: 'delivered' }
          break
        default:
          result = null
      }

      setVerificationResult({
        success: !!result,
        data: result,
        type: decoded.type,
        qrData: decoded
      })
    } catch (error) {
      setVerificationResult({
        success: false,
        error: "Failed to verify QR code"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualVerification = async (id: string, type: string) => {
    setIsLoading(true)
    try {
      let result = null
      switch (type) {
        case 'quote':
          result = await getQuoteById(id)
          break
        case 'receipt':
          result = await getReceiptById(id)
          break
        default:
          result = null
      }

      setVerificationResult({
        success: !!result,
        data: result,
        type: type
      })
    } catch (error) {
      setVerificationResult({
        success: false,
        error: "Failed to verify document"
      })
    } finally {
      setIsLoading(false)
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

  const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Filter documents based on search and type
  const filteredQuotes = mockQuotes.filter(quote => {
    const matchesSearch = !searchTerm || 
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || filterType === "quote"
    return matchesSearch && matchesType
  })

  const filteredReceipts = mockReceipts.filter(receipt => {
    const matchesSearch = !searchTerm || 
      receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || filterType === "receipt"
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QR Verification Dashboard</h1>
              <p className="text-gray-600">Verify and manage quotes, receipts, and orders</p>
            </div>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                  <p className="text-2xl font-bold">{stats.totalQuotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Receipts</p>
                  <p className="text-2xl font-bold">{stats.totalReceipts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verified Today</p>
                  <p className="text-2xl font-bold">{stats.verifiedToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingVerification}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* QR Scanner */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Scanner
                </CardTitle>
                <CardDescription>Scan or enter QR code data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="qr-input">QR Code Data</Label>
                  <Input
                    id="qr-input"
                    placeholder="Paste QR code data or scan..."
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={() => {
                    const input = document.getElementById('qr-input') as HTMLInputElement
                    if (input.value) {
                      handleQRScan(input.value)
                    }
                  }}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Verify QR Code
                    </>
                  )}
                </Button>
                
                <div className="text-center text-sm text-gray-500">
                  <p>Or scan QR code using camera</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <QrCode className="mr-2 h-4 w-4" />
                    Open Camera Scanner
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Verification Result */}
            {verificationResult && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {verificationResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    Verification Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {verificationResult.success ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Authentic
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {verificationResult.type}
                        </Badge>
                      </div>
                      
                      {verificationResult.data && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm"><strong>ID:</strong> {verificationResult.data.id}</p>
                          <p className="text-sm"><strong>Customer:</strong> {verificationResult.data.customerName}</p>
                          <p className="text-sm"><strong>Date:</strong> {formatDate(verificationResult.data.createdAt || verificationResult.data.paymentDate)}</p>
                          <p className="text-sm"><strong>Total:</strong> {formatPrice(verificationResult.data.total)}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-3 w-3" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="mr-1 h-3 w-3" />
                          Invalid
                        </Badge>
                      </div>
                      <p className="text-sm text-red-600">{verificationResult.error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Documents List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Search and verify documents manually</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="quote">Quotes</option>
                      <option value="receipt">Receipts</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by number, customer name, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Quotes */}
                  {filteredQuotes.map((quote) => (
                    <div key={quote.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{quote.quoteNumber}</h3>
                            <Badge variant="outline">Quote</Badge>
                            <Badge className={getStatusColor(quote.status)}>
                              {quote.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{quote.customerName}</p>
                          <p className="text-sm text-gray-500">{quote.customerEmail}</p>
                          <p className="text-sm font-medium mt-1">{formatPrice(quote.total)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManualVerification(quote.id, 'quote')}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Verify
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Receipts */}
                  {filteredReceipts.map((receipt) => (
                    <div key={receipt.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{receipt.receiptNumber}</h3>
                            <Badge variant="outline">Receipt</Badge>
                            <Badge className={getStatusColor(receipt.status)}>
                              {receipt.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{receipt.customerName}</p>
                          <p className="text-sm text-gray-500">{receipt.customerEmail}</p>
                          <p className="text-sm font-medium mt-1">{formatPrice(receipt.total)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManualVerification(receipt.id, 'receipt')}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Verify
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredQuotes.length === 0 && filteredReceipts.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No documents found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
