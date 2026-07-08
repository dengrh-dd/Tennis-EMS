import EmptyState from '../../../components/ui/EmptyState'
import SelectableListShell from '../../../components/ui/SelectableListShell'
import WorkspaceSectionHeading from '../../../components/ui/WorkspaceSectionHeading'
import {
  uiEmptyStateInSelectableListStyle,
  uiSelectableListRowBaseStyle,
  uiSelectableListRowInsetStyle,
  uiSelectableListRowMetaTextStyle,
  uiSelectableListRowPrimaryTextStyle,
  uiSelectableListRowSecondaryMultilineStyle,
  uiSelectableListRowSurface,
  uiWorkspaceListSectionStyle,
} from '../../../components/ui/uiPrimitives'
import { useMatchPageController } from '../hooks/useMatchPageController'

type MatchPageController = ReturnType<typeof useMatchPageController>

type Props = {
  ctrl: MatchPageController
}

export default function MatchListSection({ ctrl }: Props) {
  return (
    <section style={uiWorkspaceListSectionStyle}>
      <WorkspaceSectionHeading flushBottom>Matches</WorkspaceSectionHeading>
      <SelectableListShell>
        {!ctrl.loading && ctrl.matches.length === 0 && (
          <EmptyState
            style={uiEmptyStateInSelectableListStyle}
            message="No matches match the current filters. Adjust filters or click Refresh."
          />
        )}
        {ctrl.matches.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {ctrl.matches.map((match) => {
              const selected = match.matchId === ctrl.selectedMatchId
              const hovered = match.matchId === ctrl.hoveredMatchId
              return (
                <li
                  key={match.matchId}
                  onClick={() => ctrl.handleSelectMatch(match)}
                  onMouseEnter={() => ctrl.handleHoverMatch(match.matchId)}
                  onMouseLeave={() => ctrl.handleLeaveMatch()}
                  style={{
                    ...uiSelectableListRowBaseStyle,
                    ...uiSelectableListRowInsetStyle,
                    ...uiSelectableListRowSurface(selected, hovered),
                  }}
                >
                  <div style={uiSelectableListRowPrimaryTextStyle}>
                    {match.title?.trim() || `Match #${match.matchId}`}
                  </div>
                  <div style={uiSelectableListRowSecondaryMultilineStyle}>
                    {ctrl.formatMatchListLineup(ctrl.listPlayersByMatchId[match.matchId], ctrl.studentNameForList)}
                  </div>
                  <div style={uiSelectableListRowMetaTextStyle}>
                    Session {match.sessionId ?? '-'} / {match.matchType ?? '-'} / {match.status ?? '-'}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </SelectableListShell>
    </section>
  )
}
