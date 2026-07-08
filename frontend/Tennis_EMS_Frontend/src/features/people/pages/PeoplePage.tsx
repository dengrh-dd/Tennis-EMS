import DrillDownPageShell from '../../../components/layout/DrillDownPageShell'
import SplitPageLayout from '../../../components/layout/SplitPageLayout'
import { workspaceMainColumnStyle, workspaceSideColumnStyle } from '../../../components/layout/drillDownLayout'
import PageFeedback from '../../../components/ui/PageFeedback'
import { usePeoplePageController } from '../hooks/usePeoplePageController'
import { PeopleListSection, PeopleOverviewSection, PeoplePanelSection, PeopleToolbarSection } from '../sections'

export default function PeoplePage() {
  const ctrl = usePeoplePageController()

  return (
    <DrillDownPageShell panelOpen={ctrl.panelOpen}>
      <SplitPageLayout
        main={
          <div style={workspaceMainColumnStyle}>
            <PeopleToolbarSection ctrl={ctrl} />
            <PageFeedback
              success={ctrl.success}
              error={ctrl.error}
              loading={ctrl.loading}
              loadingMessage="Loading users…"
            />
            <PeopleListSection ctrl={ctrl} />
          </div>
        }
        side={
          <div style={workspaceSideColumnStyle}>
            <PeopleOverviewSection ctrl={ctrl} />
            <PeoplePanelSection ctrl={ctrl} />
          </div>
        }
      />
    </DrillDownPageShell>
  )
}
