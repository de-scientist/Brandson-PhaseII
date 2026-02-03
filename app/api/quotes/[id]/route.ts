import { NextResponse } from "next/server"
import { getQuoteById, updateQuoteStatus, convertQuoteToOrder } from "@/lib/database/quotes"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/quotes/[id] - Get single quote by ID
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const quote = getQuoteById(id)
    
    if (!quote) {
      return NextResponse.json({
        success: false,
        error: 'Quote not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: quote
    })
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch quote'
    }, { status: 500 })
  }
}

// PUT /api/quotes/[id] - Update quote status or convert to order
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const updateData = await req.json()
    
    const quote = getQuoteById(id)
    
    if (!quote) {
      return NextResponse.json({
        success: false,
        error: 'Quote not found'
      }, { status: 404 })
    }

    let updatedQuote

    // Handle status update
    if (updateData.status) {
      updatedQuote = updateQuoteStatus(id, updateData.status)
    }

    // Handle quote to order conversion
    if (updateData.action === 'convert' && updateData.orderId) {
      updatedQuote = convertQuoteToOrder(id, updateData.orderId)
    }

    if (!updatedQuote) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update quote'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: updatedQuote,
      message: 'Quote updated successfully'
    })
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update quote'
    }, { status: 500 })
  }
}

// DELETE /api/quotes/[id] - Delete quote (admin only)
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const quote = getQuoteById(id)
    
    if (!quote) {
      return NextResponse.json({
        success: false,
        error: 'Quote not found'
      }, { status: 404 })
    }

    // In a real app, you would delete this from a database
    // const index = mockQuotes.findIndex(q => q.id === id)
    // if (index > -1) {
    //   mockQuotes.splice(index, 1)
    // }

    return NextResponse.json({
      success: true,
      message: 'Quote deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting quote:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete quote'
    }, { status: 500 })
  }
}
