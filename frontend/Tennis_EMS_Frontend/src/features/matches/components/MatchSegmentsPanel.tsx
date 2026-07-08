import { useState, type FormEvent } from 'react'
import { MATCH_SEGMENT_TYPE_OPTIONS, type MatchSegment, type MatchSegmentType } from '../../../api/matchApi'
import ActionBar from '../../../components/ui/ActionBar'
import EmptyState from '../../../components/ui/EmptyState'
import FormField from '../../../components/ui/FormField'
import FormRow from '../../../components/ui/FormRow'
import InlineFeedback from '../../../components/ui/InlineFeedback'
import PanelCard from '../../../components/ui/PanelCard'
import '../../../components/ui/emsFormLayout.css'

type Props = {
  busy: boolean
  segments: MatchSegment[]
  nextSegmentNo: number
  addSegmentType: MatchSegmentType
  setAddSegmentType: (value: MatchSegmentType) => void
  addSideAScore: string
  setAddSideAScore: (value: string) => void
  addSideBScore: string
  setAddSideBScore: (value: string) => void
  onAddSegment: (e: FormEvent) => void
  onUpdateSegment: (
    segmentNo: number,
    payload: { segmentType: MatchSegmentType; sideAScore: number; sideBScore: number }
  ) => void
  onDeleteSegment: (segmentNo: number) => void
  inlineMessage?: string | null
  inlineError?: string | null
}

export default function MatchSegmentsPanel({
  busy,
  segments,
  nextSegmentNo,
  addSegmentType,
  setAddSegmentType,
  addSideAScore,
  setAddSideAScore,
  addSideBScore,
  setAddSideBScore,
  onAddSegment,
  onUpdateSegment,
  onDeleteSegment,
  inlineMessage,
  inlineError,
}: Props) {
  return (
    <PanelCard title="Segments" marginBottom={0}>
      <form onSubmit={onAddSegment} className="ems-form" style={{ padding: 0 }}>
        <FormRow columns={3}>
          <FormField label="Type" required>
            <select
              className="ems-select"
              disabled={busy}
              value={addSegmentType}
              onChange={(e) => setAddSegmentType(e.target.value as MatchSegmentType)}
            >
              {MATCH_SEGMENT_TYPE_OPTIONS.map((segmentType) => (
                <option key={segmentType} value={segmentType}>
                  {segmentType}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Side A">
            <input
              type="number"
              min={0}
              className="ems-input"
              disabled={busy}
              value={addSideAScore}
              onChange={(e) => setAddSideAScore(e.target.value)}
            />
          </FormField>
          <FormField label="Side B">
            <input
              type="number"
              min={0}
              className="ems-input"
              disabled={busy}
              value={addSideBScore}
              onChange={(e) => setAddSideBScore(e.target.value)}
            />
          </FormField>
        </FormRow>

        <InlineFeedback type="info" message={`Next segment: ${nextSegmentNo}`} dense />

        {inlineMessage ? <InlineFeedback type="success" message={inlineMessage} dense /> : null}
        {inlineError ? <InlineFeedback type="error" message={inlineError} dense /> : null}

        <ActionBar>
          <button type="submit" disabled={busy} className="ems-action-button">
            Add segment
          </button>
        </ActionBar>
      </form>

      {segments.length === 0 && <EmptyState message="No segments yet." />}
      {segments.length > 0 && (
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {segments
            .slice()
            .sort((a, b) => a.segmentNo - b.segmentNo)
            .map((segment) => (
              <SegmentRow
                key={segment.segmentNo}
                segment={segment}
                busy={busy}
                onUpdate={onUpdateSegment}
                onDelete={onDeleteSegment}
              />
            ))}
        </div>
      )}
    </PanelCard>
  )
}

type SegmentRowProps = {
  segment: MatchSegment
  busy: boolean
  onUpdate: (segmentNo: number, payload: { segmentType: MatchSegmentType; sideAScore: number; sideBScore: number }) => void
  onDelete: (segmentNo: number) => void
}

function SegmentRow({ segment, busy, onUpdate, onDelete }: SegmentRowProps) {
  const [segmentType, setSegmentType] = useState<MatchSegmentType>(
    segment.segmentType === 'TB' || segment.segmentType === 'RACE' ? segment.segmentType : 'SET'
  )
  const [sideAScore, setSideAScore] = useState(String(segment.sideAScore ?? 0))
  const [sideBScore, setSideBScore] = useState(String(segment.sideBScore ?? 0))

  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: 12,
        background: '#fafbfc',
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#475569',
          marginBottom: 8,
        }}
      >
        Segment #{segment.segmentNo}
      </div>

      <FormRow columns="1fr 1fr 1fr">
        <FormField label="Type">
          <select
            className="ems-select"
            disabled={busy}
            value={segmentType}
            onChange={(e) => setSegmentType(e.target.value as MatchSegmentType)}
          >
            {MATCH_SEGMENT_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Side A">
          <input
            type="number"
            min={0}
            className="ems-input"
            disabled={busy}
            value={sideAScore}
            onChange={(e) => setSideAScore(e.target.value)}
          />
        </FormField>
        <FormField label="Side B">
          <input
            type="number"
            min={0}
            className="ems-input"
            disabled={busy}
            value={sideBScore}
            onChange={(e) => setSideBScore(e.target.value)}
          />
        </FormField>
      </FormRow>

      <ActionBar style={{ marginTop: 10 }}>
        <button
          type="button"
          disabled={busy}
          className="ems-action-button"
          onClick={() =>
            onUpdate(segment.segmentNo, {
              segmentType,
              sideAScore: Number(sideAScore || 0),
              sideBScore: Number(sideBScore || 0),
            })
          }
        >
          Save
        </button>
        <button type="button" disabled={busy} className="ems-action-button" onClick={() => onDelete(segment.segmentNo)}>
          Delete
        </button>
      </ActionBar>
    </div>
  )
}
