import { useState } from 'react'
import type { Section } from '../../../api/sectionApi'
import SelectableListShell from '../../../components/ui/SelectableListShell'
import { formatDisplayDate } from '../../../utils/displayDate'

type Props = {
  sections: Section[]
  selectedSectionId: number | null
  loading: boolean
  invalidCourse: boolean
  busy: boolean
  onSelectSection: (section: Section) => void
  onViewSessions: (sectionId: number) => void
  onViewEnrollment: (sectionId: number) => void
  onArchive: (sectionId: number) => void
}

export default function CourseSectionCatalogSection({
  sections,
  selectedSectionId,
  loading,
  invalidCourse,
  busy,
  onSelectSection,
  onViewSessions,
  onViewEnrollment,
  onArchive,
}: Props) {
  const [hoveredSectionId, setHoveredSectionId] = useState<number | null>(null)

  return (
    <section>
      <SelectableListShell>
        {!loading && !invalidCourse && sections.length === 0 && (
          <p style={{ margin: '12px 12px 16px', color: '#64748b', fontSize: 14 }}>
            No sections for this course yet.
          </p>
        )}

        {sections.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {sections.map((s) => {
              const selected = s.sectionId === selectedSectionId
              const hovered = hoveredSectionId === s.sectionId
              const rowBg = selected ? '#e8edf5' : hovered ? '#f1f5f9' : '#ffffff'
              const rowBorder = selected ? '#94a3b8' : 'transparent'
              return (
                <li
                  key={s.sectionId}
                  onClick={() => {
                    onSelectSection(s)
                  }}
                  onMouseEnter={() => setHoveredSectionId(s.sectionId)}
                  onMouseLeave={() => setHoveredSectionId(null)}
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
                    <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 800,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {s.name}
                      </div>
                      <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                        Coach ID: {s.coachId ?? '—'}
                        {s.startDate != null && s.startDate !== '' && ` · ${formatDisplayDate(s.startDate)}`}
                        {s.endDate != null && s.endDate !== '' && ` – ${formatDisplayDate(s.endDate)}`}
                        {s.maxStudents != null && ` · max ${s.maxStudents}`}
                        {s.status != null && s.status !== '' && (
                          <span style={{ marginLeft: 8, color: '#94a3b8' }}>{s.status}</span>
                        )}
                        {s.isActive != null && (
                          <span style={{ marginLeft: 8, color: '#94a3b8' }}>
                            {s.isActive ? 'Active' : 'Inactive'}
                          </span>
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
                          onViewSessions(s.sectionId)
                        }}
                        disabled={busy || loading}
                        style={{ padding: '4px 10px' }}
                      >
                        View Sessions
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onViewEnrollment(s.sectionId)
                        }}
                        disabled={busy || loading}
                        style={{ padding: '4px 10px' }}
                      >
                        Enrollment
                      </button>
                      {s.isActive !== false && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            void onArchive(s.sectionId)
                          }}
                          disabled={busy || loading}
                          style={{ padding: '4px 10px' }}
                        >
                          Archive
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
