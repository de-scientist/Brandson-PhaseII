import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  isActive: boolean
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  emailNotifications: boolean
  smsNotifications: boolean
  language: string
}

export type UserRole = 'customer' | 'admin' | 'staff'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone: string
  role?: UserRole
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  error?: string
}

// In-memory storage for development (replace with database in production)
let users: User[] = []
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
const JWT_EXPIRES_IN = '7d'

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Verify password
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * Generate JWT token
 */
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch (error) {
    return null
  }
}

/**
 * Register new user
 */
export async function registerUser(data: RegisterData): Promise<AuthResult> {
  try {
    // Check if user already exists
    const existingUser = users.find(u => u.email === data.email)
    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists',
      }
    }

    // Validate input
    if (!data.email || !data.password || !data.name || !data.phone) {
      return {
        success: false,
        error: 'All fields are required',
      }
    }

    if (data.password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long',
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password)

    // Create user
    const user: User = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role || 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      preferences: {
        theme: 'system',
        emailNotifications: true,
        smsNotifications: true,
        language: 'en',
      },
    }

    // Store user (in production, this would be a database operation)
    users.push(user)

    // Generate token
    const token = generateToken(user.id)

    // Update last login
    user.lastLogin = new Date()
    user.updatedAt = new Date()

    // Remove password from response (not stored in user object anyway)
    const { ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword,
      token,
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: 'Registration failed',
    }
  }
}

/**
 * Login user
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    // Find user
    const user = users.find(u => u.email === credentials.email)
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password',
      }
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        error: 'Account is deactivated',
      }
    }

    // In production, you would verify the password here
    // For now, we'll simulate password verification
    // const isValidPassword = await verifyPassword(credentials.password, user.hashedPassword)
    const isValidPassword = true // Placeholder for demo

    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid email or password',
      }
    }

    // Generate token
    const token = generateToken(user.id)

    // Update last login
    user.lastLogin = new Date()
    user.updatedAt = new Date()

    return {
      success: true,
      user,
      token,
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'Login failed',
    }
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const user = users.find(u => u.id === userId)
  return user || null
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const user = users.find(u => u.email === email)
  return user || null
}

/**
 * Update user
 */
export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const userIndex = users.findIndex(u => u.id === userId)
  if (userIndex === -1) return null

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date(),
  }

  return users[userIndex]
}

/**
 * Change password
 */
export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  try {
    const user = await getUserById(userId)
    if (!user) return false

    // In production, verify current password
    // const isValidCurrentPassword = await verifyPassword(currentPassword, user.hashedPassword)
    const isValidCurrentPassword = true // Placeholder for demo

    if (!isValidCurrentPassword) return false

    // Hash new password
    // const hashedNewPassword = await hashPassword(newPassword)
    // Update user with new password (in production)

    return true
  } catch (error) {
    console.error('Password change error:', error)
    return false
  }
}

/**
 * Reset password request
 */
export async function requestPasswordReset(email: string): Promise<boolean> {
  try {
    const user = await getUserByEmail(email)
    if (!user) return true // Return true to prevent email enumeration

    // Generate reset token
    const resetToken = generateToken(user.id)
    
    // TODO: Send reset email with resetToken
    console.log(`Password reset token for ${email}: ${resetToken}`)

    return true
  } catch (error) {
    console.error('Password reset request error:', error)
    return false
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  try {
    const decoded = verifyToken(token)
    if (!decoded) return false

    const user = await getUserById(decoded.userId)
    if (!user) return false

    // Hash new password
    // const hashedNewPassword = await hashPassword(newPassword)
    // Update user with new password (in production)

    return true
  } catch (error) {
    console.error('Password reset error:', error)
    return false
  }
}

/**
 * Get middleware auth function
 */
export function getAuthUser(req: Request): User | null {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) return null

    return getUserById(decoded.userId)
  } catch (error) {
    return null
  }
}

/**
 * Create demo users for testing
 */
export async function createDemoUsers(): Promise<void> {
  const demoUsers: RegisterData[] = [
    {
      email: 'customer@brandson.co.ke',
      password: 'password123',
      name: 'John Customer',
      phone: '+254712345678',
      role: 'customer',
    },
    {
      email: 'admin@brandson.co.ke',
      password: 'admin123',
      name: 'Admin User',
      phone: '+254723456789',
      role: 'admin',
    },
    {
      email: 'staff@brandson.co.ke',
      password: 'staff123',
      name: 'Staff Member',
      phone: '+254734567890',
      role: 'staff',
    },
  ]

  for (const userData of demoUsers) {
    const existingUser = users.find(u => u.email === userData.email)
    if (!existingUser) {
      await registerUser(userData)
      console.log(`Created demo user: ${userData.email}`)
    }
  }
}
