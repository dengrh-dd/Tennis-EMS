import { useEffect, useState } from 'react'
import {
  getCoachSections,
  getCoachSessions,
  type CoachSection,
  type CoachSession,
} from '../../../api/userApi'
import {
  uiInsetListItemStyle,
  uiInsetPanelStyle,
  uiInsetSectionHeadingStyle,
} from '../../../components/ui/uiPrimitives'
import { uiText } from '../../../components/ui/uiTokens'
import { formatDisplayDateTime } from '../../../utils/displayDate'

type Props = {
  userId: number
}

export default function CoachUserInsights({ userId }: Props) {
  const [sections, setSections] = useState<CoachSection[]>([])
  const [sessions, setSessions] = useState<CoachSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [s, sess] = await Promise.all([getCoachSections(userId), getCoachSessions(userId)])
        if (!cancelled) {
          setSections(s)
          setSessions(sess)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load coach data')
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
        <p style={{ margin: 0, fontSize: 14, color: uiText.muted }}>Loading coach insights…</p>
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
        <h4 style={uiInsetSectionHeadingStyle}>Coaching sections</h4>
        {sections.length === 0 ? (
          <p style={{ margin: 0, fontSize: 14, color: uiText.muted }}>No sections assigned.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {sections.map((s, i) => (
              <li key={`${s.sectionId}-${i}`} style={uiInsetListItemStyle}>
                {s.name ?? `Section ${s.sectionId}`}
                {s.courseName != null && ` · ${s.courseName}`}
                {s.status != null && ` (${s.status})`}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={uiInsetPanelStyle}>
        <h4 style={uiInsetSectionHeadingStyle}>Coaching sessions</h4>
        {sessions.length === 0 ? (
          <p style={{ margin: 0, fontSize: 14, color: uiText.muted }}>No sessions.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {sessions.slice(0, 10).map((s, i) => (
              <li key={`${s.sessionId}-${i}`} style={uiInsetListItemStyle}>
                {s.sectionName ?? `Section ${s.sectionId}`}
                {s.courseName != null && ` · ${s.courseName}`}
                {s.startTime != null && ` — ${formatDisplayDateTime(s.startTime)}`}
              </li>
            ))}
            {sessions.length > 10 && (
              <li style={{ ...uiInsetListItemStyle, color: uiText.muted, borderBottom: 'none' }}>
                … and {sessions.length - 10} more
              </li>
            )}
          </ul>
        )}
      </div>
    </>
  )
}
