import WorkspaceSideSection from '../../../components/ui/WorkspaceSideSection'
import SelectedMatchWorkspace from '../components/SelectedMatchWorkspace'
import { matchDetailPath } from '../../../routes/featurePaths'
import { useMatchPageController } from '../hooks/useMatchPageController'

type MatchPageController = ReturnType<typeof useMatchPageController>

type Props = {
  ctrl: MatchPageController
}

/**
 * Side-column overview when the edit panel is closed — mirrors `PeopleOverviewSection` placement.
 */
export default function MatchOverviewSection({ ctrl }: Props) {
  if (ctrl.panelMode === 'edit') return null

  return (
    <WorkspaceSideSection variant="overview" title="Overview">
      <SelectedMatchWorkspace
        panelMode={ctrl.panelMode}
        displayMatch={ctrl.displayMatch}
        loading={ctrl.loading}
        onNavigateToDetail={(matchId) => ctrl.navigate(matchDetailPath(matchId))}
        viewDetailDisabled={ctrl.isViewDetailDisabled}
      />
    </WorkspaceSideSection>
  )
}
