import type { Role } from '../../auth/types'
import type { AppSidebarNavItem } from './AppSidebar'
import {
  COURSES_ROOT,
  DASHBOARD_ADMIN,
  DASHBOARD_COACH,
  DASHBOARD_STUDENT,
  GROUPS_ROOT,
  MATCHES_ROOT,
  PEOPLE_ROOT,
} from '../../routes/featurePaths'

/** Sidebar heading shown above nav links for each role. */
export const ROLE_SIDEBAR_LABEL: Record<Role, string> = {
  ADMIN: 'Administrator',
  COACH: 'Coach',
  STUDENT: 'Student',
}

export const ROLE_NAV_ARIA_LABEL: Record<Role, string> = {
  ADMIN: 'Admin navigation',
  COACH: 'Coach navigation',
  STUDENT: 'Student navigation',
}

/** Role-to-nav mapping for each shell; feature modules use neutral feature-first paths. */
export const ROLE_NAV_ITEMS: Record<Role, AppSidebarNavItem[]> = {
  ADMIN: [
    { to: DASHBOARD_ADMIN, label: 'Dashboard' },
    { to: COURSES_ROOT, label: 'Courses', activePrefix: COURSES_ROOT },
    { to: PEOPLE_ROOT, label: 'People', activePrefix: PEOPLE_ROOT },
    { to: GROUPS_ROOT, label: 'Group', activePrefix: GROUPS_ROOT },
    { to: MATCHES_ROOT, label: 'Matches', activePrefix: MATCHES_ROOT },
  ],
  COACH: [
    { to: DASHBOARD_COACH, label: 'Dashboard' },
    { to: COURSES_ROOT, label: 'Courses', activePrefix: COURSES_ROOT },
    { to: PEOPLE_ROOT, label: 'People', activePrefix: PEOPLE_ROOT },
    { to: GROUPS_ROOT, label: 'Group', activePrefix: GROUPS_ROOT },
    { to: MATCHES_ROOT, label: 'Matches', activePrefix: MATCHES_ROOT },
  ],
  STUDENT: [
    { to: DASHBOARD_STUDENT, label: 'Dashboard' },
    { to: '/student/courses', label: 'Courses', activePrefix: '/student/courses' },
  ],
}
