import {
  MATCH_SEGMENT_TYPE_OPTIONS,
  getMatchById,
  getMatchPlayers,
  getMatchSegments,
  getMatchSummary,
  type MatchSegmentType,
  type MatchType,
} from '../../../api/matchApi'
import { getUsersByRole } from '../../../api/userApi'

export function toNumberOrNull(value: string): number | null {
  if (value.trim() === '') return null
  const n = Number(value)
  if (!Number.isFinite(n)) return null
  return n
}

export async function loadMatchDetailData(matchId: number) {
  const [matchData, playerData, segmentData, studentData] = await Promise.all([
    getMatchById(matchId),
    getMatchPlayers(matchId),
    getMatchSegments(matchId),
    getUsersByRole('STUDENT'),
  ])

  try {
    const summaryData = await getMatchSummary(matchId)
    return { matchData, playerData, segmentData, studentData, summaryData }
  } catch {
    return { matchData, playerData, segmentData, studentData, summaryData: null }
  }
}

export function validateAddPlayerInput(params: {
  side: 'A' | 'B' | string
  position: number
  studentId: number
  matchType: MatchType
  sideCount: number
}): string | null {
  if (params.side !== 'A' && params.side !== 'B') return 'Side must be A or B.'
  if (params.matchType === 'DOUBLES' && (!Number.isFinite(params.position) || params.position < 1 || params.position > 2)) {
    return 'Position must be 1 or 2 for doubles.'
  }
  if (!Number.isFinite(params.studentId) || params.studentId <= 0) return 'Student is required.'
  const maxPlayersPerSide = params.matchType === 'DOUBLES' ? 2 : 1
  if (params.sideCount >= maxPlayersPerSide) {
    return `${params.matchType === 'DOUBLES' ? 'Doubles' : 'Singles'} limit reached for side ${params.side}.`
  }
  return null
}

export function validateSummaryScores(sideAScore: number | null, sideBScore: number | null): string | null {
  if (sideAScore != null && sideAScore < 0) return 'Side A score must be non-negative.'
  if (sideBScore != null && sideBScore < 0) return 'Side B score must be non-negative.'
  return null
}

export function validateSegmentPayload(
  segmentNo: number,
  segmentType: MatchSegmentType,
  sideAScore: number | null,
  sideBScore: number | null,
): string | null {
  const segmentNoError = validateSegmentNo(segmentNo)
  if (segmentNoError) return segmentNoError
  if (!MATCH_SEGMENT_TYPE_OPTIONS.includes(segmentType)) return 'Invalid segment type.'
  if (sideAScore != null && sideAScore < 0) return 'Side A score must be non-negative.'
  if (sideBScore != null && sideBScore < 0) return 'Side B score must be non-negative.'
  return null
}

export function validateSegmentNo(segmentNo: number): string | null {
  if (segmentNo < 1) return 'Segment number must be 1 or higher.'
  return null
}
