import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export interface UploadedFile {
  id: string
  originalName: string
  fileName: string
  mimeType: string
  size: number
  path: string
  url: string
  uploadedAt: Date
  uploadedBy?: string
  metadata?: FileMetadata
}

export interface FileMetadata {
  width?: number
  height?: number
  pages?: number
  colorSpace?: string
  dpi?: number
  format?: string
  description?: string
  tags?: string[]
}

export interface UploadOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  uploadPath?: string
  generateThumbnail?: boolean
}

export interface ValidationResult {
  valid: boolean
  error?: string
  warnings?: string[]
}

// In-memory storage for development (replace with database in production)
let uploadedFiles: UploadedFile[] = []

// Default upload configuration
const DEFAULT_CONFIG: Required<UploadOptions> = {
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/tiff',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/illustrator',
    'application/postscript',
    'image/svg+xml',
  ],
  uploadPath: './uploads',
  generateThumbnail: true,
}

/**
 * Validate file before upload
 */
export function validateFile(file: File, options: UploadOptions = {}): ValidationResult {
  const config = { ...DEFAULT_CONFIG, ...options }

  // Check file size
  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${formatFileSize(config.maxSize)}`,
    }
  }

  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    }
  }

  // Check file name
  if (!file.name || file.name.length > 255) {
    return {
      valid: false,
      error: 'Invalid file name',
    }
  }

  const warnings: string[] = []

  // Check for potentially problematic file names
  if (/[<>:"/\\|?*]/.test(file.name)) {
    warnings.push('File name contains special characters that may cause issues')
  }

  // Check file extensions
  const extension = file.name.split('.').pop()?.toLowerCase()
  const dangerousExtensions = ['exe', 'bat', 'cmd', 'scr', 'pif', 'com']
  if (extension && dangerousExtensions.includes(extension)) {
    return {
      valid: false,
      error: 'File type is not allowed for security reasons',
    }
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}

/**
 * Generate safe filename
 */
export function generateSafeFileName(originalName: string): string {
  const extension = originalName.split('.').pop()
  const baseName = originalName.split('.').slice(0, -1).join('.')
  
  // Sanitize base name
  const sanitizedBaseName = baseName
    .replace(/[^a-zA-Z0-9\-_\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
  
  // Generate unique identifier
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  
  return `${sanitizedBaseName}-${timestamp}-${random}.${extension}`
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get file type category
 */
export function getFileCategory(mimeType: string): 'image' | 'document' | 'design' | 'other' {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document'
  if (mimeType.includes('illustrator') || mimeType.includes('postscript') || mimeType.includes('svg')) return 'design'
  return 'other'
}

/**
 * Upload file to server
 */
export async function uploadFile(
  file: File,
  options: UploadOptions = {},
  uploadedBy?: string
): Promise<UploadedFile> {
  // Validate file
  const validation = validateFile(file, options)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const config = { ...DEFAULT_CONFIG, ...options }
  
  // Ensure upload directory exists
  if (!existsSync(config.uploadPath)) {
    await mkdir(config.uploadPath, { recursive: true })
  }

  // Generate safe filename
  const fileName = generateSafeFileName(file.name)
  const filePath = join(config.uploadPath, fileName)

  // Convert file to buffer and save
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  await writeFile(filePath, buffer)

  // Generate file URL (in production, this would be your CDN or public URL)
  const fileUrl = `/uploads/${fileName}`

  // Extract metadata (placeholder implementation)
  const metadata: FileMetadata = await extractFileMetadata(file, filePath)

  // Create file record
  const uploadedFile: UploadedFile = {
    id: crypto.randomUUID(),
    originalName: file.name,
    fileName,
    mimeType: file.type,
    size: file.size,
    path: filePath,
    url: fileUrl,
    uploadedAt: new Date(),
    uploadedBy,
    metadata,
  }

  // Store file record (in production, this would be a database operation)
  uploadedFiles.push(uploadedFile)

  return uploadedFile
}

/**
 * Extract metadata from file (placeholder implementation)
 */
async function extractFileMetadata(file: File, filePath: string): Promise<FileMetadata> {
  const metadata: FileMetadata = {}

  try {
    // For images, we could use sharp or jimp to extract dimensions
    if (file.type.startsWith('image/')) {
      // Placeholder: In production, use image processing library
      metadata.width = 0
      metadata.height = 0
      metadata.dpi = 300
      metadata.colorSpace = 'RGB'
    }

    // For PDFs, we could use pdf-parse to extract page count
    if (file.type === 'application/pdf') {
      // Placeholder: In production, use PDF processing library
      metadata.pages = 1
    }

    metadata.format = file.type.split('/')[1]?.toUpperCase()
  } catch (error) {
    console.error('Error extracting file metadata:', error)
  }

  return metadata
}

/**
 * Get uploaded file by ID
 */
export async function getUploadedFile(fileId: string): Promise<UploadedFile | null> {
  const file = uploadedFiles.find(f => f.id === fileId)
  return file || null
}

/**
 * Get uploaded files by user
 */
export async function getUploadedFilesByUser(uploadedBy: string): Promise<UploadedFile[]> {
  return uploadedFiles.filter(f => f.uploadedBy === uploadedBy)
}

/**
 * Delete uploaded file
 */
export async function deleteUploadedFile(fileId: string, uploadedBy?: string): Promise<boolean> {
  const fileIndex = uploadedFiles.findIndex(f => f.id === fileId)
  
  if (fileIndex === -1) return false
  
  const file = uploadedFiles[fileIndex]
  
  // Check if user has permission to delete
  if (uploadedBy && file.uploadedBy !== uploadedBy) {
    return false
  }

  try {
    // Delete physical file (in production, you might want to keep files for audit)
    // await unlink(file.path)
    
    // Remove from storage
    uploadedFiles.splice(fileIndex, 1)
    
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}

/**
 * Get file statistics
 */
export async function getFileStats(uploadedBy?: string): Promise<{
  totalFiles: number
  totalSize: number
  filesByType: Record<string, number>
  filesByCategory: Record<string, number>
}> {
  const files = uploadedBy 
    ? uploadedFiles.filter(f => f.uploadedBy === uploadedBy)
    : uploadedFiles

  const stats = {
    totalFiles: files.length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
    filesByType: {} as Record<string, number>,
    filesByCategory: {} as Record<string, number>,
  }

  files.forEach(file => {
    // Count by MIME type
    stats.filesByType[file.mimeType] = (stats.filesByType[file.mimeType] || 0) + 1
    
    // Count by category
    const category = getFileCategory(file.mimeType)
    stats.filesByCategory[category] = (stats.filesByCategory[category] || 0) + 1
  })

  return stats
}

/**
 * Search uploaded files
 */
export async function searchUploadedFiles(
  query: string,
  uploadedBy?: string,
  options?: {
    mimeType?: string
    category?: 'image' | 'document' | 'design' | 'other'
    dateFrom?: Date
    dateTo?: Date
  }
): Promise<UploadedFile[]> {
  let files = uploadedBy 
    ? uploadedFiles.filter(f => f.uploadedBy === uploadedBy)
    : uploadedFiles

  // Filter by search query
  if (query) {
    const searchQuery = query.toLowerCase()
    files = files.filter(f => 
      f.originalName.toLowerCase().includes(searchQuery) ||
      f.fileName.toLowerCase().includes(searchQuery) ||
      f.metadata?.description?.toLowerCase().includes(searchQuery) ||
      f.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
    )
  }

  // Filter by MIME type
  if (options?.mimeType) {
    files = files.filter(f => f.mimeType === options.mimeType)
  }

  // Filter by category
  if (options?.category) {
    files = files.filter(f => getFileCategory(f.mimeType) === options.category)
  }

  // Filter by date range
  if (options?.dateFrom) {
    files = files.filter(f => f.uploadedAt >= options.dateFrom!)
  }

  if (options?.dateTo) {
    files = files.filter(f => f.uploadedAt <= options.dateTo!)
  }

  // Sort by upload date (newest first)
  return files.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
}

/**
 * Create upload presets for different use cases
 */
export const UPLOAD_PRESETS = {
  PRINT_MATERIALS: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/tiff',
      'application/pdf',
      'application/illustrator',
      'application/postscript',
      'image/svg+xml',
    ],
    generateThumbnail: true,
  },
  DOCUMENTS: {
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
    generateThumbnail: false,
  },
  IMAGES: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/tiff',
      'image/svg+xml',
    ],
    generateThumbnail: true,
  },
} as const
