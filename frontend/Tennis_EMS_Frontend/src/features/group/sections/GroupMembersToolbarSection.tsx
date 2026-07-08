import ActionToolbar from '../../../components/ui/ActionToolbar'
import CheckboxField from '../../../components/ui/CheckboxField'
import Button from '../../../components/ui/Button'
import type { TrainingGroup } from '../../../api/trainingGroupApi'

type Props = {
  loading: boolean
  busy: boolean
  group: TrainingGroup | null
  showActiveOnly: boolean
  onShowActiveOnlyChange: (checked: boolean) => void
  showAddForm: boolean
  onToggleAddForm: () => void
}

export default function GroupMembersToolbarSection({
  loading,
  busy,
  group,
  showActiveOnly,
  onShowActiveOnlyChange,
  showAddForm,
  onToggleAddForm,
}: Props) {
  const addDisabled = loading || busy || !group || group.isActive === false
  return (
    <ActionToolbar
      title="Members"
      filters={
        <CheckboxField
          label="Show active only"
          checked={showActiveOnly}
          onChange={(e) => onShowActiveOnlyChange(e.target.checked)}
          disabled={loading || busy}
        />
      }
      actions={
        <Button type="button" variant="primary" onClick={onToggleAddForm} disabled={addDisabled}>
          {showAddForm ? 'Hide Add Member' : 'Add Member'}
        </Button>
      }
    />
  )
}
