import type { FormEvent } from 'react'
import type { CourtSummary } from '../../../api/courtApi'
import PanelShell from '../../../components/ui/PanelShell'
import FormField from '../../../components/ui/FormField'
import ReadonlyInput from '../../../components/ui/form/ReadonlyInput'
import FormActionButton from '../../../components/ui/form/FormActionButton'
import '../../../components/ui/formControls.css'

import type { SectionSessionsPageEditForm } from '../hooks/useSectionSessionsPageController'
import SessionFormFields from './SessionFormFields'
import { SESSION_STATUS } from '../utils/sessionFormMapper'

type Props = {
  form: SectionSessionsPageEditForm
  courtOptions: CourtSummary[]
  courtsLoading: boolean
  busy: boolean
  panelDetailLoading: boolean
  onClose: () => void
  onSubmit: (e: FormEvent) => void
}

export default function SessionEditPanel({
  form,
  courtOptions,
  courtsLoading,
  busy,
  panelDetailLoading,
  onClose,
  onSubmit,
}: Props) {
  const disabled = busy || panelDetailLoading

  return (
    <PanelShell title="Edit Session" onClose={onClose} closeDisabled={busy || panelDetailLoading}>
      <form onSubmit={onSubmit} className="form-root">
        {panelDetailLoading && (
          <div style={{ color: '#64748b', fontSize: 14 }}>Loading session details…</div>
        )}

        <FormField label="Session ID">
          <ReadonlyInput value={form.sessionId} ariaLabel="Session ID" />
        </FormField>

        <SessionFormFields
          disabled={disabled}
          courtsLoading={courtsLoading}
          courtOptions={courtOptions}
          courtId={form.courtId}
          onCourtIdChange={form.setCourtId}
          statusLabel="Status"
          statusOptions={SESSION_STATUS}
          status={form.status}
          onStatusChange={form.setStatus}
          startDate={form.startDate}
          onStartDateCommit={form.setStartDate}
          startTime={form.startTime}
          onStartTimeCommit={form.setStartTime}
          endDate={form.endDate}
          onEndDateCommit={form.setEndDate}
          endTime={form.endTime}
          onEndTimeCommit={form.setEndTime}
        />

        <FormActionButton type="submit" disabled={disabled} style={{ alignSelf: 'flex-start' }}>
          Save changes
        </FormActionButton>
      </form>
    </PanelShell>
  )
}

