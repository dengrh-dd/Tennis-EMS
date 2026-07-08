import { useState } from 'react'
import {
  createTrainingGroup,
  updateTrainingGroup,
  type TrainingGroup,
  type TrainingGroupType,
  TRAINING_GROUP_TYPES,
} from '../../../api/trainingGroupApi'

export type GroupFormState = {
  name: string
  groupType: TrainingGroupType
  description: string
  isActive: boolean
}

const defaultFormState: GroupFormState = {
  name: '',
  groupType: TRAINING_GROUP_TYPES[0],
  description: '',
  isActive: true,
}

type Props = {
  selectedGroupId: number | null
  loadGroupDetail: (groupId: number) => Promise<TrainingGroup | null>
}

export function useGroupForm({
  selectedGroupId,
  loadGroupDetail,
}: Props) {
  const [form, setForm] = useState<GroupFormState>(defaultFormState)

  function resetForm() {
    setForm(defaultFormState)
  }

  function hydrateForm(group: TrainingGroup | null) {
    if (!group) {
      resetForm()
      return
    }
    setForm({
      name: group.name ?? '',
      groupType: group.groupType ?? TRAINING_GROUP_TYPES[0],
      description: group.description ?? '',
      isActive: group.isActive !== false,
    })
  }

  async function hydrateFromEditGroup(group: TrainingGroup) {
    hydrateForm(group)
    const detail = await loadGroupDetail(group.groupId)
    if (detail) hydrateForm(detail)
    return detail
  }

  async function submitCreate() {
    return createTrainingGroup({
      name: form.name.trim(),
      groupType: form.groupType,
      description: form.description.trim() || null,
      isActive: form.isActive,
    })
  }

  async function submitUpdate() {
    if (!selectedGroupId) {
      throw new Error('No group selected.')
    }
    return updateTrainingGroup(selectedGroupId, {
      name: form.name.trim(),
      groupType: form.groupType,
      description: form.description.trim() || null,
      isActive: form.isActive,
    })
  }

  return {
    form,
    setForm,
    resetForm,
    hydrateFromEditGroup,
    submitCreate,
    submitUpdate,
  }
}
