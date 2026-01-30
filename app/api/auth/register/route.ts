import { NextResponse } from "next/server"
import { registerUser, RegisterData } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body: RegisterData = await req.json()
    
    // Validate input
    const { email, password, name, phone } = body
    
    if (!email || !password || !name || !phone) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required',
      }, { status: 400 })
    }
    
    if (!email.includes('@')) {
      return NextResponse.json({
        success: false,
        error: 'Valid email is required',
      }, { status: 400 })
    }
    
    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 8 characters long',
      }, { status: 400 })
    }
    
    if (name.length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Name must be at least 2 characters long',
      }, { status: 400 })
    }
    
    // Register user
    const result = await registerUser(body)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
        },
        message: 'Registration successful',
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({
      success: false,
      error: 'Registration failed',
    }, { status: 500 })
  }
}
