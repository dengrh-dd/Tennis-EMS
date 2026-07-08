/**
 * Course feature route path helpers (feature-first URLs under `/courses`).
 */
import {
  COURSES_ROOT,
  courseSectionsPath,
  sectionEnrollmentPath,
  sectionSessionsPath,
  sessionAttendancePath,
} from '../../routes/featurePaths'

/** @deprecated Prefer COURSES_ROOT in new code. */
export const ADMIN_COURSES = COURSES_ROOT

export { COURSES_ROOT, courseSectionsPath, sectionSessionsPath, sessionAttendancePath, sectionEnrollmentPath }
