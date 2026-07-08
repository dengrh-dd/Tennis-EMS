import type { Role } from './types'
import { DASHBOARD_ADMIN, DASHBOARD_COACH, DASHBOARD_STUDENT } from '../routes/featurePaths'

export function roleHome(role: Role): string {
  if (role === 'ADMIN') return DASHBOARD_ADMIN
  if (role === 'COACH') return DASHBOARD_COACH
  return DASHBOARD_STUDENT
}
