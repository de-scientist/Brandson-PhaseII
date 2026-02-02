import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Package,
  Users,
  Heart,
  MessageCircle,
  Star,
  ChevronRight,
  TrendingUp,
  Zap,
  ArrowRight,
  ExternalLink,
  FileText,
  ShieldCheck,
  Award,
  Eye
} from "lucide-react"

export function EnhancedFooter() {
  const currentYear = 2026

  const quickLinks = [
    { title: "Services", href: "/services", icon: <Package className="h-4 w-4" /> },
    { title: "Portfolio", href: "/portfolio", icon: <Eye className="h-4 w-4" /> },
    { title: "About", href: "/about", icon: <Users className="h-4 w-4" /> },
    { title: "Contact", href: "/contact", icon: <MessageCircle className="h-4 w-4" /> },
    { title: "Blog", href: "/blog", icon: <FileText className="h-4 w-4" /> },
    { title: "Testimonials", href: "/testimonials", icon: <Star className="h-4 w-4" /> },
  ]

  const services = [
    { name: "Business Cards", href: "/services?category=business-cards" },
    { name: "Brochures", href: "/services?category=brochures" },
    { name: "Banners", href: "/services?category=banners" },
    { name: "Signage", href: "/services?category=signage" },
    { name: "Large Format", href: "/services?category=large-format" },
    { name: "UV Printing", href: "/services?category=uv-printing" },
    { name: "Embroidery", href: "/services?category=embroidery" },
    { name: "Promotional Items", href: "/services?category=promotional" },
  ]

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com/brandsonmedia",
      icon: <Facebook className="h-5 w-5" />,
      color: "hover:text-blue-600"
    },
    {
      name: "Twitter",
      href: "https://twitter.com/brandsonmedia",
      icon: <Twitter className="h-5 w-5" />,
      color: "hover:text-blue-400"
    },
    {
      name: "Instagram",
      href: "https://instagram.com/brandsonmedia",
      icon: <Instagram className="h-5 w-5" />,
      color: "hover:text-pink-600"
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/brandson-media",
      icon: <Linkedin className="h-5 w-5" />,
      color: "hover:text-blue-700"
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@brandsonmedia",
      icon: <Youtube className="h-5 w-5" />,
      color: "hover:text-red-600"
    },
  ]

  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Brandson Media</h3>
                <p className="text-sm text-muted-foreground">Professional Printing Solutions</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted partner for high-quality printing services in Kenya. 
              We deliver excellence with fast turnaround times and competitive pricing.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                <ShieldCheck className="w-3 h-3 mr-1" />
                ISO Certified
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Award className="w-3 h-3 mr-1" />
                5-Star Rated
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                Fast Delivery
              </Badge>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.icon}
                    <span>{link.title}</span>
                    <ChevronRight className="h-3 w-3 ml-auto" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Our Services</h4>
            <ul className="grid grid-cols-2 gap-2">
              {services.map((service) => (
                <li key={service.href}>
                  <Link 
                    href={service.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Nairobi, Kenya</p>
                  <p>Westlands, Kabete Road</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">+254 701 869821</p>
                  <p>Mon-Fri: 8AM-6PM</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">brandsonmedia@gmail.com</p>
                  <p>24/7 Support</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button className="w-full" asChild>
              <Link href="/contact">
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Message
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground text-center md:text-left">
              <p>&copy; {currentYear} Brandson Media. All rights reserved.</p>
              <p className="text-xs mt-1">
                Professional printing services in Kenya | ISO Certified Quality
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground hidden md:block">Follow us:</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-muted-foreground hover:text-foreground transition-colors ${social.color}`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/sitemap" className="text-muted-foreground hover:text-foreground transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold">Ready to Start Your Project?</h3>
              <p className="text-sm text-primary-foreground/90 mt-1">
                Get a free quote and let us bring your vision to life
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" asChild>
                <Link href="/contact">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Us
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/contact">
                  <Zap className="mr-2 h-4 w-4" />
                  Get Quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
