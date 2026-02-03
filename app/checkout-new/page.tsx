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
  FileText,
  Clock,
  AlertCircle,
  ShoppingCart
} from "lucide-react"

export default function CheckoutPage() {
  const { cart, clearCart, getShippingOptions, createOrderSummary } = useEcommerceCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState("mpesa")
  const [selectedShipping, setSelectedShipping] = useState<ShippingInfo>(getShippingOptions()[0])
  const [errors, setErrors] = useState<Record<string, string>>({})
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

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setCustomerInfo(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CustomerInfo] as any),
          [child]: value
        }
      }))
    } else {
      setCustomerInfo(prev => ({
        ...prev,
        [field]: value
      }))
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!customerInfo.firstName.trim()) newErrors.firstName = "First name is required"
    if (!customerInfo.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!customerInfo.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!customerInfo.phone.trim()) newErrors.phone = "Phone number is required"
    if (!customerInfo.address.street.trim()) newErrors["address.street"] = "Street address is required"
    if (!customerInfo.address.city.trim()) newErrors["address.city"] = "City is required"
    if (!customerInfo.address.postalCode.trim()) newErrors["address.postalCode"] = "Postal code is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString()}`
  }

  const handleCheckout = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Create order summary
      const orderSummary = createOrderSummary(
        customerInfo,
        selectedShipping.method,
        selectedPayment,
        orderNotes
      )

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
          orderSummary
        })
      })

      const result = await response.json()

      if (result.success) {
        // Clear cart and redirect to success
        clearCart()
        router.push("/checkout/success")
      } else {
        setErrors({ submit: result.error || "Payment failed. Please try again." })
      }
    } catch (error) {
      setErrors({ submit: "Payment failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <CardTitle>Your cart is empty</CardTitle>
            <CardDescription>Add some products to proceed with checkout</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/store">
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
              <Link href="/cart">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
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
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="John"
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Doe"
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+254 700 000 000"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    value={customerInfo.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Acme Corporation"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
                <CardDescription>Where should we deliver your order?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={customerInfo.address.street}
                    onChange={(e) => handleInputChange("address.street", e.target.value)}
                    placeholder="123 Main Street"
                    className={errors["address.street"] ? "border-red-500" : ""}
                  />
                  {errors["address.street"] && (
                    <p className="text-sm text-red-500 mt-1">{errors["address.street"]}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={customerInfo.address.city}
                      onChange={(e) => handleInputChange("address.city", e.target.value)}
                      placeholder="Nairobi"
                      className={errors["address.city"] ? "border-red-500" : ""}
                    />
                    {errors["address.city"] && (
                      <p className="text-sm text-red-500 mt-1">{errors["address.city"]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={customerInfo.address.state}
                      onChange={(e) => handleInputChange("address.state", e.target.value)}
                      placeholder="Nairobi County"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={customerInfo.address.postalCode}
                      onChange={(e) => handleInputChange("address.postalCode", e.target.value)}
                      placeholder="00100"
                      className={errors["address.postalCode"] ? "border-red-500" : ""}
                    />
                    {errors["address.postalCode"] && (
                      <p className="text-sm text-red-500 mt-1">{errors["address.postalCode"]}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Method
                </CardTitle>
                <CardDescription>Choose your preferred shipping method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {getShippingOptions().map((option) => (
                  <label
                    key={option.method}
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.method}
                        checked={selectedShipping.method === option.method}
                        onChange={() => setSelectedShipping(option)}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium capitalize">{option.method}</p>
                        <p className="text-sm text-gray-500">{option.description}</p>
                        <p className="text-xs text-gray-400">{option.estimatedDays}</p>
                      </div>
                    </div>
                    <p className="font-bold">
                      {option.cost === 0 ? 'FREE' : formatPrice(option.cost)}
                    </p>
                  </label>
                ))}
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

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Order Notes (Optional)
                </CardTitle>
                <CardDescription>Any special instructions for your order</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={4}
                  placeholder="Special delivery instructions, design notes, or other requirements..."
                />
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
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">{item.variant.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatPrice(item.variant.price)}</div>
                        <div className="text-sm text-gray-600">{formatPrice(item.variant.price * item.quantity)}</div>
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
                      <span>VAT (16%)</span>
                      <span>{formatPrice(cart.tax)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{cart.shipping === 0 ? 'FREE' : formatPrice(cart.shipping)}</span>
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

              {/* Error Message */}
              {errors.submit && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{errors.submit}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

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
