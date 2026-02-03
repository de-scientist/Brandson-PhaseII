"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useEcommerceCart, CustomerInfo, ShippingInfo } from "@/contexts/ecommerce-cart-context"
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle,
  Truck,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  FileText
} from "lucide-react"

export default function CheckoutPage() {
  const { cart, clearCart, getShippingOptions, createOrderSummary } = useEcommerceCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState("mpesa")
  const [selectedShipping, setSelectedShipping] = useState<ShippingInfo>(getShippingOptions()[0])
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Kenya"
    }
  })
  const [orderNotes, setOrderNotes] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString()}`
  }

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      // Process payment
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: cart.total,
          currency: "KES",
          method: selectedPayment,
          items: cart.items,
          customerInfo
        })
      })

      const result = await response.json()

      if (result.success) {
        // Clear cart and redirect to success
        clearCart()
        router.push("/checkout/success")
      } else {
        alert("Payment failed: " + result.error)
      }
    } catch (error) {
      alert("Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Your cart is empty</CardTitle>
            <CardDescription>Add some items to your cart before checkout</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Cart ({cart.itemCount} items)</Badge>
              <Badge variant="secondary">{formatPrice(cart.total)}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
                <CardDescription>Please provide your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      placeholder="+254 700 000 000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      placeholder="Nairobi"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street, Nairobi"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={customerInfo.notes}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Special instructions or delivery notes..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setSelectedPayment("mpesa")}
                    className={`p-4 border rounded-lg text-left transition-all ${
                      selectedPayment === "mpesa"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Smartphone className="h-6 w-6 text-green-600 mb-2" />
                    <div className="font-medium">M-Pesa</div>
                    <div className="text-sm text-gray-600">Pay via mobile money</div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedPayment("stripe")}
                    className={`p-4 border rounded-lg text-left transition-all ${
                      selectedPayment === "stripe"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <CreditCard className="h-6 w-6 text-blue-600 mb-2" />
                    <div className="font-medium">Card Payment</div>
                    <div className="text-sm text-gray-600">Credit/Debit card</div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedPayment("bank-transfer")}
                    className={`p-4 border rounded-lg text-left transition-all ${
                      selectedPayment === "bank-transfer"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Building className="h-6 w-6 text-purple-600 mb-2" />
                    <div className="font-medium">Bank Transfer</div>
                    <div className="text-sm text-gray-600">Direct bank deposit</div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.service}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatPrice(item.unitPrice)}</div>
                        <div className="text-sm text-gray-600">{formatPrice(item.totalPrice)}</div>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(cart.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (16%)</span>
                      <span>{formatPrice(cart.tax)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(cart.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Secure payment processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Fast delivery nationwide</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Quality guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Place Order Button */}
              <Button 
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full text-lg py-6"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
