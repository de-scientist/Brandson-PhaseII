"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useEcommerceCart } from "@/contexts/ecommerce-cart-context"
import { Product, ProductCategory, ProductVariant } from "@/lib/database/products"
import {
  Search,
  ShoppingCart,
  Star,
  Heart,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  Package,
  Truck,
  Shield,
  Clock,
  TrendingUp,
  ArrowRight,
  Eye,
  Plus,
  Minus,
  X,
  CheckCircle,
  Phone
} from "lucide-react"

// Mock data - in real app this would come from API
const mockCategories: ProductCategory[] = [
  {
    id: "business-printing",
    name: "Business Printing",
    description: "Professional business cards, letterheads, envelopes and corporate stationery",
    image: "/business-cards-display.jpg",
    icon: "briefcase",
    subcategories: ["Business Cards", "Letterheads", "Envelopes"],
    productCount: 45,
    featured: true,
    order: 1
  },
  {
    id: "large-format",
    name: "Large Format Printing",
    description: "Banners, posters, signs, and large-scale promotional materials",
    image: "/large-format-banners.jpg",
    icon: "maximize",
    subcategories: ["Banners", "Posters", "Signage"],
    productCount: 32,
    featured: true,
    order: 2
  },
  {
    id: "promotional",
    name: "Promotional Products",
    description: "Branded merchandise, promotional items and corporate gifts",
    image: "/promotional-products.jpg",
    icon: "gift",
    subcategories: ["Branded Pens", "Mugs", "T-Shirts"],
    productCount: 67,
    featured: true,
    order: 3
  },
  {
    id: "stickers-labels",
    name: "Stickers & Labels",
    description: "Custom stickers, labels, decals and adhesive products",
    image: "/custom-stickers.jpg",
    icon: "tag",
    subcategories: ["Vinyl Stickers", "Paper Labels", "Window Decals"],
    productCount: 28,
    featured: false,
    order: 4
  },
  {
    id: "graphic-design",
    name: "Graphic Design Services",
    description: "Professional design services for logos, branding and marketing materials",
    image: "/design-services.jpg",
    icon: "palette",
    subcategories: ["Logo Design", "Brand Identity", "Marketing Materials"],
    productCount: 15,
    featured: false,
    order: 5
  }
]

const mockProducts: Product[] = [
  {
    id: "business-cards-standard",
    name: "Standard Business Cards",
    description: "Premium quality business cards printed on 350gsm cardstock with various finish options.",
    category: "business-printing",
    subcategory: "Business Cards",
    basePrice: 1500,
    images: ["/business-cards-standard.jpg", "/business-cards-showcase.jpg"],
    variants: [
      { id: "bc-100-gloss", name: "100 Cards - Glossy", price: 1500, sku: "BC-100-G", stock: 1000, attributes: { quantity: "100", finish: "Glossy" } },
      { id: "bc-250-gloss", name: "250 Cards - Glossy", price: 2500, sku: "BC-250-G", stock: 500, attributes: { quantity: "250", finish: "Glossy" } }
    ],
    features: ["Premium 350gsm cardstock", "Full color printing", "Various finishes"],
    specifications: { material: "350gsm Art Card", printing: "Full Color (CMYK)" },
    rating: 4.8,
    reviews: 124,
    isFeatured: true,
    minQuantity: 100,
    maxQuantity: 1000,
    turnaroundTime: "2-3 days",
    tags: ["business", "professional", "networking"],
    seo: { title: "", description: "", keywords: [] },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "pvc-banners",
    name: "PVC Banners",
    description: "Durable PVC banners for outdoor and indoor advertising. Weather-resistant and perfect for events.",
    category: "large-format",
    subcategory: "Banners",
    basePrice: 2500,
    images: ["/pvc-banners.jpg", "/banner-installation.jpg"],
    variants: [
      { id: "pb-2x1", name: "2ft x 1ft Banner", price: 2500, sku: "PB-2x1", stock: 100, attributes: { size: "2ft x 1ft" } },
      { id: "pb-4x2", name: "4ft x 2ft Banner", price: 4500, sku: "PB-4x2", stock: 100, attributes: { size: "4ft x 2ft" } }
    ],
    features: ["Weather resistant", "High quality print", "Durable material"],
    specifications: { material: "440gsm PVC Banner", printing: "High Resolution UV" },
    rating: 4.9,
    reviews: 156,
    isFeatured: true,
    minQuantity: 1,
    maxQuantity: 50,
    turnaroundTime: "2-3 days",
    tags: ["banners", "outdoor", "advertising"],
    seo: { title: "", description: "", keywords: [] },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "branded-tshirts",
    name: "Custom Branded T-Shirts",
    description: "High-quality branded t-shirts perfect for corporate events, team uniforms, and promotional giveaways.",
    category: "promotional",
    subcategory: "T-Shirts",
    basePrice: 800,
    images: ["/branded-tshirts.jpg", "/tshirt-colors.jpg"],
    variants: [
      { id: "bt-s-10", name: "10 T-Shirts - Size S", price: 8000, sku: "BT-S-10", stock: 200, attributes: { size: "S", color: "White" } },
      { id: "bt-m-10", name: "10 T-Shirts - Size M", price: 8000, sku: "BT-M-10", stock: 200, attributes: { size: "M", color: "White" } }
    ],
    features: ["100% cotton", "Various sizes", "Durable print"],
    specifications: { material: "100% Cotton", printing: "Screen Printing" },
    rating: 4.6,
    reviews: 203,
    isNew: true,
    minQuantity: 10,
    maxQuantity: 500,
    turnaroundTime: "5-7 days",
    tags: ["t-shirts", "promotional", "corporate"],
    seo: { title: "", description: "", keywords: [] },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  }
]

export default function StorePage() {
  const { cart, addToCart, isInCart, getItemQuantity } = useEcommerceCart()
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [categories, setCategories] = useState<ProductCategory[]>(mockCategories)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "rating" | "popularity" | "newest">("popularity")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return Math.min(...a.variants.map(v => v.price)) - Math.min(...b.variants.map(v => v.price))
      case "price-desc":
        return Math.min(...b.variants.map(v => v.price)) - Math.min(...a.variants.map(v => v.price))
      case "rating":
        return b.rating - a.rating
      case "popularity":
        return b.reviews - a.reviews
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })

  const handleAddToCart = (product: Product, variant: ProductVariant, qty: number = 1) => {
    addToCart(product, variant, qty)
    setSelectedProduct(null)
    setSelectedVariant(null)
    setQuantity(1)
  }

  const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Professional Printing Services
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              High-quality printing solutions for businesses and individuals. Fast delivery, competitive prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Browse Products
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Phone className="mr-2 h-5 w-5" />
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-600 mt-2">Find exactly what you need from our wide range of printing services</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={`/store/category/${category.id}`}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-500">
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {category.productCount} Products
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600 mt-2">Our most popular printing services</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popularity">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {sortedProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                {viewMode === "grid" ? (
                  // Grid View
                  <>
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product)
                            setSelectedVariant(product.variants[0])
                          }}
                          className="bg-white/90 hover:bg-white"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Quick View
                        </Button>
                      </div>
                      {product.isNew && (
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          New
                        </Badge>
                      )}
                      {product.isFeatured && (
                        <Badge className="absolute top-2 left-2 bg-orange-500">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <Badge variant="outline" className="text-xs">
                          {product.subcategory}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({product.reviews})
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm text-gray-500">From</p>
                          <p className="text-lg font-bold text-green-600">
                            {formatPrice(Math.min(...product.variants.map(v => v.price)))}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product)
                            setSelectedVariant(product.variants[0])
                          }}
                          disabled={isInCart(product.id)}
                        >
                          {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                        </Button>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  // List View
                  <div className="flex">
                    <div className="w-32 h-32 flex-shrink-0 bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {product.subcategory}
                            </Badge>
                            {product.isNew && <Badge className="bg-green-500 text-xs">New</Badge>}
                            {product.isFeatured && <Badge className="bg-orange-500 text-xs">Featured</Badge>}
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(product.rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span>({product.reviews})</span>
                            </div>
                            <span>⏱ {product.turnaroundTime}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">From</p>
                              <p className="text-lg font-bold text-green-600">
                                {formatPrice(Math.min(...product.variants.map(v => v.price)))}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedProduct(product)
                                  setSelectedVariant(product.variants[0])
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedProduct(product)
                                  setSelectedVariant(product.variants[0])
                                }}
                                disabled={isInCart(product.id)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                {isInCart(product.id) ? 'In Cart' : 'Add'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
            <p className="text-gray-600 mt-2">We're committed to providing the best printing services</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">High-quality materials and printing technology</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Quick turnaround and reliable shipping</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-600 text-sm">100% satisfaction guarantee on all orders</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Competitive Prices</h3>
              <p className="text-gray-600 text-sm">Best prices without compromising quality</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && selectedVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Images */}
                <div>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <Badge variant="outline">{selectedProduct.subcategory}</Badge>
                    {selectedProduct.isNew && <Badge className="ml-2 bg-green-500">New</Badge>}
                    {selectedProduct.isFeatured && <Badge className="ml-2 bg-orange-500">Featured</Badge>}
                  </div>

                  <div>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(selectedProduct.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({selectedProduct.reviews} reviews)
                    </span>
                  </div>

                  {/* Variant Selection */}
                  <div>
                    <h3 className="font-semibold mb-2">Select Option:</h3>
                    <div className="space-y-2">
                      {selectedProduct.variants.map((variant) => (
                        <label
                          key={variant.id}
                          className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="variant"
                              value={variant.id}
                              checked={selectedVariant.id === variant.id}
                              onChange={(e) => setSelectedVariant(variant)}
                              className="mr-3"
                            />
                            <div>
                              <p className="font-medium">{variant.name}</p>
                              <p className="text-sm text-gray-500">SKU: {variant.sku}</p>
                            </div>
                          </div>
                          <p className="font-bold text-green-600">
                            {formatPrice(variant.price)}
                          </p>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <h3 className="font-semibold mb-2">Quantity:</h3>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center"
                        min={1}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="font-semibold mb-2">Features:</h3>
                    <ul className="space-y-1">
                      {selectedProduct.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Turnaround: {selectedProduct.turnaroundTime}</span>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => handleAddToCart(selectedProduct, selectedVariant, quantity)}
                    disabled={isInCart(selectedProduct.id, selectedVariant.id)}
                    className="w-full text-lg py-6"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isInCart(selectedProduct.id, selectedVariant.id)
                      ? 'In Cart'
                      : `Add to Cart - ${formatPrice(selectedVariant.price * quantity)}`
                    }
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
