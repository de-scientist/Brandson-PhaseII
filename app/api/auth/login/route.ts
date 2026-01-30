import { NextResponse } from "next/server"
import { loginUser, LoginCredentials } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body: LoginCredentials = await req.json()
    
    // Validate input
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required',
      }, { status: 400 })
    }
    
    if (!email.includes('@')) {
      return NextResponse.json({
        success: false,
        error: 'Valid email is required',
      }, { status: 400 })
    }
    
    // Login user
    const result = await loginUser(body)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
        },
        message: 'Login successful',
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      error: 'Login failed',
    }, { status: 500 })
  }
}
