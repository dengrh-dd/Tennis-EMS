import { Route, Routes } from 'react-router-dom'
import AuthGate from '../auth/AuthGate'
import LoginPage from '../pages/LoginPage'
import { AdminDashboardPage, CoachDashboardPage, StudentDashboardPage } from '../features/dashboard/pages'
import { GroupMembersPage, GroupPage } from '../features/group'
import { MatchDetailPage, MatchPage } from '../features/matches'
import { PeoplePage } from '../features/people'
import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute, { ALLOW_ADMIN_COACH, ALLOW_COACH, ALLOW_STUDENT } from './ProtectedRoute'
import {
  AttendancePage,
  CourseSectionsPage,
  CoursesPage,
  EnrollmentPage,
  SectionSessionsPage,
  StudentCoursesPage,
} from '../features/courses'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthGate />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/admin" element={<ProtectedRoute allowedRoles={ALLOW_ADMIN_COACH} />}>
        <Route element={<AppLayout />}>
          <Route index element={<AdminDashboardPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={ALLOW_ADMIN_COACH} />}>
        <Route element={<AppLayout />}>
          <Route
            path="/courses/:courseId/sections/:sectionId/sessions/:sessionId/attendance"
            element={<AttendancePage />}
          />
          <Route
            path="/courses/:courseId/sections/:sectionId/sessions"
            element={<SectionSessionsPage />}
          />
          <Route
            path="/courses/:courseId/sections/:sectionId/enrollment"
            element={<EnrollmentPage />}
          />
          <Route path="/courses/:courseId/sections" element={<CourseSectionsPage />} />
          <Route path="/courses" element={<CoursesPage />} />

          <Route path="/people" element={<PeoplePage />} />
          <Route path="/groups" element={<GroupPage />} />
          <Route path="/groups/:groupId/members" element={<GroupMembersPage />} />
          <Route path="/matches" element={<MatchPage />} />
          <Route path="/matches/:matchId" element={<MatchDetailPage />} />
        </Route>
      </Route>

      <Route path="/coach" element={<ProtectedRoute allowedRoles={ALLOW_COACH} />}>
        <Route element={<AppLayout />}>
          <Route index element={<CoachDashboardPage />} />
        </Route>
      </Route>

      <Route path="/student" element={<ProtectedRoute allowedRoles={ALLOW_STUDENT} />}>
        <Route element={<AppLayout />}>
          <Route index element={<StudentDashboardPage />} />
          <Route path="courses" element={<StudentCoursesPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
