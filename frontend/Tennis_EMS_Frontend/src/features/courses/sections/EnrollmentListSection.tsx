import Button from '../../../components/ui/Button'
import SelectableListShell from '../../../components/ui/SelectableListShell'
import type { Student } from '../../../api/enrollmentApi'

type Props = {
  students: Student[]
  loading: boolean
  onDrop: (studentId: number) => void
}

export default function EnrollmentListSection({ students, loading, onDrop }: Props) {
  return (
    <>
      <h2 style={{ fontSize: 16, color: '#0f172a', marginBottom: 10 }}>Students in section</h2>
      {students.length === 0 ? (
        <p style={{ color: '#64748b' }}>No students in this section.</p>
      ) : (
        <SelectableListShell>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {students.map((s, i) => (
              <li
                key={s.id ? `student-${s.id}` : `student-idx-${i}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderBottom: '1px solid #f1f5f9',
                  fontSize: 14,
                }}
              >
                <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <strong style={{ color: '#0f172a' }}>
                    {s.name != null && s.name !== '' ? s.name : `Student #${s.id}`}
                  </strong>
                  <span style={{ color: '#64748b', marginLeft: 8 }}>(Student ID: {s.id})</span>
                  {s.email != null && s.email !== '' && (
                    <span style={{ color: '#94a3b8', marginLeft: 6 }}>{s.email}</span>
                  )}
                </span>
                <Button
                  type="button"
                  onClick={() => onDrop(s.id)}
                  disabled={loading}
                  variant="danger"
                  style={{ flexShrink: 0 }}
                >
                  Drop
                </Button>
              </li>
            ))}
          </ul>
        </SelectableListShell>
      )}
    </>
  )
}
