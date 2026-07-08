import {
  getActiveTrainingGroups,
  getAllTrainingGroups,
  getTrainingGroupsByType,
  type TrainingGroup,
} from '../../../api/trainingGroupApi'
import { GROUP_TYPE_FILTER_ALL, type GroupTypeFilterValue } from '../components/GroupTypeFilter'
import type { ActiveFilter } from '../hooks/useGroupListState'

type GetGroupsParams = {
  typeFilter: GroupTypeFilterValue
  activeFilter: ActiveFilter
}

export async function getGroups({ typeFilter, activeFilter }: GetGroupsParams): Promise<TrainingGroup[]> {
  if (typeFilter === GROUP_TYPE_FILTER_ALL) {
    return activeFilter === 'ACTIVE_ONLY' ? getActiveTrainingGroups() : getAllTrainingGroups()
  }

  const list = await getTrainingGroupsByType(typeFilter)
  if (activeFilter !== 'ACTIVE_ONLY') return list
  return list.filter((item) => item.isActive !== false)
}
