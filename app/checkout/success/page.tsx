"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  ArrowRight,
  Home,
  FileText,
  MessageCircle,
  Truck,
  Phone,
  Mail
} from "lucide-react"

export default function CheckoutSuccessPage() {
  useEffect(() => {
    // Clear any remaining cart items
    localStorage.removeItem('brandson_cart')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Order Successful!</CardTitle>
            <CardDescription className="text-lg">
              Thank you for your order. We'll start processing it right away.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Order Number:</span>
                  <Badge variant="secondary">ORD-{Date.now()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div>
              <h3 className="font-semibold mb-3">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Order Confirmation</p>
                    <p className="text-sm text-gray-600">You'll receive an email confirmation shortly</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Production</p>
                    <p className="text-sm text-gray-600">We'll start working on your order immediately</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Delivery</p>
                    <p className="text-sm text-gray-600">Your order will be delivered as per your selected timeline</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Options */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Need Help?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+254 701 869 821</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>brandsonmedia@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/quote">
                    <FileText className="mr-2 h-4 w-4" />
                    Get Another Quote
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link href="https://wa.me/254701869821" target="_blank">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat on WhatsApp
                  </Link>
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-center gap-4 pt-4">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Truck className="h-3 w-3" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <CheckCircle className="h-3 w-3" />
                <span>Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Phone className="h-3 w-3" />
                <span>24/7 Support</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
