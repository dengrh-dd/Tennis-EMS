import { apiFetch, apiPatch, apiPost } from './client'

/** Frontend shape used by EnrollmentPage. */
export type Student = {
  id: number
  name?: string | null
  email?: string | null
}

/** Matches backend `EnrollmentDetailDTO` (enroll / drop responses). */
export type EnrollmentDetail = {
  studentId: number
  sectionId: number
  status: string
  createdAt?: string | null
}

/** Raw backend `EnrollmentSummaryDTO` (list endpoints). */
type EnrollmentDto = Record<string, unknown>

function normalizeToStudent(raw: EnrollmentDto): Student {
  const id = Number((raw.studentId ?? raw.id) ?? 0)
  const name =
    raw.studentName != null
      ? String(raw.studentName)
      : raw.name != null
        ? String(raw.name)
        : null
  const email =
    raw.studentEmail != null
      ? String(raw.studentEmail)
      : raw.email != null
        ? String(raw.email)
        : null
  return { id, name: name || undefined, email: email || undefined }
}

const ENROLLMENTS_BASE = '/api/enrollments'

/**
 * Get students enrolled in a section.
 * GET /api/enrollments/section/{sectionId} → EnrollmentSummaryDTO[]
 */
export async function getStudentsBySection(sectionId: number): Promise<Student[]> {
  const url = `${ENROLLMENTS_BASE}/section/${sectionId}`
  console.debug('[Enrollment] GET', url)
  const res = await apiFetch(url, { method: 'GET' })
  const raw = await res.json() as unknown
  console.debug('[Enrollment] getStudentsBySection response length', Array.isArray(raw) ? raw.length : '?')
  const list = Array.isArray(raw) ? raw : (raw as { content?: unknown[] }).content ?? []
  return (list as EnrollmentDto[]).map(normalizeToStudent)
}

/**
 * Enroll a student in a section.
 * POST /api/enrollments — body: EnrollRequestDTO { studentId, sectionId }
 */
export async function enrollStudent(
  studentId: number,
  sectionId: number
): Promise<EnrollmentDetail> {
  const body = { studentId, sectionId }
  console.debug('[Enrollment] POST', ENROLLMENTS_BASE, body)
  const detail = await apiPost<EnrollmentDetail>(ENROLLMENTS_BASE, body)
  console.debug('[Enrollment] enrollStudent response', detail)
  return detail
}

/**
 * Drop a student from a section.
 * PATCH /api/enrollments/drop — body: EnrollRequestDTO { studentId, sectionId }
 */
export async function dropStudent(
  studentId: number,
  sectionId: number
): Promise<EnrollmentDetail> {
  const body = { studentId, sectionId }
  const url = `${ENROLLMENTS_BASE}/drop`
  console.debug('[Enrollment] PATCH', url, body)
  const detail = await apiPatch<EnrollmentDetail>(url, body)
  console.debug('[Enrollment] dropStudent response', detail)
  return detail
}
