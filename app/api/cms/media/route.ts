import { NextResponse } from "next/server"
import { 
  uploadMediaAsset,
  getMediaAssets,
  getMediaStats,
  getMediaCollections,
  createMediaCollection,
  trackMediaAnalytics
} from '@/lib/cms-media'
import { getAuthUser } from '@/lib/auth'

// GET /api/cms/media - Get media assets or collections
export async function GET(req: Request) {
  try {
    // Get authenticated user
    const user = await getAuthUser(req)
    
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    
    // Get statistics
    if (searchParams.get('stats') === 'true') {
      const stats = await getMediaStats()
      return NextResponse.json({
        success: true,
        data: stats,
      })
    }

    // Get collections
    if (type === 'collections') {
      const filter: any = {}
      
      if (searchParams.get('createdBy')) {
        filter.createdBy = searchParams.get('createdBy')!
      }
      
      if (searchParams.get('visibility')) {
        filter.visibility = searchParams.get('visibility')?.split(',').map(v => v.trim())
      }
      
      if (searchParams.get('tags')) {
        filter.tags = searchParams.get('tags')?.split(',').map(t => t.trim())
      }
      
      if (searchParams.get('categories')) {
        filter.categories = searchParams.get('categories')?.split(',').map(c => c.trim())
      }

      const collections = await getMediaCollections(filter)
      return NextResponse.json({
        success: true,
        data: collections,
        count: collections.length,
      })
    }

    // Get media assets
    const filter: any = {}
    
    if (searchParams.get('query')) {
      filter.query = searchParams.get('query')!
    }
    
    if (searchParams.get('tags')) {
      filter.tags = searchParams.get('tags')?.split(',').map(t => t.trim())
    }
    
    if (searchParams.get('categories')) {
      filter.categories = searchParams.get('categories')?.split(',').map(c => c.trim())
    }
    
    if (searchParams.get('mimeType')) {
      filter.mimeType = searchParams.get('mimeType')?.split(',').map(m => m.trim())
    }
    
    if (searchParams.get('uploadedBy')) {
      filter.uploadedBy = searchParams.get('uploadedBy')!
    }
    
    if (searchParams.get('dateFrom')) {
      filter.dateFrom = new Date(searchParams.get('dateFrom')!)
    }
    
    if (searchParams.get('dateTo')) {
      filter.dateTo = new Date(searchParams.get('dateTo')!)
    }
    
    if (searchParams.get('sizeMin')) {
      filter.sizeRange = { ...filter.sizeRange, min: parseInt(searchParams.get('sizeMin')!) }
    }
    
    if (searchParams.get('sizeMax')) {
      filter.sizeRange = { ...filter.sizeRange, max: parseInt(searchParams.get('sizeMax')!) }
    }
    
    if (searchParams.get('minWidth')) {
      filter.dimensions = { ...filter.dimensions, minWidth: parseInt(searchParams.get('minWidth')!) }
    }
    
    if (searchParams.get('maxWidth')) {
      filter.dimensions = { ...filter.dimensions, maxWidth: parseInt(searchParams.get('maxWidth')!) }
    }
    
    if (searchParams.get('minHeight')) {
      filter.dimensions = { ...filter.dimensions, minHeight: parseInt(searchParams.get('minHeight')!) }
    }
    
    if (searchParams.get('maxHeight')) {
      filter.dimensions = { ...filter.dimensions, maxHeight: parseInt(searchParams.get('maxHeight')!) }
    }
    
    if (searchParams.get('status')) {
      filter.status = searchParams.get('status')?.split(',').map(s => s.trim())
    }
    
    if (searchParams.get('visibility')) {
      filter.visibility = searchParams.get('visibility')?.split(',').map(v => v.trim())
    }
    
    if (searchParams.get('license')) {
      filter.license = searchParams.get('license')?.split(',').map(l => l.trim())
    }
    
    if (searchParams.get('hasAnalytics') === 'true') {
      filter.hasAnalytics = true
    }
    
    if (searchParams.get('sortBy')) {
      filter.sortBy = searchParams.get('sortBy') as any
    }
    
    if (searchParams.get('sortOrder')) {
      filter.sortOrder = searchParams.get('sortOrder') as any
    }

    const assets = await getMediaAssets(filter)
    
    return NextResponse.json({
      success: true,
      data: assets,
      count: assets.length,
    })
  } catch (error) {
    console.error('Media API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch media',
    }, { status: 500 })
  }
}

// POST /api/cms/media - Upload media or create collection
export async function POST(req: Request) {
  try {
    // Get authenticated user
    const user = await getAuthUser(req)
    
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 })
    }

    const contentType = req.headers.get('content-type')
    
    // Handle form data (file upload)
    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File
      
      if (!file) {
        return NextResponse.json({
          success: false,
          error: 'No file provided',
        }, { status: 400 })
      }

      // Parse upload options
      const options: any = {}
      
      if (formData.get('generateThumbnails')) {
        options.generateThumbnails = formData.get('generateThumbnails') === 'true'
      }
      
      if (formData.get('autoTag')) {
        options.autoTag = formData.get('autoTag') === 'true'
      }
      
      if (formData.get('extractMetadata')) {
        options.extractMetadata = formData.get('extractMetadata') === 'true'
      }
      
      if (formData.get('applyWatermark')) {
        options.applyWatermark = formData.get('applyWatermark') === 'true'
      }
      
      if (formData.get('visibility')) {
        options.visibility = formData.get('visibility') as any
      }
      
      if (formData.get('license')) {
        options.license = formData.get('license') as any
      }
      
      if (formData.get('collections')) {
        options.collections = formData.get('collections')?.toString().split(',').map(c => c.trim())
      }

      // Upload media asset
      const asset = await uploadMediaAsset(file, options, user.id)
      
      return NextResponse.json({
        success: true,
        data: asset,
        message: 'Media uploaded successfully',
      })
    } else {
      // Handle JSON (create collection)
      const body = await req.json()
      const { type } = body

      if (type === 'collection') {
        const { name, description, slug, tags, categories, visibility, settings } = body
        
        if (!name || !slug) {
          return NextResponse.json({
            success: false,
            error: 'name and slug are required',
          }, { status: 400 })
        }

        const collection = await createMediaCollection({
          name,
          description,
          slug,
          assets: [],
          tags: tags || [],
          categories: categories || [],
          visibility: visibility || 'private',
          createdBy: user.id,
          settings: settings || {
            allowDownloads: true,
            allowComments: false,
            requireLogin: false,
            autoGenerateThumbnails: true,
          },
        })

        return NextResponse.json({
          success: true,
          data: collection,
          message: 'Collection created successfully',
        })
      } else {
        return NextResponse.json({
          success: false,
          error: 'Invalid type specified',
        }, { status: 400 })
      }
    }
  } catch (error) {
    console.error('Upload media error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to upload media',
    }, { status: 500 })
  }
}

