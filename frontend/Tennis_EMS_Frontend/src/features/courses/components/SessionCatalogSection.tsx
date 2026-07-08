import { useState } from 'react'
import type { Session } from '../../../api/sessionApi'
import SelectableListShell from '../../../components/ui/SelectableListShell'
import { formatDisplayDateTime } from '../../../utils/displayDate'

type Props = {
  sessions: Session[]
  selectedSessionId: number | null
  loading: boolean
  invalidIds: boolean
  busy: boolean
  onSelectSession: (session: Session) => void
  onAttendance: (session: Session) => void
  onCancelSession: (session: Session) => void
}

export default function SessionCatalogSection({
  sessions,
  selectedSessionId,
  loading,
  invalidIds,
  busy,
  onSelectSession,
  onAttendance,
  onCancelSession,
}: Props) {
  const [hoveredSessionId, setHoveredSessionId] = useState<number | null>(null)

  return (
    <section>
      <SelectableListShell>
        {!loading && !invalidIds && sessions.length === 0 && (
          <p style={{ margin: '12px 12px 16px', color: '#64748b', fontSize: 14 }}>
            No sessions scheduled for this section yet.
          </p>
        )}

        {sessions.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {sessions.map((s) => {
              const selected = s.sessionId === selectedSessionId
              const hovered = hoveredSessionId === s.sessionId
              const rowBg = selected ? '#e8edf5' : hovered ? '#f1f5f9' : '#ffffff'
              const rowBorder = selected ? '#94a3b8' : 'transparent'

              return (
                <li
                  key={s.sessionId}
                  onClick={() => onSelectSession(s)}
                  onMouseEnter={() => setHoveredSessionId(s.sessionId)}
                  onMouseLeave={() => setHoveredSessionId(null)}
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    userSelect: 'none',
                    background: rowBg,
                    borderLeft: `3px solid ${rowBorder}`,
                    borderRadius: 6,
                    margin: '2px 4px',
                    transition: 'background-color 0.12s ease',
                  }}
                  aria-selected={selected}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>Session #{s.sessionId}</div>
                      <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                        {formatDisplayDateTime(s.startTime)} — {formatDisplayDateTime(s.endTime)}
                        {s.courtId != null && (
                          <span style={{ marginLeft: 8 }}>Court #{s.courtId}</span>
                        )}
                        {s.status != null && s.status !== '' && (
                          <span style={{ marginLeft: 8, color: '#94a3b8' }}>{s.status}</span>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        marginLeft: 'auto',
                        display: 'flex',
                        gap: 8,
                        flexWrap: 'wrap',
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onAttendance(s)
                        }}
                        disabled={busy || loading}
                        style={{ padding: '4px 10px' }}
                      >
                        Attendance
                      </button>

                      {s.status !== 'CANCELLED' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onCancelSession(s)
                          }}
                          disabled={busy || loading}
                          style={{ padding: '4px 10px' }}
                        >
                          Cancel session
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </SelectableListShell>
    </section>
  )
}

