import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  MATCH_TYPES,
  MATCH_STATUS_OPTIONS,
  createTrainingMatch,
  deleteTrainingMatch,
  getActiveScoringFormats,
  getMatchById,
  getMatchPlayers,
  getMatchesBySessionId,
  getMatchesByStatus,
  type MatchSidePlayer,
  type MatchType,
  type ScoringFormat,
  type TrainingMatch,
  updateTrainingMatch,
} from '../../../api/matchApi'
import { getUsersByRole, type User } from '../../../api/userApi'
import { getAllCourses, type CourseSummary } from '../../../api/courseApi'
import { getSectionsByCourse, type Section } from '../../../api/sectionApi'
import { getSessionsBySection, type Session } from '../../../api/sessionApi'
import { formatDisplayDateTime } from '../../../utils/displayDate'

export type PanelMode = null | 'edit'
export type MatchFilterStatus = 'ALL' | (typeof MATCH_STATUS_OPTIONS)[number]
export type MatchFilterType = 'ALL' | MatchType

function formatSessionLabel(session: Session): string {
  const startText = session.startTime
    ? formatDisplayDateTime(session.startTime)
    : 'Start?'
  const endText = session.endTime ? formatDisplayDateTime(session.endTime) : 'End?'
  const sectionText = session.sectionName ?? `Section #${session.sectionId}`
  return `${sectionText} | ${startText} - ${endText}`
}

/** Side A vs side B; uses " / " within a side for doubles. */
function formatMatchListLineup(
  players: MatchSidePlayer[] | undefined,
  studentName: (studentId: number) => string
): string {
  if (!players || players.length === 0) return 'Players not set'
  const sideA = players
    .filter((p) => p.side?.toUpperCase() === 'A')
    .sort((a, b) => a.position - b.position)
  const sideB = players
    .filter((p) => p.side?.toUpperCase() === 'B')
    .sort((a, b) => a.position - b.position)
  if (sideA.length === 0 || sideB.length === 0) return 'Players not set'
  const left = sideA.map((p) => studentName(p.studentId)).join(' / ')
  const right = sideB.map((p) => studentName(p.studentId)).join(' / ')
  return `${left} vs ${right}`
}

export function useMatchPageController() {
  const navigate = useNavigate()
  const location = useLocation()
  const [matches, setMatches] = useState<TrainingMatch[]>([])
  const [formats, setFormats] = useState<ScoringFormat[]>([])
  const [courses, setCourses] = useState<CourseSummary[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [sectionsLoading, setSectionsLoading] = useState(false)
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [panelLoading, setPanelLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [panelMode, setPanelMode] = useState<PanelMode>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null)
  const [selectedMatchDetail, setSelectedMatchDetail] = useState<TrainingMatch | null>(null)
  const [hoveredMatchId, setHoveredMatchId] = useState<number | null>(null)
  const [editPanelPlayers, setEditPanelPlayers] = useState<MatchSidePlayer[]>([])
  const [studentUsersForWinner, setStudentUsersForWinner] = useState<User[]>([])
  const [listPlayersByMatchId, setListPlayersByMatchId] = useState<Record<number, MatchSidePlayer[]>>({})

  const [filterCourseId, setFilterCourseId] = useState('')
  const [filterSectionId, setFilterSectionId] = useState('')
  const [filterSessionId, setFilterSessionId] = useState('')
  const [filterSections, setFilterSections] = useState<Section[]>([])
  const [filterSessions, setFilterSessions] = useState<Session[]>([])
  const [filterSectionsLoading, setFilterSectionsLoading] = useState(false)
  const [filterSessionsLoading, setFilterSessionsLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<MatchFilterStatus>('ALL')
  const [typeFilter, setTypeFilter] = useState<MatchFilterType>('ALL')

  /** Only the first `loadMatches` run toggles page `loading` (PageFeedback). Filter-driven refetches stay silent. */
  const isFirstMatchesFetch = useRef(true)

  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [selectedSessionId, setSelectedSessionId] = useState('')
  const [formatId, setFormatId] = useState('')
  const [matchType, setMatchType] = useState<MatchType>('SINGLES')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<string>('SCHEDULED')
  const [winnerSide, setWinnerSide] = useState('')

  const [editSessionId, setEditSessionId] = useState('')
  const [editFormatId, setEditFormatId] = useState('')
  const [editMatchType, setEditMatchType] = useState<MatchType>('SINGLES')
  const [editTitle, setEditTitle] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editStatus, setEditStatus] = useState<string>('SCHEDULED')
  const [editWinnerSide, setEditWinnerSide] = useState('')

  const selectedMatch = useMemo(
    () =>
      selectedMatchId == null
        ? null
        : matches.find((match) => match.matchId === selectedMatchId) ?? selectedMatchDetail,
    [matches, selectedMatchId, selectedMatchDetail]
  )

  const studentNameForList = useMemo(() => {
    const map = new Map<number, string>()
    for (const u of studentUsersForWinner) {
      if (u.profileId == null) continue
      const label = u.displayName?.trim() || u.email || `Student #${u.profileId}`
      map.set(u.profileId, label)
    }
    return (studentId: number) => map.get(studentId) ?? `Student #${studentId}`
  }, [studentUsersForWinner])

  const loadMatches = useCallback(async () => {
    setError(null)
    const showPageLevelLoading = isFirstMatchesFetch.current
    if (showPageLevelLoading) {
      setLoading(true)
    }
    try {
      const sessionId = Number(filterSessionId)
      const hasSessionFilter = Number.isFinite(sessionId) && sessionId > 0

      let list: TrainingMatch[] = []
      if (hasSessionFilter) {
        list = await getMatchesBySessionId(sessionId)
      } else if (statusFilter !== 'ALL') {
        list = await getMatchesByStatus(statusFilter)
      } else {
        const byStatusLists = await Promise.all(
          MATCH_STATUS_OPTIONS.map((status) =>
            getMatchesByStatus(status).catch(() => [] as TrainingMatch[])
          )
        )
        const dedup = new Map<number, TrainingMatch>()
        for (const item of byStatusLists.flat()) {
          dedup.set(item.matchId, item)
        }
        list = Array.from(dedup.values())
      }

      if (statusFilter !== 'ALL' && hasSessionFilter) {
        list = list.filter((item) => item.status === statusFilter)
      }
      if (typeFilter !== 'ALL') {
        list = list.filter((item) => item.matchType === typeFilter)
      }

      const playersMap: Record<number, MatchSidePlayer[]> = {}
      if (list.length > 0) {
        const playerRows = await Promise.all(
          list.map((m) =>
            getMatchPlayers(m.matchId).catch(() => [] as MatchSidePlayer[])
          )
        )
        list.forEach((m, i) => {
          playersMap[m.matchId] = playerRows[i] ?? []
        })
      }
      setListPlayersByMatchId(playersMap)
      setMatches(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load matches')
      setMatches([])
      setListPlayersByMatchId({})
    } finally {
      if (showPageLevelLoading) {
        setLoading(false)
      }
      isFirstMatchesFetch.current = false
    }
  }, [filterSessionId, statusFilter, typeFilter])

  const loadFormats = useCallback(async () => {
    try {
      const list = await getActiveScoringFormats()
      setFormats(list)
      if (!formatId && list[0]) setFormatId(String(list[0].formatId))
    } catch {
      setFormats([])
    }
  }, [formatId])

  const loadCourses = useCallback(async () => {
    try {
      const list = await getAllCourses()
      setCourses(list)
    } catch {
      setCourses([])
    }
  }, [])

  useEffect(() => {
    void loadMatches()
  }, [loadMatches])

  useEffect(() => {
    void loadFormats()
  }, [loadFormats])

  useEffect(() => {
    void loadCourses()
  }, [loadCourses])

  useEffect(() => {
    void getUsersByRole('STUDENT')
      .then(setStudentUsersForWinner)
      .catch(() => setStudentUsersForWinner([]))
  }, [])

  useEffect(() => {
    if (panelMode !== 'edit' || selectedMatchId == null) {
      setEditPanelPlayers([])
      return
    }
    void getMatchPlayers(selectedMatchId)
      .then(setEditPanelPlayers)
      .catch(() => setEditPanelPlayers([]))
  }, [panelMode, selectedMatchId])

  useEffect(() => {
    const parsedCourseId = Number(filterCourseId)
    if (!Number.isFinite(parsedCourseId) || parsedCourseId <= 0) {
      setFilterSections([])
      setFilterSectionId('')
      setFilterSessions([])
      setFilterSessionId('')
      return
    }
    setFilterSectionId('')
    setFilterSessions([])
    setFilterSessionId('')
    setFilterSectionsLoading(true)
    void getSectionsByCourse(parsedCourseId)
      .then((list) => setFilterSections(list))
      .catch(() => setFilterSections([]))
      .finally(() => setFilterSectionsLoading(false))
  }, [filterCourseId])

  useEffect(() => {
    const parsedSectionId = Number(filterSectionId)
    if (!Number.isFinite(parsedSectionId) || parsedSectionId <= 0) {
      setFilterSessions([])
      setFilterSessionId('')
      return
    }
    setFilterSessions([])
    setFilterSessionId('')
    setFilterSessionsLoading(true)
    void getSessionsBySection(parsedSectionId)
      .then((list) => setFilterSessions(list))
      .catch(() => setFilterSessions([]))
      .finally(() => setFilterSessionsLoading(false))
  }, [filterSectionId])

  useEffect(() => {
    const parsedCourseId = Number(selectedCourseId)
    if (!Number.isFinite(parsedCourseId) || parsedCourseId <= 0) {
      setSections([])
      setSelectedSectionId('')
      setSessions([])
      setSelectedSessionId('')
      return
    }
    setSelectedSectionId('')
    setSessions([])
    setSelectedSessionId('')
    setSectionsLoading(true)
    void getSectionsByCourse(parsedCourseId)
      .then((list) => setSections(list))
      .catch(() => setSections([]))
      .finally(() => setSectionsLoading(false))
  }, [selectedCourseId])

  useEffect(() => {
    const parsedSectionId = Number(selectedSectionId)
    if (!Number.isFinite(parsedSectionId) || parsedSectionId <= 0) {
      setSessions([])
      setSelectedSessionId('')
      return
    }
    setSessions([])
    setSelectedSessionId('')
    setSessionsLoading(true)
    void getSessionsBySection(parsedSectionId)
      .then((list) => setSessions(list))
      .catch(() => setSessions([]))
      .finally(() => setSessionsLoading(false))
  }, [selectedSectionId])

  useEffect(() => {
    const state = location.state as { selectedMatchId?: number } | null
    if (state?.selectedMatchId != null && Number.isFinite(state.selectedMatchId)) {
      setSelectedMatchId(state.selectedMatchId)
    }
  }, [location.state])

  useEffect(() => {
    if (matches.length === 0) {
      if (loading) return
      setSelectedMatchId(null)
      setSelectedMatchDetail(null)
      return
    }
    if (selectedMatchId == null) {
      setSelectedMatchId(matches[0].matchId)
      setSelectedMatchDetail(matches[0])
      return
    }
    const stillInList = matches.some((match) => match.matchId === selectedMatchId)
    if (!stillInList) {
      setSelectedMatchId(matches[0].matchId)
      setSelectedMatchDetail(matches[0])
    } else if (!selectedMatchDetail || selectedMatchDetail.matchId !== selectedMatchId) {
      setSelectedMatchDetail(matches.find((match) => match.matchId === selectedMatchId) ?? null)
    }
  }, [loading, matches, selectedMatchDetail, selectedMatchId])

  function clearMessages() {
    setError(null)
    setSuccess(null)
  }

  function resetCreateForm() {
    setSelectedCourseId('')
    setSelectedSectionId('')
    setSelectedSessionId('')
    setSections([])
    setSessions([])
    setFormatId(formats[0] ? String(formats[0].formatId) : '')
    setMatchType('SINGLES')
    setTitle('')
    setNotes('')
    setStatus('SCHEDULED')
    setWinnerSide('')
  }

  async function loadMatchDetail(matchId: number) {
    try {
      const detail = await getMatchById(matchId)
      setSelectedMatchDetail(detail)
      return detail
    } catch {
      setSelectedMatchDetail(null)
      return null
    }
  }

  function handleSelectMatch(match: TrainingMatch) {
    setPanelMode(null)
    setSelectedMatchId(match.matchId)
    void loadMatchDetail(match.matchId)
  }

  const handleHoverMatch = useCallback((matchId: number) => {
    setHoveredMatchId(matchId)
  }, [])

  const handleLeaveMatch = useCallback(() => {
    setHoveredMatchId(null)
  }, [])

  const handleCloseEditPanel = useCallback(() => {
    setPanelMode(null)
  }, [])

  const handleCloseCreateModal = useCallback(() => {
    setCreateModalOpen(false)
  }, [])

  async function startEdit(match: TrainingMatch) {
    clearMessages()
    setPanelLoading(true)
    setEditSessionId(String(match.sessionId ?? ''))
    setEditFormatId(String(match.formatId ?? ''))
    setEditMatchType(match.matchType === 'DOUBLES' ? 'DOUBLES' : 'SINGLES')
    setEditTitle(match.title ?? '')
    setEditNotes(match.notes ?? '')
    setEditStatus(match.status ?? 'SCHEDULED')
    setEditWinnerSide(match.winnerSide === 'A' || match.winnerSide === 'B' ? match.winnerSide : '')
    try {
      const detail = await getMatchById(match.matchId)
      setEditSessionId(String(detail.sessionId ?? ''))
      setEditFormatId(String(detail.formatId ?? ''))
      setEditMatchType(detail.matchType === 'DOUBLES' ? 'DOUBLES' : 'SINGLES')
      setEditTitle(detail.title ?? '')
      setEditNotes(detail.notes ?? '')
      setEditStatus(detail.status ?? 'SCHEDULED')
      setEditWinnerSide(detail.winnerSide === 'A' || detail.winnerSide === 'B' ? detail.winnerSide : '')
    } catch {
      setError('Could not load selected match for editing.')
    } finally {
      setPanelLoading(false)
    }
  }

  function validateMatchForm(formSessionId: string, formFormatId: string, formWinnerSide: string): string | null {
    const parsedSessionId = Number(formSessionId)
    const parsedFormatId = Number(formFormatId)
    if (!Number.isFinite(parsedSessionId) || parsedSessionId <= 0) {
      return 'Session ID is required and must be greater than 0.'
    }
    if (!Number.isFinite(parsedFormatId) || parsedFormatId <= 0) {
      return 'Scoring format is required.'
    }
    if (formWinnerSide && formWinnerSide !== 'A' && formWinnerSide !== 'B') {
      return 'Winner side must be A or B.'
    }
    return null
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    clearMessages()
    const validationError = validateMatchForm(selectedSessionId, formatId, winnerSide)
    if (validationError) {
      setError(validationError)
      return
    }
    setBusy(true)
    try {
      const created = await createTrainingMatch({
        sessionId: Number(selectedSessionId),
        formatId: Number(formatId),
        matchType,
        title: title.trim() || null,
        notes: notes.trim() || null,
        status: status || null,
        winnerSide: winnerSide || null,
      })
      setSuccess('Match created.')
      setSelectedMatchId(created.matchId)
      setSelectedMatchDetail(created)
      setCreateModalOpen(false)
      await loadMatches()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault()
    clearMessages()
    if (selectedMatchId == null) {
      setError('No match selected.')
      return
    }
    const validationError = validateMatchForm(editSessionId, editFormatId, editWinnerSide)
    if (validationError) {
      setError(validationError)
      return
    }
    setBusy(true)
    try {
      const updated = await updateTrainingMatch(selectedMatchId, {
        sessionId: Number(editSessionId),
        formatId: Number(editFormatId),
        matchType: editMatchType,
        title: editTitle.trim() || null,
        notes: editNotes.trim() || null,
        status: editStatus || null,
        winnerSide: editWinnerSide || null,
      })
      setSuccess('Match updated.')
      setSelectedMatchDetail(updated)
      setPanelMode(null)
      await loadMatches()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (selectedMatchId == null) return
    if (!window.confirm('Delete selected match? This cannot be undone.')) return
    clearMessages()
    setBusy(true)
    try {
      await deleteTrainingMatch(selectedMatchId)
      setSuccess('Match deleted.')
      setSelectedMatchId(null)
      setSelectedMatchDetail(null)
      setPanelMode(null)
      await loadMatches()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  function openCreateModal() {
    clearMessages()
    resetCreateForm()
    setCreateModalOpen(true)
    setPanelLoading(false)
  }

  function openEditPanel() {
    if (!selectedMatch) return
    setCreateModalOpen(false)
    setPanelMode('edit')
    void startEdit(selectedMatch)
  }

  const isEditDisabled = selectedMatchId == null || loading || busy || panelLoading
  const isDeleteDisabled = selectedMatchId == null || loading || busy
  const isViewDetailDisabled = selectedMatchId == null || loading || busy
  const displayMatch = selectedMatchDetail ?? selectedMatch
  const courseOptions = useMemo(
    () =>
      courses
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((course) => ({
          courseId: course.courseId,
          label: `${course.name} (${course.courseNumber})`,
        })),
    [courses]
  )
  const sectionOptions = useMemo(
    () =>
      sections
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((section) => ({
          sectionId: section.sectionId,
          label: section.courseName ? `${section.name} - ${section.courseName}` : section.name,
        })),
    [sections]
  )
  const sessionOptions = useMemo(
    () =>
      sessions
        .slice()
        .sort((a, b) => (a.startTime ?? '').localeCompare(b.startTime ?? ''))
        .map((session) => ({
          sessionId: session.sessionId,
          label: formatSessionLabel(session),
        })),
    [sessions]
  )
  const filterSectionOptions = useMemo(
    () =>
      filterSections
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((section) => ({
          sectionId: section.sectionId,
          label: section.courseName ? `${section.name} - ${section.courseName}` : section.name,
        })),
    [filterSections]
  )
  const filterSessionOptions = useMemo(
    () =>
      filterSessions
        .slice()
        .sort((a, b) => (a.startTime ?? '').localeCompare(b.startTime ?? ''))
        .map((session) => ({
          sessionId: session.sessionId,
          label: formatSessionLabel(session),
        })),
    [filterSessions]
  )

  const editWinnerSideLabels = useMemo(() => {
    const labelForSide = (side: 'A' | 'B') => {
      const names = editPanelPlayers
        .filter((p) => p.side === side)
        .sort((a, b) => a.position - b.position)
        .map((p) => {
          const u = studentUsersForWinner.find((user) => user.profileId === p.studentId)
          return u?.displayName?.trim() || u?.email || `Student #${p.studentId}`
        })
      return names.length > 0 ? names.join(' / ') : `Side ${side}`
    }
    return { A: labelForSide('A'), B: labelForSide('B') }
  }, [editPanelPlayers, studentUsersForWinner])

  return {
    navigate,
    matches,
    formats,
    loading,
    busy,
    panelLoading,
    error,
    success,
    panelMode,
    createModalOpen,
    selectedMatchId,
    setSelectedMatchId,
    hoveredMatchId,
    handleHoverMatch,
    handleLeaveMatch,
    handleCloseEditPanel,
    handleCloseCreateModal,
    filterCourseId,
    setFilterCourseId,
    filterSectionId,
    setFilterSectionId,
    filterSessionId,
    setFilterSessionId,
    filterSectionsLoading,
    filterSessionsLoading,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    selectedCourseId,
    setSelectedCourseId,
    selectedSectionId,
    setSelectedSectionId,
    selectedSessionId,
    setSelectedSessionId,
    formatId,
    setFormatId,
    matchType,
    setMatchType,
    title,
    setTitle,
    notes,
    setNotes,
    status,
    setStatus,
    winnerSide,
    setWinnerSide,
    editSessionId,
    setEditSessionId,
    editFormatId,
    setEditFormatId,
    editMatchType,
    setEditMatchType,
    editTitle,
    setEditTitle,
    editNotes,
    setEditNotes,
    editStatus,
    setEditStatus,
    editWinnerSide,
    setEditWinnerSide,
    selectedMatch,
    studentNameForList,
    loadMatches,
    loadMatchDetail,
    handleSelectMatch,
    handleCreate,
    handleUpdate,
    handleDelete,
    openCreateModal,
    openEditPanel,
    isEditDisabled,
    isDeleteDisabled,
    isViewDetailDisabled,
    displayMatch,
    courseOptions,
    sectionOptions,
    sessionOptions,
    sectionsLoading,
    sessionsLoading,
    filterSectionOptions,
    filterSessionOptions,
    editWinnerSideLabels,
    listPlayersByMatchId,
    formatMatchListLineup,
    MATCH_TYPES,
    MATCH_STATUS_OPTIONS,
  }
}
