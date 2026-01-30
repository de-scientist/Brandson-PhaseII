import { sanityClient } from '@/lib/sanity'

export interface ScheduledContent {
  id: string
  _type: string
  title: string
  content: any
  publishAt: Date
  unpublishAt?: Date
  status: 'draft' | 'scheduled' | 'published' | 'expired'
  author: string
  reviewer?: string
  tags: string[]
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  timezone: string
  notifications: {
    author: boolean
    reviewer: boolean
    team: boolean
  }
  metadata: {
    seoTitle?: string
    seoDescription?: string
    featuredImage?: string
    readingTime?: number
    wordCount?: number
  }
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  revisionHistory: ContentRevision[]
}

export interface ContentRevision {
  id: string
  author: string
  timestamp: Date
  changes: string
  version: number
  published: boolean
}

export interface PublishingWorkflow {
  id: string
  contentId: string
  steps: WorkflowStep[]
  currentStep: number
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'cancelled'
  createdBy: string
  assignedTo?: string[]
  dueDate?: Date
  completedAt?: Date
}

export interface WorkflowStep {
  id: string
  name: string
  description: string
  type: 'review' | 'approval' | 'edit' | 'publish' | 'notify'
  assignee?: string
  status: 'pending' | 'in_progress' | 'completed' | 'skipped'
  completedAt?: Date
  notes?: string
  required: boolean
  order: number
}

export interface ContentCalendar {
  id: string
  date: Date
  contents: ScheduledContent[]
  events: CalendarEvent[]
  notes: string
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime?: Date
  type: 'content_publish' | 'campaign' | 'meeting' | 'deadline' | 'holiday'
  attendees?: string[]
  location?: string
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: Date
  }
}

// In-memory storage for development (replace with database in production)
let scheduledContent: ScheduledContent[] = []
let workflows: PublishingWorkflow[] = []
let calendarEvents: CalendarEvent[] = []

const sanity = sanityClient

/**
 * Create scheduled content
 */
export async function createScheduledContent(content: Omit<ScheduledContent, 'id' | 'createdAt' | 'updatedAt' | 'revisionHistory'>): Promise<ScheduledContent> {
  const scheduledContentItem: ScheduledContent = {
    ...content,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    revisionHistory: [{
      id: crypto.randomUUID(),
      author: content.author,
      timestamp: new Date(),
      changes: 'Initial content creation',
      version: 1,
      published: false,
    }],
  }

  // Store in memory (in production, save to database)
  scheduledContent.push(scheduledContentItem)

  // Create draft in Sanity
  try {
    const sanityDoc = {
      ...content.content,
      _type: content._type,
      title: content.title,
      slug: {
        _type: 'slug',
        current: generateSlug(content.title),
      },
      publishAt: content.publishAt.toISOString(),
      unpublishAt: content.unpublishAt?.toISOString(),
      status: content.status,
      author: content.author,
      tags: content.tags,
      category: content.category,
      priority: content.priority,
      metadata: content.metadata,
      createdAt: scheduledContentItem.createdAt.toISOString(),
      updatedAt: scheduledContentItem.updatedAt.toISOString(),
    }

    await sanity.create(sanityDoc)
  } catch (error) {
    console.error('Error creating Sanity document:', error)
  }

  return scheduledContentItem
}

/**
 * Get scheduled content with filtering
 */
export async function getScheduledContent(filter?: {
  status?: ScheduledContent['status'][]
  author?: string
  category?: string
  dateFrom?: Date
  dateTo?: Date
  priority?: ScheduledContent['priority'][]
  search?: string
}): Promise<ScheduledContent[]> {
  let filtered = [...scheduledContent]

  if (filter) {
    if (filter.status?.length) {
      filtered = filtered.filter(c => filter.status!.includes(c.status))
    }
    if (filter.author) {
      filtered = filtered.filter(c => c.author === filter.author)
    }
    if (filter.category) {
      filtered = filtered.filter(c => c.category === filter.category)
    }
    if (filter.dateFrom) {
      filtered = filtered.filter(c => c.publishAt >= filter.dateFrom!)
    }
    if (filter.dateTo) {
      filtered = filtered.filter(c => c.publishAt <= filter.dateTo!)
    }
    if (filter.priority?.length) {
      filtered = filtered.filter(c => filter.priority!.includes(c.priority))
    }
    if (filter.search) {
      const search = filter.search.toLowerCase()
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(search) ||
        c.tags.some(tag => tag.toLowerCase().includes(search)) ||
        c.category.toLowerCase().includes(search)
      )
    }
  }

  return filtered.sort((a, b) => b.publishAt.getTime() - a.publishAt.getTime())
}

/**
 * Update scheduled content
 */
export async function updateScheduledContent(id: string, updates: Partial<ScheduledContent>, author: string): Promise<ScheduledContent | null> {
  const index = scheduledContent.findIndex(c => c.id === id)
  if (index === -1) return null

  const content = scheduledContent[index]
  const updatedContent = {
    ...content,
    ...updates,
    updatedAt: new Date(),
    revisionHistory: [
      ...content.revisionHistory,
      {
        id: crypto.randomUUID(),
        author,
        timestamp: new Date(),
        changes: generateChangeDescription(content, updates),
        version: content.revisionHistory.length + 1,
        published: false,
      },
    ],
  }

  scheduledContent[index] = updatedContent

  // Update in Sanity
  try {
    await sanity
      .patch(content.content._id || id)
      .set({
        ...updates,
        updatedAt: updatedContent.updatedAt.toISOString(),
      })
      .commit()
  } catch (error) {
    console.error('Error updating Sanity document:', error)
  }

  return updatedContent
}

/**
 * Delete scheduled content
 */
export async function deleteScheduledContent(id: string): Promise<boolean> {
  const index = scheduledContent.findIndex(c => c.id === id)
  if (index === -1) return false

  const content = scheduledContent[index]
  scheduledContent.splice(index, 1)

  // Delete from Sanity
  try {
    await sanity.delete(content.content._id || id)
  } catch (error) {
    console.error('Error deleting Sanity document:', error)
  }

  return true
}

/**
 * Publish scheduled content
 */
export async function publishScheduledContent(id: string, publishedBy: string): Promise<boolean> {
  const content = scheduledContent.find(c => c.id === id)
  if (!content) return false

  try {
    // Update status in Sanity
    await sanity
      .patch(content.content._id || id)
      .set({
        status: 'published',
        publishedAt: new Date().toISOString(),
        publishedBy,
      })
      .commit()

    // Update local status
    content.status = 'published'
    content.publishedAt = new Date()
    content.updatedAt = new Date()

    // Add to revision history
    content.revisionHistory.push({
      id: crypto.randomUUID(),
      author: publishedBy,
      timestamp: new Date(),
      changes: 'Content published',
      version: content.revisionHistory.length + 1,
      published: true,
    })

    return true
  } catch (error) {
    console.error('Error publishing content:', error)
    return false
  }
}

/**
 * Get content calendar
 */
export async function getContentCalendar(dateFrom: Date, dateTo: Date): Promise<ContentCalendar[]> {
  const calendars: ContentCalendar[] = []
  const currentDate = new Date(dateFrom)

  while (currentDate <= dateTo) {
    const dayStart = new Date(currentDate)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(currentDate)
    dayEnd.setHours(23, 59, 59, 999)

    const dayContents = scheduledContent.filter(c =>
      c.publishAt >= dayStart && c.publishAt <= dayEnd
    )

    const dayEvents = calendarEvents.filter(e =>
      e.startTime >= dayStart && e.startTime <= dayEnd
    )

    calendars.push({
      id: crypto.randomUUID(),
      date: new Date(currentDate),
      contents: dayContents,
      events: dayEvents,
      notes: '',
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return calendars
}

/**
 * Create publishing workflow
 */
export async function createPublishingWorkflow(contentId: string, steps: Omit<WorkflowStep, 'id' | 'status' | 'completedAt'>[], createdBy: string): Promise<PublishingWorkflow> {
  const workflow: PublishingWorkflow = {
    id: crypto.randomUUID(),
    contentId,
    steps: steps.map((step, index) => ({
      ...step,
      id: crypto.randomUUID(),
      status: 'pending',
      order: index,
    })),
    currentStep: 0,
    status: 'pending',
    createdBy,
    dueDate: steps.find(s => s.required)?.assignee ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined,
  }

  workflows.push(workflow)
  return workflow
}

/**
 * Get workflows for content
 */
export async function getContentWorkflows(contentId: string): Promise<PublishingWorkflow[]> {
  return workflows.filter(w => w.contentId === contentId)
}

/**
 * Update workflow step
 */
export async function updateWorkflowStep(workflowId: string, stepId: string, updates: { status: WorkflowStep['status']; notes?: string; completedBy?: string }): Promise<boolean> {
  const workflow = workflows.find(w => w.id === workflowId)
  if (!workflow) return false

  const step = workflow.steps.find(s => s.id === stepId)
  if (!step) return false

  step.status = updates.status
  step.notes = updates.notes
  if (updates.status === 'completed') {
    step.completedAt = new Date()
  }

  // Update workflow status
  const nextStep = workflow.steps.find(s => s.order > step.order && s.status === 'pending')
  if (nextStep) {
    workflow.currentStep = nextStep.order
    workflow.status = 'in_progress'
  } else {
    workflow.status = 'completed'
    workflow.completedAt = new Date()
  }

  return true
}

/**
 * Get scheduled content that needs to be published
 */
export async function getContentToPublish(): Promise<ScheduledContent[]> {
  const now = new Date()
  return scheduledContent.filter(c =>
    c.status === 'scheduled' &&
    c.publishAt <= now &&
    (!c.unpublishAt || c.unpublishAt > now)
  )
}

/**
 * Get scheduled content that needs to be unpublished
 */
export async function getContentToUnpublish(): Promise<ScheduledContent[]> {
  const now = new Date()
  return scheduledContent.filter(c =>
    c.status === 'published' &&
    c.unpublishAt &&
    c.unpublishAt <= now
  )
}

/**
 * Process scheduled publishing (cron job function)
 */
export async function processScheduledPublishing(): Promise<{ published: number; unpublished: number }> {
  const toPublish = await getContentToPublish()
  const toUnpublish = await getContentToUnpublish()

  let publishedCount = 0
  let unpublishedCount = 0

  // Publish scheduled content
  for (const content of toPublish) {
    if (await publishScheduledContent(content.id, 'system')) {
      publishedCount++
    }
  }

  // Unpublish expired content
  for (const content of toUnpublish) {
    try {
      await sanity
        .patch(content.content._id || content.id)
        .set({
          status: 'expired',
          unpublishedAt: new Date().toISOString(),
        })
        .commit()

      content.status = 'expired'
      content.updatedAt = new Date()
      unpublishedCount++
    } catch (error) {
      console.error('Error unpublishing content:', error)
    }
  }

  return { published: publishedCount, unpublished: unpublishedCount }
}

/**
 * Generate URL-friendly slug
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Generate change description for revision history
 */
function generateChangeDescription(original: ScheduledContent, updates: Partial<ScheduledContent>): string {
  const changes: string[] = []

  if (updates.title && updates.title !== original.title) {
    changes.push('Title updated')
  }
  if (updates.content && JSON.stringify(updates.content) !== JSON.stringify(original.content)) {
    changes.push('Content updated')
  }
  if (updates.publishAt && updates.publishAt.getTime() !== original.publishAt.getTime()) {
    changes.push('Publish time updated')
  }
  if (updates.status && updates.status !== original.status) {
    changes.push(`Status changed to ${updates.status}`)
  }
  if (updates.priority && updates.priority !== original.priority) {
    changes.push(`Priority changed to ${updates.priority}`)
  }

  return changes.length > 0 ? changes.join(', ') : 'Metadata updated'
}

/**
 * Get content statistics
 */
export async function getContentStats(): Promise<{
  total: number
  byStatus: Record<string, number>
  byCategory: Record<string, number>
  byPriority: Record<string, number>
  scheduledThisWeek: number
  scheduledThisMonth: number
}> {
  const now = new Date()
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const stats = {
    total: scheduledContent.length,
    byStatus: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    byPriority: {} as Record<string, number>,
    scheduledThisWeek: 0,
    scheduledThisMonth: 0,
  }

  scheduledContent.forEach(content => {
    // By status
    stats.byStatus[content.status] = (stats.byStatus[content.status] || 0) + 1
    
    // By category
    stats.byCategory[content.category] = (stats.byCategory[content.category] || 0) + 1
    
    // By priority
    stats.byPriority[content.priority] = (stats.byPriority[content.priority] || 0) + 1
    
    // Scheduled counts
    if (content.publishAt >= weekStart) {
      stats.scheduledThisWeek++
    }
    if (content.publishAt >= monthStart) {
      stats.scheduledThisMonth++
    }
  })

  return stats
}
