import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { TrainingGroup, TrainingGroupType } from '../../../api/trainingGroupApi'
import { TRAINING_GROUP_TYPES } from '../../../api/trainingGroupApi'
import CheckboxField from '../../../components/ui/CheckboxField'
import FormField from '../../../components/ui/FormField'
import FormActionButton from '../../../components/ui/form/FormActionButton'
import '../../../components/ui/emsFormLayout.css'

type GroupFormModel = {
  name: string
  groupType: TrainingGroupType
  description: string
  isActive: boolean
}

type BaseProps = {
  mode: 'create' | 'edit'
  busy: boolean
  onSubmit: (e: FormEvent) => void
  form: GroupFormModel
  setForm: Dispatch<SetStateAction<GroupFormModel>>
}

type Props = BaseProps & {
  group?: TrainingGroup
}

export function GroupForm({
  mode,
  busy,
  onSubmit,
  group,
  form,
  setForm,
}: Props) {
  const setField = <K extends keyof GroupFormModel>(key: K, value: GroupFormModel[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const isEditMode = mode === 'edit'
  const submitLabel = isEditMode ? 'Save Changes' : 'Create Group'

  return (
    <form onSubmit={onSubmit} className="ems-form">
      {isEditMode && group && (
        <FormField label="Group ID">
          <input type="number" value={group.groupId} readOnly className="ems-input ems-input-readonly" />
        </FormField>
      )}
      <FormField label="Name" required>
        <input
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          required
          disabled={busy}
          className="ems-input"
        />
      </FormField>
      <FormField label="Group type" required>
        <select
          value={form.groupType}
          onChange={(e) => setField('groupType', e.target.value as TrainingGroupType)}
          disabled={busy}
          className="ems-select"
        >
          {TRAINING_GROUP_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Description">
        <textarea
          value={form.description}
          onChange={(e) => setField('description', e.target.value)}
          disabled={busy}
          rows={4}
          className="ems-textarea"
        />
      </FormField>
      <CheckboxField
        checked={form.isActive}
        onChange={(e) => setField('isActive', e.target.checked)}
        disabled={busy}
        label="Active"
      />
      <div className="ems-form-actions ems-form-actions-end">
        <FormActionButton type="submit" variant="primary" disabled={busy}>
          {submitLabel}
        </FormActionButton>
      </div>
    </form>
  )
}
