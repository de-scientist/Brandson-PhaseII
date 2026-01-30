import { NextResponse } from "next/server"
import { 
  createScheduledContent,
  getScheduledContent,
  getContentStats,
  processScheduledPublishing
} from '@/lib/cms-scheduling'
import { getAuthUser } from '@/lib/auth'

// GET /api/cms/scheduling - Get scheduled content
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
    
    // Check if requesting stats
    if (searchParams.get('stats') === 'true') {
      const stats = await getContentStats()
      return NextResponse.json({
        success: true,
        data: stats,
      })
    }

    // Check if requesting to process scheduled publishing
    if (searchParams.get('process') === 'true') {
      const result = await processScheduledPublishing()
      return NextResponse.json({
        success: true,
        data: result,
        message: `Processed ${result.published} publishes and ${result.unpublished} unpublishes`,
      })
    }

    // Parse filter parameters
    const filter: any = {}
    
    if (searchParams.get('status')) {
      filter.status = searchParams.get('status')?.split(',').map(s => s.trim())
    }
    
    if (searchParams.get('author')) {
      filter.author = searchParams.get('author')!
    }
    
    if (searchParams.get('category')) {
      filter.category = searchParams.get('category')!
    }
    
    if (searchParams.get('date_from')) {
      filter.dateFrom = new Date(searchParams.get('date_from')!)
    }
    
    if (searchParams.get('date_to')) {
      filter.dateTo = new Date(searchParams.get('date_to')!)
    }
    
    if (searchParams.get('priority')) {
      filter.priority = searchParams.get('priority')?.split(',').map(p => p.trim())
    }
    
    if (searchParams.get('search')) {
      filter.search = searchParams.get('search')!
    }

    // Get scheduled content
    const content = await getScheduledContent(filter)
    
    return NextResponse.json({
      success: true,
      data: content,
      count: content.length,
    })
  } catch (error) {
    console.error('CMS scheduling API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch scheduled content',
    }, { status: 500 })
  }
}

// POST /api/cms/scheduling - Create scheduled content
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

    const body = await req.json()
    
    // Validate required fields
    const requiredFields = ['title', 'content', 'publishAt', 'category', '_type']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          success: false,
          error: `${field} is required`,
        }, { status: 400 })
      }
    }

    // Create scheduled content
    const scheduledContent = await createScheduledContent({
      ...body,
      author: user.id,
      publishAt: new Date(body.publishAt),
      unpublishAt: body.unpublishAt ? new Date(body.unpublishAt) : undefined,
      status: body.status || 'draft',
      tags: body.tags || [],
      priority: body.priority || 'medium',
      timezone: body.timezone || 'Africa/Nairobi',
      notifications: {
        author: body.notifications?.author ?? true,
        reviewer: body.notifications?.reviewer ?? false,
        team: body.notifications?.team ?? false,
      },
      metadata: body.metadata || {},
    })

    return NextResponse.json({
      success: true,
      data: scheduledContent,
      message: 'Content scheduled successfully',
    })
  } catch (error) {
    console.error('Create scheduled content error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to schedule content',
    }, { status: 500 })
  }
}
