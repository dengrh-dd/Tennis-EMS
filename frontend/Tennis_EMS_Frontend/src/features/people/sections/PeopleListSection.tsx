import WorkspaceSectionHeading from '../../../components/ui/WorkspaceSectionHeading'
import { uiWorkspaceListSectionStyle } from '../../../components/ui/uiPrimitives'
import UserListPanel from '../components/UserListPanel'
import { usePeoplePageController } from '../hooks/usePeoplePageController'

type PeoplePageController = ReturnType<typeof usePeoplePageController>

type Props = {
  ctrl: PeoplePageController
}

export default function PeopleListSection({ ctrl }: Props) {
  return (
    <section style={uiWorkspaceListSectionStyle}>
      <WorkspaceSectionHeading flushBottom>Users</WorkspaceSectionHeading>
      <UserListPanel
        users={ctrl.users}
        loading={ctrl.loading}
        selectedUserId={ctrl.selectedUserId}
        hoveredUserId={ctrl.hoveredUserId}
        onSelectUser={ctrl.handleSelectUser}
        onHoverUser={ctrl.handleHoverUser}
        onLeaveUser={ctrl.handleLeaveUser}
      />
    </section>
  )
}
