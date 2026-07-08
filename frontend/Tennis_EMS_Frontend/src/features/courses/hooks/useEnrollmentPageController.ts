import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourseById } from '../../../api/courseApi'
import {
  dropStudent,
  enrollStudent,
  getStudentsBySection,
  type Student,
} from '../../../api/enrollmentApi'
import { getSectionById } from '../../../api/sectionApi'
import { getUsersByRole, type User } from '../../../api/userApi'
import { ADMIN_COURSES, courseSectionsPath } from '../routes'

export function useEnrollmentPageController() {
  const { courseId: courseParam, sectionId: sectionParam } = useParams<{
    courseId: string
    sectionId: string
  }>()
  const navigate = useNavigate()

  const courseId = Number(courseParam)
  const sectionId = Number(sectionParam)
  const invalidIds =
    !Number.isFinite(courseId) ||
    courseId <= 0 ||
    !Number.isFinite(sectionId) ||
    sectionId <= 0

  const [courseName, setCourseName] = useState<string | null>(null)
  const [sectionName, setSectionName] = useState<string | null>(null)
  const [metaError, setMetaError] = useState<string | null>(null)
  const [metaLoading, setMetaLoading] = useState(true)

  const [studentIdToEnroll, setStudentIdToEnroll] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [studentUsers, setStudentUsers] = useState<User[]>([])
  const [studentUsersLoading, setStudentUsersLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const courseTitle = courseName ?? (metaLoading ? '…' : 'Course')
  const sectionTitle = sectionName ?? (metaLoading ? '…' : 'Section')

  useEffect(() => {
    let cancelled = false
    async function loadMeta() {
      if (invalidIds) {
        setMetaLoading(false)
        setMetaError('Invalid course or section in URL.')
        return
      }
      setMetaLoading(true)
      setMetaError(null)
      try {
        const [course, section] = await Promise.all([
          getCourseById(courseId),
          getSectionById(sectionId),
        ])
        if (section.courseId !== courseId) {
          setMetaError('This section does not belong to the selected course.')
          setCourseName(null)
          setSectionName(null)
          return
        }
        if (!cancelled) {
          setCourseName(course.name)
          setSectionName(section.name)
        }
      } catch (e) {
        if (!cancelled) {
          setMetaError(e instanceof Error ? e.message : 'Failed to load section context.')
          setCourseName(null)
          setSectionName(null)
        }
      } finally {
        if (!cancelled) setMetaLoading(false)
      }
    }
    void loadMeta()
    return () => {
      cancelled = true
    }
  }, [courseId, sectionId, invalidIds])

  useEffect(() => {
    setStudentUsersLoading(true)
    void getUsersByRole('STUDENT')
      .then(setStudentUsers)
      .catch(() => setStudentUsers([]))
      .finally(() => setStudentUsersLoading(false))
  }, [])

  const enrollStudentOptions = useMemo(() => {
    const enrolled = new Set(students.map((s) => s.id))
    return studentUsers
      .filter(
        (u) =>
          u.profileId != null &&
          u.profileId > 0 &&
          !enrolled.has(u.profileId as number),
      )
      .map((u) => {
        const pid = u.profileId as number
        const name = u.displayName?.trim() || u.email || 'Student'
        return {
          value: String(pid),
          label: `${name} (Student ID: ${pid})`,
        }
      })
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [studentUsers, students])

  const loadStudents = async () => {
    const list = await getStudentsBySection(sectionId)
    setStudents(list)
    return list
  }

  useEffect(() => {
    if (metaLoading || metaError || invalidIds || !courseName || !sectionName) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      setSuccess(null)
      try {
        const list = await getStudentsBySection(sectionId)
        if (!cancelled) {
          setStudents(list)
          setSuccess(`Loaded ${list.length} student(s).`)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load students')
          setStudents([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [metaLoading, metaError, invalidIds, courseName, sectionName, sectionId])

  const handleEnroll = async (e: FormEvent) => {
    e.preventDefault()
    const studentId = Number(studentIdToEnroll)
    if (!Number.isFinite(studentId) || studentId <= 0) {
      setError('Select a student to enroll.')
      return
    }
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await enrollStudent(studentId, sectionId)
      setSuccess('Student enrolled.')
      setStudentIdToEnroll('')
      await loadStudents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enroll failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = async (studentId: number) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await dropStudent(studentId, sectionId)
      setSuccess('Student dropped.')
      await loadStudents()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Drop failed')
    } finally {
      setLoading(false)
    }
  }

  const backToSections = () => {
    navigate(!invalidIds ? courseSectionsPath(courseId) : ADMIN_COURSES)
  }

  return {
    courseId,
    sectionId,
    invalidIds,
    courseTitle,
    sectionTitle,
    metaLoading,
    metaError,
    students,
    loading,
    success,
    error,
    studentUsersLoading,
    enrollStudentOptions,
    studentIdToEnroll,
    setStudentIdToEnroll,
    handleEnroll,
    handleDrop,
    backToSections,
  }
}
