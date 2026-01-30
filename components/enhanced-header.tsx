"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NavigationMenu } from "@/components/navigation-menu"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck,
  Star,
  TrendingUp,
  Award,
  Users,
  Package,
  CheckCircle,
  AlertCircle,
  Zap,
  ArrowRight,
  Eye
} from "lucide-react"

export function EnhancedHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    const updateTime = () => {
      setCurrentTime(new Date())
    }

    window.addEventListener('scroll', handleScroll)
    const timeInterval = setInterval(updateTime, 60000) // Update every minute

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(timeInterval)
    }
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const businessHours = {
    open: 8,
    close: 18,
    currentHour: currentTime.getHours(),
    isOpen: currentTime.getHours() >= 8 && currentTime.getHours() < 18
  }

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md shadow-lg border-b' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                Brandson Media
              </h1>
              <p className="text-xs text-muted-foreground">Printing Excellence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <NavigationMenu />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Business Hours Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {formatTime(currentTime)}
              </span>
              <div className={`w-2 h-2 rounded-full ${
                businessHours.isOpen ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>

            {/* Quick Contact */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="tel:+254701869821" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="hidden lg:inline">+254 701 869821</span>
                </Link>
              </Button>
              
              <Button variant="ghost" size="sm" asChild>
                <Link href="mailto:brandsonmedia@gmail.com" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="hidden lg:inline">Email</span>
                </Link>
              </Button>
            </div>

            {/* CTA Button */}
            <Button className="hidden sm:flex items-center gap-2" asChild>
              <Link href="/contact">
                Get Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            {/* WhatsApp Button */}
            <WhatsAppButton />

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <NavigationMenu />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        {!isScrolled && (
          <div className="hidden md:block border-t border-border/50 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center gap-8 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span className="font-medium">ISO Certified Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">5-Star Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Fast Turnaround</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Expert Team</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">500+ Happy Clients</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Announcement */}
      {!isScrolled && (
        <div className="md:hidden border-t border-border/50 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4 py-2 text-xs">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-green-600" />
                <span>ISO Certified</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>5-Star Service</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-blue-600" />
                <span>Fast Turnaround</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export function HeroSection() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' stroke='white' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M30 30m-15-15l30 30M45 15l-30 30M30 45l15-15M15 15l30 30'/%3e%3c/svg%3e")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Status Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Open for Business
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Clock className="w-3 h-3 mr-1" />
              8 AM - 6 PM
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <MapPin className="w-3 h-3 mr-1" />
              Nairobi, Kenya
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Professional
            <span className="block text-yellow-300">Printing Solutions</span>
            <span className="block">for Your Business</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-primary-foreground/90 leading-relaxed max-w-3xl mx-auto mb-8">
            High-quality printing services with fast turnaround times. 
            From business cards to large format printing, we bring your vision to life.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">500+</div>
              <div className="text-sm text-primary-foreground/80">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">10+</div>
              <div className="text-sm text-primary-foreground/80">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">24h</div>
              <div className="text-sm text-primary-foreground/80">Turnaround Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">100%</div>
              <div className="text-sm text-primary-foreground/80">Satisfaction</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 transition-colors" asChild>
              <Link href="/contact">
                <Zap className="mr-2 h-4 w-4" />
                Get Instant Quote
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 transition-colors" asChild>
              <Link href="/portfolio">
                <Eye className="mr-2 h-4 w-4" />
                View Our Work
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm text-primary-foreground/80">Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-primary-foreground/80">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-primary-foreground/80">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
