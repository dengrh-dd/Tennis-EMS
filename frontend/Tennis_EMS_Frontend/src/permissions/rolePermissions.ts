import type { Role } from '../auth/types'
import type { Permission } from './types'

const allCourse: Permission[] = [
  'courses.view',
  'courses.create',
  'courses.edit',
  'courses.delete',
]
const allGroups: Permission[] = [
  'groups.view',
  'groups.create',
  'groups.edit',
  'groups.delete',
]
const allMatches: Permission[] = [
  'matches.view',
  'matches.create',
  'matches.edit',
  'matches.delete',
]
const allUsers: Permission[] = [
  'users.view',
  'users.create',
  'users.edit',
  'users.delete',
]

const coachCourse: Permission[] = [
  'courses.view',
  'courses.create',
  'courses.edit',
  'courses.delete',
]
const coachGroups: Permission[] = [
  'groups.view',
  'groups.create',
  'groups.edit',
  'groups.delete',
]
const coachMatches: Permission[] = [
  'matches.view',
  'matches.create',
  'matches.edit',
  'matches.delete',
]
const coachUsers: Permission[] = ['users.view', 'users.edit']

const studentRead: Permission[] = [
  'courses.view',
  'groups.view',
  'matches.view',
  'users.view',
]

function setOf(list: Permission[]): Set<Permission> {
  return new Set(list)
}

/** Static role → permission map (phase 1). */
export const ROLE_PERMISSIONS: Record<Role, Set<Permission>> = {
  ADMIN: setOf([...allCourse, ...allGroups, ...allMatches, ...allUsers]),
  COACH: setOf([...coachCourse, ...coachGroups, ...coachMatches, ...coachUsers]),
  STUDENT: setOf(studentRead),
}

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false
}
