import { NextResponse } from "next/server"
import { getUploadedFile, deleteUploadedFile } from '@/lib/uploads'
import { getAuthUser } from '@/lib/auth'
import { readFile } from 'fs/promises'

interface RouteParams {
  params: Promise<{
    fileId: string
  }>
}

// GET /api/uploads/[fileId] - Get file info or download file
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(req.url)
    const download = searchParams.get('download') === 'true'
    const { fileId } = await params
    
    // Get file info
    const file = await getUploadedFile(fileId)
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'File not found',
      }, { status: 404 })
    }

    if (download) {
      // Return file for download
      try {
        const fileBuffer = await readFile(file.path)
        
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': file.mimeType,
            'Content-Disposition': `attachment; filename="${file.originalName}"`,
            'Content-Length': file.size.toString(),
          },
        })
      } catch (error) {
        console.error('Error reading file:', error)
        return NextResponse.json({
          success: false,
          error: 'File not found on disk',
        }, { status: 404 })
      }
    } else {
      // Return file metadata
      return NextResponse.json({
        success: true,
        data: file,
      })
    }
  } catch (error) {
    console.error('Get file error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve file',
    }, { status: 500 })
  }
}

// DELETE /api/uploads/[fileId] - Delete file
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    // Get authenticated user
    const user = await getAuthUser(req)
    const { fileId } = await params
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 })
    }

    // Delete file (user can only delete their own files)
    const success = await deleteUploadedFile(fileId, user.id)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'File not found or permission denied',
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    })
  } catch (error) {
    console.error('Delete file error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete file',
    }, { status: 500 })
  }
}

// PUT /api/uploads/[fileId] - Update file metadata
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    // Get authenticated user
    const user = await getAuthUser(req)
    const { fileId } = await params
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 })
    }

    // Get file
    const file = await getUploadedFile(fileId)
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'File not found',
      }, { status: 404 })
    }

    // Check if user owns this file
    if (file.uploadedBy !== user.id) {
      return NextResponse.json({
        success: false,
        error: 'Permission denied',
      }, { status: 403 })
    }

    // Update metadata
    const updates = await req.json()
    
    // Update file metadata (in production, this would update the database)
    file.metadata = {
      ...file.metadata,
      ...updates,
    }

    return NextResponse.json({
      success: true,
      data: file,
      message: 'File metadata updated successfully',
    })
  } catch (error) {
    console.error('Update file error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update file',
    }, { status: 500 })
  }
}
