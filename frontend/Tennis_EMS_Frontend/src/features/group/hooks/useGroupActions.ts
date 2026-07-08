import { useNavigate } from 'react-router-dom'
import { deleteTrainingGroup } from '../../../api/trainingGroupApi'
import { groupMembersPath } from '../../../routes/featurePaths'

/**
 * Business operation for deleting a group.
 * Page-level loading/message state is intentionally handled by controllers.
 */
export async function deleteGroupById(groupId: number): Promise<void> {
  await deleteTrainingGroup(groupId)
}

export function useGroupActions() {
  const navigate = useNavigate()

  function handleViewMembers(groupId: number) {
    navigate(groupMembersPath(groupId), {
      state: { selectedGroupId: groupId },
    })
  }

  return {
    handleViewMembers,
  }
}
