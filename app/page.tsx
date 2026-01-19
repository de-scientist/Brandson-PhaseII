import HeroSection from "@/components/HeroSection"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  Printer,
  Shirt,
  Sparkles,
  Building2,
  Scissors,
  Layers,
  CheckCircle,
  Clock,
  Award,
  DollarSign,
  ArrowRight,
} from "lucide-react"

const services = [
  {
    icon: Printer,
    title: "Printing & Stickers",
    description: "Banners, stickers, vehicle branding, and all your printing needs.",
  },
  {
    icon: Shirt,
    title: "Branding Services",
    description: "T-shirts, uniforms, caps, and corporate apparel branding.",
  },
  {
    icon: Sparkles,
    title: "UV Printing",
    description: "Custom promotional items, gifts, and branded merchandise.",
  },
  {
    icon: Building2,
    title: "Signage & 3D Signs",
    description: "Indoor and outdoor signage for businesses and buildings.",
  },
  {
    icon: Scissors,
    title: "Laser Cutting",
    description: "Acrylic, wood cutting, engraving, and custom displays.",
  },
  {
    icon: Layers,
    title: "Paper Printing",
    description: "Business cards, brochures, company profiles, and more.",
  },
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
  },
]

const portfolioItems = [
  { title: "Corporate Branding", category: "Branding", image: "/branded-corporate-t-shirts-uniform.jpg" },
  { title: "Event Banners", category: "Printing", image: "/professional-event-banners-displays.jpg" },
  { title: "Vehicle Wrapping", category: "Branding", image: "/branded-vehicle-car-wrapping.jpg" },
  { title: "3D Signage", category: "Signage", image: "/3d-company-signage-letters.jpg" },
  { title: "UV Printed Items", category: "UV Printing", image: "/uv-printed-promotional-items-bottles.jpg" },
  { title: "Acrylic Displays", category: "Laser Cutting", image: "/acrylic-menu-holders-displays.jpg" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
       <HeroSection />

      {/* Services Overview */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Our Services</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive printing and branding solutions for your business
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="group hover:shadow-lg transition-shadow bg-card border-border">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              asChild
            >
              <Link href="/services">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Why Choose Brandson Media</h2>
            <p className="mt-4 text-lg text-muted-foreground">Quality, reliability, and creativity in every project</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Our Work</h2>
            <p className="mt-4 text-lg text-muted-foreground">A glimpse of our recent projects</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <div key={item.title} className="group relative overflow-hidden rounded-lg">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-dark-section-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-center text-dark-section-fg">
                    <p className="text-sm text-primary font-medium">{item.category}</p>
                    <h3 className="text-xl font-semibold mt-1">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              asChild
            >
              <Link href="/portfolio">
                View Full Portfolio <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Client Trust Section */}
      <section className="py-16 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-8">Trusted by businesses across Nairobi</p>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
              {["Hotels", "Corporates", "Events", "Institutions", "SMEs"].map((client) => (
                <div key={client} className="text-muted-foreground/60 font-semibold text-lg">
                  {client}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance">Ready to Transform Your Brand?</h2>
          <p className="mt-4 text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Let us help you create powerful visual solutions that make your business stand out.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-dark-section-fg text-dark-section-bg hover:bg-dark-section-fg/90" asChild>
              <a href="https://wa.me/254701869821" target="_blank" rel="noopener noreferrer">
                WhatsApp Us Now
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
