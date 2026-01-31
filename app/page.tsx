import { DynamicHero } from "@/components/dynamic-hero"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
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
  Grid3X3,
  List,
  Filter,
  Search,
  Plus,
  Settings,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Home,
  ShoppingBag,
  Printer,
  Shirt,
  Sparkles,
  Building2,
  Scissors,
  Layers,
} from "lucide-react"

const services = [
  {
    id: "printing-stickers",
    icon: Printer,
    title: "Printing & Stickers",
    description: "Banners, stickers, vehicle branding, and all your printing needs.",
    features: ["High Quality", "Fast Delivery", "Best Prices"],
    startingFrom: "KES 500",
    popular: true
  },
  {
    icon: Shirt,
    title: "Branding Services",
    description: "T-shirts, uniforms, caps, and corporate apparel branding.",
    features: ["Custom Designs", "Premium Materials", "Expert Installation"],
    startingFrom: "KES 800",
    popular: false
  },
  {
    icon: Sparkles,
    title: "UV Printing",
    description: "Custom promotional items, gifts, and branded merchandise.",
    features: ["Advanced Technology", "Eco-Friendly", "Long-lasting"],
    startingFrom: "KES 1,200",
    popular: true,
    isNew: true
  },
  {
    icon: Building2,
    title: "Signage & 3D Signs",
    description: "Indoor and outdoor signage for businesses and buildings.",
    features: ["3D Design", "LED Options", "Weather Resistant"],
    startingFrom: "KES 2,000",
    popular: false
  },
  {
    icon: Scissors,
    title: "Laser Cutting",
    description: "Acrylic, wood cutting, engraving, and custom displays.",
    features: ["Precision Cutting", "Custom Shapes", "Quick Turnaround"],
    startingFrom: "KES 300",
    popular: false
  },
  {
    icon: Layers,
    title: "Paper Printing",
    description: "Business cards, brochures, company profiles, and more.",
    features: ["Premium Paper", "Full Color", "Bulk Discounts"],
    startingFrom: "KES 100",
    popular: false
  }
]

const features = [
  {
    icon: CheckCircle,
    title: "Premium Quality",
    description: "We use top-grade materials and latest printing technology for lasting results.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Quick delivery without compromising on quality standards.",
  },
  {
    icon: Award,
    title: "Expert Team",
    description: "Skilled professionals with years of experience in the industry.",
  },
  {
    icon: DollarSign,
    title: "Competitive Pricing",
    description: "Affordable rates for businesses of all sizes.",
  }
]

const portfolioItems = [
  { 
    title: "Corporate Branding", 
    category: "Branding", 
    image: "/branded-corporate-t-shirts-uniform.jpg",
    price: "KES 15,000",
    rating: 4.8,
    reviews: 24
  },
  { 
    title: "Event Banners", 
    category: "Printing", 
    image: "/professional-event-banners-displays.jpg",
    price: "KES 8,000",
    rating: 4.9,
    reviews: 18
  },
  { 
    title: "Vehicle Wrapping", 
    category: "Branding", 
    image: "/branded-vehicle-car-wrapping.jpg",
    price: "KES 25,000",
    rating: 4.7,
    reviews: 31
  },
  { 
    title: "3D Signage", 
    category: "Signage", 
    image: "/3d-company-signage-letters.jpg",
    price: "KES 12,000",
    rating: 5.0,
    reviews: 12
  },
  { 
    title: "UV Printed Items", 
    category: "UV Printing", 
    image: "/uv-printed-promotional-items-bottles.jpg",
    price: "KES 3,500",
    rating: 4.6,
    reviews: 8,
    isNew: true
  },
  { 
    title: "Acrylic Displays", 
    category: "Laser Cutting", 
    image: "/acrylic-menu-holders-displays.jpg",
    price: "KES 5,000",
    rating: 4.8,
    reviews: 15
  }
]

export default function HomePage() {
  const { addToCart, isInCart, getItemQuantity } = useCart()

  const handleAddToCart = (service: any) => {
    addToCart({
      id: service.id || service.title.toLowerCase().replace(/\s+/g, '-'),
      service: service.title,
      category: service.title.toLowerCase().replace(/\s+/g, '-'),
      description: service.description,
      quantity: 1,
      unitPrice: parseInt(service.startingFrom.replace('KES ', '').replace(',', '')),
      specifications: {},
      timeline: 'Standard (3-5 days)',
      image: service.image
    })
  }

  return (
    <div className="min-h-screen">
      {/* Dynamic Hero Section */}
      <DynamicHero 
        autoPlay={true}
        interval={6000}
        showControls={true}
        showThumbnails={true}
        height="h-[70vh]"
      />

      {/* Quick Actions Bar */}
      <section className="bg-primary text-primary-foreground py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+254 701 869 821</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">brandsonmedia@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Nairobi, Kenya</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="secondary" size="sm">
                <Link href="/quote">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Get Quote
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="https://wa.me/254701869821" target="_blank">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Comprehensive printing and branding solutions for your business
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm">
                <Grid3X3 className="mr-2 h-4 w-4" />
                Grid View
              </Button>
              <Button variant="ghost" size="sm">
                <List className="mr-2 h-4 w-4" />
                List View
              </Button>
              <Button variant="ghost" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-card border-border h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <service.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {service.isNew && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          New
                        </Badge>
                      )}
                      {service.popular && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Starting from</p>
                        <p className="text-lg font-bold text-primary">{service.startingFrom}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}>
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Link>
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleAddToCart(service)}
                          disabled={isInCart(service.id || service.title.toLowerCase().replace(/\s+/g, '-'))}
                        >
                          <ShoppingCart className="mr-1 h-3 w-3" />
                          {isInCart(service.id || service.title.toLowerCase().replace(/\s+/g, '-')) 
                            ? `In Cart (${getItemQuantity(service.id || service.title.toLowerCase().replace(/\s+/g, '-'))})`
                            : 'Add to Cart'
                          }
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View All Services <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Brandson Media</h2>
            <p className="text-xl text-muted-foreground">Quality, reliability, and creativity in every project</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Recent Work</h2>
            <p className="text-xl text-muted-foreground mb-8">A glimpse of our recent projects</p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                All Categories
              </Button>
              <Button variant="ghost" size="sm">
                <TrendingUp className="mr-2 h-4 w-4" />
                Most Popular
              </Button>
              <Button variant="ghost" size="sm">
                <Star className="mr-2 h-4 w-4" />
                Top Rated
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center text-white">
                      <p className="text-sm font-medium mb-1">{item.category}</p>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                    </div>
                  </div>
                  {item.isNew && (
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      New
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{item.price}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">{item.rating}</span>
                        <span className="text-xs text-muted-foreground">({item.reviews})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      <ShoppingCart className="mr-1 h-3 w-3" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              View Full Portfolio <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Brand?</h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Let us help you create powerful visual solutions that make your business stand out.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
                <Link href="/quote">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Get Instant Quote
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link href="https://wa.me/254701869821" target="_blank">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
