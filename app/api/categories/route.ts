import { NextResponse } from "next/server"
import { productCategories } from "@/lib/database/products"

// GET /api/categories - Get all product categories
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: productCategories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch categories'
    }, { status: 500 })
  }
}
