import { apiGet } from './client'

const BASE = '/api/courts'

export type CourtSummary = {
  courtId: number
  name: string | null
  location: string | null
}

/**
 * GET /api/courts — admin session required.
 */
export async function getCourts(): Promise<CourtSummary[]> {
  return apiGet<CourtSummary[]>(BASE)
}
