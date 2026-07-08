import type { TrainingMatch } from '../../../api/matchApi'
import PanelCard from '../../../components/ui/PanelCard'

type Props = {
  match: TrainingMatch
  winnerDisplayLabel: string
  hasSummary: boolean
}

export default function MatchHeaderSection({ match, winnerDisplayLabel, hasSummary }: Props) {
  return (
    <PanelCard title="Match header">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 10,
          fontSize: 14,
        }}
      >
        <div>
          <div style={{ color: '#64748b' }}>Match ID</div>
          <div>{match.matchId}</div>
        </div>
        <div>
          <div style={{ color: '#64748b' }}>Session ID</div>
          <div>{match.sessionId ?? '—'}</div>
        </div>
        <div>
          <div style={{ color: '#64748b' }}>Format ID</div>
          <div>{match.formatId ?? '—'}</div>
        </div>
        <div>
          <div style={{ color: '#64748b' }}>Type</div>
          <div>{match.matchType ?? '—'}</div>
        </div>
        <div>
          <div style={{ color: '#64748b' }}>Status</div>
          <div>{match.status ?? '—'}</div>
        </div>
        <div>
          <div style={{ color: '#64748b' }}>Winner</div>
          <div>{winnerDisplayLabel}</div>
        </div>
      </div>
      {match.notes?.trim() ? (
        <div style={{ marginTop: 10, fontSize: 14 }}>
          <span style={{ color: '#64748b' }}>Notes: </span>
          <span>{match.notes}</span>
        </div>
      ) : null}
      <div style={{ marginTop: 10, fontSize: 13, color: '#64748b' }}>
        Summary record: {hasSummary ? 'Available' : 'Not created yet'}
      </div>
    </PanelCard>
  )
}

