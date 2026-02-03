// Product database schema and mock data
export interface ProductVariant {
  id: string
  name: string
  price: number
  sku: string
  stock: number
  attributes: Record<string, string> // e.g., { size: "A4", finish: "Glossy" }
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  subcategory: string
  basePrice: number
  images: string[]
  variants: ProductVariant[]
  features: string[]
  specifications: Record<string, any>
  rating: number
  reviews: number
  isNew?: boolean
  isFeatured?: boolean
  minQuantity: number
  maxQuantity: number
  turnaroundTime: string
  tags: string[]
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface ProductCategory {
  id: string
  name: string
  description: string
  image: string
  icon: string
  subcategories: string[]
  productCount: number
  featured: boolean
  order: number
}

// Mock product data
export const productCategories: ProductCategory[] = [
  {
    id: "business-printing",
    name: "Business Printing",
    description: "Professional business cards, letterheads, envelopes and corporate stationery",
    image: "/business-cards-display.jpg",
    icon: "briefcase",
    subcategories: ["Business Cards", "Letterheads", "Envelopes", "Compliment Slips", "Folders"],
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
    subcategories: ["Banners", "Posters", "Signage", "Vehicle Graphics", "Canvas Prints"],
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
    subcategories: ["Branded Pens", "Mugs", "T-Shirts", "Bags", "USB Drives", "Keychains"],
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
    subcategories: ["Vinyl Stickers", "Paper Labels", "Window Decals", "Bumper Stickers", "Product Labels"],
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
    subcategories: ["Logo Design", "Brand Identity", "Marketing Materials", "Social Media Graphics", "Packaging Design"],
    productCount: 15,
    featured: false,
    order: 5
  }
]

export const mockProducts: Product[] = [
  // Business Printing Products
  {
    id: "business-cards-standard",
    name: "Standard Business Cards",
    description: "Premium quality business cards printed on 350gsm cardstock with various finish options. Perfect for networking and professional presentations.",
    category: "business-printing",
    subcategory: "Business Cards",
    basePrice: 1500,
    images: [
      "/business-cards-standard.jpg",
      "/business-cards-showcase.jpg",
      "/business-cards-finishes.jpg"
    ],
    variants: [
      { id: "bc-100-gloss", name: "100 Cards - Glossy", price: 1500, sku: "BC-100-G", stock: 1000, attributes: { quantity: "100", finish: "Glossy", size: "90x50mm" } },
      { id: "bc-100-matt", name: "100 Cards - Matt", price: 1600, sku: "BC-100-M", stock: 1000, attributes: { quantity: "100", finish: "Matt", size: "90x50mm" } },
      { id: "bc-250-gloss", name: "250 Cards - Glossy", price: 2500, sku: "BC-250-G", stock: 500, attributes: { quantity: "250", finish: "Glossy", size: "90x50mm" } },
      { id: "bc-250-matt", name: "250 Cards - Matt", price: 2700, sku: "BC-250-M", stock: 500, attributes: { quantity: "250", finish: "Matt", size: "90x50mm" } },
      { id: "bc-500-gloss", name: "500 Cards - Glossy", price: 4000, sku: "BC-500-G", stock: 300, attributes: { quantity: "500", finish: "Glossy", size: "90x50mm" } },
      { id: "bc-500-matt", name: "500 Cards - Matt", price: 4300, sku: "BC-500-M", stock: 300, attributes: { quantity: "500", finish: "Matt", size: "90x50mm" } }
    ],
    features: ["Premium 350gsm cardstock", "Full color printing", "Various finishes", "Fast turnaround", "Free delivery"],
    specifications: {
      material: "350gsm Art Card",
      printing: "Full Color (CMYK)",
      finishing: "Glossy or Matt",
      size: "Standard 90x50mm",
      turnaround: "2-3 working days"
    },
    rating: 4.8,
    reviews: 124,
    isFeatured: true,
    minQuantity: 100,
    maxQuantity: 1000,
    turnaroundTime: "2-3 days",
    tags: ["business", "professional", "networking", "premium"],
    seo: {
      title: "Standard Business Cards - Premium Quality Printing",
      description: "Order professional business cards online. Premium quality, fast delivery, various finishes available.",
      keywords: ["business cards", "professional printing", "networking cards", "corporate stationery"]
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "letterheads-a4",
    name: "A4 Letterheads",
    description: "Professional A4 letterheads printed on premium paper. Perfect for official correspondence and business communications.",
    category: "business-printing",
    subcategory: "Letterheads",
    basePrice: 2800,
    images: [
      "/letterheads-a4.jpg",
      "/letterheads-design.jpg",
      "/letterheads-paper.jpg"
    ],
    variants: [
      { id: "lh-100-80gsm", name: "100 Sheets - 80gsm", price: 2800, sku: "LH-100-80", stock: 500, attributes: { quantity: "100", paper: "80gsm", size: "A4" } },
      { id: "lh-100-120gsm", name: "100 Sheets - 120gsm", price: 3500, sku: "LH-100-120", stock: 500, attributes: { quantity: "100", paper: "120gsm", size: "A4" } },
      { id: "lh-250-80gsm", name: "250 Sheets - 80gsm", price: 5500, sku: "LH-250-80", stock: 300, attributes: { quantity: "250", paper: "80gsm", size: "A4" } },
      { id: "lh-250-120gsm", name: "250 Sheets - 120gsm", price: 7000, sku: "LH-250-120", stock: 300, attributes: { quantity: "250", paper: "120gsm", size: "A4" } }
    ],
    features: ["Premium quality paper", "Professional appearance", "Custom design", "Bulk discounts", "Fast delivery"],
    specifications: {
      material: "80gsm or 120gsm Bond Paper",
      printing: "Full Color (CMYK)",
      size: "A4 (210x297mm)",
      turnaround: "3-4 working days"
    },
    rating: 4.7,
    reviews: 89,
    minQuantity: 100,
    maxQuantity: 1000,
    turnaroundTime: "3-4 days",
    tags: ["letterheads", "business", "official", "corporate"],
    seo: {
      title: "A4 Letterheads - Professional Business Printing",
      description: "Custom A4 letterheads for your business. Premium quality paper, professional printing.",
      keywords: ["letterheads", "A4 printing", "business stationery", "official correspondence"]
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  
  // Large Format Products
  {
    id: "pvc-banners",
    name: "PVC Banners",
    description: "Durable PVC banners for outdoor and indoor advertising. Weather-resistant and perfect for events, promotions, and business signage.",
    category: "large-format",
    subcategory: "Banners",
    basePrice: 2500,
    images: [
      "/pvc-banners.jpg",
      "/banner-installation.jpg",
      "/banner-designs.jpg"
    ],
    variants: [
      { id: "pb-2x1", name: "2ft x 1ft Banner", price: 2500, sku: "PB-2x1", stock: 100, attributes: { size: "2ft x 1ft", material: "PVC", finishing: "Hemmed" } },
      { id: "pb-4x2", name: "4ft x 2ft Banner", price: 4500, sku: "PB-4x2", stock: 100, attributes: { size: "4ft x 2ft", material: "PVC", finishing: "Hemmed" } },
      { id: "pb-6x3", name: "6ft x 3ft Banner", price: 6500, sku: "PB-6x3", stock: 100, attributes: { size: "6ft x 3ft", material: "PVC", finishing: "Hemmed" } },
      { id: "pb-8x4", name: "8ft x 4ft Banner", price: 8500, sku: "PB-8x4", stock: 50, attributes: { size: "8ft x 4ft", material: "PVC", finishing: "Hemmed & Eyelets" } }
    ],
    features: ["Weather resistant", "High quality print", "Durable material", "Custom sizes", "Eyelets available"],
    specifications: {
      material: "440gsm PVC Banner",
      printing: "High Resolution UV Printing",
      finishing: "Hemmed edges with eyelets",
      durability: "Outdoor 6+ months",
      turnaround: "2-3 working days"
    },
    rating: 4.9,
    reviews: 156,
    isFeatured: true,
    minQuantity: 1,
    maxQuantity: 50,
    turnaroundTime: "2-3 days",
    tags: ["banners", "outdoor", "advertising", "events", "durable"],
    seo: {
      title: "PVC Banners - Outdoor & Indoor Advertising",
      description: "Custom PVC banners for all your advertising needs. Weather-resistant, durable, high-quality printing.",
      keywords: ["PVC banners", "outdoor advertising", "event banners", "business signage"]
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },

  // Promotional Products
  {
    id: "branded-tshirts",
    name: "Custom Branded T-Shirts",
    description: "High-quality branded t-shirts perfect for corporate events, team uniforms, and promotional giveaways. Various colors and sizes available.",
    category: "promotional",
    subcategory: "T-Shirts",
    basePrice: 800,
    images: [
      "/branded-tshirts.jpg",
      "/tshirt-colors.jpg",
      "/tshirt-printing.jpg"
    ],
    variants: [
      { id: "bt-s-10", name: "10 T-Shirts - Size S", price: 8000, sku: "BT-S-10", stock: 200, attributes: { quantity: "10", size: "S", color: "White", print: "Screen Print" } },
      { id: "bt-m-10", name: "10 T-Shirts - Size M", price: 8000, sku: "BT-M-10", stock: 200, attributes: { quantity: "10", size: "M", color: "White", print: "Screen Print" } },
      { id: "bt-l-10", name: "10 T-Shirts - Size L", price: 8000, sku: "BT-L-10", stock: 200, attributes: { quantity: "10", size: "L", color: "White", print: "Screen Print" } },
      { id: "bt-xl-10", name: "10 T-Shirts - Size XL", price: 8000, sku: "BT-XL-10", stock: 200, attributes: { quantity: "10", size: "XL", color: "White", print: "Screen Print" } },
      { id: "bt-xxl-10", name: "10 T-Shirts - Size XXL", price: 8500, sku: "BT-XXL-10", stock: 100, attributes: { quantity: "10", size: "XXL", color: "White", print: "Screen Print" } }
    ],
    features: ["100% cotton", "Various sizes", "Multiple colors", "Durable print", "Bulk discounts"],
    specifications: {
      material: "100% Cotton",
      printing: "Screen Printing or DTG",
      sizes: "S, M, L, XL, XXL",
      colors: "White, Black, Navy, Red, Blue",
      turnaround: "5-7 working days"
    },
    rating: 4.6,
    reviews: 203,
    isNew: true,
    minQuantity: 10,
    maxQuantity: 500,
    turnaroundTime: "5-7 days",
    tags: ["t-shirts", "promotional", "corporate", "events", "apparel"],
    seo: {
      title: "Custom Branded T-Shirts - Corporate & Promotional",
      description: "Order custom branded t-shirts for your business. Quality printing, various sizes and colors.",
      keywords: ["branded t-shirts", "promotional apparel", "corporate uniforms", "custom printing"]
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },

  // Stickers & Labels
  {
    id: "vinyl-stickers",
    name: "Custom Vinyl Stickers",
    description: "High-quality custom vinyl stickers perfect for branding, promotions, and personal use. Waterproof and durable for indoor/outdoor use.",
    category: "stickers-labels",
    subcategory: "Vinyl Stickers",
    basePrice: 1200,
    images: [
      "/vinyl-stickers.jpg",
      "/sticker-designs.jpg",
      "/sticker-finishes.jpg"
    ],
    variants: [
      { id: "vs-50-round", name: "50 Round Stickers - 2\"", price: 1200, sku: "VS-50-R2", stock: 500, attributes: { quantity: "50", shape: "Round", size: "2 inch", finish: "Glossy" } },
      { id: "vs-50-square", name: "50 Square Stickers - 2\"", price: 1200, sku: "VS-50-S2", stock: 500, attributes: { quantity: "50", shape: "Square", size: "2 inch", finish: "Glossy" } },
      { id: "vs-100-round", name: "100 Round Stickers - 2\"", price: 2000, sku: "VS-100-R2", stock: 300, attributes: { quantity: "100", shape: "Round", size: "2 inch", finish: "Glossy" } },
      { id: "vs-100-square", name: "100 Square Stickers - 2\"", price: 2000, sku: "VS-100-S2", stock: 300, attributes: { quantity: "100", shape: "Square", size: "2 inch", finish: "Glossy" } }
    ],
    features: ["Waterproof", "Durable vinyl", "Custom shapes", "Full color", "Easy to apply"],
    specifications: {
      material: "Premium Vinyl",
      printing: "Full Color Digital Printing",
      finish: "Glossy or Matt",
      durability: "3-5 years outdoor",
      turnaround: "2-3 working days"
    },
    rating: 4.7,
    reviews: 167,
    minQuantity: 50,
    maxQuantity: 1000,
    turnaroundTime: "2-3 days",
    tags: ["stickers", "vinyl", "promotional", "waterproof", "custom"],
    seo: {
      title: "Custom Vinyl Stickers - Waterproof & Durable",
      description: "Order custom vinyl stickers online. Waterproof, durable, perfect for branding and promotions.",
      keywords: ["vinyl stickers", "custom stickers", "promotional stickers", "waterproof labels"]
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },

  // Graphic Design Services
  {
    id: "logo-design-basic",
    name: "Basic Logo Design Package",
    description: "Professional logo design service including initial concepts, revisions, and final files. Perfect for startups and small businesses.",
    category: "graphic-design",
    subcategory: "Logo Design",
    basePrice: 15000,
    images: [
      "/logo-design-portfolio.jpg",
      "/logo-process.jpg",
      "/logo-deliverables.jpg"
    ],
    variants: [
      { id: "ld-basic", name: "Basic Logo Package", price: 15000, sku: "LD-BASIC", stock: 50, attributes: { concepts: "3", revisions: "2", format: "Standard Files" } },
      { id: "ld-professional", name: "Professional Logo Package", price: 25000, sku: "LD-PRO", stock: 30, attributes: { concepts: "5", revisions: "3", format: "All Files" } },
      { id: "ld-premium", name: "Premium Logo Package", price: 40000, sku: "LD-PREMIUM", stock: 20, attributes: { concepts: "8", revisions: "Unlimited", format: "All Files + Brand Guide" } }
    ],
    features: ["Professional designers", "Multiple concepts", "Unlimited revisions (premium)", "All file formats", "Brand guidelines"],
    specifications: {
      concepts: "3-8 initial designs",
      revisions: "2-Unlimited based on package",
      deliverables: "AI, EPS, PDF, PNG, JPG",
      timeline: "5-10 working days",
      support: "1 month post-delivery"
    },
    rating: 4.9,
    reviews: 78,
    isFeatured: true,
    minQuantity: 1,
    maxQuantity: 1,
    turnaroundTime: "5-10 days",
    tags: ["logo design", "branding", "professional", "custom design"],
    seo: {
      title: "Professional Logo Design Services - Custom Brand Identity",
      description: "Get a professional logo design for your business. Multiple concepts, revisions, and all file formats included.",
      keywords: ["logo design", "brand identity", "custom logo", "professional design", "business branding"]
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  }
]

// Product filtering and sorting functions
export const filterProducts = (
  products: Product[],
  category?: string,
  subcategory?: string,
  priceRange?: [number, number],
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'popularity' | 'newest'
): Product[] => {
  let filtered = products

  // Filter by category
  if (category) {
    filtered = filtered.filter(p => p.category === category)
  }

  // Filter by subcategory
  if (subcategory) {
    filtered = filtered.filter(p => p.subcategory === subcategory)
  }

  // Filter by price range
  if (priceRange) {
    filtered = filtered.filter(p => {
      const minPrice = Math.min(...p.variants.map(v => v.price))
      return minPrice >= priceRange[0] && minPrice <= priceRange[1]
    })
  }

  // Sort products
  switch (sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => Math.min(...a.variants.map(v => v.price)) - Math.min(...b.variants.map(v => v.price)))
      break
    case 'price-desc':
      filtered.sort((a, b) => Math.min(...b.variants.map(v => v.price)) - Math.min(...a.variants.map(v => v.price)))
      break
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'popularity':
      filtered.sort((a, b) => b.reviews - a.reviews)
      break
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
  }

  return filtered
}

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(p => p.id === id)
}

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(p => p.category === category)
}

export const getFeaturedProducts = (limit?: number): Product[] => {
  const featured = mockProducts.filter(p => p.isFeatured)
  return limit ? featured.slice(0, limit) : featured
}

export const getNewProducts = (limit?: number): Product[] => {
  const newProducts = mockProducts.filter(p => p.isNew)
  return limit ? newProducts.slice(0, limit) : newProducts
}
