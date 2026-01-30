"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Smartphone, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface MpesaPaymentProps {
  amount: number
  accountReference: string
  transactionDesc?: string
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

interface PaymentState {
  loading: boolean
  status: 'idle' | 'processing' | 'success' | 'error'
  checkoutRequestID?: string
  message: string
}

export function MpesaPayment({
  amount,
  accountReference,
  transactionDesc = 'Brandson Media Payment',
  onSuccess,
  onError,
}: MpesaPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [paymentState, setPaymentState] = useState<PaymentState>({
    loading: false,
    status: 'idle',
    message: '',
  })

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '')
    
    // Format as Kenyan phone number
    if (cleaned.startsWith('254') && cleaned.length <= 12) {
      return cleaned
    } else if (cleaned.startsWith('0') && cleaned.length <= 10) {
      return cleaned
    } else if (cleaned.startsWith('7') && cleaned.length <= 9) {
      return cleaned
    }
    
    return cleaned.slice(0, 12)
  }

  const validatePhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '')
    
    // Validate Kenyan phone number formats
    if (cleaned.startsWith('254') && cleaned.length === 12) {
      return true
    } else if (cleaned.startsWith('0') && cleaned.length === 10) {
      return true
    } else if (cleaned.startsWith('7') && cleaned.length === 9) {
      return true
    }
    
    return false
  }

  const handlePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid Kenyan phone number')
      return
    }

    setPaymentState({
      loading: true,
      status: 'processing',
      message: 'Initiating M-Pesa payment...',
    })

    try {
      const response = await fetch('/api/payments/mpesa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          amount,
          accountReference,
          transactionDesc,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPaymentState({
          loading: false,
          status: 'success',
          message: 'Please check your phone for the M-Pesa prompt',
          checkoutRequestID: data.data?.CheckoutRequestID,
        })
        
        toast.success('M-Pesa prompt sent to your phone')
        onSuccess?.(data)
        
        // Start polling for payment status
        if (data.data?.CheckoutRequestID) {
          pollPaymentStatus(data.data.CheckoutRequestID)
        }
      } else {
        const errorMessage = data.message || 'Payment failed'
        setPaymentState({
          loading: false,
          status: 'error',
          message: errorMessage,
        })
        
        toast.error(errorMessage)
        onError?.(errorMessage)
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.'
      setPaymentState({
        loading: false,
        status: 'error',
        message: errorMessage,
      })
      
      toast.error(errorMessage)
      onError?.(errorMessage)
    }
  }

  const pollPaymentStatus = async (checkoutRequestID: string) => {
    const maxAttempts = 20 // Poll for up to 10 minutes (30 seconds * 20)
    let attempts = 0

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setPaymentState(prev => ({
          ...prev,
          loading: false,
          status: 'error',
          message: 'Payment timeout. Please check your M-Pesa transactions.',
        }))
        return
      }

      try {
        const response = await fetch(`/api/payments/mpesa/status?checkoutRequestID=${checkoutRequestID}`)
        const data = await response.json()

        if (data.success && data.data?.ResultCode !== undefined) {
          if (data.data.ResultCode === 0) {
            // Payment successful
            setPaymentState({
              loading: false,
              status: 'success',
              message: 'Payment completed successfully!',
              checkoutRequestID,
            })
            toast.success('Payment completed successfully!')
          } else if (data.data.ResultCode === 1032) {
            // Payment cancelled by user
            setPaymentState({
              loading: false,
              status: 'error',
              message: 'Payment was cancelled',
              checkoutRequestID,
            })
            toast.error('Payment was cancelled')
          } else {
            // Payment failed
            setPaymentState({
              loading: false,
              status: 'error',
              message: data.data.ResultDesc || 'Payment failed',
              checkoutRequestID,
            })
            toast.error(data.data.ResultDesc || 'Payment failed')
          }
          return
        }

        // Continue polling
        attempts++
        setTimeout(poll, 30000) // Poll every 30 seconds
      } catch (error) {
        console.error('Error polling payment status:', error)
        attempts++
        setTimeout(poll, 30000)
      }
    }

    // Start polling after 5 seconds
    setTimeout(poll, 5000)
  }

  const resetPayment = () => {
    setPaymentState({
      loading: false,
      status: 'idle',
      message: '',
    })
    setPhoneNumber('')
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-green-600" />
          M-Pesa Payment
        </CardTitle>
        <CardDescription>
          Pay KES {amount.toLocaleString()} using M-Pesa
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {paymentState.status === 'idle' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="07XXXXXXXX or 2547XXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">
                Enter your M-Pesa registered phone number
              </p>
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium mb-2">Payment Details:</h4>
              <div className="space-y-1 text-sm">
                <p>Amount: <span className="font-medium">KES {amount.toLocaleString()}</span></p>
                <p>Account: <span className="font-medium">{accountReference}</span></p>
                <p>Business: <span className="font-medium">Brandson Media</span></p>
              </div>
            </div>
          </div>
        )}

        {paymentState.status === 'processing' && (
          <div className="flex flex-col items-center space-y-4 py-8">
            <Loader2 className="h-12 w-12 animate-spin text-green-600" />
            <div className="text-center">
              <p className="font-medium">{paymentState.message}</p>
              <p className="text-sm text-muted-foreground mt-2">
                This may take a few moments...
              </p>
            </div>
          </div>
        )}

        {paymentState.status === 'success' && (
          <div className="flex flex-col items-center space-y-4 py-8">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <div className="text-center">
              <p className="font-medium text-green-600">{paymentState.message}</p>
              {paymentState.checkoutRequestID && (
                <p className="text-xs text-muted-foreground mt-2">
                  Transaction ID: {paymentState.checkoutRequestID}
                </p>
              )}
            </div>
          </div>
        )}

        {paymentState.status === 'error' && (
          <div className="flex flex-col items-center space-y-4 py-8">
            <XCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <p className="font-medium text-red-500">{paymentState.message}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetPayment}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {paymentState.status === 'idle' && (
        <CardFooter>
          <Button
            onClick={handlePayment}
            disabled={!phoneNumber || paymentState.loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {paymentState.loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Smartphone className="mr-2 h-4 w-4" />
                Pay KES {amount.toLocaleString()}
              </>
            )}
          </Button>
        </CardFooter>
      )}

      <CardFooter className="border-t">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p>You will receive an M-Pesa prompt on your phone.</p>
            <p>Enter your M-Pesa PIN to complete the payment.</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
