import ActionToolbar from '../../../components/ui/ActionToolbar'
import Button from '../../../components/ui/Button'
import ToolbarFilterField from '../../../components/ui/ToolbarFilterField'
import { uiToolbarFiltersClusterStyle } from '../../../components/ui/uiPrimitives'
import '../../../components/ui/emsFormLayout.css'
import GroupTypeFilter, { type GroupTypeFilterValue } from '../components/GroupTypeFilter'
import type { ActiveFilter } from '../hooks/useGroupPageController'
import { useGroupPageController } from '../hooks/useGroupPageController'

type GroupPageController = ReturnType<typeof useGroupPageController>

type Props = {
  ctrl: GroupPageController
}

export default function GroupToolbarSection({ ctrl }: Props) {
  const { list, feedback, form, flags, actions } = ctrl
  return (
    <ActionToolbar
      title="Group"
      filters={
        <div style={uiToolbarFiltersClusterStyle}>
          <GroupTypeFilter
            value={list.typeFilter}
            onChange={list.setTypeFilter as (value: GroupTypeFilterValue) => void}
            disabled={list.loading || feedback.busy}
          />
          <ToolbarFilterField label="Status">
            <select
              value={list.activeFilter}
              onChange={(e) => list.setActiveFilter(e.target.value as ActiveFilter)}
              disabled={list.loading || feedback.busy}
              className="ems-select"
            >
              <option value="ALL">All</option>
              <option value="ACTIVE_ONLY">Active only</option>
            </select>
          </ToolbarFilterField>
        </div>
      }
      actions={
        <>
          <Button
            variant="primary"
            onClick={form.openCreatePanel}
            disabled={feedback.busy || form.panelDetailLoading}
          >
            Create Group
          </Button>
          <Button variant="secondary" onClick={form.openEditPanel} disabled={flags.isEditDisabled}>
            Edit Selected
          </Button>
          <Button variant="danger" onClick={actions.deleteGroup} disabled={flags.isDeleteDisabled}>
            Delete
          </Button>
        </>
      }
    />
  )
}
