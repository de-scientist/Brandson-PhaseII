"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import {
  Package,
  Users,
  CreditCard,
  FileText,
  Upload,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Clock,
  Award,
  DollarSign,
  ArrowRight,
  ShoppingCart,
  Star,
  Zap,
  Target,
  Shield,
  Palette,
  Eye,
  Phone,
  Mail,
  MapPin,
  Heart,
  MessageCircle,
  Play,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  Download,
  Printer,
  Shirt,
  Sparkles,
  Building2,
  Scissors,
  Layers,
  Calendar,
  Truck,
  Settings,
  HelpCircle,
  Info,
  AlertCircle,
  Check,
  X,
  Edit,
  Save,
  RefreshCw,
  FileDown,
  Share2,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
} from "lucide-react"

interface QuoteItem {
  id: string
  service: string
  category: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  specifications: Record<string, any>
  timeline: string
  features: string[]
}

interface QuoteData {
  customerInfo: {
    name: string
    email: string
    phone: string
    company: string
    address: string
  }
  items: QuoteItem[]
  subtotal: number
  tax: number
  total: number
  timeline: string
  notes: string
  status: 'draft' | 'pending' | 'approved' | 'rejected'
}

const services = [
  {
    id: 'printing',
    name: 'Printing & Stickers',
    icon: Printer,
    description: 'Banners, stickers, vehicle branding, and all your printing needs.',
    basePrice: 500,
    options: {
      material: ['Vinyl', 'Paper', 'Fabric', 'Metal', 'Plastic'],
      size: ['Small', 'Medium', 'Large', 'Custom'],
      finish: ['Matte', 'Glossy', 'Satin', 'UV Coated'],
      quantity: [1, 10, 50, 100, 500, 1000]
    }
  },
  {
    id: 'branding',
    name: 'Branding Services',
    icon: Shirt,
    description: 'T-shirts, uniforms, caps, and corporate apparel branding.',
    basePrice: 800,
    options: {
      material: ['Cotton', 'Polyester', 'Blend', 'Performance'],
      size: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'],
      printType: ['Screen Print', 'Embroidery', 'Heat Transfer', 'DTG'],
      quantity: [1, 10, 25, 50, 100, 250]
    }
  },
  {
    id: 'uv-printing',
    name: 'UV Printing',
    icon: Sparkles,
    description: 'Custom promotional items, gifts, and branded merchandise.',
    basePrice: 1200,
    options: {
      material: ['Plastic', 'Metal', 'Glass', 'Wood', 'Leather'],
      size: ['Small', 'Medium', 'Large', 'Custom'],
      finish: ['Matte', 'Glossy', 'Textured', 'Metallic'],
      quantity: [1, 5, 10, 25, 50, 100]
    }
  },
  {
    id: 'signage',
    name: 'Signage & 3D Signs',
    icon: Building2,
    description: 'Indoor and outdoor signage for businesses and buildings.',
    basePrice: 2000,
    options: {
      material: ['Acrylic', 'Aluminum', 'PVC', 'Wood', 'LED'],
      size: ['Small', 'Medium', 'Large', 'Extra Large'],
      lighting: ['No Lighting', 'LED Backlit', 'Edge Lit', 'Neon'],
      installation: ['DIY', 'Professional Installation']
    }
  },
  {
    id: 'laser-cutting',
    name: 'Laser Cutting',
    icon: Scissors,
    description: 'Acrylic, wood cutting, engraving, and custom displays.',
    basePrice: 300,
    options: {
      material: ['Acrylic', 'Wood', 'Metal', 'Leather', 'Fabric'],
      thickness: ['1mm', '3mm', '5mm', '10mm', 'Custom'],
      complexity: ['Simple', 'Medium', 'Complex', 'Intricate'],
      quantity: [1, 5, 10, 25, 50, 100]
    }
  },
  {
    id: 'paper-printing',
    name: 'Paper Printing',
    icon: Layers,
    description: 'Business cards, brochures, company profiles, and more.',
    basePrice: 100,
    options: {
      paperType: ['Standard', 'Premium', 'Recycled', 'Cardstock'],
      size: ['A4', 'A5', 'A6', 'Custom'],
      finish: ['Matte', 'Glossy', 'Satin', 'Uncoated'],
      quantity: [50, 100, 250, 500, 1000, 5000]
    }
  }
]

export default function QuoteBuilder() {
  const [currentStep, setCurrentStep] = useState(1)
  const [quoteData, setQuoteData] = useState<QuoteData>({
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      company: '',
      address: ''
    },
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    timeline: '',
    notes: '',
    status: 'draft'
  })
  const [selectedService, setSelectedService] = useState<string>('')
  const [currentItem, setCurrentItem] = useState<Partial<QuoteItem>>({})
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const calculatePrice = (serviceId: string, specifications: Record<string, any>, quantity: number) => {
    const service = services.find(s => s.id === serviceId)
    if (!service) return 0

    let basePrice = service.basePrice
    
    // Add material cost
    if (specifications.material) {
      const materialCosts: Record<string, number> = {
        'Vinyl': 0,
        'Paper': -50,
        'Fabric': 100,
        'Metal': 500,
        'Plastic': 50,
        'Cotton': 0,
        'Polyester': 50,
        'Blend': 25,
        'Performance': 100,
        'Acrylic': 100,
        'Aluminum': 300,
        'PVC': 50,
        'Wood': 200,
        'LED': 500,
        'Standard': 0,
        'Premium': 100,
        'Recycled': 25,
        'Cardstock': 150
      }
      basePrice += materialCosts[specifications.material] || 0
    }

    // Add size cost
    if (specifications.size) {
      const sizeCosts: Record<string, number> = {
        'Small': 0,
        'Medium': 100,
        'Large': 300,
        'Custom': 500,
        'XS': -50,
        'S': 0,
        'M': 50,
        'L': 100,
        'XL': 150,
        'XXL': 200,
        'Extra Large': 500,
        'A4': 0,
        'A5': -25,
        'A6': -50,
        '1mm': 0,
        '3mm': 50,
        '5mm': 100,
        '10mm': 300,
        'Simple': 0,
        'Medium_Complex': 100,
        'Complex': 300,
        'Intricate': 500
      }
      basePrice += sizeCosts[specifications.size] || 0
    }

    // Add finish cost
    if (specifications.finish) {
      const finishCosts: Record<string, number> = {
        'Matte': 0,
        'Glossy': 50,
        'Satin': 25,
        'UV Coated': 100,
        'Textured': 75,
        'Metallic': 200,
        'Uncoated': -25
      }
      basePrice += finishCosts[specifications.finish] || 0
    }

    // Add other features
    if (specifications.lighting === 'LED Backlit') basePrice += 300
    if (specifications.lighting === 'Edge Lit') basePrice += 400
    if (specifications.lighting === 'Neon') basePrice += 500
    if (specifications.installation === 'Professional Installation') basePrice += 200
    if (specifications.printType === 'Embroidery') basePrice += 200
    if (specifications.printType === 'Heat Transfer') basePrice += 50
    if (specifications.printType === 'DTG') basePrice += 100

    return basePrice * quantity
  }

  const addQuoteItem = () => {
    if (!selectedService || !currentItem.quantity) return

    const service = services.find(s => s.id === selectedService)
    if (!service) return

    const unitPrice = calculatePrice(selectedService, currentItem.specifications || {}, currentItem.quantity || 1)
    const totalPrice = unitPrice * (currentItem.quantity || 1)

    const newItem: QuoteItem = {
      id: Date.now().toString(),
      service: service.name,
      category: service.id,
      description: currentItem.description || service.description,
      quantity: currentItem.quantity || 1,
      unitPrice,
      totalPrice,
      specifications: currentItem.specifications || {},
      timeline: currentItem.timeline || 'Standard (3-5 days)',
      features: currentItem.features || []
    }

    setQuoteData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      subtotal: prev.subtotal + totalPrice,
      tax: prev.tax + (totalPrice * 0.16), // 16% tax
      total: prev.total + totalPrice + (totalPrice * 0.16)
    }))

    // Reset current item
    setCurrentItem({})
    setSelectedService('')
  }

  const removeQuoteItem = (id: string) => {
    const item = quoteData.items.find(i => i.id === id)
    if (!item) return

    setQuoteData(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== id),
      subtotal: prev.subtotal - item.totalPrice,
      tax: prev.tax - (item.totalPrice * 0.16),
      total: prev.total - item.totalPrice - (item.totalPrice * 0.16)
    }))
  }

  const generatePDF = async () => {
    setIsGeneratingPDF(true)
    
    try {
      const { generateQuotePDF } = await import('@/lib/pdf-generator')
      const pdfBlob = await generateQuotePDF(quoteData)
      
      // Download the PDF
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Brandson-Media-Quote-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const totalSteps = 4

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quote Builder</h1>
              <p className="text-gray-600 mt-1">Create a custom quote for your printing needs</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={generatePDF} disabled={quoteData.items.length === 0 || isGeneratingPDF}>
                {isGeneratingPDF ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
                </div>
                <span className="font-medium">Select Services</span>
              </div>
              <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
                </div>
                <span className="font-medium">Customize</span>
              </div>
              <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  {currentStep > 3 ? <Check className="h-4 w-4" /> : '3'}
                </div>
                <span className="font-medium">Customer Info</span>
              </div>
              <div className={`flex items-center space-x-2 ${currentStep >= 4 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 4 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  {currentStep > 4 ? <Check className="h-4 w-4" /> : '4'}
                </div>
                <span className="font-medium">Review</span>
              </div>
            </div>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Select Services */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Services</CardTitle>
                  <CardDescription>Choose the services you need for your project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedService === service.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <service.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{service.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                            <p className="text-sm font-medium text-primary mt-2">
                              From KES {service.basePrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedService && (
                    <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-semibold mb-4">Quick Add</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="quick-quantity">Quantity</Label>
                          <Select onValueChange={(value) => setCurrentItem(prev => ({ ...prev, quantity: parseInt(value) }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select quantity" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.find(s => s.id === selectedService)?.options.quantity?.map(q => (
                                <SelectItem key={q} value={q.toString()}>{q}</SelectItem>
                              )) || []}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="quick-description">Description</Label>
                          <Input
                            placeholder="Brief description"
                            value={currentItem.description || ''}
                            onChange={(e) => setCurrentItem(prev => ({ ...prev, description: e.target.value }))}
                          />
                        </div>
                      </div>
                      <Button onClick={addQuoteItem} className="mt-4" disabled={!currentItem.quantity}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add to Quote
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Customize */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Customize Your Items</CardTitle>
                  <CardDescription>Configure specifications for each item</CardDescription>
                </CardHeader>
                <CardContent>
                  {quoteData.items.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No items added yet. Go back to select services.</p>
                      <Button onClick={() => setCurrentStep(1)} className="mt-4">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Services
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {quoteData.items.map((item) => (
                        <div key={item.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold">{item.service}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => removeQuoteItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Quantity</Label>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const newQuantity = parseInt(e.target.value) || 1
                                  const newUnitPrice = calculatePrice(item.category, item.specifications, newQuantity)
                                  const newTotalPrice = newUnitPrice * newQuantity
                                  
                                  setQuoteData(prev => ({
                                    ...prev,
                                    items: prev.items.map(i => 
                                      i.id === item.id 
                                        ? { ...i, quantity: newQuantity, unitPrice: newUnitPrice, totalPrice: newTotalPrice }
                                        : i
                                    ),
                                    subtotal: prev.subtotal - item.totalPrice + newTotalPrice,
                                    tax: prev.tax - (item.totalPrice * 0.16) + (newTotalPrice * 0.16),
                                    total: prev.total - item.totalPrice - (item.totalPrice * 0.16) + newTotalPrice + (newTotalPrice * 0.16)
                                  }))
                                }}
                              />
                            </div>
                            <div>
                              <Label>Timeline</Label>
                              <Select value={item.timeline} onValueChange={(value) => {
                                setQuoteData(prev => ({
                                  ...prev,
                                  items: prev.items.map(i => 
                                    i.id === item.id ? { ...i, timeline: value } : i
                                  )
                                }))
                              }}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Express (1-2 days)">Express (1-2 days)</SelectItem>
                                  <SelectItem value="Standard (3-5 days)">Standard (3-5 days)</SelectItem>
                                  <SelectItem value="Economy (7-10 days)">Economy (7-10 days)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Label>Special Requirements</Label>
                            <Textarea
                              placeholder="Any special requirements or notes..."
                              value={item.specifications.notes || ''}
                              onChange={(e) => {
                                setQuoteData(prev => ({
                                  ...prev,
                                  items: prev.items.map(i => 
                                    i.id === item.id 
                                      ? { ...i, specifications: { ...i.specifications, notes: e.target.value } }
                                      : i
                                  )
                                }))
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Customer Info */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                  <CardDescription>Provide your contact details for the quote</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={quoteData.customerInfo.name}
                          onChange={(e) => setQuoteData(prev => ({
                            ...prev,
                            customerInfo: { ...prev.customerInfo, name: e.target.value }
                          }))}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={quoteData.customerInfo.email}
                          onChange={(e) => setQuoteData(prev => ({
                            ...prev,
                            customerInfo: { ...prev.customerInfo, email: e.target.value }
                          }))}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          value={quoteData.customerInfo.phone}
                          onChange={(e) => setQuoteData(prev => ({
                            ...prev,
                            customerInfo: { ...prev.customerInfo, phone: e.target.value }
                          }))}
                          placeholder="+254 700 000 000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={quoteData.customerInfo.company}
                          onChange={(e) => setQuoteData(prev => ({
                            ...prev,
                            customerInfo: { ...prev.customerInfo, company: e.target.value }
                          }))}
                          placeholder="Acme Corporation"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={quoteData.customerInfo.address}
                        onChange={(e) => setQuoteData(prev => ({
                          ...prev,
                          customerInfo: { ...prev.customerInfo, address: e.target.value }
                        }))}
                        placeholder="123 Main St, Nairobi, Kenya"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={quoteData.notes}
                        onChange={(e) => setQuoteData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any additional information or special requirements..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Quote</CardTitle>
                  <CardDescription>Check all details before downloading your quote</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Customer Information */}
                    <div>
                      <h3 className="font-semibold mb-3">Customer Information</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-medium">{quoteData.customerInfo.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{quoteData.customerInfo.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium">{quoteData.customerInfo.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Company</p>
                            <p className="font-medium">{quoteData.customerInfo.company}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quote Items */}
                    <div>
                      <h3 className="font-semibold mb-3">Quote Items</h3>
                      <div className="space-y-3">
                        {quoteData.items.map((item) => (
                          <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{item.service}</h4>
                                <p className="text-sm text-gray-600">{item.description}</p>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                <p className="text-sm text-gray-600">Timeline: {item.timeline}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">KES {item.totalPrice.toLocaleString()}</p>
                                <p className="text-sm text-gray-600">KES {item.unitPrice.toLocaleString()} each</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Summary */}
                    <div>
                      <h3 className="font-semibold mb-3">Pricing Summary</h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>KES {quoteData.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax (16%)</span>
                          <span>KES {quoteData.tax.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span>KES {quoteData.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {quoteData.notes && (
                      <div>
                        <h3 className="font-semibold mb-3">Additional Notes</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">{quoteData.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                disabled={
                  (currentStep === 1 && quoteData.items.length === 0) ||
                  (currentStep === 3 && (!quoteData.customerInfo.name || !quoteData.customerInfo.email || !quoteData.customerInfo.phone))
                }
              >
                {currentStep === totalSteps ? 'Complete' : 'Next'}
                {currentStep < totalSteps && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quote Summary */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Quote Summary</CardTitle>
                <CardDescription>Current quote details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Items</span>
                    <Badge variant="secondary">{quoteData.items.length}</Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    {quoteData.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="truncate">{item.service} x{item.quantity}</span>
                        <span className="font-medium">KES {item.totalPrice.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>KES {quoteData.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (16%)</span>
                      <span>KES {quoteData.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>KES {quoteData.total.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={generatePDF} 
                    disabled={quoteData.items.length === 0 || isGeneratingPDF}
                  >
                    {isGeneratingPDF ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                  </Button>
                  
                  <div className="text-center text-sm text-gray-600">
                    <p>Quote valid for 30 days</p>
                    <p>Includes 16% VAT</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
