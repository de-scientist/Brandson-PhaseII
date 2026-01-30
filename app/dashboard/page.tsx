import { getAuthUser } from "@/lib/auth"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  // Get authenticated user
  const user = await getAuthUser({} as Request)
  
  if (!user) {
    redirect('/login')
  }

  return <EnhancedDashboard />
}
