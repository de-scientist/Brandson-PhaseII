import { NextResponse } from "next/server"
import { uploadFile, getUploadedFilesByUser, getFileStats, UPLOAD_PRESETS } from '@/lib/uploads'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 })
    }

    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const preset = formData.get('preset') as keyof typeof UPLOAD_PRESETS
    const description = formData.get('description') as string
    const tags = formData.get('tags') as string

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided',
      }, { status: 400 })
    }

    // Get upload options based on preset
    const uploadOptions = preset ? UPLOAD_PRESETS[preset] : {}

    // Upload file
    const uploadedFile = await uploadFile(file, uploadOptions, user.id)

    // Add description and tags to metadata if provided
    if (description || tags) {
      uploadedFile.metadata = {
        ...uploadedFile.metadata,
        description,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
      }
    }

    return NextResponse.json({
      success: true,
      data: uploadedFile,
      message: 'File uploaded successfully',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    // Get authenticated user
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    
    // Check if requesting stats
    if (searchParams.get('stats') === 'true') {
      const stats = await getFileStats(user.id)
      return NextResponse.json({
        success: true,
        data: stats,
      })
    }

    // Get search parameters
    const query = searchParams.get('search') || ''
    const mimeType = searchParams.get('mimeType') || undefined
    const category = searchParams.get('category') as 'image' | 'document' | 'design' | 'other' || undefined
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined

    // Get user's files
    const files = await getUploadedFilesByUser(user.id)

    // Filter files based on search parameters
    let filteredFiles = files

    if (query) {
      const searchQuery = query.toLowerCase()
      filteredFiles = filteredFiles.filter(f => 
        f.originalName.toLowerCase().includes(searchQuery) ||
        f.fileName.toLowerCase().includes(searchQuery) ||
        f.metadata?.description?.toLowerCase().includes(searchQuery) ||
        f.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
      )
    }

    if (mimeType) {
      filteredFiles = filteredFiles.filter(f => f.mimeType === mimeType)
    }

    if (category) {
      const { getFileCategory } = await import('@/lib/uploads')
      filteredFiles = filteredFiles.filter(f => getFileCategory(f.mimeType) === category)
    }

    if (dateFrom) {
      filteredFiles = filteredFiles.filter(f => f.uploadedAt >= dateFrom!)
    }

    if (dateTo) {
      filteredFiles = filteredFiles.filter(f => f.uploadedAt <= dateTo!)
    }

    // Sort by upload date (newest first)
    filteredFiles.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())

    return NextResponse.json({
      success: true,
      data: filteredFiles,
      count: filteredFiles.length,
    })
  } catch (error) {
    console.error('Get files error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve files',
    }, { status: 500 })
  }
}
