import { redirect } from 'next/navigation'
import { EnhancedDashboard } from "@/components/enhanced-dashboard"

export default async function DashboardPage() {
  // Simple dashboard without auth for now
  return <EnhancedDashboard />
}
