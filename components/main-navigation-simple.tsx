"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, ShoppingBag, Package, Users } from "lucide-react"

export function MainNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">Brandson Media</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/services" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Services
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/portfolio" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Portfolio
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/services" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Services
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/portfolio" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Portfolio
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
