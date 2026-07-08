import type { TrainingGroupType } from '../../../api/trainingGroupApi'
import { TRAINING_GROUP_TYPES } from '../../../api/trainingGroupApi'
import '../../../components/ui/emsFormLayout.css'
import ToolbarFilterField from '../../../components/ui/ToolbarFilterField'

export const GROUP_TYPE_FILTER_ALL = 'ALL'
export type GroupTypeFilterValue = typeof GROUP_TYPE_FILTER_ALL | TrainingGroupType

type Props = {
  value: GroupTypeFilterValue
  onChange: (value: GroupTypeFilterValue) => void
  disabled?: boolean
}

export default function GroupTypeFilter({ value, onChange, disabled }: Props) {
  return (
    <ToolbarFilterField label="Type">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as GroupTypeFilterValue)}
        disabled={disabled}
        className="ems-select"
      >
        <option value={GROUP_TYPE_FILTER_ALL}>All</option>
        {TRAINING_GROUP_TYPES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </ToolbarFilterField>
  )
}
