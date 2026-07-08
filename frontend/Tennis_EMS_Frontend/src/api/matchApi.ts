import { apiDelete, apiGet, apiPost, apiPut } from './client'

const MATCH_BASE = '/api/matches'
const SCORING_FORMAT_BASE = '/api/scoring-formats'

export const MATCH_TYPES = ['SINGLES', 'DOUBLES'] as const
export type MatchType = (typeof MATCH_TYPES)[number]

export const MATCH_STATUS_OPTIONS = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const
export type MatchStatus = (typeof MATCH_STATUS_OPTIONS)[number]

export type MatchSide = 'A' | 'B'
export const MATCH_SEGMENT_TYPE_OPTIONS = ['SET', 'TB', 'RACE'] as const
export type MatchSegmentType = (typeof MATCH_SEGMENT_TYPE_OPTIONS)[number]

export type TrainingMatch = {
  matchId: number
  sessionId: number | null
  formatId: number | null
  matchType: string | null
  title: string | null
  notes: string | null
  status: string | null
  winnerSide: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type CreateTrainingMatchRequest = {
  sessionId: number
  formatId: number
  matchType: string
  title?: string | null
  notes?: string | null
  status?: string | null
  winnerSide?: string | null
}

export type UpdateTrainingMatchRequest = Partial<CreateTrainingMatchRequest>

export type MatchSidePlayer = {
  matchId: number
  side: string
  position: number
  studentId: number
}

export type AddMatchPlayerRequest = {
  side: MatchSide
  position: number
  studentId: number
}

export type MatchSummary = {
  matchId: number
  finalScoreText: string | null
  sideAScore: number | null
  sideBScore: number | null
  createdAt: string | null
  updatedAt: string | null
}

export type UpsertMatchSummaryRequest = {
  finalScoreText?: string | null
  sideAScore?: number | null
  sideBScore?: number | null
}

export type MatchSegment = {
  matchId: number
  segmentNo: number
  segmentType: string | null
  sideAScore: number | null
  sideBScore: number | null
  createdAt: string | null
  updatedAt: string | null
}

export type CreateMatchSegmentRequest = {
  segmentNo: number
  segmentType?: string | null
  sideAScore?: number | null
  sideBScore?: number | null
}

export type UpdateMatchSegmentRequest = {
  segmentType?: string | null
  sideAScore?: number | null
  sideBScore?: number | null
}

export type ScoringFormat = {
  formatId: number
  name: string | null
  formatType: string | null
  pointsToWin: number | null
  winByTwo: boolean | null
  gamesToWinSet: number | null
  setsToWinMatch: number | null
  tiebreakAt: number | null
  noAd: boolean | null
  notes: string | null
  isActive: boolean | null
}

export async function getMatchById(id: number): Promise<TrainingMatch> {
  return apiGet<TrainingMatch>(`${MATCH_BASE}/${id}`)
}

export async function getMatchesBySessionId(sessionId: number): Promise<TrainingMatch[]> {
  return apiGet<TrainingMatch[]>(`${MATCH_BASE}/session/${sessionId}`)
}

export async function getMatchesByStatus(status: string): Promise<TrainingMatch[]> {
  return apiGet<TrainingMatch[]>(`${MATCH_BASE}/status/${encodeURIComponent(status)}`)
}

export async function createTrainingMatch(payload: CreateTrainingMatchRequest): Promise<TrainingMatch> {
  return apiPost<TrainingMatch>(MATCH_BASE, payload)
}

export async function updateTrainingMatch(
  matchId: number,
  payload: UpdateTrainingMatchRequest
): Promise<TrainingMatch> {
  return apiPut<TrainingMatch>(`${MATCH_BASE}/${matchId}`, payload)
}

export async function deleteTrainingMatch(matchId: number): Promise<void> {
  return apiDelete<void>(`${MATCH_BASE}/${matchId}`)
}

export async function getMatchPlayers(matchId: number): Promise<MatchSidePlayer[]> {
  return apiGet<MatchSidePlayer[]>(`${MATCH_BASE}/${matchId}/players`)
}

export async function addMatchPlayer(matchId: number, payload: AddMatchPlayerRequest): Promise<MatchSidePlayer> {
  return apiPost<MatchSidePlayer>(`${MATCH_BASE}/${matchId}/players`, payload)
}

export async function removeMatchPlayer(matchId: number, side: MatchSide, position: number): Promise<void> {
  return apiDelete<void>(`${MATCH_BASE}/${matchId}/players/${side}/${position}`)
}

export async function getMatchSummary(matchId: number): Promise<MatchSummary> {
  return apiGet<MatchSummary>(`${MATCH_BASE}/${matchId}/summary`)
}

export async function upsertMatchSummary(
  matchId: number,
  payload: UpsertMatchSummaryRequest
): Promise<MatchSummary> {
  return apiPut<MatchSummary>(`${MATCH_BASE}/${matchId}/summary`, payload)
}

export async function getMatchSegments(matchId: number): Promise<MatchSegment[]> {
  return apiGet<MatchSegment[]>(`${MATCH_BASE}/${matchId}/segments`)
}

export async function createMatchSegment(
  matchId: number,
  payload: CreateMatchSegmentRequest
): Promise<MatchSegment> {
  return apiPost<MatchSegment>(`${MATCH_BASE}/${matchId}/segments`, payload)
}

export async function updateMatchSegment(
  matchId: number,
  segmentNo: number,
  payload: UpdateMatchSegmentRequest
): Promise<MatchSegment> {
  return apiPut<MatchSegment>(`${MATCH_BASE}/${matchId}/segments/${segmentNo}`, payload)
}

export async function deleteMatchSegment(matchId: number, segmentNo: number): Promise<void> {
  return apiDelete<void>(`${MATCH_BASE}/${matchId}/segments/${segmentNo}`)
}

export async function getActiveScoringFormats(): Promise<ScoringFormat[]> {
  return apiGet<ScoringFormat[]>(`${SCORING_FORMAT_BASE}/active`)
}

export async function getScoringFormatById(formatId: number): Promise<ScoringFormat> {
  return apiGet<ScoringFormat>(`${SCORING_FORMAT_BASE}/${formatId}`)
}
