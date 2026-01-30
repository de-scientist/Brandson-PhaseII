import { NextResponse } from "next/server"
import { getAuthUser } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 })
    }
    
    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get user info',
    }, { status: 500 })
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
