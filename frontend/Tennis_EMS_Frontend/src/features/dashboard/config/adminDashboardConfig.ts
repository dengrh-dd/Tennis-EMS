import type { RoleDashboardConfig } from '../types/dashboard'
import { COURSES_ROOT, GROUPS_ROOT, MATCHES_ROOT, PEOPLE_ROOT } from '../../../routes/featurePaths'

export const adminDashboardConfig: RoleDashboardConfig = {
  roleLabel: 'Admin',
  heroTitle: 'Admin dashboard',
  heroSubtitle:
    'Use this dashboard as your starting point for managing courses, people, groups, and matches across the program.',
  heroBadge: 'Admin',
  stats: [
    { id: 'courses', title: 'Courses', value: '—', helperText: 'Course catalog and sections.' },
    { id: 'people', title: 'People', value: '—', helperText: 'Accounts and roles.' },
    { id: 'groups', title: 'Groups', value: '—', helperText: 'Training groups and members.' },
    { id: 'matches', title: 'Matches', value: '—', helperText: 'Match scheduling and results.' },
  ],
  actions: [
    {
      id: 'manage-courses',
      title: 'Manage courses',
      description: 'Configure catalog, sections, and sessions for your program.',
      to: COURSES_ROOT,
      buttonText: 'Go to Courses',
    },
    {
      id: 'manage-people',
      title: 'Manage people',
      description: 'Review user accounts, roles, and directory entries.',
      to: PEOPLE_ROOT,
      buttonText: 'Open People',
    },
    {
      id: 'manage-groups',
      title: 'Manage groups',
      description: 'Create and maintain training groups and their members.',
      to: GROUPS_ROOT,
      buttonText: 'Open Groups',
    },
    {
      id: 'manage-matches',
      title: 'Manage matches',
      description: 'Plan and review matches for players and teams.',
      to: MATCHES_ROOT,
      buttonText: 'Open Matches',
    },
  ],
  features: [
    {
      id: 'feature-courses',
      title: 'Course management',
      description: 'Course catalog, sections, sessions, enrollment, and attendance.',
      to: COURSES_ROOT,
      statusLabel: 'Core module',
    },
    {
      id: 'feature-people',
      title: 'People directory',
      description: 'Search and manage accounts, roles, and contact details.',
      to: PEOPLE_ROOT,
      statusLabel: 'Core module',
    },
    {
      id: 'feature-groups',
      title: 'Group management',
      description: 'Define training groups, assign members, and track activity.',
      to: GROUPS_ROOT,
      statusLabel: 'Core module',
    },
    {
      id: 'feature-matches',
      title: 'Match management',
      description: 'Track match schedules and outcomes for players.',
      to: MATCHES_ROOT,
      statusLabel: 'In rollout',
    },
  ],
}
