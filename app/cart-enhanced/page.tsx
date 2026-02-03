"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useEcommerceCart, ShippingInfo } from "@/contexts/ecommerce-cart-context"
import { qrGenerator } from "@/lib/qr-generator"
import { pdfGenerator } from "@/lib/pdf-generator-advanced"
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  Truck,
  Shield,
  ArrowRight,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle,
  QrCode,
  Download,
  Share,
  FileText,
  Eye,
  AlertCircle
} from "lucide-react"

export default function EnhancedCartPage() {
  const { cart, removeFromCart, updateQuantity, setShipping, getShippingOptions } = useEcommerceCart()
  const [selectedShipping, setSelectedShipping] = useState<ShippingInfo>(getShippingOptions()[0])
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [cartQRCode, setCartQRCode] = useState<string | null>(null)
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false)

  useEffect(() => {
    generateCartQR()
  }, [cart.items])

  const generateCartQR = async () => {
    if (cart.items.length === 0) return
    
    setIsGeneratingQR(true)
    try {
      const qrCode = await qrGenerator.generateFullCartQR(cart.items)
      setCartQRCode(qrCode)
    } catch (error) {
      console.error('Error generating cart QR code:', error)
    } finally {
      setIsGeneratingQR(false)
    }
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleShippingChange = (shipping: ShippingInfo) => {
    setSelectedShipping(shipping)
    setShipping(shipping)
  }

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      setDiscount(cart.subtotal * 0.1)
    } else {
      setDiscount(0)
    }
  }

  const generateQuote = async () => {
    setIsGeneratingQuote(true)
    try {
      // Create quote data
      const quoteData = {
        customerId: "guest-user", // In a real app, this would be the actual user ID
        customerName: "Guest User",
        customerEmail: "guest@example.com",
        items: cart.items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          variantId: item.variant.id,
          variantName: item.variant.name,
          quantity: item.quantity,
          unitPrice: item.variant.price,
          totalPrice: item.variant.price * item.quantity,
          description: item.product.description
        })),
        subtotal: cart.subtotal,
        tax: cart.tax,
        shipping: cart.shipping,
        total: cart.total,
        notes: "Generated from shopping cart"
      }

      // Call API to create quote
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(quoteData)
      })

      const result = await response.json()

      if (result.success) {
        // Download the quote PDF
        if (result.data.pdfUrl) {
          const link = document.createElement('a')
          link.href = result.data.pdfUrl
          link.download = `quote-${result.data.quoteNumber}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } else {
        console.error('Failed to generate quote:', result.error)
      }
    } catch (error) {
      console.error('Error generating quote:', error)
    } finally {
      setIsGeneratingQuote(false)
    }
  }

  const shareCart = () => {
    const cartData = {
      items: cart.items.map(item => ({
        name: item.product.name,
        variant: item.variant.name,
        quantity: item.quantity,
        price: item.variant.price
      })),
      total: cart.total
    }

    const message = `Check out my shopping cart from Brandson Media:\n\n${cartData.items.map((item, index) => 
      `${index + 1}. ${item.name} (${item.variant}) - Qty: ${item.quantity} - KES ${item.price.toLocaleString()}`
    ).join('\n')}\n\nTotal: KES ${cartData.total.toLocaleString()}\n\nView details: ${window.location.href}`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString()}`
  }

  const finalTotal = cart.subtotal + cart.tax + cart.shipping - discount

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <CardTitle>Your cart is empty</CardTitle>
            <CardDescription>Add some products to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/store">
                <ArrowRight className="mr-2 h-4 w-4" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600">{cart.itemCount} items in your cart</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={shareCart}>
                <Share className="mr-2 h-4 w-4" />
                Share Cart
              </Button>
              <Button variant="outline" asChild>
                <Link href="/store">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.product.name}</h3>
                          <p className="text-sm text-gray-600">{item.variant.name}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {item.product.subcategory}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">Qty:</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                              min={1}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Unit price: {formatPrice(item.variant.price)}</p>
                          <p className="font-semibold text-lg">
                            {formatPrice(item.variant.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      {/* Product Features */}
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {item.product.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <Truck className="h-3 w-3" />
                        <span>Delivery: {item.product.turnaroundTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              
              {/* Cart QR Code */}
              {cartQRCode && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="h-5 w-5" />
                      Cart QR Code
                    </CardTitle>
                    <CardDescription>Scan to share or verify your cart</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-4">
                      <img src={cartQRCode} alt="Cart QR Code" className="mx-auto" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={shareCart}>
                        <Share className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        const link = document.createElement('a')
                        link.download = 'cart-qr-code.png'
                        link.href = cartQRCode
                        link.click()
                      }}>
                        <Download className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Generate Quote */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Generate Quote
                  </CardTitle>
                  <CardDescription>Create a formal quote for your cart items</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={generateQuote}
                    disabled={isGeneratingQuote}
                    className="w-full"
                  >
                    {isGeneratingQuote ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Quote PDF
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Get a formal quote with QR code verification
                  </p>
                </CardContent>
              </Card>

              {/* Promo Code */}
              <Card>
                <CardHeader>
                  <CardTitle>Promo Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button onClick={applyPromoCode} variant="outline">
                      Apply
                    </Button>
                  </div>
                  {discount > 0 && (
                    <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Promo code applied! Saved {formatPrice(discount)}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getShippingOptions().map((option) => (
                    <label
                      key={option.method}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          value={option.method}
                          checked={selectedShipping.method === option.method}
                          onChange={() => handleShippingChange(option)}
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

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({cart.itemCount} items)</span>
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
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>Secure checkout powered by M-Pesa & Stripe</span>
                  </div>

                  {/* Checkout Button */}
                  <Button asChild className="w-full text-lg py-6" size="lg">
                    <Link href="/checkout-new">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proceed to Checkout
                    </Link>
                  </Button>

                  {/* Trust Indicators */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2">
                      <Truck className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                      <p className="text-xs text-gray-600">Fast Delivery</p>
                    </div>
                    <div className="p-2">
                      <Shield className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                      <p className="text-xs text-gray-600">Secure Payment</p>
                    </div>
                    <div className="p-2">
                      <CheckCircle className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                      <p className="text-xs text-gray-600">Quality Guarantee</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Support */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">Need help with your order?</p>
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="https://wa.me/254701869821" target="_blank">
                          <Smartphone className="h-4 w-4 mr-1" />
                          WhatsApp
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="tel:+254701869821">
                          <Smartphone className="h-4 w-4 mr-1" />
                          Call Us
                        </Link>
                      </Button>
                    </div>
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
