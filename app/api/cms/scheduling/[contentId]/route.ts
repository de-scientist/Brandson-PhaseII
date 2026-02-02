import { NextResponse } from "next/server"
import { 
  updateScheduledContent,
  deleteScheduledContent,
  publishScheduledContent,
  getScheduledContent,
  createPublishingWorkflow,
  getContentWorkflows,
  updateWorkflowStep
} from '@/lib/cms-scheduling'
import { getAuthUser } from '@/lib/auth'

interface RouteParams {
  params: Promise<{
    contentId: string
  }>
}

// GET /api/cms/scheduling/[contentId] - Get specific scheduled content
export async function GET(req: Request, { params }: RouteParams) {
  try {
    // Get authenticated user
    const user = await getAuthUser(req)
    
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 })
    }

    const { contentId } = await params
    const { searchParams } = new URL(req.url)
    
    // Check if requesting workflows
    if (searchParams.get('workflows') === 'true') {
      const workflows = await getContentWorkflows(contentId)
      return NextResponse.json({
        success: true,
        data: workflows,
      })
    }

    // Get scheduled content
    const content = await getScheduledContent()
    const contentItem = content.find(c => c.id === contentId)
    
    if (!contentItem) {
      return NextResponse.json({
        success: false,
        error: 'Content not found',
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: contentItem,
    })
  } catch (error) {
    console.error('Get scheduled content error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch scheduled content',
    }, { status: 500 })
  }
}

// PUT /api/cms/scheduling/[contentId] - Update scheduled content
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    // Get authenticated user
    const user = await getAuthUser(req)
    
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 })
    }

    const updates = await req.json()
    const { contentId } = await params
    
    // Update scheduled content
    const updatedContent = await updateScheduledContent(contentId, updates, user.id)
    
    if (!updatedContent) {
      return NextResponse.json({
        success: false,
        error: 'Content not found',
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedContent,
      message: 'Content updated successfully',
    })
  } catch (error) {
    console.error('Update scheduled content error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update content',
    }, { status: 500 })
  }
}

// DELETE /api/cms/scheduling/[contentId] - Delete scheduled content
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    // Get authenticated user
    const user = await getAuthUser(req)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 })
    }

    const { contentId } = await params

    // Delete scheduled content
    const success = await deleteScheduledContent(contentId)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Content not found',
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully',
    })
  } catch (error) {
    console.error('Delete scheduled content error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete content',
    }, { status: 500 })
  }
}

// POST /api/cms/scheduling/[contentId]/publish - Publish content immediately
export async function POST(req: Request, { params }: RouteParams) {
  try {
    // Get authenticated user
    const user = await getAuthUser(req)
    
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 })
    }

    const { contentId } = await params
    const { searchParams } = new URL(req.url)
    const body = await req.json()
    const { steps } = body
      
    if (!steps || !Array.isArray(steps)) {
      return NextResponse.json({
        success: false,
        error: 'Workflow steps are required',
      }, { status: 400 })
    }

    // Check if creating workflow
    if (searchParams.get('workflow') === 'true') {
      const workflow = await createPublishingWorkflow(contentId, steps, user.id)
      
      return NextResponse.json({
        success: true,
        data: workflow,
        message: 'Publishing workflow created successfully',
      })
    }

    // Check if updating workflow step
    if (searchParams.get('step') === 'true') {
      const body = await req.json()
      const { stepId, status, notes } = body
      
      if (!stepId || !status) {
        return NextResponse.json({
          success: false,
          error: 'Step ID and status are required',
        }, { status: 400 })
      }

      const success = await updateWorkflowStep(contentId, stepId, { 
        status, 
        notes, 
        completedBy: user.id 
      })
      
      if (!success) {
        return NextResponse.json({
          success: false,
          error: 'Failed to update workflow step',
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Workflow step updated successfully',
      })
    }

    // Publish content immediately
    const success = await publishScheduledContent(contentId, user.id)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to publish content',
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Content published successfully',
    })
  } catch (error) {
    console.error('Publish content error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to publish content',
    }, { status: 500 })
  }
}
