import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { getOrderById } from '@/lib/orders'
import { getInvoiceByOrderId } from '@/lib/invoices'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Package, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  FileText,
  Download,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  // Get authenticated user
  const user = await getAuthUser({} as Request)
  
  if (!user) {
    redirect('/login')
  }

  // Get order details
  const order = await getOrderById(params.orderId)
  
  if (!order) {
    redirect('/dashboard/orders')
  }

  // Verify user owns this order
  if (order.customerEmail !== user.email) {
    redirect('/dashboard/orders')
  }

  // Get invoice if exists
  const invoice = await getInvoiceByOrderId(order.id)

  // Status configurations
  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', description: 'Order received and awaiting confirmation' },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', description: 'Order confirmed and being prepared' },
    processing: { label: 'Processing', color: 'bg-purple-100 text-purple-800', description: 'Order is being processed' },
    printing: { label: 'Printing', color: 'bg-indigo-100 text-indigo-800', description: 'Your items are being printed' },
    quality_check: { label: 'Quality Check', color: 'bg-orange-100 text-orange-800', description: 'Final quality inspection in progress' },
    ready_for_delivery: { label: 'Ready for Delivery', color: 'bg-green-100 text-green-800', description: 'Order is ready for delivery' },
    out_for_delivery: { label: 'Out for Delivery', color: 'bg-teal-100 text-teal-800', description: 'Order is on its way to you' },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', description: 'Order has been successfully delivered' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', description: 'Order has been cancelled' },
    refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800', description: 'Order has been refunded' },
  }

  const paymentStatusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
    refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
    partially_refunded: { label: 'Partially Refunded', color: 'bg-orange-100 text-orange-800' },
  }

  const statusInfo = statusConfig[order.status]
  const paymentInfo = paymentStatusConfig[order.paymentStatus]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/orders" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{order.orderNumber}</h1>
            <div className="flex items-center gap-3">
              <Badge className={statusInfo.color}>
                {statusInfo.label}
              </Badge>
              <Badge className={paymentInfo.color}>
                {paymentInfo.label}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            {invoice && (
              <>
                <Link href={`/dashboard/invoices/${invoice.id}`}>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    View Invoice
                  </Button>
                </Link>
                <Link href={`/api/invoices/${invoice.id}?format=pdf`}>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </Link>
              </>
            )}
            {order.status === 'delivered' && (
              <Link href={`/services?reorder=${order.id}`}>
                <Button>Reorder Items</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>{statusInfo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Timeline */}
                <div className="space-y-3">
                  {Object.entries(statusConfig).slice(0, -2).map(([status, config], index) => {
                    const isActive = Object.keys(statusConfig).indexOf(order.status) >= index
                    const isCompleted = Object.keys(statusConfig).indexOf(order.status) > index
                    
                    return (
                      <div key={status} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isActive 
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : isActive ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <div className="w-2 h-2 bg-current rounded-full" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {config.label}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {config.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>{order.items.length} items in this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{item.productName}</h4>
                      {item.productDescription && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.productDescription}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Quantity: {item.quantity}</span>
                        <span>Unit Price: KES {item.unitPrice.toLocaleString()}</span>
                      </div>
                      {item.specifications && (
                        <div className="mt-2 text-sm">
                          <p className="font-medium text-foreground mb-1">Specifications:</p>
                          <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                            {item.specifications.paperType && (
                              <span>Paper: {item.specifications.paperType}</span>
                            )}
                            {item.specifications.size && (
                              <span>Size: {item.specifications.size}</span>
                            )}
                            {item.specifications.finish && (
                              <span>Finish: {item.specifications.finish}</span>
                            )}
                            {item.specifications.colors && (
                              <span>Colors: {item.specifications.colors}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">KES {item.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          {(order.shippingAddress || order.deliveryInstructions) && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.shippingAddress && (
                    <div>
                      <h4 className="font-medium mb-2">Delivery Address</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city}
                          {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                          {order.shippingAddress.postalCode && ` ${order.shippingAddress.postalCode}`}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  )}
                  {order.deliveryInstructions && (
                    <div>
                      <h4 className="font-medium mb-2">Delivery Instructions</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.deliveryInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>KES {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>KES {order.tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>KES {order.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number</span>
                  <span>{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Placed On</span>
                  <span>{order.createdAt.toLocaleDateString()}</span>
                </div>
                {order.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Delivery</span>
                    <span>{order.dueDate.toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{order.customerName}</p>
                <p className="text-muted-foreground">{order.customerEmail}</p>
                <p className="text-muted-foreground">{order.customerPhone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Have questions about your order? We're here to help.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    Track Order
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage
