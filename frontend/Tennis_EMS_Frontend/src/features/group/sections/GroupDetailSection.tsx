import PanelShell from '../../../components/ui/PanelShell'
import WorkspaceSideSection from '../../../components/ui/WorkspaceSideSection'
import GroupSelectedWorkspace from '../components/GroupSelectedWorkspace'
import { GroupForm } from '../components/GroupForm'
import { useGroupPageController } from '../hooks/useGroupPageController'

type GroupPageController = ReturnType<typeof useGroupPageController>

type Props = {
  ctrl: GroupPageController
}

export default function GroupDetailSection({ ctrl }: Props) {
  const handlePanelClose = () => {
    ctrl.form.closePanel()
  }

  return (
    <>
      {ctrl.form.panelMode === null && (
        <WorkspaceSideSection variant="overview" title="Overview">
          <GroupSelectedWorkspace ctrl={ctrl} />
        </WorkspaceSideSection>
      )}

      {ctrl.form.panelMode !== null && (
        <WorkspaceSideSection variant="action" title="Action panel">
          {ctrl.form.panelMode === 'create' && (
            <PanelShell title="Create Group" onClose={handlePanelClose} closeDisabled={ctrl.feedback.busy}>
              <GroupForm
                mode="create"
                busy={ctrl.feedback.busy || ctrl.form.panelDetailLoading}
                onSubmit={ctrl.form.submitCreate}
                form={ctrl.form.model}
                setForm={ctrl.form.setForm}
              />
            </PanelShell>
          )}
          {ctrl.form.panelMode === 'edit' && ctrl.list.selectedGroup && (
            <PanelShell
              title="Edit Group"
              onClose={handlePanelClose}
              closeDisabled={ctrl.feedback.busy || ctrl.form.panelDetailLoading}
            >
              <GroupForm
                mode="edit"
                busy={ctrl.feedback.busy || ctrl.form.panelDetailLoading}
                onSubmit={ctrl.form.submitUpdate}
                group={ctrl.list.selectedGroup}
                form={ctrl.form.model}
                setForm={ctrl.form.setForm}
              />
            </PanelShell>
          )}
        </WorkspaceSideSection>
      )}
    </>
  )
}
