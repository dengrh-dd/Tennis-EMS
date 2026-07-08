import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getCourseById, type CourseDetail } from '../../../api/courseApi'
import { getSectionById, type SectionDetail } from '../../../api/sectionApi'
import { getCourts, type CourtSummary } from '../../../api/courtApi'
import {
  cancelSession,
  createSession,
  getSessionById,
  getSessionsBySection,
  updateSession,
  type CreateSessionRequest,
  type Session,
  type UpdateSessionRequest,
} from '../../../api/sessionApi'

import {
  joinLocalDateTime,
  splitLocalDateTime,
} from '../../../utils/displayDate'

import { courseSectionsPath, sessionAttendancePath } from '../routes'
import { SESSION_STATUS, toCreateSessionRequest, toIsoLocalDateTime, toUpdateSessionRequest } from '../utils/sessionFormMapper'

export type SectionSessionsPanelMode = null | 'create' | 'edit'

export type SectionSessionsPageCreateForm = {
  startDate: string
  setStartDate: (v: string) => void
  startTime: string
  setStartTime: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
  endTime: string
  setEndTime: (v: string) => void
  courtId: string
  setCourtId: (v: string) => void
  status: string
  setStatus: (v: string) => void
}

export type SectionSessionsPageEditForm = {
  sessionId: string
  startDate: string
  setStartDate: (v: string) => void
  startTime: string
  setStartTime: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
  endTime: string
  setEndTime: (v: string) => void
  courtId: string
  setCourtId: (v: string) => void
  status: string
  setStatus: (v: string) => void
}

export function useSectionSessionsPageController() {
  const { courseId: courseIdParam, sectionId: sectionIdParam } = useParams<{
    courseId: string
    sectionId: string
  }>()
  const navigate = useNavigate()

  const courseId = Number(courseIdParam)
  const sectionId = Number(sectionIdParam)

  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [section, setSection] = useState<SectionDetail | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null)
  const [sessionPanelMode, setSessionPanelMode] = useState<SectionSessionsPanelMode>(null)
  const [panelDetailLoading, setPanelDetailLoading] = useState(false)

  const [courts, setCourts] = useState<CourtSummary[]>([])
  const [courtsLoading, setCourtsLoading] = useState(true)

  // Create form
  const [createStartDate, setCreateStartDate] = useState('')
  const [createStartTime, setCreateStartTime] = useState('')
  const [createEndDate, setCreateEndDate] = useState('')
  const [createEndTime, setCreateEndTime] = useState('')
  const [createCourtId, setCreateCourtId] = useState('')
  const [createStatus, setCreateStatus] = useState<string>(SESSION_STATUS[0])

  // Edit form
  const [editSessionId, setEditSessionId] = useState('')
  const [editStartDate, setEditStartDate] = useState('')
  const [editStartTime, setEditStartTime] = useState('')
  const [editEndDate, setEditEndDate] = useState('')
  const [editEndTime, setEditEndTime] = useState('')
  const [editCourtId, setEditCourtId] = useState('')
  const [editStatus, setEditStatus] = useState<string>(SESSION_STATUS[0])

  const selectedSession = useMemo(
    () => (selectedSessionId == null ? null : sessions.find((s) => s.sessionId === selectedSessionId) ?? null),
    [sessions, selectedSessionId],
  )

  const courtsForEditDropdown = useMemo(() => {
    const parsed = Number(editCourtId)
    if (!editCourtId.trim() || !Number.isFinite(parsed) || parsed <= 0) return courts
    if (courts.some((c) => c.courtId === parsed)) return courts
    return [...courts, { courtId: parsed, name: null, location: null }]
  }, [courts, editCourtId])

  const invalidIds = !Number.isFinite(courseId) || courseId <= 0 || !Number.isFinite(sectionId) || sectionId <= 0

  const panelOpen = sessionPanelMode === 'create' || sessionPanelMode === 'edit'
  const showCreatePanel = sessionPanelMode === 'create'
  const showEditPanel = sessionPanelMode === 'edit'

  const courseTitle = course?.name ?? (loading ? '…' : 'Course')
  const sectionTitle = section?.name ?? (loading ? '…' : 'Section')

  const isCreateDisabled = busy || panelDetailLoading || invalidIds || !section

  const isEditDisabledBase = selectedSessionId == null || busy || panelDetailLoading || loading
  const isEditDisabled = isEditDisabledBase || invalidIds || !section

  const isAttendanceNavDisabled = selectedSessionId == null || busy || invalidIds || !section || loading
  const isAttendanceCursorDisabled = selectedSessionId == null || invalidIds

  const createForm: SectionSessionsPageCreateForm = useMemo(
    () => ({
      startDate: createStartDate,
      setStartDate: setCreateStartDate,
      startTime: createStartTime,
      setStartTime: setCreateStartTime,
      endDate: createEndDate,
      setEndDate: setCreateEndDate,
      endTime: createEndTime,
      setEndTime: setCreateEndTime,
      courtId: createCourtId,
      setCourtId: setCreateCourtId,
      status: createStatus,
      setStatus: setCreateStatus,
    }),
    [
      createCourtId,
      createStatus,
      createStartDate,
      createStartTime,
      createEndDate,
      createEndTime,
    ],
  )

  const editForm: SectionSessionsPageEditForm = useMemo(
    () => ({
      sessionId: editSessionId,
      startDate: editStartDate,
      setStartDate: setEditStartDate,
      startTime: editStartTime,
      setStartTime: setEditStartTime,
      endDate: editEndDate,
      setEndDate: setEditEndDate,
      endTime: editEndTime,
      setEndTime: setEditEndTime,
      courtId: editCourtId,
      setCourtId: setEditCourtId,
      status: editStatus,
      setStatus: setEditStatus,
    }),
    [
      editCourtId,
      editStatus,
      editEndDate,
      editEndTime,
      editStartDate,
      editStartTime,
      editSessionId,
    ],
  )

  const sectionsPath = courseSectionsPath(courseId)

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  const resetCreateForm = useCallback(() => {
    setCreateStartDate('')
    setCreateStartTime('')
    setCreateEndDate('')
    setCreateEndTime('')
    setCreateCourtId('')
    setCreateStatus(SESSION_STATUS[0])
  }, [])

  const loadPage = useCallback(async () => {
    if (invalidIds) {
      setError('Invalid course or section.')
      setCourse(null)
      setSection(null)
      setSessions([])
      setLoading(false)
      return
    }

    setError(null)
    setLoading(true)
    try {
      const [courseDetail, sectionDetail, sessionList] = await Promise.all([
        getCourseById(courseId),
        getSectionById(sectionId),
        getSessionsBySection(sectionId),
      ])
      if (sectionDetail.courseId !== courseId) {
        setError('This section does not belong to the selected course.')
        setCourse(null)
        setSection(null)
        setSessions([])
        return
      }
      setCourse(courseDetail)
      setSection(sectionDetail)
      setSessions(sessionList)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load sessions')
      setCourse(null)
      setSection(null)
      setSessions([])
    } finally {
      setLoading(false)
    }
  }, [courseId, invalidIds, sectionId])

  useEffect(() => {
    void loadPage()
  }, [loadPage])

  useEffect(() => {
    setCourtsLoading(true)
    void getCourts()
      .then(setCourts)
      .catch(() => setCourts([]))
      .finally(() => setCourtsLoading(false))
  }, [])

  useEffect(() => {
    if (sessions.length === 0) {
      setSelectedSessionId(null)
      return
    }
    if (selectedSessionId == null) {
      setSelectedSessionId(sessions[0].sessionId)
      return
    }
    if (!sessions.some((s) => s.sessionId === selectedSessionId)) {
      setSelectedSessionId(sessions[0].sessionId)
    }
  }, [sessions, selectedSessionId])

  const handleClosePanel = useCallback(() => {
    setSessionPanelMode(null)
    setPanelDetailLoading(false)
    clearMessages()
  }, [clearMessages])

  const startEditFromSession = useCallback(
    async (sess: Session) => {
      clearMessages()
      setPanelDetailLoading(true)
      setEditSessionId(String(sess.sessionId))

      {
        const s = splitLocalDateTime(sess.startTime)
        const e = splitLocalDateTime(sess.endTime)
        setEditStartDate(s.date)
        setEditStartTime(s.time)
        setEditEndDate(e.date)
        setEditEndTime(e.time)
      }

      setEditCourtId(sess.courtId != null ? String(sess.courtId) : '')
      setEditStatus(
        sess.status && SESSION_STATUS.includes(sess.status as (typeof SESSION_STATUS)[number])
          ? sess.status
          : SESSION_STATUS[0],
      )

      try {
        const detail = await getSessionById(sess.sessionId)
        {
          const s = splitLocalDateTime(detail.startTime)
          const e = splitLocalDateTime(detail.endTime)
          setEditStartDate(s.date)
          setEditStartTime(s.time)
          setEditEndDate(e.date)
          setEditEndTime(e.time)
        }
        setEditCourtId(detail.courtId != null ? String(detail.courtId) : '')
        setEditStatus(
          detail.status && SESSION_STATUS.includes(detail.status as (typeof SESSION_STATUS)[number])
            ? detail.status
            : SESSION_STATUS[0],
        )
      } catch {
        setError('Could not load session details for editing.')
      } finally {
        setPanelDetailLoading(false)
      }
    },
    [clearMessages],
  )

  const openCreatePanel = useCallback(() => {
    clearMessages()
    setSessionPanelMode('create')
    setPanelDetailLoading(false)
    resetCreateForm()
  }, [clearMessages, resetCreateForm])

  const openEditPanel = useCallback(() => {
    if (!selectedSession) return
    clearMessages()
    setSessionPanelMode('edit')
    void startEditFromSession(selectedSession)
  }, [clearMessages, selectedSession, startEditFromSession])

  const handleSelectSession = useCallback(
    (sess: Session) => {
      setSelectedSessionId(sess.sessionId)
      if (sessionPanelMode === 'edit') {
        void startEditFromSession(sess)
      }
    },
    [sessionPanelMode, startEditFromSession],
  )

  const handleAttendance = useCallback(
    (sess: Session) => {
      setSelectedSessionId(sess.sessionId)
      navigate(sessionAttendancePath(courseId, sectionId, sess.sessionId))
    },
    [courseId, navigate, sectionId],
  )

  const handleToolbarAttendance = useCallback(() => {
    if (selectedSessionId == null || invalidIds) return
    navigate(sessionAttendancePath(courseId, sectionId, selectedSessionId))
  }, [courseId, invalidIds, navigate, selectedSessionId, sectionId])

  const handleCancelSession = useCallback(
    async (sess: Session) => {
      clearMessages()
      setSelectedSessionId(sess.sessionId)
      if (!window.confirm('Cancel this session?')) return
      setBusy(true)
      try {
        await cancelSession(sess.sessionId)
        setSuccess('Session cancelled.')
        await loadPage()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Cancel failed')
      } finally {
        setBusy(false)
      }
    },
    [clearMessages, loadPage],
  )

  const handleCreate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      clearMessages()
      const createStart = joinLocalDateTime(createStartDate, createStartTime)
      const createEnd = joinLocalDateTime(createEndDate, createEndTime)
      if (!createStart || !createEnd) {
        setError('Start and end date/time are required (use MM/DD/YY and 24-hour HH:MM).')
        return
      }
      const startIso = toIsoLocalDateTime(createStart)
      const endIso = toIsoLocalDateTime(createEnd)
      if (startIso >= endIso) {
        setError('End time must be after start time.')
        return
      }

      setBusy(true)
      try {
        const payload: CreateSessionRequest = toCreateSessionRequest(sectionId, {
          startTimeIsoLocalDateTime: createStart,
          endTimeIsoLocalDateTime: createEnd,
          courtId: createCourtId,
          status: createStatus,
        })
        const created = await createSession(payload)
        setSuccess('Session created.')
        setSelectedSessionId(created.sessionId)
        resetCreateForm()
        await loadPage()
        setSessionPanelMode(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Create session failed')
      } finally {
        setBusy(false)
      }
    },
    [
      clearMessages,
      createCourtId,
      createEndDate,
      createEndTime,
      createStartDate,
      createStartTime,
      createStatus,
      loadPage,
      resetCreateForm,
      sectionId,
    ],
  )

  const handleUpdate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      clearMessages()

      const sid = Number(editSessionId)
      if (!sid) {
        setError('Missing session ID.')
        return
      }

      const editStart = joinLocalDateTime(editStartDate, editStartTime)
      const editEnd = joinLocalDateTime(editEndDate, editEndTime)
      if (!editStart || !editEnd) {
        setError('Start and end date/time are required (use MM/DD/YY and 24-hour HH:MM).')
        return
      }

      const startIso = toIsoLocalDateTime(editStart)
      const endIso = toIsoLocalDateTime(editEnd)
      if (startIso >= endIso) {
        setError('End time must be after start time.')
        return
      }

      setBusy(true)
      try {
        const body: UpdateSessionRequest = toUpdateSessionRequest(sectionId, {
          startTimeIsoLocalDateTime: editStart,
          endTimeIsoLocalDateTime: editEnd,
          courtId: editCourtId,
          status: editStatus,
        })
        const updated = await updateSession(sid, body)
        setSuccess('Session updated.')
        setSelectedSessionId(updated.sessionId)
        await loadPage()
        setSessionPanelMode(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Update failed')
      } finally {
        setBusy(false)
      }
    },
    [
      clearMessages,
      editCourtId,
      editEndDate,
      editEndTime,
      editSessionId,
      editStartDate,
      editStartTime,
      editStatus,
      loadPage,
      sectionId,
    ],
  )

  const handleBackToSections = useCallback(() => {
    navigate(sectionsPath)
  }, [navigate, sectionsPath])

  return {
    // Identifiers
    courseId,
    sectionId,
    sectionsPath,

    // Page context
    invalidIds,
    course,
    section,
    courseTitle,
    sectionTitle,

    // Data
    sessions,
    selectedSessionId,
    selectedSession,
    loading,
    busy,
    error,
    success,

    // UI state
    panelOpen,
    showCreatePanel,
    showEditPanel,
    panelDetailLoading,
    courts,
    courtsLoading,
    courtsForEditDropdown,

    // Toolbar/controls
    isCreateDisabled,
    isEditDisabledBase,
    isEditDisabled,
    isAttendanceNavDisabled,
    isAttendanceCursorDisabled,

    createForm,
    editForm,

    // Handlers
    clearMessages,
    handleClosePanel,
    openCreatePanel,
    openEditPanel,
    handleSelectSession,
    handleAttendance,
    handleToolbarAttendance,
    handleCancelSession,
    handleCreate,
    handleUpdate,
    handleBackToSections,
  }
}

