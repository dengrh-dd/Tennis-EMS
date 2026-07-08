import type { FormEvent } from 'react'
import ActionBar from '../../../components/ui/ActionBar'
import FormField from '../../../components/ui/FormField'
import FormRow from '../../../components/ui/FormRow'
import InlineFeedback from '../../../components/ui/InlineFeedback'
import PanelCard from '../../../components/ui/PanelCard'
import '../../../components/ui/emsFormLayout.css'

type Props = {
  busy: boolean
  finalScoreText: string
  setFinalScoreText: (value: string) => void
  sideAScore: string
  setSideAScore: (value: string) => void
  sideBScore: string
  setSideBScore: (value: string) => void
  onSubmit: (e: FormEvent) => void
  inlineMessage?: string | null
  inlineError?: string | null
}

export default function MatchSummaryPanel({
  busy,
  finalScoreText,
  setFinalScoreText,
  sideAScore,
  setSideAScore,
  sideBScore,
  setSideBScore,
  onSubmit,
  inlineMessage,
  inlineError,
}: Props) {
  return (
    <PanelCard title="Summary">
      <form onSubmit={onSubmit} className="ems-form" style={{ padding: 0 }}>
        <FormField label="Final score text">
          <input
            className="ems-input"
            disabled={busy}
            value={finalScoreText}
            onChange={(e) => setFinalScoreText(e.target.value)}
            maxLength={120}
            placeholder="e.g. 6-4, 6-3"
          />
        </FormField>

        <FormRow columns={2}>
          <FormField label="Side A score">
            <input
              min={0}
              type="number"
              className="ems-input"
              disabled={busy}
              value={sideAScore}
              onChange={(e) => setSideAScore(e.target.value)}
            />
          </FormField>
          <FormField label="Side B score">
            <input
              min={0}
              type="number"
              className="ems-input"
              disabled={busy}
              value={sideBScore}
              onChange={(e) => setSideBScore(e.target.value)}
            />
          </FormField>
        </FormRow>

        {inlineMessage ? <InlineFeedback type="success" message={inlineMessage} dense /> : null}
        {inlineError ? <InlineFeedback type="error" message={inlineError} dense /> : null}

        <ActionBar>
          <button type="submit" disabled={busy} className="ems-action-button">
            Save summary
          </button>
        </ActionBar>
      </form>
    </PanelCard>
  )
}
