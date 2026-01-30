import { NextResponse } from "next/server"
import { 
  createEditorialWorkflow,
  getEditorialWorkflows,
  getWorkflowAnalytics,
  createWorkflowInstance,
  getWorkflowInstances,
  getEditorialUsers
} from '@/lib/cms-workflows'
import { getAuthUser } from '@/lib/auth'

// GET /api/cms/workflows - Get workflows or instances
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
    
    // Get analytics
    if (searchParams.get('analytics') === 'true') {
      const analytics = await getWorkflowAnalytics()
      return NextResponse.json({
        success: true,
        data: analytics,
      })
    }

    // Get users
    if (searchParams.get('users') === 'true') {
      const role = searchParams.get('role') as any
      const department = searchParams.get('department') || undefined
      const isActive = searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined
      
      const users = await getEditorialUsers({ role, department, isActive })
      return NextResponse.json({
        success: true,
        data: users,
      })
    }

    // Get workflow instances
    if (type === 'instances') {
      const filter: any = {}
      
      if (searchParams.get('status')) {
        filter.status = searchParams.get('status')!
      }
      
      if (searchParams.get('assignedTo')) {
        filter.assignedTo = searchParams.get('assignedTo')!
      }
      
      if (searchParams.get('createdBy')) {
        filter.createdBy = searchParams.get('createdBy')!
      }
      
      if (searchParams.get('workflowType')) {
        filter.workflowType = searchParams.get('workflowType') as any
      }
      
      if (searchParams.get('priority')) {
        filter.priority = searchParams.get('priority') as any
      }
      
      if (searchParams.get('dateFrom')) {
        filter.dateFrom = new Date(searchParams.get('dateFrom')!)
      }
      
      if (searchParams.get('dateTo')) {
        filter.dateTo = new Date(searchParams.get('dateTo')!)
      }

      const instances = await getWorkflowInstances(filter)
      return NextResponse.json({
        success: true,
        data: instances,
        count: instances.length,
      })
    }

    // Get workflow definitions
    const filter: any = {}
    
    if (searchParams.get('workflowType')) {
      filter.type = searchParams.get('workflowType') as any
    }
    
    if (searchParams.get('isActive') !== null) {
      filter.isActive = searchParams.get('isActive') === 'true'
    }
    
    if (searchParams.get('createdBy')) {
      filter.createdBy = searchParams.get('createdBy')!
    }
    
    if (searchParams.get('tags')) {
      filter.tags = searchParams.get('tags')?.split(',').map(t => t.trim())
    }

    const workflows = await getEditorialWorkflows(filter)
    
    return NextResponse.json({
      success: true,
      data: workflows,
      count: workflows.length,
    })
  } catch (error) {
    console.error('Workflows API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch workflows',
    }, { status: 500 })
  }
}

// POST /api/cms/workflows - Create workflow or instance
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
    const { type } = body

    if (type === 'instance') {
      // Create workflow instance
      const { workflowId, contentId, contentType, title, priority, tags, metadata } = body
      
      if (!workflowId || !contentId || !contentType || !title) {
        return NextResponse.json({
          success: false,
          error: 'workflowId, contentId, contentType, and title are required',
        }, { status: 400 })
      }

      const instance = await createWorkflowInstance({
        workflowId,
        contentId,
        contentType,
        title,
        status: 'draft',
        currentStep: 0,
        steps: [], // Will be populated by the function
        createdBy: user.id,
        assignedTo: [],
        priority: priority || 'medium',
        tags: tags || [],
        metadata: metadata || {},
      })

      return NextResponse.json({
        success: true,
        data: instance,
        message: 'Workflow instance created successfully',
      })
    } else {
      // Create workflow definition
      const { name, description, workflowType, steps, isActive, isDefault, tags } = body
      
      if (!name || !workflowType || !steps || !Array.isArray(steps)) {
        return NextResponse.json({
          success: false,
          error: 'name, workflowType, and steps are required',
        }, { status: 400 })
      }

      const workflow = await createEditorialWorkflow({
        name,
        description,
        type: workflowType,
        steps,
        isActive: isActive ?? true,
        isDefault: isDefault ?? false,
        createdBy: user.id,
        tags: tags || [],
      })

      return NextResponse.json({
        success: true,
        data: workflow,
        message: 'Workflow created successfully',
      })
    }
  } catch (error) {
    console.error('Create workflow error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create workflow',
    }, { status: 500 })
  }
}
