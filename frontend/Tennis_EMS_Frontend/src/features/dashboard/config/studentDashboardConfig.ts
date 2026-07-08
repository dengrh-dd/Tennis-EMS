import type { RoleDashboardConfig } from '../types/dashboard'

export const studentDashboardConfig: RoleDashboardConfig = {
  roleLabel: 'Student',
  heroTitle: 'Student dashboard',
  heroSubtitle:
    'Use this dashboard to see your enrollments, upcoming sessions, groups, and match activity at a glance.',
  heroBadge: 'Student',
  stats: [
    { id: 'active-courses', title: 'Active courses', value: '—', helperText: 'Courses you are currently enrolled in.' },
    { id: 'upcoming-sessions', title: 'Upcoming sessions', value: '—', helperText: 'Next scheduled training times.' },
    { id: 'groups', title: 'Training groups', value: '—', helperText: 'Groups you are assigned to.' },
    { id: 'recent-attendance', title: 'Recent attendance', value: '—', helperText: 'Recent check-ins across sessions.' },
  ],
  actions: [
    {
      id: 'view-courses',
      title: 'View your courses',
      description: 'See which courses and sections you are enrolled in.',
      to: '/student/courses',
      buttonText: 'Open Courses',
    },
  ],
  features: [
    {
      id: 'feature-courses',
      title: 'Courses',
      description: 'Overview of the courses and sections you participate in.',
      to: '/student/courses',
      statusLabel: 'Student-focused',
    },
  ],
}
