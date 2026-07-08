import { apiGet, apiPatch, apiPost, apiPut } from './client'

const SESSIONS_BASE = '/api/sessions'
const SECTIONS_BASE = '/api/sections'

/**
 * Matches backend section DTOs we care about for session list/create flows.
 * - List endpoints return `SessionSummaryDTO`
 * - Create endpoint returns `SessionDetailDTO`
 */
export type Session = {
  sessionId: number
  sectionId: number
  startTime: string
  endTime: string
  status: string | null
  sectionName: string | null
  courseName: string | null

  coachId?: number | null
  courtId?: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

/** Matches backend `CreateSessionRequestDTO`. */
export type CreateSessionRequest = {
  sectionId: number
  courtId?: number | null
  startTime: string
  endTime: string
  status?: string | null
}

/** Matches `SessionDetailDTO`. */
export type SessionDetail = {
  sessionId: number
  sectionId: number
  coachId: number | null
  courtId: number | null
  startTime: string
  endTime: string
  status: string | null
  sectionName: string | null
  courseName: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

/** Matches `UpdateSessionRequestDTO` — fields optional for partial update. */
export type UpdateSessionRequest = {
  sectionId?: number | null
  courtId?: number | null
  startTime?: string | null
  endTime?: string | null
  status?: string | null
}

/**
 * GET /api/sessions — admin session required.
 */
export async function getSessions(): Promise<Session[]> {
  return apiGet<Session[]>(SESSIONS_BASE)
}

/**
 * GET /api/sections/{sectionId}/sessions
 */
export async function getSessionsBySection(sectionId: number): Promise<Session[]> {
  return apiGet<Session[]>(`${SECTIONS_BASE}/${sectionId}/sessions`)
}

/**
 * POST /api/sessions
 */
export async function createSession(
  payload: CreateSessionRequest
): Promise<SessionDetail> {
  return apiPost<SessionDetail>(SESSIONS_BASE, payload)
}

/**
 * GET /api/sessions/{sessionId}
 */
export async function getSessionById(sessionId: number): Promise<SessionDetail> {
  return apiGet<SessionDetail>(`${SESSIONS_BASE}/${sessionId}`)
}

/**
 * PUT /api/sessions/{sessionId}
 */
export async function updateSession(
  sessionId: number,
  body: UpdateSessionRequest
): Promise<SessionDetail> {
  return apiPut<SessionDetail>(`${SESSIONS_BASE}/${sessionId}`, body)
}

/**
 * PATCH /api/sessions/{sessionId}/cancel
 */
export async function cancelSession(sessionId: number): Promise<SessionDetail> {
  return apiPatch<SessionDetail>(`${SESSIONS_BASE}/${sessionId}/cancel`)
}

