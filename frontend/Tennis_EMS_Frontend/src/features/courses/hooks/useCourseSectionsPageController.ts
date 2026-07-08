import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourseById, type CourseDetail } from '../../../api/courseApi'
import {
  archiveSection,
  createSection,
  getSectionById,
  getSectionsByCourse,
  updateSection,
  type Section,
} from '../../../api/sectionApi'
import { getUsersByRole, type User } from '../../../api/userApi'
import { toHtmlDateInputValue } from '../../../utils/displayDate'
import { ADMIN_COURSES, sectionEnrollmentPath, sectionSessionsPath } from '../routes'
import { coachOptionsFromUsers, withUnlistedCoachOption, type CoachSelectOption } from '../utils/courseSectionCoachOptions'
import { toCreateSectionRequest, toUpdateSectionRequest } from '../utils/courseSectionFormMapper'

export type SectionPanelMode = null | 'create' | 'edit'

export type CourseSectionsPageCreateForm = {
  coachId: string
  setCoachId: (v: string) => void
  name: string
  setName: (v: string) => void
  syllabus: string
  setSyllabus: (v: string) => void
  startDate: string
  setStartDate: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
  maxStudents: string
  setMaxStudents: (v: string) => void
}

export type CourseSectionsPageEditForm = {
  sectionId: string
  coachId: string
  setCoachId: (v: string) => void
  name: string
  setName: (v: string) => void
  syllabus: string
  setSyllabus: (v: string) => void
  startDate: string
  setStartDate: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
  maxStudents: string
  setMaxStudents: (v: string) => void
}

export function useCourseSectionsPageController() {
  const { courseId: courseIdParam } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const courseId = Number(courseIdParam)

  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null)
  const [sectionPanelMode, setSectionPanelMode] = useState<SectionPanelMode>(null)
  const [panelDetailLoading, setPanelDetailLoading] = useState(false)

  const [coachUsers, setCoachUsers] = useState<User[]>([])
  const [coachesLoading, setCoachesLoading] = useState(true)

  const [createCoachId, setCreateCoachId] = useState('')
  const [createName, setCreateName] = useState('')
  const [createSyllabus, setCreateSyllabus] = useState('')
  const [createStartDate, setCreateStartDate] = useState('')
  const [createEndDate, setCreateEndDate] = useState('')
  const [createMaxStudents, setCreateMaxStudents] = useState('')

  const [editSectionId, setEditSectionId] = useState('')
  const [editCoachId, setEditCoachId] = useState('')
  const [editName, setEditName] = useState('')
  const [editSyllabus, setEditSyllabus] = useState('')
  const [editStartDate, setEditStartDate] = useState('')
  const [editEndDate, setEditEndDate] = useState('')
  const [editMaxStudents, setEditMaxStudents] = useState('')

  const selectedSection = useMemo(
    () =>
      selectedSectionId == null ? null : sections.find((s) => s.sectionId === selectedSectionId) ?? null,
    [sections, selectedSectionId],
  )

  const coachSelectOptions: CoachSelectOption[] = useMemo(
    () => coachOptionsFromUsers(coachUsers),
    [coachUsers],
  )

  const coachSelectOptionsEdit = useMemo(
    () => withUnlistedCoachOption(coachSelectOptions, editCoachId),
    [coachSelectOptions, editCoachId],
  )

  const createForm: CourseSectionsPageCreateForm = useMemo(
    () => ({
      coachId: createCoachId,
      setCoachId: setCreateCoachId,
      name: createName,
      setName: setCreateName,
      syllabus: createSyllabus,
      setSyllabus: setCreateSyllabus,
      startDate: createStartDate,
      setStartDate: setCreateStartDate,
      endDate: createEndDate,
      setEndDate: setCreateEndDate,
      maxStudents: createMaxStudents,
      setMaxStudents: setCreateMaxStudents,
    }),
    [
      createCoachId,
      createName,
      createSyllabus,
      createStartDate,
      createEndDate,
      createMaxStudents,
    ],
  )

  const editForm: CourseSectionsPageEditForm = useMemo(
    () => ({
      sectionId: editSectionId,
      coachId: editCoachId,
      setCoachId: setEditCoachId,
      name: editName,
      setName: setEditName,
      syllabus: editSyllabus,
      setSyllabus: setEditSyllabus,
      startDate: editStartDate,
      setStartDate: setEditStartDate,
      endDate: editEndDate,
      setEndDate: setEditEndDate,
      maxStudents: editMaxStudents,
      setMaxStudents: setEditMaxStudents,
    }),
    [
      editSectionId,
      editCoachId,
      editName,
      editSyllabus,
      editStartDate,
      editEndDate,
      editMaxStudents,
    ],
  )

  const invalidCourse = !Number.isFinite(courseId) || courseId <= 0
  const courseTitle = course?.name ?? (loading ? '…' : 'Course')
  const panelOpen = sectionPanelMode === 'create' || sectionPanelMode === 'edit'
  const showCreatePanel = sectionPanelMode === 'create'
  const showEditPanel = sectionPanelMode === 'edit'

  /** Create flow does not load section detail; do not tie to edit detail loading. */
  const isCreateDisabled = busy || invalidCourse || !course
  const isEditDisabled = selectedSectionId == null || busy || panelDetailLoading || loading || invalidCourse || !course
  const isEnrollmentNavDisabled =
    selectedSectionId == null || busy || invalidCourse || !course || loading

  const loadPage = useCallback(async () => {
    if (!Number.isFinite(courseId) || courseId <= 0) {
      setError('Invalid course.')
      setCourse(null)
      setSections([])
      setLoading(false)
      return
    }

    setError(null)
    setLoading(true)
    try {
      const [courseDetail, sectionList] = await Promise.all([
        getCourseById(courseId),
        getSectionsByCourse(courseId),
      ])
      setCourse(courseDetail)
      setSections(sectionList)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load course sections')
      setCourse(null)
      setSections([])
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    void loadPage()
  }, [loadPage])

  useEffect(() => {
    setCoachesLoading(true)
    void getUsersByRole('COACH')
      .then(setCoachUsers)
      .catch(() => setCoachUsers([]))
      .finally(() => setCoachesLoading(false))
  }, [])

  useEffect(() => {
    if (sections.length === 0) {
      setSelectedSectionId(null)
      return
    }
    if (selectedSectionId == null) {
      setSelectedSectionId(sections[0].sectionId)
      return
    }
    if (!sections.some((s) => s.sectionId === selectedSectionId)) {
      setSelectedSectionId(sections[0].sectionId)
    }
  }, [sections, selectedSectionId])

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  const resetCreateForm = useCallback(() => {
    setCreateCoachId('')
    setCreateName('')
    setCreateSyllabus('')
    setCreateStartDate('')
    setCreateEndDate('')
    setCreateMaxStudents('')
  }, [])

  const handleClosePanel = useCallback(() => {
    setSectionPanelMode(null)
    setPanelDetailLoading(false)
    clearMessages()
  }, [clearMessages])

  const startEditFromSection = useCallback(
    async (section: Section) => {
      clearMessages()
      setPanelDetailLoading(true)
      setEditSectionId(String(section.sectionId))
      setEditCoachId(section.coachId != null ? String(section.coachId) : '')
      setEditName(section.name)
      setEditSyllabus('')
      setEditStartDate(toHtmlDateInputValue(section.startDate))
      setEditEndDate(toHtmlDateInputValue(section.endDate))
      setEditMaxStudents(
        section.maxStudents != null && section.maxStudents !== undefined ? String(section.maxStudents) : '',
      )

      try {
        const detail = await getSectionById(section.sectionId)
        setEditSyllabus(detail.syllabus ?? '')
        setEditCoachId(detail.coachId != null ? String(detail.coachId) : '')
        setEditStartDate(toHtmlDateInputValue(detail.startDate))
        setEditEndDate(toHtmlDateInputValue(detail.endDate))
        setEditMaxStudents(detail.maxStudents != null ? String(detail.maxStudents) : '')
      } catch {
        setError('Could not load section details for editing.')
      } finally {
        setPanelDetailLoading(false)
      }
    },
    [clearMessages],
  )

  const openCreatePanel = useCallback(() => {
    clearMessages()
    setSectionPanelMode('create')
    setPanelDetailLoading(false)
    resetCreateForm()
  }, [clearMessages, resetCreateForm])

  const openEditPanel = useCallback(() => {
    if (!selectedSection) return
    clearMessages()
    setSectionPanelMode('edit')
    void startEditFromSection(selectedSection)
  }, [clearMessages, selectedSection, startEditFromSection])

  const handleSelectSection = useCallback(
    (section: Section) => {
      setSelectedSectionId(section.sectionId)
      if (sectionPanelMode === 'edit') {
        void startEditFromSection(section)
      }
    },
    [sectionPanelMode, startEditFromSection],
  )

  const handleBackToCourses = useCallback(() => {
    navigate(ADMIN_COURSES)
  }, [navigate])

  const handleViewSessions = useCallback(
    (sid: number) => {
      setSelectedSectionId(sid)
      navigate(sectionSessionsPath(courseId, sid))
    },
    [courseId, navigate],
  )

  const handleViewEnrollment = useCallback(
    (sid: number) => {
      setSelectedSectionId(sid)
      navigate(sectionEnrollmentPath(courseId, sid))
    },
    [courseId, navigate],
  )

  const handleToolbarEnrollment = useCallback(() => {
    if (selectedSectionId == null || invalidCourse) return
    navigate(sectionEnrollmentPath(courseId, selectedSectionId))
  }, [courseId, invalidCourse, navigate, selectedSectionId])

  const handleCreate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      clearMessages()

      const coach = Number(createCoachId)
      if (!coach || coach <= 0) {
        setError('Select a coach.')
        return
      }
      const trimmedName = createName.trim()
      if (!trimmedName) {
        setError('Enter a section name.')
        return
      }

      setBusy(true)
      try {
        const created = await createSection(
          toCreateSectionRequest(courseId, {
            coachId: createCoachId,
            name: createName,
            syllabus: createSyllabus,
            startDate: createStartDate,
            endDate: createEndDate,
            maxStudents: createMaxStudents,
          }),
        )
        setSuccess('Section created.')
        setSelectedSectionId(created.sectionId)
        resetCreateForm()
        await loadPage()
        setSectionPanelMode(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Create section failed')
      } finally {
        setBusy(false)
      }
    },
    [
      clearMessages,
      courseId,
      createCoachId,
      createEndDate,
      createMaxStudents,
      createName,
      createStartDate,
      createSyllabus,
      loadPage,
      resetCreateForm,
    ],
  )

  const handleUpdate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      clearMessages()
      const sid = Number(editSectionId)
      if (!sid) {
        setError('Missing section ID.')
        return
      }

      const coach = Number(editCoachId)
      if (!coach || coach <= 0) {
        setError('Select a coach.')
        return
      }

      setBusy(true)
      try {
        const updated = await updateSection(
          sid,
          toUpdateSectionRequest({
            coachId: editCoachId,
            name: editName,
            syllabus: editSyllabus,
            startDate: editStartDate,
            endDate: editEndDate,
            maxStudents: editMaxStudents,
          }),
        )
        setSuccess('Section updated.')
        setSelectedSectionId(updated.sectionId)
        await loadPage()
        setSectionPanelMode(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Update failed')
      } finally {
        setBusy(false)
      }
    },
    [
      clearMessages,
      editCoachId,
      editEndDate,
      editMaxStudents,
      editName,
      editSectionId,
      editStartDate,
      editSyllabus,
      loadPage,
    ],
  )

  const handleArchiveSection = useCallback(
    async (sectionId: number) => {
      setSelectedSectionId(sectionId)
      clearMessages()
      if (!window.confirm('Archive this section? It will be marked inactive.')) return
      setBusy(true)
      try {
        await archiveSection(sectionId)
        setSuccess('Section archived.')
        await loadPage()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Archive failed')
      } finally {
        setBusy(false)
      }
    },
    [clearMessages, loadPage],
  )

  return {
    courseId,
    invalidCourse,
    course,
    courseTitle,
    sections,
    loading,
    busy,
    error,
    success,
    selectedSectionId,
    selectedSection,
    sectionPanelMode,
    panelDetailLoading,
    panelOpen,
    showCreatePanel,
    showEditPanel,
    createForm,
    editForm,
    coachSelectOptions,
    coachSelectOptionsEdit,
    coachesLoading,
    clearMessages,
    handleClosePanel,
    openCreatePanel,
    openEditPanel,
    handleSelectSection,
    handleBackToCourses,
    handleViewSessions,
    handleViewEnrollment,
    handleToolbarEnrollment,
    handleCreate,
    handleUpdate,
    handleArchiveSection,
    isCreateDisabled,
    isEditDisabled,
    isEnrollmentNavDisabled,
  }
}
