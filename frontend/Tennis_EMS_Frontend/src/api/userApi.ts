import { apiDelete, apiGet, apiPost, apiPut } from './client'

const BASE = '/api/users'

/** Matches backend `UserDTO`. */
export type User = {
  userId: number
  email: string | null
  role: string | null
  isActive: boolean | null
  profileId: number | null
  displayName: string | null
}

/** Backend `User.Role` enum values. */
export const USER_ROLES = ['ADMIN', 'COACH', 'STUDENT'] as const
export type UserRole = (typeof USER_ROLES)[number]

/** Backend `Admin.adminLevel` values used at account creation. */
export const ADMIN_LEVELS = ['SUPER', 'STANDARD'] as const
export type AdminLevelOption = (typeof ADMIN_LEVELS)[number]

/** Backend `Student.skillLevel` values used at account creation. */
export const STUDENT_SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const
export type StudentSkillLevelOption = (typeof STUDENT_SKILL_LEVELS)[number]

/** Matches `CreateAccountRequestDTO` — send only fields relevant to `role`. */
export type CreateUserRequest = {
  email: string
  password: string
  role: UserRole
  firstName: string
  lastName: string
  phone?: string | null
  preferredName?: string | null
  /** ISO date `yyyy-MM-dd` for `LocalDate`. */
  dateOfBirth?: string | null
  certification?: string | null
  experienceYears?: number | null
  bio?: string | null
  adminLevel?: string | null
  skillLevel?: string | null
  notes?: string | null
  emergencyContactName?: string | null
  emergencyContactPhone?: string | null
}

/** Matches `UpdateUserRequestDTO` — email and active status only. */
export type UpdateUserRequest = {
  email?: string | null
  isActive?: boolean | null
}

/** Matches `EnrollmentSummaryDTO` — student sections. */
export type StudentSection = {
  studentId: number
  sectionId: number
  status: string | null
  createdAt: string | null
  studentName: string | null
  sectionName: string | null
}

/** Matches `SessionAttendanceSummaryDTO` — student attendance. */
export type StudentAttendance = {
  sessionId: number
  studentId: number
  status: string | null
  source: string | null
  studentName: string | null
  sessionLabel: string | null
}

/** Matches `SectionSummaryDTO` — coach sections. */
export type CoachSection = {
  sectionId: number
  courseId: number
  name: string | null
  status: string | null
  isActive: boolean | null
  courseName: string | null
}

/** Matches `SessionSummaryDTO` — coach sessions. */
export type CoachSession = {
  sessionId: number
  sectionId: number
  startTime: string | null
  endTime: string | null
  status: string | null
  sectionName: string | null
  courseName: string | null
}

/**
 * GET /api/users — admin session required.
 */
export async function getAllUsers(): Promise<User[]> {
  return apiGet<User[]>(BASE)
}

/**
 * GET /api/users/role/{role} — admin session required.
 */
export async function getUsersByRole(role: string): Promise<User[]> {
  return apiGet<User[]>(`${BASE}/role/${role}`)
}

/**
 * GET /api/users/{id}
 */
export async function getUserById(id: number): Promise<User> {
  return apiGet<User>(`${BASE}/${id}`)
}

/**
 * POST /api/users — admin; returns 201 + UserDTO.
 */
export async function createUser(payload: CreateUserRequest): Promise<User> {
  return apiPost<User>(BASE, payload)
}

/**
 * PUT /api/users/{id} — admin; email and isActive only.
 */
export async function updateUser(id: number, payload: UpdateUserRequest): Promise<User> {
  return apiPut<User>(`${BASE}/${id}`, payload)
}

/**
 * DELETE /api/users/{id} — admin.
 */
export async function deleteUser(id: number): Promise<void> {
  return apiDelete<void>(`${BASE}/${id}`)
}

/**
 * GET /api/users/{id}/sections — enrolled sections for student.
 */
export async function getStudentSections(userId: number): Promise<StudentSection[]> {
  return apiGet<StudentSection[]>(`${BASE}/${userId}/sections`)
}

/**
 * GET /api/users/{id}/attendance — attendance history for student.
 */
export async function getStudentAttendance(userId: number): Promise<StudentAttendance[]> {
  return apiGet<StudentAttendance[]>(`${BASE}/${userId}/attendance`)
}

/**
 * GET /api/users/{id}/coaching-sections — sections coached.
 */
export async function getCoachSections(userId: number): Promise<CoachSection[]> {
  return apiGet<CoachSection[]>(`${BASE}/${userId}/coaching-sections`)
}

/**
 * GET /api/users/{id}/coaching-sessions — sessions coached.
 */
export async function getCoachSessions(userId: number): Promise<CoachSession[]> {
  return apiGet<CoachSession[]>(`${BASE}/${userId}/coaching-sessions`)
}
