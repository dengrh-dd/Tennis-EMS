import ActionToolbar from '../../../components/ui/ActionToolbar'
import Button from '../../../components/ui/Button'
import ToolbarFilterField from '../../../components/ui/ToolbarFilterField'
import { uiToolbarFiltersClusterStyle } from '../../../components/ui/uiPrimitives'
import '../../../components/ui/emsFormLayout.css'
import UserRoleFilter from '../components/UserRoleFilter'
import { usePeoplePageController } from '../hooks/usePeoplePageController'

type PeoplePageController = ReturnType<typeof usePeoplePageController>

type Props = {
  ctrl: PeoplePageController
}

export default function PeopleToolbarSection({ ctrl }: Props) {
  const filterDisabled = ctrl.loading || ctrl.busy
  return (
    <ActionToolbar
      title="People"
      filters={
        <div style={uiToolbarFiltersClusterStyle}>
          <ToolbarFilterField label="Role">
            <UserRoleFilter
              value={ctrl.roleFilter}
              onChange={ctrl.setRoleFilter}
              disabled={filterDisabled}
            />
          </ToolbarFilterField>
        </div>
      }
      actions={
        <>
          <Button variant="primary" onClick={ctrl.openCreatePanel} disabled={ctrl.busy || ctrl.panelDetailLoading}>
            Create User
          </Button>
          <Button variant="secondary" onClick={ctrl.openEditPanel} disabled={ctrl.isEditDisabled}>
            Edit Selected
          </Button>
          <Button variant="danger" onClick={ctrl.handleDelete} disabled={ctrl.isDeleteDisabled}>
            Delete
          </Button>
        </>
      }
    />
  )
}
