import type { FormEvent } from 'react'
import type { CourtSummary } from '../../../api/courtApi'
import PanelShell from '../../../components/ui/PanelShell'
import FormActionButton from '../../../components/ui/form/FormActionButton'
import '../../../components/ui/formControls.css'

import type { SectionSessionsPageCreateForm } from '../hooks/useSectionSessionsPageController'
import SessionFormFields from './SessionFormFields'
import { SESSION_STATUS } from '../utils/sessionFormMapper'

type Props = {
  sectionId: number
  form: SectionSessionsPageCreateForm
  courts: CourtSummary[]
  courtsLoading: boolean
  busy: boolean
  panelDetailLoading: boolean
  onClose: () => void
  onSubmit: (e: FormEvent) => void
}

export default function SessionCreatePanel({
  sectionId,
  form,
  courts,
  courtsLoading,
  busy,
  panelDetailLoading,
  onClose,
  onSubmit,
}: Props) {
  const disabled = busy || panelDetailLoading

  return (
    <PanelShell title="Create Session" onClose={onClose} closeDisabled={busy}>
      <form onSubmit={onSubmit} className="form-root">
        <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
          Section ID: <strong>{sectionId}</strong>
        </p>

        <SessionFormFields
          disabled={disabled}
          courtsLoading={courtsLoading}
          courtOptions={courts}
          courtId={form.courtId}
          onCourtIdChange={form.setCourtId}
          statusLabel="Status (optional)"
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
          Create session
        </FormActionButton>
      </form>
    </PanelShell>
  )
}

