import type { CourtSummary } from '../../../api/courtApi'
import type { CreateSessionRequest, UpdateSessionRequest } from '../../../api/sessionApi'

export const SESSION_STATUS = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const

export function toIsoLocalDateTime(value: string): string {
  // Legacy behavior: incoming value is `yyyy-MM-ddTHH:mm` (length 16), backend expects seconds.
  return value.length === 16 ? `${value}:00` : value
}

export function formatCourtOptionLabel(c: CourtSummary): string {
  const name = (c.name ?? '').trim() || 'Court'
  const loc = (c.location ?? '').trim()
  const place = loc ? `${name} — ${loc}` : name
  return `${place} (Court ID: ${c.courtId})`
}

export function toCreateSessionRequest(
  sectionId: number,
  input: {
    startTimeIsoLocalDateTime: string
    endTimeIsoLocalDateTime: string
    courtId: string
    status: string
  },
): CreateSessionRequest {
  return {
    sectionId,
    startTime: toIsoLocalDateTime(input.startTimeIsoLocalDateTime),
    endTime: toIsoLocalDateTime(input.endTimeIsoLocalDateTime),
    ...(input.courtId.trim() ? { courtId: Number(input.courtId) } : {}),
    status: input.status,
  }
}

export function toUpdateSessionRequest(
  sectionId: number,
  input: {
    startTimeIsoLocalDateTime: string
    endTimeIsoLocalDateTime: string
    courtId: string
    status: string
  },
): UpdateSessionRequest {
  return {
    sectionId,
    startTime: toIsoLocalDateTime(input.startTimeIsoLocalDateTime),
    endTime: toIsoLocalDateTime(input.endTimeIsoLocalDateTime),
    status: input.status,
    ...(input.courtId.trim() ? { courtId: Number(input.courtId) } : {}),
  }
}

