import { NextResponse } from "next/server"
import { 
  mockProducts, 
  productCategories, 
  filterProducts, 
  getFeaturedProducts, 
  getNewProducts 
} from "@/lib/database/products"

// GET /api/products - Get all products with filtering and sorting
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Parse query parameters
    const category = searchParams.get('category') || undefined
    const subcategory = searchParams.get('subcategory') || undefined
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined
    const sortBy = searchParams.get('sortBy') as any || undefined
    const featured = searchParams.get('featured') === 'true'
    const isNew = searchParams.get('new') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const search = searchParams.get('search') || undefined

    let products = mockProducts

    // Apply featured/new filters
    if (featured) {
      products = getFeaturedProducts()
    } else if (isNew) {
      products = getNewProducts()
    }

    // Apply search filter
    if (search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      )
    }

    // Apply other filters
    const priceRange = minPrice && maxPrice ? [minPrice, maxPrice] as [number, number] : undefined
    products = filterProducts(products, category, subcategory, priceRange, sortBy)

    // Apply limit
    if (limit) {
      products = products.slice(0, limit)
    }

    return NextResponse.json({
      success: true,
      data: products,
      total: products.length,
      categories: productCategories
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products'
    }, { status: 500 })
  }
}

// POST /api/products - Create new product (admin only)
export async function POST(req: Request) {
  try {
    const productData = await req.json()
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'category', 'basePrice', 'variants']
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 })
      }
    }

    // Generate new product ID
    const newId = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const newProduct = {
      ...productData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 0,
      reviews: 0
    }

    // In a real app, you would save this to a database
    // mockProducts.push(newProduct)

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create product'
    }, { status: 500 })
  }
}
