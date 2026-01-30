"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CreditCard, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { PRODUCT_CATALOG, Product } from '@/lib/stripe'

interface StripePaymentProps {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  defaultAmount?: number
}

interface CartItem {
  product: Product
  quantity: number
}

export function StripePayment({ onSuccess, onError, defaultAmount }: StripePaymentProps) {
  const [email, setEmail] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [customAmount, setCustomAmount] = useState(defaultAmount || 0)
  const [paymentType, setPaymentType] = useState<'catalog' | 'custom'>('catalog')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      )
    }
  }

  const getTotalAmount = () => {
    if (paymentType === 'catalog') {
      return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0) / 100
    }
    return customAmount
  }

  const handlePayment = async () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    if (paymentType === 'catalog' && cart.length === 0) {
      toast.error('Please add items to your cart')
      return
    }

    if (paymentType === 'custom' && customAmount < 1) {
      toast.error('Please enter a valid amount')
      return
    }

    setLoading(true)
    setStatus('processing')

    try {
      const baseUrl = window.location.origin
      const successUrl = `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`
      const cancelUrl = `${baseUrl}/payment/cancel`

      let requestBody: any = {
        type: paymentType === 'catalog' ? 'checkout' : 'payment_intent',
        successUrl,
        cancelUrl,
        customerEmail: email,
      }

      if (paymentType === 'catalog') {
        requestBody.productIds = cart.map(item => item.product.id)
        requestBody.quantities = cart.map(item => item.quantity)
      } else {
        requestBody.amount = customAmount
      }

      const response = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.type === 'checkout' && data.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url
        } else if (data.type === 'payment_intent' && data.client_secret) {
          // Handle Payment Intent (would need Stripe Elements UI)
          toast.success('Payment intent created. Implement Stripe Elements for completion.')
          onSuccess?.(data)
        }
      } else {
        const errorMessage = data.error || 'Payment failed'
        setStatus('error')
        toast.error(errorMessage)
        onError?.(errorMessage)
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.'
      setStatus('error')
      toast.error(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const groupedProducts = PRODUCT_CATALOG.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
    acc[product.category].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Stripe Payment
          </CardTitle>
          <CardDescription>
            Pay securely using Stripe (Card, Mobile Money, etc.)
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Payment Type Selection */}
          <div className="space-y-2">
            <Label>Payment Type</Label>
            <Select value={paymentType} onValueChange={(value: 'catalog' | 'custom') => setPaymentType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="catalog">Buy from Catalog</SelectItem>
                <SelectItem value="custom">Custom Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentType === 'catalog' ? (
            <div className="space-y-6">
              {/* Product Catalog */}
              <div className="space-y-4">
                <h3 className="font-medium">Products & Services</h3>
                {Object.entries(groupedProducts).map(([category, products]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground capitalize">
                      {category}
                    </h4>
                    <div className="grid gap-2">
                      {products.map((product) => {
                        const cartItem = cart.find(item => item.product.id === product.id)
                        return (
                          <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <h5 className="font-medium">{product.name}</h5>
                              <p className="text-sm text-muted-foreground">{product.description}</p>
                              <p className="text-sm font-medium text-green-600">
                                KES {(product.price / 100).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {cartItem ? (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                                  >
                                    -
                                  </Button>
                                  <span className="w-8 text-center">{cartItem.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => addToCart(product)}
                                >
                                  Add
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              {cart.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Cart Summary</h3>
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span>{item.product.name} x {item.quantity}</span>
                        <span>KES {((item.product.price * item.quantity) / 100).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span className="text-green-600">KES {getTotalAmount().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Custom Amount */
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (KES)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1000"
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                min="1"
                step="0.01"
              />
              <p className="text-sm text-muted-foreground">
                Enter custom amount for services or deposits
              </p>
            </div>
          )}

          {/* Processing Status */}
          {status === 'processing' && (
            <div className="flex flex-col items-center space-y-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="font-medium">Processing payment...</p>
              <p className="text-sm text-muted-foreground">
                You will be redirected to Stripe secure checkout
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4 py-8">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <p className="font-medium text-green-600">Payment initiated successfully!</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4 py-8">
              <XCircle className="h-12 w-12 text-red-500" />
              <p className="font-medium text-red-500">Payment failed</p>
              <Button
                variant="outline"
                onClick={() => setStatus('idle')}
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>

        {status === 'idle' && (
          <CardFooter>
            <Button
              onClick={handlePayment}
              disabled={loading || !email || (paymentType === 'catalog' ? cart.length === 0 : customAmount < 1)}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay KES {getTotalAmount().toLocaleString()}
                </>
              )}
            </Button>
          </CardFooter>
        )}

        <CardFooter className="border-t">
          <div className="text-xs text-muted-foreground">
            <p>Secure payment powered by Stripe. We accept cards, M-Pesa, and other payment methods.</p>
            <p>Your payment information is encrypted and secure.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
