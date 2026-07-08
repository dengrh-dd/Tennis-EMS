import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePermission } from '../../../permissions/usePermission'
import { courseSectionsPath } from '../routes'
import {
  archiveCourse,
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourse,
  COURSE_LEVELS,
  type CourseSummary,
} from '../../../api/courseApi'
import { resolveCourseLevel, toCreateCourseRequest, toUpdateCourseRequest } from '../utils/courseFormMapper'

export type CoursePanelMode = null | 'create' | 'edit'

/** Grouped state for the create-course panel (values + setters). */
export type CoursesPageCreateForm = {
  name: string
  setName: (v: string) => void
  courseNumber: string
  setCourseNumber: (v: string) => void
  description: string
  setDescription: (v: string) => void
  level: string
  setLevel: (v: string) => void
  isActiveNew: boolean
  setIsActiveNew: (v: boolean) => void
}

/** Grouped state for the edit-course panel (values + setters). Course ID is display-only. */
export type CoursesPageEditForm = {
  courseId: string
  name: string
  setName: (v: string) => void
  courseNumber: string
  setCourseNumber: (v: string) => void
  description: string
  setDescription: (v: string) => void
  level: string
  setLevel: (v: string) => void
  isActive: boolean
  setIsActive: (v: boolean) => void
}

export function useCoursesPageController() {
  const navigate = useNavigate()
  const { can } = usePermission()

  const canView = can('courses.view')
  const canCreate = can('courses.create')
  const canEdit = can('courses.edit')
  const canDelete = can('courses.delete')

  const [courses, setCourses] = useState<CourseSummary[]>([])
  const [loading, setLoading] = useState(true)
  /** Only first catalog load toggles page `loading`; refetches after mutations stay section-level (silent). */
  const isFirstCoursesFetch = useRef(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)

  const [coursePanelMode, setCoursePanelMode] = useState<CoursePanelMode>(null)
  const [panelDetailLoading, setPanelDetailLoading] = useState(false)

  const [name, setName] = useState('')
  const [courseNumber, setCourseNumber] = useState('')
  const [description, setDescription] = useState('')
  const [level, setLevel] = useState<string>(COURSE_LEVELS[0])
  const [isActiveNew, setIsActiveNew] = useState(true)

  const [editCourseId, setEditCourseId] = useState('')
  const [editName, setEditName] = useState('')
  const [editCourseNumber, setEditCourseNumber] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editLevel, setEditLevel] = useState<string>(COURSE_LEVELS[0])
  const [editIsActive, setEditIsActive] = useState(true)

  const selectedCourse = useMemo(
    () => (selectedCourseId == null ? null : courses.find((c) => c.courseId === selectedCourseId) ?? null),
    [courses, selectedCourseId],
  )

  const createForm: CoursesPageCreateForm = useMemo(
    () => ({
      name,
      setName,
      courseNumber,
      setCourseNumber,
      description,
      setDescription,
      level,
      setLevel,
      isActiveNew,
      setIsActiveNew,
    }),
    [
      name,
      courseNumber,
      description,
      level,
      isActiveNew,
    ],
  )

  const editForm: CoursesPageEditForm = useMemo(
    () => ({
      courseId: editCourseId,
      name: editName,
      setName: setEditName,
      courseNumber: editCourseNumber,
      setCourseNumber: setEditCourseNumber,
      description: editDescription,
      setDescription: setEditDescription,
      level: editLevel,
      setLevel: setEditLevel,
      isActive: editIsActive,
      setIsActive: setEditIsActive,
    }),
    [
      editCourseId,
      editName,
      editCourseNumber,
      editDescription,
      editLevel,
      editIsActive,
    ],
  )

  const loadCourses = useCallback(async () => {
    setError(null)
    const showPageLevelLoading = isFirstCoursesFetch.current
    if (showPageLevelLoading) {
      setLoading(true)
    }
    try {
      const list = await getAllCourses()
      setCourses(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load courses')
      setCourses([])
    } finally {
      if (showPageLevelLoading) {
        setLoading(false)
      }
      isFirstCoursesFetch.current = false
    }
  }, [])

  useEffect(() => {
    void loadCourses()
  }, [loadCourses])

  useEffect(() => {
    if (courses.length === 0) {
      setSelectedCourseId(null)
      return
    }

    if (selectedCourseId == null) {
      setSelectedCourseId(courses[0].courseId)
      return
    }

    if (!courses.some((c) => c.courseId === selectedCourseId)) {
      setSelectedCourseId(courses[0].courseId)
    }
  }, [courses, selectedCourseId])

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  const resetCreateForm = useCallback(() => {
    setName('')
    setCourseNumber('')
    setDescription('')
    setLevel(COURSE_LEVELS[0])
    setIsActiveNew(true)
  }, [])

  const handleClosePanel = useCallback(() => {
    setCoursePanelMode(null)
    setPanelDetailLoading(false)
    clearMessages()
  }, [clearMessages])

  const startEditFromCourse = useCallback(
    async (c: CourseSummary) => {
      clearMessages()
      setPanelDetailLoading(true)

      setEditCourseId(String(c.courseId))
      setEditName(c.name)
      setEditCourseNumber(c.courseNumber)
      setEditLevel(resolveCourseLevel(c.level))
      setEditIsActive(Boolean(c.isActive))
      setEditDescription('')

      try {
        const detail = await getCourseById(c.courseId)
        setEditDescription(detail.description ?? '')
      } catch {
        setError('Could not load course details for editing.')
      } finally {
        setPanelDetailLoading(false)
      }
    },
    [clearMessages],
  )

  const openCreatePanel = useCallback(() => {
    if (!canCreate) return
    clearMessages()
    setCoursePanelMode('create')
    setPanelDetailLoading(false)
    resetCreateForm()
  }, [canCreate, clearMessages, resetCreateForm])

  const openEditPanel = useCallback(() => {
    if (!canEdit || !selectedCourse) return
    clearMessages()
    setCoursePanelMode('edit')
    void startEditFromCourse(selectedCourse)
  }, [canEdit, clearMessages, selectedCourse, startEditFromCourse])

  const handleSelectCourse = useCallback(
    (c: CourseSummary) => {
      setSelectedCourseId(c.courseId)
      if (coursePanelMode === 'edit' && canEdit) {
        void startEditFromCourse(c)
      }
    },
    [canEdit, coursePanelMode, startEditFromCourse],
  )

  const handleViewSections = useCallback(
    (courseId: number) => {
      setSelectedCourseId(courseId)
      navigate(courseSectionsPath(courseId))
    },
    [navigate],
  )

  const handleCreate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (!canCreate) return
      clearMessages()
      setBusy(true)
      try {
        const created = await createCourse(
          toCreateCourseRequest({
            name,
            courseNumber,
            description,
            level,
            isActive: isActiveNew,
          }),
        )

        setSuccess('Course created.')
        setSelectedCourseId(created.courseId)
        resetCreateForm()
        await loadCourses()
        setCoursePanelMode(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Create failed')
      } finally {
        setBusy(false)
      }
    },
    [canCreate, clearMessages, courseNumber, description, isActiveNew, level, loadCourses, name, resetCreateForm],
  )

  const handleUpdate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (!canEdit) return
      clearMessages()
      const id = Number(editCourseId)
      if (!id) {
        setError('Enter a course ID to update.')
        return
      }

      setBusy(true)
      try {
        const updated = await updateCourse(
          id,
          toUpdateCourseRequest({
            editName,
            editCourseNumber,
            editDescription,
            editLevel,
            editIsActive,
          }),
        )

        setSuccess('Course updated.')
        setSelectedCourseId(updated.courseId)
        await loadCourses()
        setCoursePanelMode(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Update failed')
      } finally {
        setBusy(false)
      }
    },
    [
      canEdit,
      clearMessages,
      editCourseId,
      editCourseNumber,
      editDescription,
      editIsActive,
      editLevel,
      editName,
      loadCourses,
    ],
  )

  const handleArchive = useCallback(
    async (courseId: number) => {
      if (!canDelete) return
      clearMessages()
      if (!window.confirm('Archive this course? It will be marked inactive.')) return
      setBusy(true)
      try {
        await archiveCourse(courseId)
        setSuccess('Course archived.')
        await loadCourses()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Archive failed')
      } finally {
        setBusy(false)
      }
    },
    [canDelete, clearMessages, loadCourses],
  )

  /** Create flow does not load remote detail; only block on in-flight mutations. */
  const isCreateDisabled = busy
  const isEditDisabled = selectedCourseId == null || busy || panelDetailLoading || loading

  const showCreateForm = coursePanelMode === 'create' && canCreate
  const showEditForm = coursePanelMode === 'edit' && canEdit

  return {
    canView,
    canCreate,
    canEdit,
    canDelete,
    courses,
    loading,
    busy,
    error,
    success,
    selectedCourseId,
    coursePanelMode,
    panelDetailLoading,
    createForm,
    editForm,
    selectedCourse,
    handleClosePanel,
    openCreatePanel,
    openEditPanel,
    handleSelectCourse,
    handleViewSections,
    handleCreate,
    handleUpdate,
    handleArchive,
    isCreateDisabled,
    isEditDisabled,
    showCreateForm,
    showEditForm,
  }
}
