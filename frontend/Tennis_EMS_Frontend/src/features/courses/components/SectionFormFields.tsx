import DateInput from '../../../components/ui/form/DateInput'

type Props = {
  disabled: boolean
  syllabusLabel: string
  syllabus: string
  onSyllabusChange: (v: string) => void
  startDate: string
  onStartDateCommit: (v: string) => void
  endDate: string
  onEndDateCommit: (v: string) => void
  maxStudents: string
  onMaxStudentsChange: (v: string) => void
  maxStudentsLabel: string
}

export default function SectionFormFields({
  disabled,
  syllabusLabel,
  syllabus,
  onSyllabusChange,
  startDate,
  onStartDateCommit,
  endDate,
  onEndDateCommit,
  maxStudents,
  onMaxStudentsChange,
  maxStudentsLabel,
}: Props) {
  return (
    <>
      <label className="form-field">
        <span className="form-label">{syllabusLabel}</span>
        <textarea
          value={syllabus}
          onChange={(e) => onSyllabusChange(e.target.value)}
          rows={2}
          disabled={disabled}
          className="form-textarea"
        />
      </label>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <label style={{ flex: '1 1 160px' }} className="form-field">
          <span className="form-label">Start date</span>
          <DateInput
            value={startDate}
            onCommit={onStartDateCommit}
            disabled={disabled}
            className="form-input"
            aria-label="Section start date"
          />
        </label>
        <label style={{ flex: '1 1 160px' }} className="form-field">
          <span className="form-label">End date</span>
          <DateInput
            value={endDate}
            onCommit={onEndDateCommit}
            disabled={disabled}
            className="form-input"
            aria-label="Section end date"
          />
        </label>
      </div>
      <label className="form-field">
        <span className="form-label">{maxStudentsLabel}</span>
        <input
          type="number"
          inputMode="numeric"
          value={maxStudents}
          onChange={(e) => onMaxStudentsChange(e.target.value)}
          disabled={disabled}
          className="form-input"
        />
      </label>
    </>
  )
}
