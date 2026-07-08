import WorkspaceSideSection from '../../../components/ui/WorkspaceSideSection'
import SelectedUserWorkspace from '../components/SelectedUserWorkspace'
import { usePeoplePageController } from '../hooks/usePeoplePageController'

type PeoplePageController = ReturnType<typeof usePeoplePageController>

type Props = {
  ctrl: PeoplePageController
}

export default function PeopleOverviewSection({ ctrl }: Props) {
  if (ctrl.panelMode !== null) return null

  return (
    <WorkspaceSideSection variant="overview" title="Overview">
      <SelectedUserWorkspace
        user={ctrl.displayUser}
        loading={ctrl.loading}
        onEdit={ctrl.openEditPanel}
        editDisabled={ctrl.isEditDisabled}
      />
    </WorkspaceSideSection>
  )
}
