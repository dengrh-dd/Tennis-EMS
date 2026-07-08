import { useEffect, useMemo, useState } from 'react'
import { me } from '../../../auth/authApi'
import type { CurrentUser } from '../../../auth/types'
import {
  getStudentAttendance,
  getStudentSections,
  type StudentAttendance,
  type StudentSection,
} from '../../../api/userApi'
import { getMembershipsByStudent, type TrainingGroupMember } from '../../../api/trainingGroupApi'
import { getSessionsBySection, type Session } from '../../../api/sessionApi'
import { formatDisplayDate, formatDisplayDateTime } from '../../../utils/displayDate'
import {
  emsDashboardBodyMutedStyle,
  emsDashboardCardGridStyle,
  emsDashboardErrorTextStyle,
  emsDashboardListMetaStyle,
  emsDashboardListStyle,
  emsDashboardManagementHeadingStyle,
  emsDashboardPrimaryLineStyle,
  emsDashboardSecondaryLineStyle,
  emsDashboardSectionLabelStyle,
  emsDashboardSessionCardStyle,
  emsDashboardTwoColumnGridStyle,
} from '../styles/dashboardPrimitives'
import StudentDashboardSection from '../components/StudentDashboardSection'

export default function StudentDashboardInsights() {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [sections, setSections] = useState<StudentSection[]>([])
  const [sectionsError, setSectionsError] = useState<string | null>(null)

  const [attendance, setAttendance] = useState<StudentAttendance[]>([])
  const [attendanceError, setAttendanceError] = useState<string | null>(null)

  const [memberships, setMemberships] = useState<TrainingGroupMember[]>([])
  const [membershipsError, setMembershipsError] = useState<string | null>(null)

  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [sessionsError, setSessionsError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setSessionError(null)
        const current = await me()
        if (cancelled) return
        setUser(current)

        setSectionsError(null)
        setAttendanceError(null)
        setMembershipsError(null)
        setSessionsError(null)

        const uid = current.userId
        const sid = current.profileId

        let sec: StudentSection[] = []
        try {
          sec = await getStudentSections(uid)
          if (!cancelled) setSections(sec)
        } catch (e) {
          if (!cancelled) {
            setSections([])
            setSectionsError(e instanceof Error ? e.message : 'Could not load your courses.')
          }
        }

        try {
          const att = await getStudentAttendance(uid)
          if (!cancelled) setAttendance(att)
        } catch (e) {
          if (!cancelled) {
            setAttendance([])
            setAttendanceError(e instanceof Error ? e.message : 'Could not load attendance.')
          }
        }

        if (sid != null) {
          try {
            const mem = await getMembershipsByStudent(sid)
            if (!cancelled) setMemberships(mem)
          } catch (e) {
            if (!cancelled) {
              setMemberships([])
              setMembershipsError(e instanceof Error ? e.message : 'Could not load training groups.')
            }
          }
        } else if (!cancelled) {
          setMemberships([])
        }

        const sectionIds = [...new Set(sec.map((s) => s.sectionId).filter((id) => id != null && id > 0))]
        if (sectionIds.length === 0) {
          if (!cancelled) setUpcomingSessions([])
          return
        }
        try {
          const lists = await Promise.all(
            sectionIds.map((sectionId) => getSessionsBySection(sectionId).catch(() => [] as Session[])),
          )
          const merged = lists.flat()
          const now = Date.now()
          const upcoming = merged
            .filter((s) => {
              if (!s.startTime) return false
              const t = new Date(s.startTime).getTime()
              return Number.isFinite(t) && t > now
            })
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .slice(0, 8)
          if (!cancelled) setUpcomingSessions(upcoming)
        } catch (e) {
          if (!cancelled) {
            setUpcomingSessions([])
            setSessionsError(e instanceof Error ? e.message : 'Could not load upcoming sessions.')
          }
        }
      } catch {
        if (!cancelled) setSessionError('Could not load your session.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const attendancePreview = useMemo(() => {
    return [...attendance].slice(-10).reverse()
  }, [attendance])

  const activeMemberships = useMemo(() => memberships.filter((m) => m.active !== false), [memberships])

  if (sessionError) {
    return (
      <p style={emsDashboardErrorTextStyle} role="alert">
        {sessionError}
      </p>
    )
  }

  if (loading && !user) {
    return (
      <p style={emsDashboardBodyMutedStyle}>Loading your dashboard details...</p>
    )
  }

  if (!user) return null

  return (
    <>
      <div style={emsDashboardTwoColumnGridStyle}>
        <div>
          <h2 style={emsDashboardSectionLabelStyle}>Account</h2>
          <div style={emsDashboardSessionCardStyle}>
            <div style={emsDashboardPrimaryLineStyle}>{user.displayName?.trim() || user.email}</div>
            <div style={emsDashboardSecondaryLineStyle}>
              {user.email}
              {' · '}
              {user.role}
              {user.profileId != null ? ` · Student ID ${user.profileId}` : ''}
            </div>
          </div>
        </div>
        <div>
          <h2 style={emsDashboardSectionLabelStyle}>Portal</h2>
          <p style={emsDashboardBodyMutedStyle}>
            Use the sidebar to switch between Dashboard and Courses. The sections below summarize your recent activity.
          </p>
        </div>
      </div>

      <h2 style={emsDashboardManagementHeadingStyle}>Your activity</h2>
      <div style={emsDashboardCardGridStyle}>
        <StudentDashboardSection title="Upcoming sessions" subtitle="The next scheduled times for your enrolled sections.">
          {sessionsError ? <p style={emsDashboardErrorTextStyle}>{sessionsError}</p> : null}
          {!sessionsError && upcomingSessions.length === 0 ? (
            <p style={emsDashboardBodyMutedStyle}>No upcoming sessions found.</p>
          ) : (
            <ul style={emsDashboardListStyle}>
              {upcomingSessions.map((s) => (
                <li key={s.sessionId}>
                  {s.courseName ?? 'Course'}
                  {s.sectionName ? ` · ${s.sectionName}` : ''}
                  <div style={{ ...emsDashboardBodyMutedStyle, fontSize: 13 }}>{formatDisplayDateTime(s.startTime)}</div>
                </li>
              ))}
            </ul>
          )}
        </StudentDashboardSection>

        <StudentDashboardSection title="Current enrollments" subtitle="Sections you are enrolled in right now.">
          {sectionsError ? <p style={emsDashboardErrorTextStyle}>{sectionsError}</p> : null}
          {!sectionsError && sections.length === 0 ? (
            <p style={emsDashboardBodyMutedStyle}>You are not enrolled in any sections yet.</p>
          ) : (
            <ul style={emsDashboardListStyle}>
              {sections.map((row) => (
                <li key={`${row.studentId}-${row.sectionId}`}>
                  {row.sectionName ?? `Section #${row.sectionId}`}
                  {row.status ? <span style={emsDashboardListMetaStyle}>{` · ${row.status}`}</span> : null}
                </li>
              ))}
            </ul>
          )}
        </StudentDashboardSection>

        <StudentDashboardSection title="Attendance overview" subtitle="Recent check-ins from your sessions.">
          {attendanceError ? <p style={emsDashboardErrorTextStyle}>{attendanceError}</p> : null}
          {!attendanceError && attendancePreview.length === 0 ? (
            <p style={emsDashboardBodyMutedStyle}>No attendance records yet.</p>
          ) : (
            <ul style={emsDashboardListStyle}>
              {attendancePreview.map((row, idx) => (
                <li key={`${row.sessionId}-${idx}`}>
                  {row.sessionLabel ?? `Session #${row.sessionId}`}
                  {row.status ? <span style={emsDashboardListMetaStyle}>{` · ${row.status}`}</span> : null}
                </li>
              ))}
            </ul>
          )}
        </StudentDashboardSection>

        <StudentDashboardSection title="Training groups" subtitle="Groups your coach has added you to.">
          {membershipsError ? <p style={emsDashboardErrorTextStyle}>{membershipsError}</p> : null}
          {!membershipsError && user.profileId == null ? (
            <p style={emsDashboardBodyMutedStyle}>Group memberships will show after your student profile is linked.</p>
          ) : null}
          {!membershipsError && user.profileId != null && activeMemberships.length === 0 ? (
            <p style={emsDashboardBodyMutedStyle}>You are not listed in any training groups yet.</p>
          ) : null}
          {!membershipsError && activeMemberships.length > 0 ? (
            <ul style={emsDashboardListStyle}>
              {activeMemberships.map((m) => (
                <li key={`${m.groupId}-${m.studentId}`}>
                  Group #{m.groupId}
                  <div style={{ ...emsDashboardBodyMutedStyle, fontSize: 13 }}>
                    {m.startDate ? `From ${formatDisplayDate(m.startDate)}` : ''}
                    {m.endDate ? ` · Through ${formatDisplayDate(m.endDate)}` : ''}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </StudentDashboardSection>
      </div>
    </>
  )
}

