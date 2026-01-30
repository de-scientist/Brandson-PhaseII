"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  Users,
  CreditCard,
  FileText,
  Upload,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Eye,
  Download,
  Filter,
  Search,
  Plus,
  Settings,
  Bell,
  LogOut,
  User,
  Shield,
  Zap,
  ArrowRight,
  Activity,
  DollarSign,
  ShoppingCart,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  Target,
  PieChart,
  LineChart,
  FileImage,
  Video,
  FileText as FileTextIcon,
  Folder,
  Grid3X3,
  List,
  SlidersHorizontal,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Download as DownloadIcon,
  ExternalLink,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  Menu,
  Home,
  ShoppingBag,
  Palette,
  MessageCircle,
  Share2,
  Heart,
  Bookmark,
  Tag,
  Hash,
  AlertTriangle,
  Info,
  HelpCircle,
} from "lucide-react"

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  totalFiles: number
  pendingOrders: number
  completedOrders: number
  totalProjects: number
  activeProjects: number
  recentActivity: ActivityItem[]
}

interface ActivityItem {
  id: string
  type: 'order' | 'user' | 'file' | 'payment' | 'system'
  title: string
  description: string
  timestamp: Date
  status: 'success' | 'warning' | 'error' | 'info'
  icon: React.ReactNode
}

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
  badge?: string
}

export function EnhancedDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchUserData()
    fetchDashboardStats()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const [ordersRes, usersRes, filesRes] = await Promise.all([
        fetch('/api/orders/stats'),
        fetch('/api/uploads?stats=true'),
        fetch('/api/portfolio?stats=true')
      ])

      const ordersData = ordersRes.ok ? await ordersRes.json() : { data: { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, completedOrders: 0 } }
      const filesData = filesRes.ok ? await filesRes.json() : { data: { totalFiles: 0 } }
      const portfolioData = usersRes.ok ? await usersRes.json() : { data: { totalProjects: 0, activeProjects: 0 } }

      const mockStats: DashboardStats = {
        totalOrders: ordersData.data?.totalOrders || 0,
        totalRevenue: ordersData.data?.totalRevenue || 0,
        totalUsers: 156,
        totalFiles: filesData.data?.totalFiles || 0,
        pendingOrders: ordersData.data?.pendingOrders || 0,
        completedOrders: ordersData.data?.completedOrders || 0,
        totalProjects: portfolioData.data?.totalProjects || 0,
        activeProjects: portfolioData.data?.activeProjects || 0,
        recentActivity: [
          {
            id: '1',
            type: 'order',
            title: 'New Order Received',
            description: 'Business Cards order from John Doe',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            status: 'success',
            icon: <ShoppingCart className="h-4 w-4" />
          },
          {
            id: '2',
            type: 'payment',
            title: 'Payment Completed',
            description: 'M-Pesa payment for order #1234',
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            status: 'success',
            icon: <CreditCard className="h-4 w-4" />
          },
          {
            id: '3',
            type: 'file',
            title: 'File Uploaded',
            description: 'Logo file uploaded by Jane Smith',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            status: 'info',
            icon: <Upload className="h-4 w-4" />
          },
          {
            id: '4',
            type: 'system',
            title: 'System Update',
            description: 'New features deployed successfully',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            status: 'info',
            icon: <Settings className="h-4 w-4" />
          }
        ]
      }

      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions: QuickAction[] = [
    {
      title: 'Create Order',
      description: 'Start a new printing order',
      icon: <Plus className="h-5 w-5" />,
      href: '/orders/create',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Upload Files',
      description: 'Upload print materials',
      icon: <Upload className="h-5 w-5" />,
      href: '/dashboard/files',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'View Orders',
      description: 'Manage your orders',
      icon: <Package className="h-5 w-5" />,
      href: '/dashboard/orders',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Get Quote',
      description: 'Request a price quote',
      icon: <FileText className="h-5 w-5" />,
      href: '/contact',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'error': return 'text-red-600 bg-red-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg">Brandson Media</span>
              </Link>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <Badge variant="secondary">{user?.role || 'Customer'}</Badge>
                <span>•</span>
                <span>{user?.name || 'Guest'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-48"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Guest'}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your printing business today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">+12%</span>
                  <span className="text-gray-600">from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">+8%</span>
                  <span className="text-gray-600">from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.activeProjects || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">+5%</span>
                  <span className="text-gray-600">from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Files Uploaded</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalFiles || 0}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileImage className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">+15%</span>
                  <span className="text-gray-600">from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your printing business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(activity.status)}`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Pending Orders</span>
                      <span className="text-sm font-bold text-gray-900">{stats?.pendingOrders || 0}</span>
                    </div>
                    <Progress value={(stats?.pendingOrders || 0) / (stats?.totalOrders || 1) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Completed Orders</span>
                      <span className="text-sm font-bold text-gray-900">{stats?.completedOrders || 0}</span>
                    </div>
                    <Progress value={(stats?.completedOrders || 0) / (stats?.totalOrders || 1) * 100} className="h-2" />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Projects</span>
                      <span className="text-sm font-bold text-gray-900">{stats?.totalProjects || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Users</span>
                      <span className="text-sm font-bold text-gray-900">{stats?.totalUsers || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Files Uploaded</span>
                      <span className="text-sm font-bold text-gray-900">{stats?.totalFiles || 0}</span>
                    </div>
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
