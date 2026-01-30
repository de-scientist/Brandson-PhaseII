import { NextResponse } from "next/server"
import { trackMediaAnalytics } from '@/lib/cms-media'

// POST /api/cms/media/track - Track analytics
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { assetId, action } = body
    
    if (!assetId || !action) {
      return NextResponse.json({
        success: false,
        error: 'assetId and action are required',
      }, { status: 400 })
    }

    if (!['view', 'download', 'share', 'click'].includes(action)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid action',
      }, { status: 400 })
    }

    await trackMediaAnalytics(assetId, action)
    
    return NextResponse.json({
      success: true,
      message: 'Analytics tracked successfully',
    })
  } catch (error) {
    console.error('Track analytics error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to track analytics',
    }, { status: 500 })
  }
}
