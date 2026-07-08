import type { CreateSectionRequest, UpdateSectionRequest } from '../../../api/sectionApi'

export function toCreateSectionRequest(
  courseId: number,
  input: {
    coachId: string
    name: string
    syllabus: string
    startDate: string
    endDate: string
    maxStudents: string
  },
): CreateSectionRequest {
  const coach = Number(input.coachId)
  const trimmedName = input.name.trim()
  return {
    courseId,
    coachId: coach,
    name: trimmedName,
    syllabus: input.syllabus.trim() ? input.syllabus.trim() : undefined,
    startDate: input.startDate || undefined,
    endDate: input.endDate || undefined,
    maxStudents: input.maxStudents.trim() ? Number(input.maxStudents) : undefined,
  }
}

export function toUpdateSectionRequest(input: {
  coachId: string
  name: string
  syllabus: string
  startDate: string
  endDate: string
  maxStudents: string
}): UpdateSectionRequest {
  const coach = Number(input.coachId)
  return {
    coachId: coach,
    name: input.name.trim(),
    syllabus: input.syllabus.trim() ? input.syllabus.trim() : '',
    startDate: input.startDate || null,
    endDate: input.endDate || null,
    maxStudents: input.maxStudents.trim() ? Number(input.maxStudents) : null,
  }
}
