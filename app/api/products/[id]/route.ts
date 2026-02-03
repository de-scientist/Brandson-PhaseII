import { NextResponse } from "next/server"
import { getProductById } from "@/lib/database/products"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/products/[id] - Get single product by ID
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const product = getProductById(id)
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch product'
    }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update product (admin only)
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const updateData = await req.json()
    
    const product = getProductById(id)
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    // In a real app, you would update this in a database
    const updatedProduct = {
      ...product,
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update product'
    }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const product = getProductById(id)
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    // In a real app, you would delete this from a database
    // const index = mockProducts.findIndex(p => p.id === id)
    // if (index > -1) {
    //   mockProducts.splice(index, 1)
    // }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete product'
    }, { status: 500 })
  }
}
