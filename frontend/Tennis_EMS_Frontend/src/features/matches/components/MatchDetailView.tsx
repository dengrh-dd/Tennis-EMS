import { Link } from 'react-router-dom'
import DrillDownPageShell from '../../../components/layout/DrillDownPageShell'
import {
  breadcrumbCurrentStyle,
  breadcrumbLinkStyle,
  workspaceDetailStackStyle,
  workspaceMainColumnStyle,
} from '../../../components/layout/drillDownLayout'
import PageHeader from '../../../components/ui/PageHeader'
import PanelCard from '../../../components/ui/PanelCard'
import { uiColors } from '../../../components/ui/uiPrimitives'
import { uiFontSize, uiSpace, uiText } from '../../../components/ui/uiTokens'
import { MATCHES_ROOT } from '../../../routes/featurePaths'
import { useMatchDetailController } from '../hooks/useMatchDetailController'
import MatchHeaderSection from './MatchHeaderSection'
import MatchPlayersSection from './MatchPlayersSection'
import MatchSummarySection from './MatchSummarySection'
import MatchSegmentsSection from './MatchSegmentsSection'

export type MatchDetailController = ReturnType<typeof useMatchDetailController>

type Props = {
  controller: MatchDetailController
}

export default function MatchDetailView({ controller: c }: Props) {
  return (
    <DrillDownPageShell panelOpen={false}>
      <div style={workspaceMainColumnStyle}>
        <PageHeader
          breadcrumbLineHeight={1.6}
          breadcrumb={
            <>
              <Link
                to={MATCHES_ROOT}
                state={{ selectedMatchId: c.match?.matchId ?? c.matchId }}
                style={breadcrumbLinkStyle}
              >
                Match
              </Link>
              {' / '}
              <span style={breadcrumbCurrentStyle}>{c.match?.title ?? (c.loading ? '…' : `#${c.matchId}`)}</span>
              {' / '}
              <span style={breadcrumbCurrentStyle}>Details</span>
            </>
          }
          backLabel="← Back to Matches"
          onBack={c.navigateBackToMatches}
        />

        <div style={workspaceDetailStackStyle}>
          {c.pageError ? (
            <PanelCard title="Error" marginBottom={uiSpace.md}>
              <p style={{ margin: 0, fontSize: uiFontSize.body, color: uiText.error }} role="alert">
                {c.pageError}
              </p>
            </PanelCard>
          ) : null}
          {c.loading ? (
            <p style={{ color: uiColors.textMuted, margin: 0 }}>Loading match details…</p>
          ) : null}

          {!c.loading && c.match && (
            <MatchHeaderSection
              match={c.match}
              winnerDisplayLabel={c.winnerDisplayLabel}
              hasSummary={c.summary != null}
            />
          )}

          {!c.loading && c.match && (
            <>
              <MatchPlayersSection
                players={c.players}
                students={c.studentOptions}
                busy={c.busy}
                matchType={c.matchType}
                addSide={c.addSide}
                setAddSide={c.setAddSide}
                addPosition={c.addPosition}
                setAddPosition={c.setAddPosition}
                addStudentId={c.addStudentId}
                setAddStudentId={c.setAddStudentId}
                onSubmitAdd={c.handleAddPlayer}
                onDeletePlayer={c.handleDeletePlayer}
                inlineMessage={c.playerMessage}
                inlineError={c.playerError}
              />

              <MatchSummarySection
                busy={c.busy}
                finalScoreText={c.finalScoreText}
                setFinalScoreText={c.setFinalScoreText}
                sideAScore={c.sideAScore}
                setSideAScore={c.setSideAScore}
                sideBScore={c.sideBScore}
                setSideBScore={c.setSideBScore}
                onSubmit={c.handleSaveSummary}
                inlineMessage={c.summaryMessage}
                inlineError={c.summaryError}
              />

              <MatchSegmentsSection
                busy={c.busy}
                segments={c.segments}
                nextSegmentNo={c.nextSegmentNo}
                addSegmentType={c.addSegmentType}
                setAddSegmentType={c.setAddSegmentType}
                addSideAScore={c.addSideAScore}
                setAddSideAScore={c.setAddSideAScore}
                addSideBScore={c.addSideBScore}
                setAddSideBScore={c.setAddSideBScore}
                onAddSegment={c.handleAddSegment}
                onUpdateSegment={c.handleUpdateSegment}
                onDeleteSegment={c.handleDeleteSegment}
                inlineMessage={c.segmentMessage}
                inlineError={c.segmentError}
              />
            </>
          )}
        </div>
      </div>
    </DrillDownPageShell>
  )
}
