import type { CourtSummary } from '../../../api/courtApi'
import DateInput from '../../../components/ui/form/DateInput'
import Time24Input from '../../../components/ui/form/Time24Input'
import { formatCourtOptionLabel } from '../utils/sessionFormMapper'

type Props = {
  disabled: boolean
  courtsLoading: boolean
  courtOptions: CourtSummary[]
  courtId: string
  onCourtIdChange: (v: string) => void
  statusLabel: string
  statusOptions: readonly string[]
  status: string
  onStatusChange: (v: string) => void
  startDate: string
  onStartDateCommit: (v: string) => void
  startTime: string
  onStartTimeCommit: (v: string) => void
  endDate: string
  onEndDateCommit: (v: string) => void
  endTime: string
  onEndTimeCommit: (v: string) => void
}

export default function SessionFormFields({
  disabled,
  courtsLoading,
  courtOptions,
  courtId,
  onCourtIdChange,
  statusLabel,
  statusOptions,
  status,
  onStatusChange,
  startDate,
  onStartDateCommit,
  startTime,
  onStartTimeCommit,
  endDate,
  onEndDateCommit,
  endTime,
  onEndTimeCommit,
}: Props) {
  const courtDisabled = disabled || courtsLoading
  const selectNoCourtLabel = courtsLoading ? 'Loading courts…' : 'No court'

  return (
    <>
      <label className="form-field">
        <span className="form-label">
          Start date <span style={{ color: 'coral' }}>*</span>
        </span>
        <DateInput
          value={startDate}
          onCommit={onStartDateCommit}
          required
          disabled={disabled}
          className="form-input"
          aria-label="Session start date"
        />
      </label>

      <label className="form-field">
        <span className="form-label">
          Start time (24h) <span style={{ color: 'coral' }}>*</span>
        </span>
        <Time24Input
          value={startTime}
          onCommit={onStartTimeCommit}
          required
          disabled={disabled}
          className="form-input"
          aria-label="Session start time"
        />
      </label>

      <label className="form-field">
        <span className="form-label">
          End date <span style={{ color: 'coral' }}>*</span>
        </span>
        <DateInput
          value={endDate}
          onCommit={onEndDateCommit}
          required
          disabled={disabled}
          className="form-input"
          aria-label="Session end date"
        />
      </label>

      <label className="form-field">
        <span className="form-label">
          End time (24h) <span style={{ color: 'coral' }}>*</span>
        </span>
        <Time24Input
          value={endTime}
          onCommit={onEndTimeCommit}
          required
          disabled={disabled}
          className="form-input"
          aria-label="Session end time"
        />
      </label>

      <label className="form-field">
        <span className="form-label">Court (optional)</span>
        <select
          value={courtId}
          onChange={(e) => onCourtIdChange(e.target.value)}
          disabled={courtDisabled}
          className="form-select"
        >
          <option value="">{selectNoCourtLabel}</option>
          {courtOptions.map((c) => (
            <option key={c.courtId} value={String(c.courtId)}>
              {formatCourtOptionLabel(c)}
            </option>
          ))}
        </select>
      </label>

      <label className="form-field">
        <span className="form-label">{statusLabel}</span>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          disabled={disabled}
          className="form-select"
        >
          {statusOptions.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </label>
    </>
  )
}

