import EmptyState from '../../../components/ui/EmptyState'
import GroupDetailCard from './GroupDetailCard'
import GroupDetailPanel from './GroupDetailPanel'
import { useGroupPageController } from '../hooks/useGroupPageController'

type GroupPageController = ReturnType<typeof useGroupPageController>

type Props = {
  ctrl: GroupPageController
}

/**
 * Read-only selected group detail in the side column when create/edit panels are closed.
 */
export default function GroupSelectedWorkspace({ ctrl }: Props) {
  const selectedGroup = ctrl.list.displayGroup

  if (selectedGroup) {
    return (
      <GroupDetailPanel
        title={selectedGroup.name ?? `Group #${selectedGroup.groupId}`}
        onEdit={ctrl.form.openEditPanel}
        editDisabled={ctrl.flags.isEditDisabled}
        onViewMembers={() => ctrl.actions.viewMembers(selectedGroup.groupId)}
        viewMembersDisabled={ctrl.flags.isViewMembersDisabled}
      >
        <GroupDetailCard group={selectedGroup} memberCount={ctrl.list.memberCount ?? undefined} />
      </GroupDetailPanel>
    )
  }

  if (!ctrl.list.loading) {
    return <EmptyState style={{ marginTop: 0 }} message="Select a group or create one." />
  }

  return null
}
