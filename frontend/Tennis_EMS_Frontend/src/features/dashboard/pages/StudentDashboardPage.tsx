import RoleDashboardPage from './RoleDashboardPage'
import { studentDashboardConfig } from '../config/studentDashboardConfig'
import StudentDashboardInsights from './StudentDashboardInsights'

export default function StudentDashboardPage() {
  return (
    <RoleDashboardPage config={studentDashboardConfig} extensions={<StudentDashboardInsights />} />
  )
}

