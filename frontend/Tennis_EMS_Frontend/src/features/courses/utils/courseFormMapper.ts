import { COURSE_LEVELS, type CreateCourseRequest, type UpdateCourseRequest } from '../../../api/courseApi'

export function resolveCourseLevel(level: string | null | undefined): string {
  return level && COURSE_LEVELS.includes(level as (typeof COURSE_LEVELS)[number])
    ? level
    : COURSE_LEVELS[0]
}

export function toCreateCourseRequest(input: {
  name: string
  courseNumber: string
  description: string
  level: string
  isActive: boolean
}): CreateCourseRequest {
  return {
    name: input.name.trim(),
    courseNumber: input.courseNumber.trim(),
    description: input.description.trim() || null,
    level: input.level,
    isActive: input.isActive,
  }
}

export function toUpdateCourseRequest(input: {
  editName: string
  editCourseNumber: string
  editDescription: string
  editLevel: string
  editIsActive: boolean
}): UpdateCourseRequest {
  // Description: empty field → send `''` (clears on server); non-empty → trimmed string (always sent).
  return {
    ...(input.editName.trim() && { name: input.editName.trim() }),
    ...(input.editCourseNumber.trim() && { courseNumber: input.editCourseNumber.trim() }),
    description: input.editDescription === '' ? '' : input.editDescription.trim(),
    level: input.editLevel,
    isActive: input.editIsActive,
  }
}
