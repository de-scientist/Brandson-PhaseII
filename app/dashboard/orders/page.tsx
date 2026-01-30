import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { getCustomerOrders } from '@/lib/orders'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Eye
} from 'lucide-react'
import Link from 'next/link'

async function OrdersPage() {
  // Get authenticated user
  const user = await getAuthUser({} as Request)
  
  if (!user) {
    redirect('/login')
  }

  // Get customer orders
  const orders = await getCustomerOrders(user.email)

  // Status configurations
  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    processing: { label: 'Processing', color: 'bg-purple-100 text-purple-800', icon: Package },
    printing: { label: 'Printing', color: 'bg-indigo-100 text-indigo-800', icon: Package },
    quality_check: { label: 'Quality Check', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
    ready_for_delivery: { label: 'Ready for Delivery', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    out_for_delivery: { label: 'Out for Delivery', color: 'bg-teal-100 text-teal-800', icon: Package },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
    refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
  }

  const paymentStatusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
    refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
    partially_refunded: { label: 'Partially Refunded', color: 'bg-orange-100 text-orange-800' },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Orders</h1>
        <p className="text-muted-foreground">
          Track and manage all your orders in one place.
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by order number, item name..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = statusConfig[order.status]
            const paymentInfo = paymentStatusConfig[order.paymentStatus]
            const StatusIcon = statusInfo.icon

            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                        <Badge className={paymentInfo.color}>
                          {paymentInfo.label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            <Calendar className="inline mr-1 h-3 w-3" />
                            Placed: {order.createdAt.toLocaleDateString()}
                          </p>
                          {order.dueDate && (
                            <p className="text-sm text-muted-foreground">
                              <Clock className="inline mr-1 h-3 w-3" />
                              Due: {order.dueDate.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {order.items.length} items
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total: <span className="font-semibold">KES {order.total.toLocaleString()}</span>
                          </p>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item, index) => (
                          <p key={index} className="text-sm text-muted-foreground">
                            {item.quantity}x {item.productName}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-muted-foreground">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                      {order.status === 'delivered' && (
                        <Link href={`/services?reorder=${order.id}`}>
                          <Button size="sm">
                            Reorder
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar for active orders */}
                  {(order.status === 'confirmed' || order.status === 'processing' || order.status === 'printing' || order.status === 'quality_check' || order.status === 'ready_for_delivery' || order.status === 'out_for_delivery') && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Order Progress</span>
                        <span className="text-sm text-muted-foreground">{statusInfo.label}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(Object.keys(statusConfig).indexOf(order.status) + 1) / Object.keys(statusConfig).length * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start by browsing our services.
            </p>
            <Link href="/services">
              <Button size="lg">
                Browse Services
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default OrdersPage
