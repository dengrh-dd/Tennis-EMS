import { useCallback, useEffect, useState } from 'react'
import { me } from '../../../auth/authApi'
import type { CurrentUser } from '../../../auth/types'
import { getStudentSections, type StudentSection } from '../../../api/userApi'
import PageShell from '../../../components/layout/PageShell'
import PanelCard from '../../../components/ui/PanelCard'
import SectionCard from '../../../components/ui/SectionCard'
import StatusMessage from '../../../components/ui/StatusMessage'
import EmptyState from '../../../components/ui/EmptyState'
import { usePermission } from '../../../permissions/usePermission'

export default function StudentCoursesPage() {
  const { can } = usePermission()
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [sections, setSections] = useState<StudentSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const u = await me()
      setUser(u)
      const list = await getStudentSections(u.userId)
      setSections(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load your courses.')
      setSections([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (!can('courses.view')) {
    return (
      <PageShell title="Courses" subtitle="Your enrollments and sections.">
        <StatusMessage variant="info" message="You do not have access to course information." />
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Courses"
      subtitle="Sections you are enrolled in, aligned with the club catalog."
    >
      {error && <StatusMessage variant="error" message={error} role="alert" />}
      {loading && <StatusMessage variant="info" message="Loading your courses…" role="status" />}

      <SectionCard label="Overview" marginBottom={14}>
        <p style={{ margin: 0, fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>
          This list is read-only. Use <strong style={{ color: '#334155' }}>Sessions</strong> and{' '}
          <strong style={{ color: '#334155' }}>Attendance</strong> in the sidebar for schedules and check-ins.
        </p>
      </SectionCard>

      <PanelCard
        title="Your enrollments"
        subtitle={user ? `Account: ${user.email}` : undefined}
        marginBottom={0}
      >
        {!loading && sections.length === 0 && !error && (
          <EmptyState message="You are not enrolled in any sections yet." />
        )}
        {sections.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {sections.map((row) => (
              <li
                key={`${row.studentId}-${row.sectionId}`}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #f1f5f9',
                  borderLeft: '3px solid transparent',
                  borderRadius: 6,
                  margin: '2px 4px',
                  background: '#ffffff',
                  transition: 'background-color 0.12s ease',
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: '#0f172a',
                  }}
                >
                  {row.sectionName ?? `Section #${row.sectionId}`}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                  {row.status != null && row.status !== '' ? row.status : 'Enrolled'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </PanelCard>
    </PageShell>
  )
}
