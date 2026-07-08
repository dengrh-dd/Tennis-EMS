import { apiGet, apiPatch, apiPost, apiPut } from './client'

const BASE = '/api/courses'

/** Matches `CourseSummaryDTO`. */
export type CourseSummary = {
  courseId: number
  name: string
  courseNumber: string
  level: string | null
  isActive: boolean | null
}

/** Matches `CourseDetailDTO`. */
export type CourseDetail = {
  courseId: number
  name: string
  courseNumber: string
  description: string | null
  level: string | null
  isActive: boolean | null
  sectionCount: number
}

/** Matches `CreateCourseRequestDTO`. */
export type CreateCourseRequest = {
  name: string
  courseNumber: string
  description?: string | null
  level: string
  isActive?: boolean | null
}

/** Matches `UpdateCourseRequestDTO` — all fields optional for partial update. */
export type UpdateCourseRequest = {
  name?: string | null
  courseNumber?: string | null
  description?: string | null
  level?: string | null
  isActive?: boolean | null
}

/** Backend `Course.Level` enum values. */
export const COURSE_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const
export type CourseLevel = (typeof COURSE_LEVELS)[number]

/**
 * GET /api/courses — admin session required.
 */
export async function getAllCourses(): Promise<CourseSummary[]> {
  return apiGet<CourseSummary[]>(BASE)
}

/**
 * GET /api/courses/active — active courses only (no admin gate in controller).
 */
export async function getActiveCourses(): Promise<CourseSummary[]> {
  return apiGet<CourseSummary[]>(`${BASE}/active`)
}

/**
 * GET /api/courses/{courseId}
 */
export async function getCourseById(courseId: number): Promise<CourseDetail> {
  return apiGet<CourseDetail>(`${BASE}/${courseId}`)
}

/**
 * POST /api/courses — admin; returns 201 + `CourseDetailDTO`.
 */
export async function createCourse(
  body: CreateCourseRequest
): Promise<CourseDetail> {
  return apiPost<CourseDetail>(BASE, body)
}

/**
 * PUT /api/courses/{courseId} — admin; partial updates supported by backend.
 */
export async function updateCourse(
  courseId: number,
  body: UpdateCourseRequest
): Promise<CourseDetail> {
  return apiPut<CourseDetail>(`${BASE}/${courseId}`, body)
}

/**
 * PATCH /api/courses/{courseId}/archive — sets `isActive` to false (admin).
 */
export async function archiveCourse(courseId: number): Promise<CourseDetail> {
  return apiPatch<CourseDetail>(`${BASE}/${courseId}/archive`)
}
