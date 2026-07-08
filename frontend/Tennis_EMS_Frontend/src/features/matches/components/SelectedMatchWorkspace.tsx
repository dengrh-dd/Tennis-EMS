import type { TrainingMatch } from '../../../api/matchApi'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import PanelCard from '../../../components/ui/PanelCard'
import { uiColors, uiMetaRowLabelStyle, uiMetaRowValueStyle } from '../../../components/ui/uiPrimitives'
import { uiFontSize, uiLineHeight, uiSpace } from '../../../components/ui/uiTokens'
import type { PanelMode } from '../hooks/useMatchPageController'

type Props = {
  panelMode: PanelMode
  displayMatch: TrainingMatch | null
  loading: boolean
  onNavigateToDetail: (matchId: number) => void
  viewDetailDisabled: boolean
}

/**
 * Selected match summary for the Match page side column (hidden while edit panel is open).
 */
export default function SelectedMatchWorkspace({
  panelMode,
  displayMatch,
  loading,
  onNavigateToDetail,
  viewDetailDisabled,
}: Props) {
  if (panelMode === 'edit') return null

  if (displayMatch) {
    return (
      <PanelCard
        marginBottom={0}
        title={displayMatch.title?.trim() || `Match #${displayMatch.matchId}`}
        subtitle="Overview"
        rightActions={
          <Button
            variant="secondary"
            disabled={viewDetailDisabled}
            onClick={() => onNavigateToDetail(displayMatch.matchId)}
          >
            View Details
          </Button>
        }
      >
        <div
          style={{
            borderTop: `1px solid ${uiColors.borderLight}`,
            paddingTop: uiSpace.md,
            marginTop: uiSpace.xs,
            fontSize: uiFontSize.body,
            lineHeight: uiLineHeight.relaxed,
          }}
        >
          <div style={{ display: 'flex', marginBottom: uiSpace.sm }}>
            <span style={uiMetaRowLabelStyle}>Match ID</span>
            <span style={uiMetaRowValueStyle}>{displayMatch.matchId}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: uiSpace.sm }}>
            <span style={uiMetaRowLabelStyle}>Session ID</span>
            <span style={uiMetaRowValueStyle}>{displayMatch.sessionId ?? '-'}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: uiSpace.sm }}>
            <span style={uiMetaRowLabelStyle}>Format ID</span>
            <span style={uiMetaRowValueStyle}>{displayMatch.formatId ?? '-'}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: uiSpace.sm }}>
            <span style={uiMetaRowLabelStyle}>Type</span>
            <span style={uiMetaRowValueStyle}>{displayMatch.matchType ?? '-'}</span>
          </div>
          <div style={{ display: 'flex' }}>
            <span style={uiMetaRowLabelStyle}>Status</span>
            <span style={uiMetaRowValueStyle}>{displayMatch.status ?? '-'}</span>
          </div>
        </div>
      </PanelCard>
    )
  }

  if (!loading) {
    return <EmptyState style={{ marginTop: 0 }} message="Select a match or create one." />
  }

  return null
}
