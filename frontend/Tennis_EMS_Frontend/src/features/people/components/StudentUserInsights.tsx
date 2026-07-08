import { useEffect, useState } from 'react'
import {
  getStudentSections,
  getStudentAttendance,
  type StudentSection,
  type StudentAttendance,
} from '../../../api/userApi'
import {
  uiInsetListItemStyle,
  uiInsetPanelStyle,
  uiInsetSectionHeadingStyle,
} from '../../../components/ui/uiPrimitives'
import { uiText } from '../../../components/ui/uiTokens'

type Props = {
  userId: number
}

export default function StudentUserInsights({ userId }: Props) {
  const [sections, setSections] = useState<StudentSection[]>([])
  const [attendance, setAttendance] = useState<StudentAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [s, a] = await Promise.all([getStudentSections(userId), getStudentAttendance(userId)])
        if (!cancelled) {
          setSections(s)
          setAttendance(a)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load student data')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [userId])

  if (loading) {
    return (
      <div style={uiInsetPanelStyle}>
        <p style={{ margin: 0, fontSize: 14, color: uiText.muted }}>Loading student insights…</p>
      </div>
    )
  }
  if (error) {
    return (
      <div style={uiInsetPanelStyle}>
        <p style={{ margin: 0, fontSize: 14, color: uiText.error }} role="alert">
          {error}
        </p>
      </div>
    )
  }

  return (
    <>
      <div style={uiInsetPanelStyle}>
        <h4 style={uiInsetSectionHeadingStyle}>Enrolled sections</h4>
        {sections.length === 0 ? (
          <p style={{ margin: 0, fontSize: 14, color: uiText.muted }}>No sections enrolled.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {sections.map((s, i) => (
              <li key={`${s.sectionId}-${i}`} style={uiInsetListItemStyle}>
                {s.sectionName ?? `Section ${s.sectionId}`} {s.status != null && `(${s.status})`}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={uiInsetPanelStyle}>
        <h4 style={uiInsetSectionHeadingStyle}>Attendance history</h4>
        {attendance.length === 0 ? (
          <p style={{ margin: 0, fontSize: 14, color: uiText.muted }}>No attendance records.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {attendance.slice(0, 10).map((a, i) => (
              <li key={`${a.sessionId}-${i}`} style={uiInsetListItemStyle}>
                {a.sessionLabel ?? `Session ${a.sessionId}`} — {a.status ?? '—'}
              </li>
            ))}
            {attendance.length > 10 && (
              <li style={{ ...uiInsetListItemStyle, color: uiText.muted, borderBottom: 'none' }}>
                … and {attendance.length - 10} more
              </li>
            )}
          </ul>
        )}
      </div>
    </>
  )
}
