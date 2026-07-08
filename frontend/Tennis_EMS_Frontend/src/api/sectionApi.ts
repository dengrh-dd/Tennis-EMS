import { apiGet, apiPatch, apiPost, apiPut } from './client'

const BASE = '/api/sections'

/**
 * Matches backend section DTOs we care about for list/create flows.
 * - List endpoints return `SectionSummaryDTO`
 * - Create endpoint returns `SectionDetailDTO`
 */
export type Section = {
  sectionId: number
  courseId: number
  name: string
  status: string | null
  isActive: boolean | null
  courseName: string | null

  coachId?: number | null
  syllabus?: string | null
  startDate?: string | null
  endDate?: string | null
  maxStudents?: number | null
  enrollmentMode?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

/** Matches `SectionDetailDTO` from the backend. */
export type SectionDetail = {
  sectionId: number
  courseId: number
  coachId: number | null
  name: string
  syllabus: string | null
  startDate: string | null
  endDate: string | null
  maxStudents: number | null
  enrollmentMode: string | null
  status: string | null
  isActive: boolean | null
  courseName: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

/** Matches `UpdateSectionRequestDTO` — fields optional for partial update. */
export type UpdateSectionRequest = {
  courseId?: number | null
  coachId?: number | null
  name?: string | null
  syllabus?: string | null
  startDate?: string | null
  endDate?: string | null
  maxStudents?: number | null
  enrollmentMode?: string | null
  status?: string | null
  isActive?: boolean | null
}

/** Matches backend `CreateSectionRequestDTO`. */
export type CreateSectionRequest = {
  courseId: number
  /**
   * Required in practice due to DB FK constraint `section.coachId -> coach.coachId`.
   */
  coachId: number
  name: string

  syllabus?: string | null
  /** `yyyy-MM-dd` (backend expects `LocalDate`). */
  startDate?: string | null
  /** `yyyy-MM-dd` (backend expects `LocalDate`). */
  endDate?: string | null
  maxStudents?: number | null
  enrollmentMode?: string | null
  status?: string | null
  isActive?: boolean | null
}

/**
 * GET /api/sections — admin session required.
 */
export async function getSections(): Promise<Section[]> {
  return apiGet<Section[]>(BASE)
}

/**
 * GET /api/sections/course/{courseId}
 */
export async function getSectionsByCourse(courseId: number): Promise<Section[]> {
  return apiGet<Section[]>(`${BASE}/course/${courseId}`)
}

/**
 * POST /api/sections
 */
export async function createSection(
  payload: CreateSectionRequest
): Promise<Section> {
  return apiPost<Section>(BASE, payload)
}

/**
 * GET /api/sections/{sectionId}
 */
export async function getSectionById(sectionId: number): Promise<SectionDetail> {
  return apiGet<SectionDetail>(`${BASE}/${sectionId}`)
}

/**
 * PUT /api/sections/{sectionId}
 */
export async function updateSection(
  sectionId: number,
  body: UpdateSectionRequest
): Promise<SectionDetail> {
  return apiPut<SectionDetail>(`${BASE}/${sectionId}`, body)
}

/**
 * PATCH /api/sections/{sectionId}/archive — sets section inactive (admin).
 */
export async function archiveSection(sectionId: number): Promise<SectionDetail> {
  return apiPatch<SectionDetail>(`${BASE}/${sectionId}/archive`)
}

