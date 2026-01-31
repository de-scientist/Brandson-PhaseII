"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { 
  Menu, 
  X, 
  Home, 
  ShoppingBag, 
  FileText, 
  Users, 
  Settings, 
  Phone, 
  Mail, 
  ChevronDown,
  User,
  LogOut,
  Package,
  CreditCard,
  Upload,
  BarChart3,
  Calendar,
  Filter,
  Eye,
  Download,
  Shield,
  Palette,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  UserPlus
} from "lucide-react"
import { getAuthUser } from "@/lib/auth"

interface NavigationItem {
  title: string
  href: string
  icon: React.ReactNode
  badge?: string
  description?: string
  children?: NavigationItem[]
  requiresAuth?: boolean
  adminOnly?: boolean
}

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsClient(true)
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.data)
        }
      }
    } catch (error) {
      // User not authenticated
    }
  }

  const handleLogout = async () => {
    try {
      // Clear any stored auth data
      setUser(null)
      // Redirect to home
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navigationItems: NavigationItem[] = [
    {
      title: "Home",
      href: "/",
      icon: <Home className="h-4 w-4" />,
      description: "Return to homepage"
    },
    {
      title: "Services",
      href: "/services",
      icon: <ShoppingBag className="h-4 w-4" />,
      description: "Browse our printing services",
      badge: "8 Services"
    },
    {
      title: "Portfolio",
      href: "/portfolio",
      icon: <Palette className="h-4 w-4" />,
      description: "View our work samples",
      children: [
        {
          title: "Standard Portfolio",
          href: "/portfolio",
          icon: <Eye className="h-4 w-4" />,
          description: "Browse our portfolio"
        },
        {
          title: "Enhanced Portfolio",
          href: "/portfolio/enhanced",
          icon: <Filter className="h-4 w-4" />,
          description: "Advanced filtering and search"
        }
      ]
    },
    {
      title: "Customer Portal",
      href: "/dashboard",
      icon: <Users className="h-4 w-4" />,
      description: "Access your account",
      requiresAuth: true,
      children: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "View your dashboard"
        },
        {
          title: "My Orders",
          href: "/dashboard/orders",
          icon: <Package className="h-4 w-4" />,
          description: "Track your orders"
        },
        {
          title: "File Manager",
          href: "/dashboard/files",
          icon: <Upload className="h-4 w-4" />,
          description: "Manage your files"
        }
      ]
    },
    {
      title: "Quick Actions",
      href: "#",
      icon: <Zap className="h-4 w-4" />,
      description: "Quick access to common tasks",
      children: [
        {
          title: "Get Quote",
          href: "/contact",
          icon: <FileText className="h-4 w-4" />,
          description: "Request a quote"
        },
        {
          title: "Upload Files",
          href: "/dashboard/files",
          icon: <Upload className="h-4 w-4" />,
          description: "Upload print materials",
          requiresAuth: true
        },
        {
          title: "Track Order",
          href: "/dashboard/orders",
          icon: <Eye className="h-4 w-4" />,
          description: "Track your order status",
          requiresAuth: true
        }
      ]
    }
  ]

  const adminItems: NavigationItem[] = [
    {
      title: "Admin Panel",
      href: "#",
      icon: <Settings className="h-4 w-4" />,
      description: "Administrative functions",
      adminOnly: true,
      children: [
        {
          title: "Order Management",
          href: "/admin/orders",
          icon: <Package className="h-4 w-4" />,
          description: "Manage all orders"
        },
        {
          title: "Customer Management",
          href: "/admin/customers",
          icon: <Users className="h-4 w-4" />,
          description: "Manage customers"
        },
        {
          title: "Media Library",
          href: "/admin/media",
          icon: <Upload className="h-4 w-4" />,
          description: "Manage media assets"
        },
        {
          title: "Content Management",
          href: "/admin/cms",
          icon: <FileText className="h-4 w-4" />,
          description: "Manage content"
        },
        {
          title: "Analytics",
          href: "/admin/analytics",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "View analytics"
        }
      ]
    }
  ]

  const filteredItems = navigationItems.filter(item => {
    if (item.adminOnly && (!user || user.role !== 'admin')) return false
    if (item.requiresAuth && !user) return false
    return true
  })

  const filteredAdminItems = adminItems.filter(item => {
    if (item.adminOnly && (!user || user.role !== 'admin')) return false
    if (item.requiresAuth && !user) return false
    return true
  })

  const renderNavigationItems = (items: NavigationItem[], level: number = 0) => {
    return items.map((item) => {
      const isActive = pathname === item.href
      const hasChildren = item.children && item.children.length > 0

      if (hasChildren) {
        return (
          <div key={item.href} className="space-y-1">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-medium">{item.title}</h4>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </div>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </div>
            <div className="ml-4 space-y-1">
              {renderNavigationItems(item.children!, level + 1)}
            </div>
          </div>
        )
      }

      return (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors ${
            isActive ? 'bg-primary text-primary-foreground' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md ${
              isActive ? 'bg-primary-foreground text-primary' : 'bg-primary/10 text-primary'
            }`}>
              {item.icon}
            </div>
            <div>
              <h4 className="text-sm font-medium">{item.title}</h4>
              {item.description && (
                <p className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {item.description}
                </p>
              )}
            </div>
          </div>
          {item.badge && (
            <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
      )
    })
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href
          const hasChildren = item.children && item.children.length > 0

          if (hasChildren) {
            return (
              <div key={item.href} className="relative group">
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  {item.icon}
                  <span>{item.title}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    {item.children?.map((child) => {
                      const isChildActive = pathname === child.href
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors ${
                            isChildActive ? 'bg-muted' : ''
                          }`}
                        >
                          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded text-xs">
                            {child.icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{child.title}</p>
                            {child.description && (
                              <p className="text-xs text-muted-foreground">{child.description}</p>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          }

          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "default" : "ghost"}
              className="flex items-center gap-2"
            >
              <Link href={item.href} className="flex items-center gap-2">
                {item.icon}
                <span>{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </Button>
          )
        })}
      </nav>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-primary-foreground" />
              </div>
              Brandson Media
            </SheetTitle>
          </SheetHeader>
          
          <div className="px-4 py-6 space-y-6">
            {/* User Status */}
            {isClient && (
              <div className="p-4 bg-muted rounded-lg">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center">
                      <Shield className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">Not logged in</p>
                      <p className="text-xs text-muted-foreground">Sign in to access your account</p>
                    </div>
                    <div className="space-y-2">
                      <Button asChild className="w-full">
                        <Link href="/login">
                          <User className="h-4 w-4 mr-2" />
                          Sign In
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/register">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Register
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Items */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Navigation</h3>
              {renderNavigationItems(filteredItems)}
            </div>

            {/* Admin Panel */}
            {user && user.role === 'admin' && filteredAdminItems.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Admin Panel</h3>
                {renderNavigationItems(filteredAdminItems)}
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/contact" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Get Quote
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="tel:+254701869821" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Call Us
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="mailto:brandsonmedia@gmail.com" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
