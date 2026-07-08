import type { FormEvent } from 'react'
import type { User } from '../../../api/userApi'
import DateInput from '../../../components/ui/form/DateInput'
import FormActionButton from '../../../components/ui/form/FormActionButton'
import SearchableSelect, {
  type EntitySelectOption,
} from '../../../components/ui/form/SearchableSelect'
import '../../../components/ui/formControls.css'

type Props = {
  busy: boolean
  students: User[]
  studentId: string
  setStudentId: (value: string) => void
  studentOptions: EntitySelectOption[]
  startDate: string
  setStartDate: (value: string) => void
  endDate: string
  setEndDate: (value: string) => void
  onSubmit: (e: FormEvent) => void
  onCancel: () => void
  inlineMessage?: string | null
  inlineError?: string | null
}

export default function AddGroupMemberForm({
  busy,
  students,
  studentId,
  setStudentId,
  studentOptions,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onSubmit,
  onCancel,
  inlineMessage,
  inlineError,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="form-card">
      <div style={{ display: 'grid', gap: 10, width: '100%', boxSizing: 'border-box' }}>
        <SearchableSelect
          id="add-group-member-student"
          label="Student"
          required
          emptyOptionLabel="Select student"
          options={studentOptions}
          value={studentId}
          onChange={setStudentId}
          disabled={busy || students.length === 0}
          searchPlaceholder="Search students by name…"
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 10,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <label className="form-field">
            <span className="form-label">Start date</span>
            <DateInput
              value={startDate}
              onCommit={setStartDate}
              disabled={busy}
              required
              className="form-input"
              aria-label="Membership start date"
            />
          </label>
          <label className="form-field">
            <span className="form-label">End date</span>
            <DateInput
              value={endDate}
              onCommit={setEndDate}
              disabled={busy}
              className="form-input"
              aria-label="Membership end date"
            />
          </label>
        </div>
      </div>
      <div className="form-actions" style={{ marginTop: 12 }}>
        <FormActionButton type="submit" disabled={busy}>
          Add member
        </FormActionButton>
        <FormActionButton type="button" onClick={onCancel} disabled={busy}>
          Cancel
        </FormActionButton>
        {inlineMessage && <span style={{ color: '#15803d', fontSize: 13, marginLeft: 4 }}>{inlineMessage}</span>}
        {inlineError && (
          <span style={{ color: '#c2410c', fontSize: 13, marginLeft: 4, display: 'block', marginTop: 8 }}>
            {inlineError}
          </span>
        )}
        {!busy && studentOptions.length === 0 && (
          <span style={{ color: '#64748b', fontSize: 13 }}>
            No students available to add.
          </span>
        )}
      </div>
    </form>
  )
}
