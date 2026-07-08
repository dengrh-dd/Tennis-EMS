import { apiFetch, apiPost } from './client'

/** Matches backend `SessionAttendanceSummaryDTO` (list by session / student). */
export type AttendanceRecord = {
  sessionId: number
  studentId: number
  status: string
  source?: string | null
  studentName?: string | null
  sessionLabel?: string | null
}

/** Matches backend `SessionAttendanceDetailDTO` (mark / single get). */
export type SessionAttendanceDetail = {
  sessionId: number
  studentId: number
  status: string
  source?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type MarkAttendancePayload = {
  sessionId: number
  studentId: number
  status: string
  source?: string
}

type AttendanceDto = Record<string, unknown>

function normalizeToRecord(raw: AttendanceDto): AttendanceRecord {
  const studentId = Number((raw.studentId ?? raw.student_id) ?? 0)
  const sessionId = Number((raw.sessionId ?? raw.session_id) ?? 0)
  const status = String(raw.status ?? '')
  const source = raw.source != null ? String(raw.source) : undefined
  const studentName =
    raw.studentName != null ? String(raw.studentName) : undefined
  const sessionLabel =
    raw.sessionLabel != null ? String(raw.sessionLabel) : undefined
  return {
    sessionId,
    studentId,
    status,
    source: source || null,
    studentName,
    sessionLabel,
  }
}

const SESSION_ATTENDANCE_BASE = '/api/session-attendance'

/**
 * Get attendance rows for a session.
 * GET /api/session-attendance/session/{sessionId} → SessionAttendanceSummaryDTO[]
 */
export async function getAttendanceBySession(
  sessionId: number
): Promise<AttendanceRecord[]> {
  const url = `${SESSION_ATTENDANCE_BASE}/session/${sessionId}`
  console.debug('[Attendance] GET', url)
  const res = await apiFetch(url, { method: 'GET' })
  const raw = (await res.json()) as unknown
  console.debug(
    '[Attendance] getAttendanceBySession response length',
    Array.isArray(raw) ? raw.length : '?'
  )
  const list = Array.isArray(raw) ? raw : (raw as { content?: unknown[] }).content ?? []
  return (list as AttendanceDto[]).map(normalizeToRecord)
}

/**
 * Mark or update attendance for a student in a session.
 * POST /api/session-attendance — body: MarkAttendanceRequestDTO
 */
export async function markAttendance(
  payload: MarkAttendancePayload
): Promise<SessionAttendanceDetail> {
  console.debug('[Attendance] POST', SESSION_ATTENDANCE_BASE, payload)
  const detail = await apiPost<SessionAttendanceDetail>(
    SESSION_ATTENDANCE_BASE,
    payload
  )
  console.debug('[Attendance] markAttendance response', detail)
  return detail
}
