import DrillDownPageShell from '../../../components/layout/DrillDownPageShell'
import SplitPageLayout from '../../../components/layout/SplitPageLayout'
import { workspaceMainColumnStyle, workspaceSideColumnStyle } from '../../../components/layout/drillDownLayout'
import PageFeedback from '../../../components/ui/PageFeedback'
import { useGroupPageController } from '../hooks/useGroupPageController'
import { GroupDetailSection, GroupListSection, GroupToolbarSection } from '../sections'

export default function GroupPage() {
  const ctrl = useGroupPageController()

  return (
    <DrillDownPageShell panelOpen={ctrl.flags.panelOpen}>
      <SplitPageLayout
        main={
          <div style={workspaceMainColumnStyle}>
            <GroupToolbarSection ctrl={ctrl} />
            <PageFeedback
              success={ctrl.feedback.success}
              error={ctrl.feedback.error}
              loading={ctrl.list.loading}
              loadingMessage="Loading training groups…"
              onDismiss={ctrl.feedback.clear}
            />
            <GroupListSection ctrl={ctrl} />
          </div>
        }
        side={
          <div style={workspaceSideColumnStyle}>
            <GroupDetailSection ctrl={ctrl} />
          </div>
        }
      />
    </DrillDownPageShell>
  )
}
