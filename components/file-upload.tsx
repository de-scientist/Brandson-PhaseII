"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  Image,
  FileText,
  Palette,
  Trash2,
  Download,
  Eye
} from "lucide-react"
import { toast } from "sonner"

interface UploadedFile {
  id: string
  originalName: string
  fileName: string
  mimeType: string
  size: number
  url: string
  uploadedAt: string
  metadata?: {
    width?: number
    height?: number
    pages?: number
    format?: string
    description?: string
    tags?: string[]
  }
}

interface FileUploadProps {
  onUploadComplete?: (files: UploadedFile[]) => void
  maxFiles?: number
  preset?: keyof typeof UPLOAD_PRESETS
  className?: string
}

// Import presets (would normally be from lib/uploads)
const UPLOAD_PRESETS = {
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
  },
  DOCUMENTS: {
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
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
  },
}

export function FileUpload({ onUploadComplete, maxFiles = 10, preset = 'PRINT_MATERIALS', className }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')

  const presetConfig = UPLOAD_PRESETS[preset]

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles)
    setFiles(newFiles)
  }, [files, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: presetConfig.allowedTypes.reduce((acc, type) => {
      acc[type] = [`.${type.split('/')[1]}`]
      return acc
    }, {} as Record<string, string[]>),
    maxSize: presetConfig.maxSize,
    multiple: maxFiles > 1,
  })

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText
    if (mimeType.includes('illustrator') || mimeType.includes('postscript')) return Palette
    return File
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('preset', preset)
        if (description) formData.append('description', description)
        if (tags) formData.append('tags', tags)

        const response = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`)
        }

        const result = await response.json()
        
        // Update progress
        setUploadProgress(((index + 1) / files.length) * 100)

        return result.data
      })

      const results = await Promise.all(uploadPromises)
      setUploadedFiles([...uploadedFiles, ...results])
      setFiles([])
      setDescription('')
      setTags('')
      
      toast.success(`Successfully uploaded ${results.length} file(s)`)
      onUploadComplete?.(results)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const deleteUploadedFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/uploads/${fileId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete file')
      }

      setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId))
      toast.success('File deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete file')
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>
            Upload your print materials, documents, or design files.
            Maximum file size: {formatFileSize(presetConfig.maxSize)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              {isDragActive ? (
                <p className="text-lg font-medium">Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: {presetConfig.allowedTypes.map(type => type.split('/')[1]).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* File Details */}
            {(description || tags) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe these files..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="tag1, tag2, tag3"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate tags with commas
                  </p>
                </div>
              </div>
            )}

            {/* Pending Files */}
            {files.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Files to Upload ({files.length})</h4>
                <div className="space-y-2">
                  {files.map((file, index) => {
                    const FileIcon = getFileIcon(file.type)
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileIcon className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {/* Upload Button */}
            {files.length > 0 && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? 'Uploading...' : `Upload ${files.length} File${files.length > 1 ? 's' : ''}`}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              Recently uploaded files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file) => {
                const FileIcon = getFileIcon(file.mimeType)
                return (
                  <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileIcon className="h-10 w-10 text-muted-foreground" />
                      <div className="flex-1">
                        <h4 className="font-medium">{file.originalName}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span>{file.metadata?.format || file.mimeType.split('/')[1]?.toUpperCase()}</span>
                          {file.metadata?.width && file.metadata?.height && (
                            <span>{file.metadata.width}×{file.metadata.height}</span>
                          )}
                          {file.metadata?.pages && (
                            <span>{file.metadata.pages} pages</span>
                          )}
                        </div>
                        {file.metadata?.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {file.metadata.description}
                          </p>
                        )}
                        {file.metadata?.tags && file.metadata.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {file.metadata.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/api/uploads/${file.id}?download=true`}>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteUploadedFile(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
