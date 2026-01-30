import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { getUploadedFilesByUser, getFileStats, searchUploadedFiles } from '@/lib/uploads'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  File, 
  Upload,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Image,
  FileText,
  Palette,
  Calendar,
  HardDrive
} from 'lucide-react'
import Link from 'next/link'

async function FilesPage() {
  // Get authenticated user
  const user = await getAuthUser({} as Request)
  
  if (!user) {
    redirect('/login')
  }

  // Get user's files and stats
  const files = await getUploadedFilesByUser(user.id)
  const stats = await getFileStats(user.id)

  // File type configurations
  const fileConfig = {
    'image/jpeg': { icon: Image, label: 'JPEG', color: 'bg-green-100 text-green-800' },
    'image/png': { icon: Image, label: 'PNG', color: 'bg-blue-100 text-blue-800' },
    'image/gif': { icon: Image, label: 'GIF', color: 'bg-purple-100 text-purple-800' },
    'image/tiff': { icon: Image, label: 'TIFF', color: 'bg-indigo-100 text-indigo-800' },
    'application/pdf': { icon: FileText, label: 'PDF', color: 'bg-red-100 text-red-800' },
    'application/msword': { icon: FileText, label: 'DOC', color: 'bg-blue-100 text-blue-800' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, label: 'DOCX', color: 'bg-blue-100 text-blue-800' },
    'application/illustrator': { icon: Palette, label: 'AI', color: 'bg-orange-100 text-orange-800' },
    'application/postscript': { icon: Palette, label: 'PS', color: 'bg-pink-100 text-pink-800' },
    'image/svg+xml': { icon: Palette, label: 'SVG', color: 'bg-teal-100 text-teal-800' },
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileConfig = (mimeType: string) => {
    return fileConfig[mimeType as keyof typeof fileConfig] || {
      icon: File,
      label: mimeType.split('/')[1]?.toUpperCase() || 'FILE',
      color: 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">File Manager</h1>
            <p className="text-muted-foreground">
              Manage your uploaded files, documents, and print materials.
            </p>
          </div>
          <Link href="/dashboard/files/upload">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFiles}</div>
            <p className="text-xs text-muted-foreground">
              All uploaded files
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</div>
            <p className="text-xs text-muted-foreground">
              Total storage consumed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.filesByCategory.image || 0}</div>
            <p className="text-xs text-muted-foreground">
              Image files uploaded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.filesByCategory.document || 0}</div>
            <p className="text-xs text-muted-foreground">
              Document files uploaded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by filename, description, or tags..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      {files.length > 0 ? (
        <div className="space-y-4">
          {files.map((file) => {
            const config = getFileConfig(file.mimeType)
            const FileIcon = config.icon

            return (
              <Card key={file.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${config.color}`}>
                        <FileIcon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg">{file.originalName}</h3>
                          <Badge variant="secondary" className={config.color}>
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </span>
                          {file.metadata?.width && file.metadata?.height && (
                            <span>{file.metadata.width}×{file.metadata.height}</span>
                          )}
                          {file.metadata?.pages && (
                            <span>{file.metadata.pages} pages</span>
                          )}
                        </div>
                        {file.metadata?.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {file.metadata.description}
                          </p>
                        )}
                        {file.metadata?.tags && file.metadata.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {file.metadata.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
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
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <File className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No files uploaded yet</h3>
            <p className="text-muted-foreground mb-6">
              Upload your first file to get started with managing your print materials.
            </p>
            <Link href="/dashboard/files/upload">
              <Button size="lg">
                <Upload className="mr-2 h-4 w-4" />
                Upload Your First File
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FilesPage
