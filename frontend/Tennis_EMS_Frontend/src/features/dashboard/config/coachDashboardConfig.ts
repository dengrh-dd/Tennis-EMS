import type { RoleDashboardConfig } from '../types/dashboard'
import { COURSES_ROOT, GROUPS_ROOT, MATCHES_ROOT } from '../../../routes/featurePaths'

export const coachDashboardConfig: RoleDashboardConfig = {
  roleLabel: 'Coach',
  heroTitle: 'Coach dashboard',
  heroSubtitle:
    'Use this dashboard to navigate sessions, groups, and match activity for the players you work with.',
  heroBadge: 'Coach',
  stats: [
    { id: 'today-sessions', title: 'Today’s sessions', value: '—', helperText: 'Scheduled sessions for today.' },
    { id: 'active-groups', title: 'Active groups', value: '—', helperText: 'Groups you coach or support.' },
    { id: 'enrolled-athletes', title: 'Enrolled athletes', value: '—', helperText: 'Players across your sessions.' },
    { id: 'upcoming-matches', title: 'Upcoming matches', value: '—', helperText: 'Planned match events.' },
  ],
  actions: [
    {
      id: 'view-sessions',
      title: 'View sessions',
      description: 'Review upcoming classes and training sessions.',
      to: COURSES_ROOT,
      buttonText: 'Go to Courses',
    },
    {
      id: 'manage-groups',
      title: 'Manage groups',
      description: 'Edit training groups and review member lists.',
      to: GROUPS_ROOT,
      buttonText: 'Open Groups',
    },
    {
      id: 'take-attendance',
      title: 'Take attendance',
      description: 'Record attendance directly from course sessions.',
      to: COURSES_ROOT,
      buttonText: 'Open Attendance',
    },
    {
      id: 'record-matches',
      title: 'Record matches',
      description: 'Log scores and outcomes for matches you coach.',
      to: MATCHES_ROOT,
      buttonText: 'Open Matches',
    },
  ],
  features: [
    {
      id: 'feature-sessions',
      title: 'Session overview',
      description: 'Browse and filter the sessions you lead.',
      to: COURSES_ROOT,
      statusLabel: 'Coach-focused',
    },
    {
      id: 'feature-groups',
      title: 'Training groups',
      description: 'Organize players into training groups and squads.',
      to: GROUPS_ROOT,
      statusLabel: 'Coach-focused',
    },
    {
      id: 'feature-attendance',
      title: 'Attendance',
      description: 'Track participation and attendance performance.',
      to: COURSES_ROOT,
      statusLabel: 'Shared with admin',
    },
    {
      id: 'feature-matches',
      title: 'Matches',
      description: 'Plan and review match details for athletes.',
      to: MATCHES_ROOT,
      statusLabel: 'In rollout',
    },
  ],
}

