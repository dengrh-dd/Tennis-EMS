import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  addMatchPlayer,
  createMatchSegment,
  deleteMatchSegment,
  removeMatchPlayer,
  updateMatchSegment,
  upsertMatchSummary,
  type MatchSide,
  type MatchSidePlayer,
  type MatchSegment,
  type MatchSegmentType,
  type MatchSummary,
  type MatchType,
  type TrainingMatch,
} from '../../../api/matchApi'
import type { User } from '../../../api/userApi'
import { MATCHES_ROOT } from '../../../routes/featurePaths'
import {
  loadMatchDetailData,
  toNumberOrNull,
  validateAddPlayerInput,
  validateSegmentNo,
  validateSegmentPayload,
  validateSummaryScores,
} from './matchDetailActions'

export function useMatchDetailController() {
  const { matchId: matchIdParam } = useParams<{ matchId: string }>()
  const navigate = useNavigate()
  const matchId = Number(matchIdParam)
  const invalidMatch = !Number.isFinite(matchId) || matchId <= 0

  const [match, setMatch] = useState<TrainingMatch | null>(null)
  const [players, setPlayers] = useState<MatchSidePlayer[]>([])
  const [summary, setSummary] = useState<MatchSummary | null>(null)
  const [segments, setSegments] = useState<MatchSegment[]>([])
  const [students, setStudents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)
  const [playerMessage, setPlayerMessage] = useState<string | null>(null)
  const [playerError, setPlayerError] = useState<string | null>(null)
  const [summaryMessage, setSummaryMessage] = useState<string | null>(null)
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const [segmentMessage, setSegmentMessage] = useState<string | null>(null)
  const [segmentError, setSegmentError] = useState<string | null>(null)

  const [addSide, setAddSide] = useState<MatchSide>('A')
  const [addPosition, setAddPosition] = useState('1')
  const [addStudentId, setAddStudentId] = useState('')

  const [finalScoreText, setFinalScoreText] = useState('')
  const [sideAScore, setSideAScore] = useState('')
  const [sideBScore, setSideBScore] = useState('')

  const [addSegmentType, setAddSegmentType] = useState<MatchSegmentType>('SET')
  const [addSideAScore, setAddSideAScore] = useState('')
  const [addSideBScore, setAddSideBScore] = useState('')

  const matchType = useMemo<MatchType>(() => (match?.matchType === 'DOUBLES' ? 'DOUBLES' : 'SINGLES'), [match])

  const studentOptions = useMemo(() => {
    return students
      .filter((student) => Number.isFinite(student.profileId) && (student.profileId ?? 0) > 0)
      .map((student) => ({
        studentId: Number(student.profileId),
        label: student.displayName ?? student.email ?? `Student #${student.profileId}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [students])

  const nextSegmentNo = useMemo(() => {
    if (segments.length === 0) return 1
    return Math.max(...segments.map((segment) => segment.segmentNo)) + 1
  }, [segments])

  const winnerDisplayLabel = useMemo(() => {
    if (!match?.winnerSide) return '—'
    const ws = match.winnerSide
    if (ws !== 'A' && ws !== 'B') return ws
    const names = players
      .filter((p) => p.side === ws)
      .sort((a, b) => a.position - b.position)
      .map((p) => {
        const s = studentOptions.find((o) => o.studentId === p.studentId)
        return s?.label ?? `Student #${p.studentId}`
      })
    return names.length > 0 ? names.join(' / ') : `Side ${ws}`
  }, [match?.winnerSide, players, studentOptions])

  const loadPage = useCallback(async () => {
    if (invalidMatch) {
      setPageError('Invalid match in URL.')
      setLoading(false)
      setMatch(null)
      return
    }
    setPageError(null)
    setLoading(true)
    try {
      const { matchData, playerData, segmentData, studentData, summaryData } = await loadMatchDetailData(matchId)
      setMatch(matchData)
      setPlayers(playerData)
      setSegments(segmentData)
      setStudents(studentData)
      if (summaryData) {
        setSummary(summaryData)
        setFinalScoreText(summaryData.finalScoreText ?? '')
        setSideAScore(String(summaryData.sideAScore ?? ''))
        setSideBScore(String(summaryData.sideBScore ?? ''))
      } else {
        setSummary(null)
        setFinalScoreText('')
        setSideAScore('')
        setSideBScore('')
      }
    } catch (e) {
      setPageError(e instanceof Error ? e.message : 'Failed to load match details')
      setMatch(null)
      setPlayers([])
      setSummary(null)
      setSegments([])
      setStudents([])
    } finally {
      setLoading(false)
    }
  }, [invalidMatch, matchId])

  useEffect(() => {
    void loadPage()
  }, [loadPage])

  function clearPlayerMessages() {
    setPlayerMessage(null)
    setPlayerError(null)
  }

  function clearSummaryMessages() {
    setSummaryMessage(null)
    setSummaryError(null)
  }

  function clearSegmentMessages() {
    setSegmentMessage(null)
    setSegmentError(null)
  }

  async function handleAddPlayer(e: FormEvent) {
    e.preventDefault()
    if (!match) return
    clearPlayerMessages()
    const position = matchType === 'SINGLES' ? 1 : Number(addPosition)
    const studentId = Number(addStudentId)
    const sideCount = players.filter((player) => player.side === addSide).length
    const addPlayerError = validateAddPlayerInput({ side: addSide, position, studentId, matchType, sideCount })
    if (addPlayerError) {
      setPlayerError(addPlayerError)
      return
    }
    setBusy(true)
    try {
      const created = await addMatchPlayer(match.matchId, { side: addSide, position, studentId })
      setPlayers((prev) => {
        const withoutSlot = prev.filter((player) => !(player.side === created.side && player.position === created.position))
        return [...withoutSlot, created]
      })
      setPlayerMessage('Player added.')
      setAddPosition('1')
      setAddStudentId('')
    } catch (err) {
      setPlayerError(err instanceof Error ? err.message : 'Add player failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleDeletePlayer(side: MatchSide, position: number) {
    if (!match) return
    if (!window.confirm(`Remove player from side ${side}, position ${position}?`)) return
    clearPlayerMessages()
    if (side !== 'A' && side !== 'B') {
      setPlayerError('Side must be A or B.')
      return
    }
    setBusy(true)
    try {
      await removeMatchPlayer(match.matchId, side, position)
      setPlayers((prev) => prev.filter((player) => !(player.side === side && player.position === position)))
      setPlayerMessage('Player removed.')
    } catch (err) {
      setPlayerError(err instanceof Error ? err.message : 'Remove player failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleSaveSummary(e: FormEvent) {
    e.preventDefault()
    if (!match) return
    clearSummaryMessages()
    const a = toNumberOrNull(sideAScore)
    const b = toNumberOrNull(sideBScore)
    const summaryValidationError = validateSummaryScores(a, b)
    if (summaryValidationError) {
      setSummaryError(summaryValidationError)
      return
    }
    setBusy(true)
    try {
      const updatedSummary = await upsertMatchSummary(match.matchId, {
        finalScoreText: finalScoreText.trim() || null,
        sideAScore: a,
        sideBScore: b,
      })
      setSummary(updatedSummary)
      setFinalScoreText(updatedSummary.finalScoreText ?? '')
      setSideAScore(String(updatedSummary.sideAScore ?? ''))
      setSideBScore(String(updatedSummary.sideBScore ?? ''))
      setSummaryMessage('Summary saved.')
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : 'Save summary failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleAddSegment(e: FormEvent) {
    e.preventDefault()
    if (!match) return
    clearSegmentMessages()
    const segmentNo = nextSegmentNo
    const a = toNumberOrNull(addSideAScore)
    const b = toNumberOrNull(addSideBScore)
    const segmentValidationError = validateSegmentPayload(segmentNo, addSegmentType, a, b)
    if (segmentValidationError) {
      setSegmentError(segmentValidationError)
      return
    }
    setBusy(true)
    try {
      const created = await createMatchSegment(match.matchId, {
        segmentNo,
        segmentType: addSegmentType,
        sideAScore: a,
        sideBScore: b,
      })
      setSegments((prev) => [...prev.filter((segment) => segment.segmentNo !== created.segmentNo), created])
      setSegmentMessage('Segment added.')
      setAddSegmentType('SET')
      setAddSideAScore('')
      setAddSideBScore('')
    } catch (err) {
      setSegmentError(err instanceof Error ? err.message : 'Add segment failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleUpdateSegment(
    segmentNo: number,
    payload: { segmentType: MatchSegmentType; sideAScore: number; sideBScore: number },
  ) {
    if (!match) return
    clearSegmentMessages()
    const segmentValidationError = validateSegmentPayload(
      segmentNo,
      payload.segmentType,
      payload.sideAScore,
      payload.sideBScore,
    )
    if (segmentValidationError) {
      setSegmentError(segmentValidationError)
      return
    }
    setBusy(true)
    try {
      const updated = await updateMatchSegment(match.matchId, segmentNo, {
        segmentType: payload.segmentType,
        sideAScore: payload.sideAScore,
        sideBScore: payload.sideBScore,
      })
      setSegments((prev) => prev.map((segment) => (segment.segmentNo === segmentNo ? updated : segment)))
      setSegmentMessage(`Segment #${segmentNo} updated.`)
    } catch (err) {
      setSegmentError(err instanceof Error ? err.message : 'Update segment failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleDeleteSegment(segmentNo: number) {
    if (!match) return
    if (!window.confirm(`Delete segment #${segmentNo}?`)) return
    clearSegmentMessages()
    const segmentValidationError = validateSegmentNo(segmentNo)
    if (segmentValidationError) {
      setSegmentError(segmentValidationError)
      return
    }
    setBusy(true)
    try {
      await deleteMatchSegment(match.matchId, segmentNo)
      setSegments((prev) => prev.filter((segment) => segment.segmentNo !== segmentNo))
      setSegmentMessage('Segment deleted.')
    } catch (err) {
      setSegmentError(err instanceof Error ? err.message : 'Delete segment failed')
    } finally {
      setBusy(false)
    }
  }

  function navigateBackToMatches() {
    navigate(MATCHES_ROOT, { state: { selectedMatchId: match?.matchId ?? matchId } })
  }

  return {
    matchId,
    match,
    loading,
    busy,
    pageError,
    winnerDisplayLabel,
    studentOptions,
    matchType,
    players,
    addSide,
    setAddSide,
    addPosition,
    setAddPosition,
    addStudentId,
    setAddStudentId,
    handleAddPlayer,
    handleDeletePlayer,
    playerMessage,
    playerError,
    finalScoreText,
    setFinalScoreText,
    sideAScore,
    setSideAScore,
    sideBScore,
    setSideBScore,
    handleSaveSummary,
    summaryMessage,
    summaryError,
    summary,
    segments,
    nextSegmentNo,
    addSegmentType,
    setAddSegmentType,
    addSideAScore,
    setAddSideAScore,
    addSideBScore,
    setAddSideBScore,
    handleAddSegment,
    handleUpdateSegment,
    handleDeleteSegment,
    segmentMessage,
    segmentError,
    navigateBackToMatches,
  }
}
