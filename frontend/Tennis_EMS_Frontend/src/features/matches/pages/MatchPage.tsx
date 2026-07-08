import DrillDownPageShell from '../../../components/layout/DrillDownPageShell'
import SplitPageLayout from '../../../components/layout/SplitPageLayout'
import { workspaceMainColumnStyle, workspaceSideColumnStyle } from '../../../components/layout/drillDownLayout'
import PageFeedback from '../../../components/ui/PageFeedback'
import { useMatchPageController } from '../hooks/useMatchPageController'
import { MatchListSection, MatchOverviewSection, MatchPanelSection, MatchToolbarSection } from '../sections'

export default function MatchPage() {
  const ctrl = useMatchPageController()

  return (
    <DrillDownPageShell panelOpen>
      <SplitPageLayout
        main={
          <div style={workspaceMainColumnStyle}>
            <MatchToolbarSection ctrl={ctrl} />
            <PageFeedback
              success={ctrl.success}
              error={ctrl.error}
              loading={ctrl.loading}
              loadingMessage="Loading matches…"
            />
            <MatchListSection ctrl={ctrl} />
          </div>
        }
        side={
          <div style={workspaceSideColumnStyle}>
            <MatchOverviewSection ctrl={ctrl} />
            <MatchPanelSection ctrl={ctrl} />
          </div>
        }
      />
    </DrillDownPageShell>
  )
}
