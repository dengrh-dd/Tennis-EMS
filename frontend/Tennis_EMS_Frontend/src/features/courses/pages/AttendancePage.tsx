import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DrillDownPageShell from '../../../components/layout/DrillDownPageShell'
import SplitPageLayout from '../../../components/layout/SplitPageLayout'
import {
  breadcrumbCurrentStyle,
  breadcrumbLinkStyle,
  workspaceDetailStackStyle,
  workspaceMainColumnStyle,
} from '../../../components/layout/drillDownLayout'
import {
  pageHeaderDescriptionStrongStyle,
  pageHeaderDescriptionStyle,
} from '../../../components/layout/pageHeaderLayout'
import EmptyState from '../../../components/ui/EmptyState'
import FormField from '../../../components/ui/FormField'
import FormActionButton from '../../../components/ui/form/FormActionButton'
import PageFeedback from '../../../components/ui/PageFeedback'
import PageHeader from '../../../components/ui/PageHeader'
import StatusMessage from '../../../components/ui/StatusMessage'
import WorkspaceSectionHeading from '../../../components/ui/WorkspaceSectionHeading'
import '../../../components/ui/emsFormLayout.css'
import { uiFormSectionSurfaceStyle, uiInlineFormRowStyle, uiStackedListRowStyle } from '../../../components/ui/uiPrimitives'
import { uiFontSize, uiHeadingStyle } from '../../../components/ui/uiTokens'
import { getCourseById } from '../../../api/courseApi'
import { getSectionById } from '../../../api/sectionApi'
import { getSessionById } from '../../../api/sessionApi'
import {
  getAttendanceBySession,
  markAttendance,
  type AttendanceRecord,
  type MarkAttendancePayload,
} from '../../../api/attendanceApi'
import { ADMIN_COURSES, courseSectionsPath, sectionSessionsPath } from '../routes'
import { formatDisplayDateTime } from '../../../utils/displayDate'

const STATUS_OPTIONS = ['PRESENT', 'LATE', 'ABSENT', 'EXCUSED'] as const
const SOURCE_OPTIONS = ['SECTION', 'DROP_IN', 'ADMIN'] as const

export default function AttendancePage() {
  const { courseId: cParam, sectionId: sParam, sessionId: sessParam } = useParams<{
    courseId: string
    sectionId: string
    sessionId: string
  }>()
  const navigate = useNavigate()

  const courseId = Number(cParam)
  const sectionId = Number(sParam)
  const sessionId = Number(sessParam)

  const [courseName, setCourseName] = useState<string | null>(null)
  const [sectionName, setSectionName] = useState<string | null>(null)
  const [sessionLabel, setSessionLabel] = useState<string>('Session')
  const [metaError, setMetaError] = useState<string | null>(null)
  const [metaLoading, setMetaLoading] = useState(true)

  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const invalidIds =
    !Number.isFinite(courseId) ||
    courseId <= 0 ||
    !Number.isFinite(sectionId) ||
    sectionId <= 0 ||
    !Number.isFinite(sessionId) ||
    sessionId <= 0

  useEffect(() => {
    let cancelled = false
    async function loadMeta() {
      if (invalidIds) {
        setMetaLoading(false)
        setMetaError('Invalid course, section, or session in URL.')
        return
      }
      setMetaLoading(true)
      setMetaError(null)
      try {
        const session = await getSessionById(sessionId)
        if (session.sectionId !== sectionId) {
          setMetaError('This session does not belong to the selected section.')
          return
        }
        const [course, section] = await Promise.all([getCourseById(courseId), getSectionById(sectionId)])
        if (section.courseId !== courseId) {
          setMetaError('This section does not belong to the selected course.')
          return
        }
        if (!cancelled) {
          setCourseName(course.name)
          setSectionName(section.name)
          setSessionLabel(`Session #${sessionId} · ${formatDisplayDateTime(session.startTime)}`)
        }
      } catch (e) {
        if (!cancelled) {
          setMetaError(e instanceof Error ? e.message : 'Failed to load session context.')
        }
      } finally {
        if (!cancelled) setMetaLoading(false)
      }
    }
    void loadMeta()
    return () => {
      cancelled = true
    }
  }, [courseId, sectionId, sessionId, invalidIds])

  useEffect(() => {
    if (metaLoading || metaError || invalidIds || !courseName) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      setSuccess(null)
      try {
        const list = await getAttendanceBySession(sessionId)
        if (!cancelled) {
          setRecords(list)
          setSuccess(`Loaded ${list.length} record(s).`)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load attendance')
          setRecords([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [metaLoading, metaError, invalidIds, courseName, sessionId])

  const handleMarkAttendance = async (payload: MarkAttendancePayload) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await markAttendance(payload)
      setSuccess('Attendance marked.')
      const list = await getAttendanceBySession(payload.sessionId)
      setRecords(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to mark attendance')
    } finally {
      setLoading(false)
    }
  }

  const sessionsPath = sectionSessionsPath(courseId, sectionId)
  const backToSessions = () => navigate(!invalidIds ? sessionsPath : ADMIN_COURSES)

  const courseTitle = courseName ?? (metaLoading ? '…' : 'Course')
  const sectionTitle = sectionName ?? (metaLoading ? '…' : 'Section')

  const main = (
    <div style={workspaceMainColumnStyle}>
      <PageHeader
        breadcrumbLineHeight={1.6}
        breadcrumb={
          <>
            <Link to={ADMIN_COURSES} style={breadcrumbLinkStyle}>
              Courses
            </Link>
            {' / '}
            {!invalidIds ? (
              <Link to={courseSectionsPath(courseId)} style={breadcrumbLinkStyle}>
                {courseTitle}
              </Link>
            ) : (
              <span style={breadcrumbLinkStyle}>{courseTitle}</span>
            )}
            {' / '}
            {!invalidIds ? (
              <Link to={sessionsPath} style={breadcrumbLinkStyle}>
                {sectionTitle}
              </Link>
            ) : (
              <span style={breadcrumbLinkStyle}>{sectionTitle}</span>
            )}
            {' / '}
            <span style={breadcrumbLinkStyle}>{sessionLabel}</span>
            {' / '}
            <span style={breadcrumbCurrentStyle}>Attendance</span>
          </>
        }
        backLabel="← Back to sessions"
        onBack={backToSessions}
        description={
          <p style={pageHeaderDescriptionStyle}>
            Session ID <strong style={pageHeaderDescriptionStrongStyle}>{sessionId}</strong>
          </p>
        }
      />

      <div style={workspaceDetailStackStyle}>
        {metaLoading && <StatusMessage variant="info" message="Loading context…" marginBottom={0} />}
        {metaError && <StatusMessage variant="error" message={metaError} marginBottom={0} />}

        {!metaLoading && !metaError && (
          <>
            <PageFeedback success={success} error={error} loading={loading} loadingMessage="Loading…" />

            <MarkAttendanceForm sessionId={sessionId} onMark={handleMarkAttendance} disabled={loading} />

            <WorkspaceSectionHeading>Attendance records</WorkspaceSectionHeading>
            {records.length === 0 ? (
              <EmptyState message="No records for this session." />
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, maxWidth: 700, margin: 0 }}>
                {records.map((r) => (
                  <li key={`attendance-${r.sessionId}-${r.studentId}`} style={uiStackedListRowStyle}>
                    {r.studentName != null && r.studentName !== ''
                      ? `${r.studentName} (ID ${r.studentId})`
                      : `Student ID: ${r.studentId}`}
                    {r.sessionLabel != null && r.sessionLabel !== '' && ` — ${r.sessionLabel}`}
                    {' — '}
                    Status: {r.status}
                    {r.source != null && r.source !== '' && ` (${r.source})`}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )

  return (
    <DrillDownPageShell panelOpen={false}>
      <SplitPageLayout main={main} />
    </DrillDownPageShell>
  )
}

type MarkAttendanceFormProps = {
  sessionId: number
  onMark: (p: MarkAttendancePayload) => void
  disabled: boolean
}

function MarkAttendanceForm({ sessionId, onMark, disabled }: MarkAttendanceFormProps) {
  const [studentId, setStudentId] = useState('')
  const [status, setStatus] = useState<string>(STATUS_OPTIONS[0])
  const [source, setSource] = useState<string>(SOURCE_OPTIONS[0])

  const submit = () => {
    const sid = Number(studentId)
    if (!sid) return
    onMark({ sessionId, studentId: sid, status, source })
    setStudentId('')
  }

  return (
    <section style={{ ...uiFormSectionSurfaceStyle, marginBottom: 0 }}>
      <h3 style={{ ...uiHeadingStyle, fontSize: uiFontSize.titleSm, marginTop: 0 }}>Mark attendance</h3>
      <div style={uiInlineFormRowStyle}>
        <FormField label="Student ID">
          <input
            type="number"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Student ID"
            className="ems-input"
          />
        </FormField>
        <FormField label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="ems-select">
            {STATUS_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Source">
          <select value={source} onChange={(e) => setSource(e.target.value)} className="ems-select">
            {SOURCE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </FormField>
        <FormActionButton type="button" variant="secondary" disabled={disabled} onClick={submit}>
          Mark
        </FormActionButton>
      </div>
    </section>
  )
}
