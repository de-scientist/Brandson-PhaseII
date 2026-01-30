import { sanityClient } from '@/lib/sanity'

export interface MediaAsset {
  id: string
  _type: string
  title: string
  description?: string
  altText?: string
  caption?: string
  url: string
  originalFilename: string
  mimeType: string
  size: number
  dimensions: {
    width: number
    height: number
    aspectRatio: number
  }
  metadata: MediaMetadata
  tags: string[]
  categories: string[]
  uploadedBy: string
  uploadedAt: Date
  updatedAt: Date
  publishedAt?: Date
  expiresAt?: Date
  status: MediaStatus
  visibility: MediaVisibility
  license: MediaLicense
  usage: MediaUsage[]
  versions: MediaVersion[]
  transformations: MediaTransformation[]
  analytics: MediaAnalytics
}

export interface MediaMetadata {
  colorProfile?: string
  colorSpace?: string
  dpi?: number
  compression?: string
  format: string
  quality?: number
  description?: string
  duration?: number // for videos
  frameRate?: number // for videos
  bitrate?: number // for videos
  codec?: string // for videos
  pages?: number // for documents
  author?: string
  copyright?: string
  keywords?: string[]
  location?: {
    latitude?: number
    longitude?: number
    address?: string
  }
  camera?: {
    make?: string
    model?: string
    lens?: string
    iso?: number
    aperture?: string
    shutterSpeed?: string
  }
  exif?: Record<string, any>
}

export type MediaStatus = 'uploading' | 'processing' | 'ready' | 'published' | 'archived' | 'deleted'
export type MediaVisibility = 'public' | 'private' | 'unlisted' | 'restricted'
export type MediaLicense = 'all_rights_reserved' | 'creative_commons' | 'public_domain' | 'royalty_free' | 'editorial_use_only'

export interface MediaUsage {
  id: string
  entityType: 'page' | 'post' | 'product' | 'portfolio' | 'campaign'
  entityId: string
  entityTitle: string
  context: string // e.g., 'hero_image', 'thumbnail', 'gallery'
  usedAt: Date
  usedBy: string
}

export interface MediaVersion {
  id: string
  name: string
  url: string
  dimensions: {
    width: number
    height: number
    aspectRatio: number
  }
  size: number
  format: string
  quality: number
  createdAt: Date
  createdBy: string
  isOriginal: boolean
}

export interface MediaTransformation {
  id: string
  name: string
  type: 'resize' | 'crop' | 'compress' | 'format_convert' | 'filter' | 'watermark'
  parameters: Record<string, any>
  url: string
  dimensions: {
    width: number
    height: number
  }
  size: number
  format: string
  createdAt: Date
  createdBy: string
}

export interface MediaAnalytics {
  views: number
  downloads: number
  shares: number
  clicks: number
  lastViewed?: Date
  topReferrers: string[]
  usageByEntity: Record<string, number>
  viewsOverTime: {
    date: string
    views: number
  }[]
}

export interface MediaCollection {
  id: string
  name: string
  description?: string
  slug: string
  assets: string[] // MediaAsset IDs
  coverImage?: string
  tags: string[]
  categories: string[]
  visibility: MediaVisibility
  createdBy: string
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  settings: CollectionSettings
}

export interface CollectionSettings {
  allowDownloads: boolean
  allowComments: boolean
  requireLogin: boolean
  maxImageSize?: number
  allowedFormats?: string[]
  autoGenerateThumbnails: boolean
  watermarkSettings?: {
    enabled: boolean
    text?: string
    opacity?: number
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  }
}

export interface MediaSearchFilter {
  query?: string
  tags?: string[]
  categories?: string[]
  mimeType?: string[]
  uploadedBy?: string
  dateFrom?: Date
  dateTo?: Date
  sizeRange?: {
    min?: number
    max?: number
  }
  dimensions?: {
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
  }
  status?: MediaStatus[]
  visibility?: MediaVisibility[]
  license?: MediaLicense[]
  hasAnalytics?: boolean
  sortBy?: 'uploadedAt' | 'title' | 'size' | 'views' | 'downloads'
  sortOrder?: 'asc' | 'desc'
}

export interface MediaUploadOptions {
  generateThumbnails?: boolean
  autoTag?: boolean
  extractMetadata?: boolean
  applyWatermark?: boolean
  createVersions?: MediaVersionConfig[]
  collections?: string[]
  visibility?: MediaVisibility
  license?: MediaLicense
}

export interface MediaVersionConfig {
  name: string
  width?: number
  height?: number
  quality?: number
  format?: string
  crop?: 'center' | 'top' | 'bottom' | 'left' | 'right'
}

// In-memory storage for development (replace with database in production)
let mediaAssets: MediaAsset[] = []
let mediaCollections: MediaCollection[] = []

/**
 * Upload media asset to Sanity
 */
export async function uploadMediaAsset(
  file: File,
  options: MediaUploadOptions = {},
  uploadedBy: string
): Promise<MediaAsset> {
  try {
    // Upload to Sanity
    const asset = await sanityClient.assets.upload('image', file)

    // Extract dimensions and metadata
    const dimensions = await extractImageDimensions(asset)
    const metadata = await extractMediaMetadata(file, asset)

    // Create media asset record
    const mediaAsset: MediaAsset = {
      id: asset._id,
      _type: 'mediaAsset',
      title: options.extractMetadata ? file.name.split('.')[0] : file.name,
      description: options.extractMetadata ? metadata.description : undefined,
      altText: options.extractMetadata ? generateAltText(file.name, metadata) : undefined,
      url: asset.url,
      originalFilename: file.name,
      mimeType: file.type,
      size: file.size,
      dimensions,
      metadata,
      tags: options.autoTag ? await generateAutoTags(file, metadata) : [],
      categories: [],
      uploadedBy,
      uploadedAt: new Date(),
      updatedAt: new Date(),
      status: 'ready',
      visibility: options.visibility || 'private',
      license: options.license || 'all_rights_reserved',
      usage: [],
      versions: await generateMediaVersions(asset, options.createVersions || [], uploadedBy),
      transformations: [],
      analytics: {
        views: 0,
        downloads: 0,
        shares: 0,
        clicks: 0,
        topReferrers: [],
        usageByEntity: {},
        viewsOverTime: [],
      },
    }

    // Add to collections if specified
    if (options.collections?.length) {
      await addToCollections(mediaAsset.id, options.collections)
    }

    // Store in memory (in production, save to database)
    mediaAssets.push(mediaAsset)

    return mediaAsset
  } catch (error) {
    console.error('Error uploading media asset:', error)
    throw new Error('Failed to upload media asset')
  }
}

/**
 * Get media assets with filtering
 */
export async function getMediaAssets(filter?: MediaSearchFilter): Promise<MediaAsset[]> {
  let filtered = [...mediaAssets]

  if (filter) {
    // Text search
    if (filter.query) {
      const search = filter.query.toLowerCase()
      filtered = filtered.filter(asset =>
        asset.title.toLowerCase().includes(search) ||
        asset.description?.toLowerCase().includes(search) ||
        asset.altText?.toLowerCase().includes(search) ||
        asset.tags.some(tag => tag.toLowerCase().includes(search)) ||
        asset.categories.some(cat => cat.toLowerCase().includes(search))
      )
    }

    // Tags filter
    if (filter.tags?.length) {
      filtered = filtered.filter(asset =>
        filter.tags!.some(tag => asset.tags.includes(tag))
      )
    }

    // Categories filter
    if (filter.categories?.length) {
      filtered = filtered.filter(asset =>
        filter.categories!.some(cat => asset.categories.includes(cat))
      )
    }

    // MIME type filter
    if (filter.mimeType?.length) {
      filtered = filtered.filter(asset =>
        filter.mimeType!.includes(asset.mimeType)
      )
    }

    // Uploaded by filter
    if (filter.uploadedBy) {
      filtered = filtered.filter(asset => asset.uploadedBy === filter.uploadedBy)
    }

    // Date range filter
    if (filter.dateFrom) {
      filtered = filtered.filter(asset => asset.uploadedAt >= filter.dateFrom!)
    }
    if (filter.dateTo) {
      filtered = filtered.filter(asset => asset.uploadedAt <= filter.dateTo!)
    }

    // Size range filter
    if (filter.sizeRange) {
      filtered = filtered.filter(asset => {
        if (filter.sizeRange!.min && asset.size < filter.sizeRange!.min) return false
        if (filter.sizeRange!.max && asset.size > filter.sizeRange!.max) return false
        return true
      })
    }

    // Dimensions filter
    if (filter.dimensions) {
      filtered = filtered.filter(asset => {
        if (filter.dimensions!.minWidth && asset.dimensions.width < filter.dimensions!.minWidth) return false
        if (filter.dimensions!.maxWidth && asset.dimensions.width > filter.dimensions!.maxWidth) return false
        if (filter.dimensions!.minHeight && asset.dimensions.height < filter.dimensions!.minHeight) return false
        if (filter.dimensions!.maxHeight && asset.dimensions.height > filter.dimensions!.maxHeight) return false
        return true
      })
    }

    // Status filter
    if (filter.status?.length) {
      filtered = filtered.filter(asset => filter.status!.includes(asset.status))
    }

    // Visibility filter
    if (filter.visibility?.length) {
      filtered = filtered.filter(asset => filter.visibility!.includes(asset.visibility))
    }

    // License filter
    if (filter.license?.length) {
      filtered = filtered.filter(asset => filter.license!.includes(asset.license))
    }

    // Analytics filter
    if (filter.hasAnalytics) {
      filtered = filtered.filter(asset => asset.analytics.views > 0)
    }

    // Sorting
    const sortBy = filter.sortBy || 'uploadedAt'
    const sortOrder = filter.sortOrder || 'desc'

    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'uploadedAt':
          comparison = a.uploadedAt.getTime() - b.uploadedAt.getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'size':
          comparison = a.size - b.size
          break
        case 'views':
          comparison = a.analytics.views - b.analytics.views
          break
        case 'downloads':
          comparison = a.analytics.downloads - b.analytics.downloads
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })
  }

  return filtered
}

/**
 * Get media asset by ID
 */
export async function getMediaAssetById(id: string): Promise<MediaAsset | null> {
  const asset = mediaAssets.find(a => a.id === id)
  return asset || null
}

/**
 * Update media asset
 */
export async function updateMediaAsset(id: string, updates: Partial<MediaAsset>, updatedBy: string): Promise<MediaAsset | null> {
  const index = mediaAssets.findIndex(a => a.id === id)
  if (index === -1) return null

  const asset = mediaAssets[index]
  const updatedAsset = {
    ...asset,
    ...updates,
    updatedAt: new Date(),
  }

  mediaAssets[index] = updatedAsset

  // Update in Sanity
  try {
    await sanityClient
      .patch(id)
      .set({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .commit()
  } catch (error) {
    console.error('Error updating Sanity asset:', error)
  }

  return updatedAsset
}

/**
 * Delete media asset
 */
export async function deleteMediaAsset(id: string): Promise<boolean> {
  const index = mediaAssets.findIndex(a => a.id === id)
  if (index === -1) return false

  const asset = mediaAssets[index]
  
  // Delete from Sanity
  try {
    await sanityClient.delete(id)
  } catch (error) {
    console.error('Error deleting Sanity asset:', error)
  }

  // Remove from collections
  await removeFromCollections(id)

  // Remove from memory
  mediaAssets.splice(index, 1)

  return true
}

/**
 * Create media collection
 */
export async function createMediaCollection(collection: Omit<MediaCollection, 'id' | 'createdAt' | 'updatedAt'>): Promise<MediaCollection> {
  const newCollection: MediaCollection = {
    ...collection,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mediaCollections.push(newCollection)

  // Create in Sanity
  try {
    await sanityClient.create({
      _type: 'mediaCollection',
      ...newCollection,
      slug: {
        _type: 'slug',
        current: collection.slug,
      },
    })
  } catch (error) {
    console.error('Error creating Sanity collection:', error)
  }

  return newCollection
}

/**
 * Get media collections
 */
export async function getMediaCollections(filter?: {
  createdBy?: string
  visibility?: MediaVisibility[]
  tags?: string[]
  categories?: string[]
}): Promise<MediaCollection[]> {
  let filtered = [...mediaCollections]

  if (filter) {
    if (filter.createdBy) {
      filtered = filtered.filter(c => c.createdBy === filter.createdBy)
    }
    if (filter.visibility?.length) {
      filtered = filtered.filter(c => filter.visibility!.includes(c.visibility))
    }
    if (filter.tags?.length) {
      filtered = filtered.filter(c =>
        filter.tags!.some(tag => c.tags.includes(tag))
      )
    }
    if (filter.categories?.length) {
      filtered = filtered.filter(c =>
        filter.categories!.some(cat => c.categories.includes(cat))
      )
    }
  }

  return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}

/**
 * Add asset to collections
 */
async function addToCollections(assetId: string, collectionIds: string[]): Promise<void> {
  collectionIds.forEach(collectionId => {
    const collection = mediaCollections.find(c => c.id === collectionId)
    if (collection && !collection.assets.includes(assetId)) {
      collection.assets.push(assetId)
      collection.updatedAt = new Date()
    }
  })
}

/**
 * Remove asset from all collections
 */
async function removeFromCollections(assetId: string): Promise<void> {
  mediaCollections.forEach(collection => {
    const index = collection.assets.indexOf(assetId)
    if (index > -1) {
      collection.assets.splice(index, 1)
      collection.updatedAt = new Date()
    }
  })
}

/**
 * Extract image dimensions from Sanity asset
 */
async function extractImageDimensions(asset: any): Promise<{ width: number; height: number; aspectRatio: number }> {
  // Sanity provides metadata in asset.metadata.dimensions
  const dimensions = asset.metadata?.dimensions
  if (dimensions) {
    const width = dimensions.width || 0
    const height = dimensions.height || 0
    return {
      width,
      height,
      aspectRatio: width && height ? width / height : 1,
    }
  }

  // Fallback dimensions
  return { width: 0, height: 0, aspectRatio: 1 }
}

/**
 * Extract media metadata from file
 */
async function extractMediaMetadata(file: File, asset: any): Promise<MediaMetadata> {
  const metadata: MediaMetadata = {
    format: file.type.split('/')[1] || 'unknown',
  }

  // Extract from Sanity asset metadata
  if (asset.metadata) {
    metadata.colorSpace = asset.metadata.colorSpace
    metadata.dpi = asset.metadata.dpi
    metadata.quality = asset.metadata.quality
  }

  // Extract EXIF data for images (placeholder implementation)
  if (file.type.startsWith('image/')) {
    // In production, use libraries like exifr to extract EXIF data
    metadata.exif = {}
  }

  // Extract video metadata (placeholder implementation)
  if (file.type.startsWith('video/')) {
    metadata.duration = 0 // Extract from video file
    metadata.frameRate = 30
    metadata.bitrate = 0
    metadata.codec = 'h264'
  }

  return metadata
}

/**
 * Generate alt text for image
 */
function generateAltText(filename: string, metadata: MediaMetadata): string {
  const baseName = filename.split('.')[0].replace(/[-_]/g, ' ')
  
  // Simple alt text generation (in production, use AI/ML for better results)
  return `Image of ${baseName}`
}

/**
 * Generate auto tags for media
 */
async function generateAutoTags(file: File, metadata: MediaMetadata): Promise<string[]> {
  const tags: string[] = []

  // Add file type tags
  if (file.type.startsWith('image/')) {
    tags.push('image')
    if (file.type.includes('jpeg') || file.type.includes('jpg')) tags.push('jpeg')
    if (file.type.includes('png')) tags.push('png')
    if (file.type.includes('gif')) tags.push('gif')
    if (file.type.includes('svg')) tags.push('svg')
  } else if (file.type.startsWith('video/')) {
    tags.push('video')
  } else if (file.type.includes('pdf')) {
    tags.push('document', 'pdf')
  }

  // Add dimension-based tags
  if (metadata.dpi && metadata.dpi > 300) {
    tags.push('high-resolution')
  }

  return tags
}

/**
 * Generate media versions
 */
async function generateMediaVersions(asset: any, configs: MediaVersionConfig[], createdBy: string): Promise<MediaVersion[]> {
  const versions: MediaVersion[] = []

  // Add original version
  versions.push({
    id: crypto.randomUUID(),
    name: 'original',
    url: asset.url,
    dimensions: await extractImageDimensions(asset),
    size: asset.size || 0,
    format: asset.mimeType?.split('/')[1] || 'unknown',
    quality: 100,
    createdAt: new Date(),
    createdBy,
    isOriginal: true,
  })

  // Generate additional versions based on configs
  for (const config of configs) {
    // In production, use image processing libraries to generate versions
    versions.push({
      id: crypto.randomUUID(),
      name: config.name,
      url: asset.url, // Placeholder - would be transformed URL
      dimensions: {
        width: config.width || 0,
        height: config.height || 0,
        aspectRatio: config.width && config.height ? config.width / config.height : 1,
      },
      size: asset.size || 0,
      format: config.format || 'jpg',
      quality: config.quality || 80,
      createdAt: new Date(),
      createdBy,
      isOriginal: false,
    })
  }

  return versions
}

/**
 * Get media statistics
 */
export async function getMediaStats(): Promise<{
  totalAssets: number
  totalSize: number
  assetsByType: Record<string, number>
  assetsByStatus: Record<string, number>
  topDownloads: MediaAsset[]
  recentUploads: MediaAsset[]
  collectionsCount: number
}> {
  const stats = {
    totalAssets: mediaAssets.length,
    totalSize: mediaAssets.reduce((sum, asset) => sum + asset.size, 0),
    assetsByType: {} as Record<string, number>,
    assetsByStatus: {} as Record<string, number>,
    topDownloads: [...mediaAssets].sort((a, b) => b.analytics.downloads - a.analytics.downloads).slice(0, 10),
    recentUploads: [...mediaAssets].sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()).slice(0, 10),
    collectionsCount: mediaCollections.length,
  }

  // Count by type
  mediaAssets.forEach(asset => {
    const type = asset.mimeType.split('/')[0] || 'unknown'
    stats.assetsByType[type] = (stats.assetsByType[type] || 0) + 1
  })

  // Count by status
  mediaAssets.forEach(asset => {
    stats.assetsByStatus[asset.status] = (stats.assetsByStatus[asset.status] || 0) + 1
  })

  return stats
}

/**
 * Track media analytics
 */
export async function trackMediaAnalytics(assetId: string, action: 'view' | 'download' | 'share' | 'click'): Promise<void> {
  const asset = mediaAssets.find(a => a.id === assetId)
  if (!asset) return

  switch (action) {
    case 'view':
      asset.analytics.views++
      asset.analytics.lastViewed = new Date()
      break
    case 'download':
      asset.analytics.downloads++
      break
    case 'share':
      asset.analytics.shares++
      break
    case 'click':
      asset.analytics.clicks++
      break
  }

  // Update views over time (simplified - in production, use proper time series)
  const today = new Date().toISOString().split('T')[0]
  const existingEntry = asset.analytics.viewsOverTime.find(entry => entry.date === today)
  
  if (existingEntry) {
    if (action === 'view') existingEntry.views++
  } else {
    if (action === 'view') {
      asset.analytics.viewsOverTime.push({ date: today, views: 1 })
    }
  }
}
