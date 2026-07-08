import type { TrainingGroupMember } from '../../../api/trainingGroupApi'
import type { User } from '../../../api/userApi'
import { formatDisplayDate } from '../../../utils/displayDate'
import DateInput from '../../../components/ui/form/DateInput'
import FormActionButton from '../../../components/ui/form/FormActionButton'
import '../../../components/ui/formControls.css'

type Props = {
  members: TrainingGroupMember[]
  studentMap: Map<number, User>
  busy: boolean
  editingStudentId: number | null
  editStartDate: string
  setEditStartDate: (value: string) => void
  editEndDate: string
  setEditEndDate: (value: string) => void
  onEdit: (member: TrainingGroupMember) => void
  onCancelEdit: () => void
  onSaveEdit: (studentId: number) => void
  onRemove: (studentId: number) => void
}

function studentName(studentId: number, studentMap: Map<number, User>): string {
  const user = studentMap.get(studentId)
  if (!user) return `Student #${studentId}`
  return user.displayName?.trim() || user.email || `Student #${studentId}`
}

export default function GroupMemberList({
  members,
  studentMap,
  busy,
  editingStudentId,
  editStartDate,
  setEditStartDate,
  editEndDate,
  setEditEndDate,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onRemove,
}: Props) {
  if (members.length === 0) {
    return <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>No members found.</p>
  }

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {members.map((member) => {
        const isEditing = editingStudentId === member.studentId
        const isActive = !member.endDate
        return (
          <li
            key={member.studentId}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              background: '#ffffff',
              padding: 12,
              marginBottom: 10,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{studentName(member.studentId, studentMap)}</div>
                <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>
                  Student ID: {member.studentId} · {isActive ? 'Active' : 'Inactive'} · Start:{' '}
                  {formatDisplayDate(member.startDate)} · End: {member.endDate ? formatDisplayDate(member.endDate) : 'Active'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <FormActionButton type="button" onClick={() => onEdit(member)} disabled={busy}>
                  Edit
                </FormActionButton>
                <FormActionButton
                  type="button"
                  onClick={() => onRemove(member.studentId)}
                  disabled={busy}
                  variant="danger"
                >
                  Remove
                </FormActionButton>
              </div>
            </div>
            {isEditing && (
              <div
                style={{
                  marginTop: 10,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 10,
                  alignItems: 'end',
                }}
              >
                <label className="form-field">
                  <span className="form-label">Start date</span>
                  <DateInput
                    value={editStartDate}
                    onCommit={setEditStartDate}
                    disabled={busy}
                    className="form-input"
                    aria-label="Edit membership start date"
                  />
                </label>
                <label className="form-field">
                  <span className="form-label">End date</span>
                  <DateInput
                    value={editEndDate}
                    onCommit={setEditEndDate}
                    disabled={busy}
                    className="form-input"
                    aria-label="Edit membership end date"
                  />
                </label>
                <div className="form-actions" style={{ marginTop: 8 }}>
                  <FormActionButton type="button" onClick={() => onSaveEdit(member.studentId)} disabled={busy}>
                    Save
                  </FormActionButton>
                  <FormActionButton type="button" onClick={onCancelEdit} disabled={busy}>
                    Cancel
                  </FormActionButton>
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
