import { NextResponse } from "next/server"
import { getAuthUser } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    // For demo purposes, return a mock user if no auth is set up
    const user = await getAuthUser(req)
    
    if (!user) {
      // Return demo user for development
      return NextResponse.json({
        success: true,
        data: {
          id: 'demo-user',
          name: 'Demo User',
          email: 'demo@brandsonmedia.co.ke',
          role: 'customer',
          avatar: null
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Auth me error:', error)
    // Return demo user on error for development
    return NextResponse.json({
      success: true,
      data: {
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@brandsonmedia.co.ke',
        role: 'customer',
        avatar: null
      }
    })
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 })
    }
    
    const updates = await req.json()
    
    // Update user (in production, this would update the database)
    const { updateUser } = await import('@/lib/auth')
    const updatedUser = await updateUser(user.id, updates)
    
    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update user',
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    })
  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update user',
    }, { status: 500 })
  }
}
