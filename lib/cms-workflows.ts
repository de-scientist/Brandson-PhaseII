export interface EditorialUser {
  id: string
  name: string
  email: string
  role: EditorialRole
  permissions: Permission[]
  department: string
  avatar?: string
  isActive: boolean
  lastLogin?: Date
  preferences: UserPreferences
}

export interface UserPreferences {
  emailNotifications: boolean
  browserNotifications: boolean
  weeklyDigest: boolean
  timezone: string
  language: string
}

export type EditorialRole = 
  | 'admin'
  | 'editor'
  | 'writer'
  | 'reviewer'
  | 'designer'
  | 'publisher'

export type Permission = 
  | 'create_content'
  | 'edit_content'
  | 'delete_content'
  | 'publish_content'
  | 'schedule_content'
  | 'review_content'
  | 'approve_content'
  | 'manage_users'
  | 'manage_workflows'
  | 'view_analytics'
  | 'manage_media'

export interface EditorialWorkflow {
  id: string
  name: string
  description: string
  type: WorkflowType
  steps: WorkflowStep[]
  isActive: boolean
  isDefault: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
  version: number
  tags: string[]
}

export type WorkflowType = 
  | 'blog_post'
  | 'article'
  | 'product_page'
  | 'landing_page'
  | 'campaign'
  | 'social_media'
  | 'email_newsletter'
  | 'custom'

export interface WorkflowStep {
  id: string
  name: string
  description: string
  type: StepType
  assigneeRole: EditorialRole
  assigneeId?: string
  required: boolean
  order: number
  timeLimit?: number // in hours
  autoAssign?: boolean
  conditions?: StepCondition[]
  actions?: StepAction[]
  notifications: NotificationConfig
}

export type StepType = 
  | 'draft'
  | 'review'
  | 'edit'
  | 'approve'
  | 'design'
  | 'publish'
  | 'schedule'
  | 'notify'
  | 'custom'

export interface StepCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than'
  value: any
}

export interface StepAction {
  type: 'send_email' | 'notify_user' | 'update_status' | 'create_task' | 'schedule_publish'
  config: Record<string, any>
}

export interface NotificationConfig {
  assignee: boolean
  creator: boolean
  team: boolean
  custom: string[]
}

export interface WorkflowInstance {
  id: string
  workflowId: string
  contentId: string
  contentType: string
  title: string
  status: InstanceStatus
  currentStep: number
  steps: WorkflowInstanceStep[]
  createdBy: string
  assignedTo: string[]
  startedAt: Date
  dueDate?: Date
  completedAt?: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
  tags: string[]
  metadata: Record<string, any>
  comments: WorkflowComment[]
  attachments: WorkflowAttachment[]
  history: WorkflowHistory[]
}

export type InstanceStatus = 
  | 'draft'
  | 'in_progress'
  | 'review'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'cancelled'
  | 'on_hold'

export interface WorkflowInstanceStep {
  id: string
  stepId: string
  name: string
  type: StepType
  status: StepStatus
  assigneeId?: string
  assigneeName?: string
  startedAt?: Date
  completedAt?: Date
  dueDate?: Date
  notes?: string
  attachments: string[]
  timeSpent?: number // in minutes
}

export type StepStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'skipped'
  | 'rejected'
  | 'overdue'

export interface WorkflowComment {
  id: string
  stepId?: string
  authorId: string
  authorName: string
  content: string
  createdAt: Date
  updatedAt?: Date
  mentions: string[]
  attachments: string[]
  isInternal: boolean
}

export interface WorkflowAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedBy: string
  uploadedAt: Date
}

export interface WorkflowHistory {
  id: string
  action: HistoryAction
  stepId?: string
  userId: string
  userName: string
  timestamp: Date
  details: string
  metadata?: Record<string, any>
}

export type HistoryAction = 
  | 'created'
  | 'started'
  | 'assigned'
  | 'completed_step'
  | 'rejected_step'
  | 'skipped_step'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'cancelled'
  | 'commented'
  | 'attachment_added'
  | 'due_date_changed'
  | 'priority_changed'

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  steps: Omit<WorkflowStep, 'id'>[]
  tags: string[]
  isPublic: boolean
  usageCount: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowAnalytics {
  totalWorkflows: number
  activeWorkflows: number
  completedWorkflows: number
  averageCompletionTime: number // in hours
  overdueWorkflows: number
  workflowsByType: Record<string, number>
  workflowsByStatus: Record<string, number>
  userPerformance: UserPerformance[]
  stepAnalytics: StepAnalytics[]
}

export interface UserPerformance {
  userId: string
  userName: string
  role: EditorialRole
  assignedTasks: number
  completedTasks: number
  overdueTasks: number
  averageCompletionTime: number
  satisfactionScore?: number
}

export interface StepAnalytics {
  stepType: StepType
  totalOccurrences: number
  averageCompletionTime: number
  overdueRate: number
  rejectionRate: number
}

// In-memory storage for development (replace with database in production)
let users: EditorialUser[] = []
let workflows: EditorialWorkflow[] = []
let workflowInstances: WorkflowInstance[] = []
let templates: WorkflowTemplate[] = []

/**
 * Initialize default editorial users
 */
export async function initializeEditorialUsers(): Promise<void> {
  if (users.length > 0) return

  const defaultUsers: EditorialUser[] = [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@brandson.co.ke',
      role: 'admin',
      permissions: [
        'create_content', 'edit_content', 'delete_content', 'publish_content',
        'schedule_content', 'review_content', 'approve_content', 'manage_users',
        'manage_workflows', 'view_analytics', 'manage_media'
      ],
      department: 'Management',
      isActive: true,
      preferences: {
        emailNotifications: true,
        browserNotifications: true,
        weeklyDigest: true,
        timezone: 'Africa/Nairobi',
        language: 'en',
      },
    },
    {
      id: 'editor-1',
      name: 'Editor User',
      email: 'editor@brandson.co.ke',
      role: 'editor',
      permissions: [
        'create_content', 'edit_content', 'publish_content', 'schedule_content',
        'review_content', 'approve_content', 'view_analytics'
      ],
      department: 'Editorial',
      isActive: true,
      preferences: {
        emailNotifications: true,
        browserNotifications: false,
        weeklyDigest: true,
        timezone: 'Africa/Nairobi',
        language: 'en',
      },
    },
    {
      id: 'writer-1',
      name: 'Writer User',
      email: 'writer@brandson.co.ke',
      role: 'writer',
      permissions: [
        'create_content', 'edit_content'
      ],
      department: 'Content',
      isActive: true,
      preferences: {
        emailNotifications: true,
        browserNotifications: false,
        weeklyDigest: false,
        timezone: 'Africa/Nairobi',
        language: 'en',
      },
    },
    {
      id: 'reviewer-1',
      name: 'Reviewer User',
      email: 'reviewer@brandson.co.ke',
      role: 'reviewer',
      permissions: [
        'review_content', 'approve_content'
      ],
      department: 'Quality Assurance',
      isActive: true,
      preferences: {
        emailNotifications: true,
        browserNotifications: true,
        weeklyDigest: true,
        timezone: 'Africa/Nairobi',
        language: 'en',
      },
    },
  ]

  users = defaultUsers
}

/**
 * Create editorial workflow
 */
export async function createEditorialWorkflow(workflow: Omit<EditorialWorkflow, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<EditorialWorkflow> {
  const newWorkflow: EditorialWorkflow = {
    ...workflow,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
  }

  workflows.push(newWorkflow)
  return newWorkflow
}

/**
 * Get editorial workflows
 */
export async function getEditorialWorkflows(filter?: {
  type?: WorkflowType
  isActive?: boolean
  createdBy?: string
  tags?: string[]
}): Promise<EditorialWorkflow[]> {
  let filtered = [...workflows]

  if (filter) {
    if (filter.type) {
      filtered = filtered.filter(w => w.type === filter.type)
    }
    if (filter.isActive !== undefined) {
      filtered = filtered.filter(w => w.isActive === filter.isActive)
    }
    if (filter.createdBy) {
      filtered = filtered.filter(w => w.createdBy === filter.createdBy)
    }
    if (filter.tags?.length) {
      filtered = filtered.filter(w => 
        filter.tags!.some(tag => w.tags.includes(tag))
      )
    }
  }

  return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}

/**
 * Update editorial workflow
 */
export async function updateEditorialWorkflow(id: string, updates: Partial<EditorialWorkflow>): Promise<EditorialWorkflow | null> {
  const index = workflows.findIndex(w => w.id === id)
  if (index === -1) return null

  workflows[index] = {
    ...workflows[index],
    ...updates,
    updatedAt: new Date(),
    version: workflows[index].version + 1,
  }

  return workflows[index]
}

/**
 * Delete editorial workflow
 */
export async function deleteEditorialWorkflow(id: string): Promise<boolean> {
  const index = workflows.findIndex(w => w.id === id)
  if (index === -1) return false

  workflows.splice(index, 1)
  return true
}

/**
 * Create workflow instance
 */
export async function createWorkflowInstance(instance: Omit<WorkflowInstance, 'id' | 'startedAt' | 'comments' | 'attachments' | 'history'>): Promise<WorkflowInstance> {
  const workflow = workflows.find(w => w.id === instance.workflowId)
  if (!workflow) {
    throw new Error('Workflow not found')
  }

  const newInstance: WorkflowInstance = {
    ...instance,
    id: crypto.randomUUID(),
    startedAt: new Date(),
    comments: [],
    attachments: [],
    history: [{
      id: crypto.randomUUID(),
      action: 'created',
      userId: instance.createdBy,
      userName: users.find(u => u.id === instance.createdBy)?.name || 'Unknown',
      timestamp: new Date(),
      details: `Workflow instance created for ${instance.title}`,
    }],
    steps: workflow.steps.map((step, index) => ({
      id: crypto.randomUUID(),
      stepId: step.id,
      name: step.name,
      type: step.type,
      status: index === 0 ? 'pending' : 'pending',
      assigneeId: step.autoAssign ? findAssigneeForRole(step.assigneeRole) : undefined,
      assigneeName: step.autoAssign ? users.find(u => u.role === step.assigneeRole)?.name : undefined,
      dueDate: step.timeLimit ? new Date(Date.now() + step.timeLimit * 60 * 60 * 1000) : undefined,
      attachments: [],
    })),
  }

  workflowInstances.push(newInstance)
  return newInstance
}

/**
 * Get workflow instances
 */
export async function getWorkflowInstances(filter?: {
  status?: InstanceStatus
  assignedTo?: string
  createdBy?: string
  workflowType?: WorkflowType
  priority?: WorkflowInstance['priority']
  dateFrom?: Date
  dateTo?: Date
}): Promise<WorkflowInstance[]> {
  let filtered = [...workflowInstances]

  if (filter) {
    if (filter.status) {
      filtered = filtered.filter(i => i.status === filter.status)
    }
    if (filter.assignedTo) {
      filtered = filtered.filter(i => i.assignedTo.includes(filter.assignedTo!))
    }
    if (filter.createdBy) {
      filtered = filtered.filter(i => i.createdBy === filter.createdBy)
    }
    if (filter.workflowType) {
      const workflow = workflows.find(w => w.type === filter.workflowType)
      if (workflow) {
        filtered = filtered.filter(i => i.workflowId === workflow.id)
      }
    }
    if (filter.priority) {
      filtered = filtered.filter(i => i.priority === filter.priority)
    }
    if (filter.dateFrom) {
      filtered = filtered.filter(i => i.startedAt >= filter.dateFrom!)
    }
    if (filter.dateTo) {
      filtered = filtered.filter(i => i.startedAt <= filter.dateTo!)
    }
  }

  return filtered.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
}

/**
 * Update workflow instance step
 */
export async function updateWorkflowInstanceStep(
  instanceId: string, 
  stepId: string, 
  updates: {
    status: StepStatus
    notes?: string
    attachments?: string[]
    userId: string
  }
): Promise<boolean> {
  const instance = workflowInstances.find(i => i.id === instanceId)
  if (!instance) return false

  const step = instance.steps.find(s => s.id === stepId)
  if (!step) return false

  const user = users.find(u => u.id === updates.userId)
  if (!user) return false

  // Update step
  step.status = updates.status
  step.notes = updates.notes
  if (updates.attachments) {
    step.attachments = [...step.attachments, ...updates.attachments]
  }

  if (updates.status === 'in_progress' && !step.startedAt) {
    step.startedAt = new Date()
  }

  if (updates.status === 'completed') {
    step.completedAt = new Date()
    step.timeSpent = step.startedAt ? Math.floor((Date.now() - step.startedAt.getTime()) / (1000 * 60)) : 0
  }

  // Add to history
  instance.history.push({
    id: crypto.randomUUID(),
    action: updates.status === 'completed' ? 'completed_step' : 'rejected_step',
    stepId: stepId,
    userId: updates.userId,
    userName: user.name,
    timestamp: new Date(),
    details: `Step "${step.name}" ${updates.status}`,
  })

  // Update instance status and current step
  await updateInstanceProgress(instance)

  return true
}

/**
 * Add comment to workflow instance
 */
export async function addWorkflowComment(
  instanceId: string,
  comment: Omit<WorkflowComment, 'id' | 'createdAt' | 'authorName'>
): Promise<WorkflowComment | null> {
  const instance = workflowInstances.find(i => i.id === instanceId)
  if (!instance) return null

  const user = users.find(u => u.id === comment.authorId)
  if (!user) return null

  const newComment: WorkflowComment = {
    ...comment,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    authorName: user.name,
  }

  instance.comments.push(newComment)

  // Add to history
  instance.history.push({
    id: crypto.randomUUID(),
    action: 'commented',
    stepId: comment.stepId,
    userId: comment.authorId,
    userName: user.name,
    timestamp: new Date(),
    details: `Added comment${comment.stepId ? ` to step` : ''}`,
  })

  return newComment
}

/**
 * Get workflow analytics
 */
export async function getWorkflowAnalytics(): Promise<WorkflowAnalytics> {
  const totalWorkflows = workflowInstances.length
  const activeWorkflows = workflowInstances.filter(i => 
    ['draft', 'in_progress', 'review'].includes(i.status)
  ).length
  const completedWorkflows = workflowInstances.filter(i => i.status === 'published').length
  const overdueWorkflows = workflowInstances.filter(i => 
    i.steps.some(s => s.status === 'overdue')
  ).length

  // Calculate average completion time
  const completedInstances = workflowInstances.filter(i => i.completedAt)
  const averageCompletionTime = completedInstances.length > 0
    ? completedInstances.reduce((sum, i) => sum + (i.completedAt!.getTime() - i.startedAt.getTime()), 0) / completedInstances.length / (1000 * 60 * 60)
    : 0

  // Workflows by type
  const workflowsByType: Record<string, number> = {}
  workflowInstances.forEach(instance => {
    const workflow = workflows.find(w => w.id === instance.workflowId)
    if (workflow) {
      workflowsByType[workflow.type] = (workflowsByType[workflow.type] || 0) + 1
    }
  })

  // Workflows by status
  const workflowsByStatus: Record<string, number> = {}
  workflowInstances.forEach(instance => {
    workflowsByStatus[instance.status] = (workflowsByStatus[instance.status] || 0) + 1
  })

  // User performance
  const userPerformance: UserPerformance[] = []
  users.forEach(user => {
    const userSteps = workflowInstances.flatMap(i => i.steps).filter(s => s.assigneeId === user.id)
    const assignedTasks = userSteps.length
    const completedTasks = userSteps.filter(s => s.status === 'completed').length
    const overdueTasks = userSteps.filter(s => s.status === 'overdue').length
    
    const averageCompletionTime = completedTasks > 0
      ? userSteps
          .filter(s => s.status === 'completed' && s.timeSpent)
          .reduce((sum, s) => sum + (s.timeSpent || 0), 0) / completedTasks
      : 0

    userPerformance.push({
      userId: user.id,
      userName: user.name,
      role: user.role,
      assignedTasks,
      completedTasks,
      overdueTasks,
      averageCompletionTime,
    })
  })

  // Step analytics
  const stepAnalytics: StepAnalytics[] = []
  const stepTypes: StepType[] = ['draft', 'review', 'edit', 'approve', 'design', 'publish', 'schedule']
  
  stepTypes.forEach(type => {
    const stepsOfType = workflowInstances.flatMap(i => i.steps).filter(s => s.type === type)
    const totalOccurrences = stepsOfType.length
    const completedSteps = stepsOfType.filter(s => s.status === 'completed')
    const overdueSteps = stepsOfType.filter(s => s.status === 'overdue')
    const rejectedSteps = stepsOfType.filter(s => s.status === 'rejected')

    const averageCompletionTime = completedSteps.length > 0
      ? completedSteps.reduce((sum, s) => sum + (s.timeSpent || 0), 0) / completedSteps.length
      : 0

    stepAnalytics.push({
      stepType: type,
      totalOccurrences,
      averageCompletionTime,
      overdueRate: totalOccurrences > 0 ? overdueSteps.length / totalOccurrences : 0,
      rejectionRate: totalOccurrences > 0 ? rejectedSteps.length / totalOccurrences : 0,
    })
  })

  return {
    totalWorkflows,
    activeWorkflows,
    completedWorkflows,
    averageCompletionTime,
    overdueWorkflows,
    workflowsByType,
    workflowsByStatus,
    userPerformance,
    stepAnalytics,
  }
}

/**
 * Helper function to find assignee for a role
 */
function findAssigneeForRole(role: EditorialRole): string | undefined {
  const availableUsers = users.filter(u => u.role === role && u.isActive)
  if (availableUsers.length === 0) return undefined
  
  // Simple round-robin assignment (in production, use more sophisticated logic)
  return availableUsers[Math.floor(Math.random() * availableUsers.length)]?.id
}

/**
 * Update instance progress based on step completion
 */
async function updateInstanceProgress(instance: WorkflowInstance): Promise<void> {
  const currentStepIndex = instance.steps.findIndex(s => s.status === 'in_progress')
  const nextStepIndex = instance.steps.findIndex(s => s.status === 'pending')

  if (currentStepIndex === -1 && nextStepIndex === -1) {
    // All steps completed
    instance.status = 'approved'
    instance.completedAt = new Date()
  } else if (nextStepIndex !== undefined) {
    // Move to next step
    instance.currentStep = nextStepIndex
    instance.status = 'in_progress'
    
    // Auto-assign if needed
    const nextStep = instance.steps[nextStepIndex]
    const workflow = workflows.find(w => w.id === instance.workflowId)
    if (workflow && workflow.steps[nextStepIndex].autoAssign) {
      nextStep.assigneeId = findAssigneeForRole(workflow.steps[nextStepIndex].assigneeRole)
      nextStep.assigneeName = users.find(u => u.id === nextStep.assigneeId)?.name
    }
  }
}

/**
 * Get editorial users
 */
export async function getEditorialUsers(filter?: {
  role?: EditorialRole
  department?: string
  isActive?: boolean
}): Promise<EditorialUser[]> {
  await initializeEditorialUsers()
  
  let filtered = [...users]

  if (filter) {
    if (filter.role) {
      filtered = filtered.filter(u => u.role === filter.role)
    }
    if (filter.department) {
      filtered = filtered.filter(u => u.department === filter.department)
    }
    if (filter.isActive !== undefined) {
      filtered = filtered.filter(u => u.isActive === filter.isActive)
    }
  }

  return filtered
}

/**
 * Create workflow template
 */
export async function createWorkflowTemplate(template: Omit<WorkflowTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<WorkflowTemplate> {
  const newTemplate: WorkflowTemplate = {
    ...template,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    usageCount: 0,
  }

  templates.push(newTemplate)
  return newTemplate
}

/**
 * Get workflow templates
 */
export async function getWorkflowTemplates(filter?: {
  category?: string
  isPublic?: boolean
  tags?: string[]
}): Promise<WorkflowTemplate[]> {
  let filtered = [...templates]

  if (filter) {
    if (filter.category) {
      filtered = filtered.filter(t => t.category === filter.category)
    }
    if (filter.isPublic !== undefined) {
      filtered = filtered.filter(t => t.isPublic === filter.isPublic)
    }
    if (filter.tags?.length) {
      filtered = filtered.filter(t => 
        filter.tags!.some(tag => t.tags.includes(tag))
      )
    }
  }

  return filtered.sort((a, b) => b.usageCount - a.usageCount)
}
