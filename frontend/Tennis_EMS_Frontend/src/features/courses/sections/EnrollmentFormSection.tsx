import type { FormEvent } from 'react'
import Button from '../../../components/ui/Button'
import SearchableSelect, {
  type EntitySelectOption,
} from '../../../components/ui/form/SearchableSelect'
import '../../../components/ui/formControls.css'

type Props = {
  loading: boolean
  studentUsersLoading: boolean
  enrollStudentOptions: EntitySelectOption[]
  studentIdToEnroll: string
  onStudentChange: (v: string) => void
  onSubmit: (e: FormEvent) => void
}

export default function EnrollmentFormSection({
  loading,
  studentUsersLoading,
  enrollStudentOptions,
  studentIdToEnroll,
  onStudentChange,
  onSubmit,
}: Props) {
  const submitDisabled = loading || studentUsersLoading || enrollStudentOptions.length === 0

  return (
    <div className="form-card" style={{ marginBottom: 20 }}>
      <form className="form-root" onSubmit={onSubmit}>
        <SearchableSelect
          id="enroll-student"
          label="Enroll student *"
          required
          emptyOptionLabel={studentUsersLoading ? 'Loading students…' : 'Select a student'}
          options={enrollStudentOptions}
          value={studentIdToEnroll}
          onChange={onStudentChange}
          disabled={submitDisabled}
          searchPlaceholder="Search students by name…"
        />
        <div className="form-actions">
          <Button type="submit" disabled={submitDisabled}>
            Enroll
          </Button>
        </div>
        {!studentUsersLoading && enrollStudentOptions.length === 0 && (
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
            No students available to add (all roster students may already be enrolled, or there are no
            student accounts).
          </p>
        )}
      </form>
    </div>
  )
}
