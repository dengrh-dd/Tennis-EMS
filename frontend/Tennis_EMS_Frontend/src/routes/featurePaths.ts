/**
 * Canonical route paths for feature modules and role home URLs.
 */
export const DASHBOARD_ADMIN = '/admin'
export const DASHBOARD_COACH = '/coach'
export const DASHBOARD_STUDENT = '/student'

export const COURSES_ROOT = '/courses'
export const PEOPLE_ROOT = '/people'
export const GROUPS_ROOT = '/groups'
export const MATCHES_ROOT = '/matches'

export function courseSectionsPath(courseId: number): string {
  return `/courses/${courseId}/sections`
}

export function sectionSessionsPath(courseId: number, sectionId: number): string {
  return `/courses/${courseId}/sections/${sectionId}/sessions`
}

export function sessionAttendancePath(courseId: number, sectionId: number, sessionId: number): string {
  return `/courses/${courseId}/sections/${sectionId}/sessions/${sessionId}/attendance`
}

export function sectionEnrollmentPath(courseId: number, sectionId: number): string {
  return `/courses/${courseId}/sections/${sectionId}/enrollment`
}

export function groupMembersPath(groupId: number): string {
  return `/groups/${groupId}/members`
}

export function matchDetailPath(matchId: number): string {
  return `/matches/${matchId}`
}
