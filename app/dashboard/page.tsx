import { redirect } from 'next/navigation'
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import Link from 'next/link'

async function DashboardPage() {
  // Get authenticated user
  const user = await getAuthUser({} as Request)
  
  if (!user) {
    redirect('/login')
  }

  // Get customer data
  const orders = await getCustomerOrders(user.email)
  const invoices = await getInvoices({ customerId: user.email })
  const orderStats = await getOrderStats({ customerEmail: user.email })

  // Calculate recent activity
  const recentOrders = orders.slice(0, 5)
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed')
  const completedOrders = orders.filter(o => o.status === 'delivered')
  const unpaidInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">
          Manage your orders, invoices, and account settings from your dashboard.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {pendingOrders.length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {orderStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unpaidInvoices.length}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest order activity</CardDescription>
              </div>
              <Link href="/dashboard/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{order.orderNumber}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} items • KES {order.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No orders yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start by placing your first order
                </p>
                <Link href="/services">
                  <Button>Browse Services</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Your billing documents</CardDescription>
              </div>
              <Link href="/dashboard/invoices">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {invoices.length > 0 ? (
              <div className="space-y-4">
                {invoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid' 
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Order: {invoice.orderNumber} • KES {invoice.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due: {invoice.dueDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/invoices/${invoice.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/api/invoices/${invoice.id}?format=pdf`}>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No invoices yet</h3>
                <p className="text-sm text-muted-foreground">
                  Invoices will appear here when you place orders
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/services">
              <Button variant="outline" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Place New Order
              </Button>
            </Link>
            <Link href="/dashboard/orders">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Track Orders
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage
