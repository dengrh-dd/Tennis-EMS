import type { Permission } from '../../permissions/types'

/** Course catalog + section drill-down capabilities (aligned with `permissions/types`). */
export const COURSE_PERMISSIONS = [
  'courses.view',
  'courses.create',
  'courses.edit',
  'courses.delete',
] as const satisfies readonly Permission[]
