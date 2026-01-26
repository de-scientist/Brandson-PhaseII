"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Phone, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Catalogue", href: "/catalogue" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Blog", href: "/blog" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="bg-dark-section-bg text-dark-section-fg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="hidden sm:flex items-center gap-6">
              <a
                href="mailto:brandsonmedia@gmail.com"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                brandsonmedia@gmail.com
              </a>
              <a href="tel:+254701869821" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +254 701 869821
              </a>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <a
                href="mailto:brandsonmedia@gmail.com"
                className="hover:text-primary transition-colors"
                aria-label="Email us"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a href="tel:+254701869821" className="hover:text-primary transition-colors" aria-label="Call us">
                <Phone className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/254701869821"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors"
                aria-label="WhatsApp us"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/brand.png"
                alt="Brandson Media Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Button asChild className="bg-primary hover:bg-primary/90">
              <a href="https://wa.me/254701869821" target="_blank" rel="noopener noreferrer">
                Get a Quote
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button type="button" className="p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild className="bg-primary hover:bg-primary/90 w-full">
                <a href="https://wa.me/254701869821" target="_blank" rel="noopener noreferrer">
                  Get a Quote
                </a>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
