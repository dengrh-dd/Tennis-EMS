import type { TrainingGroup, TrainingGroupMember } from '../../../api/trainingGroupApi'
import ContextCard from '../../../components/ui/ContextCard'
import { uiPanelFollowUpParagraphStyle } from '../../../components/ui/uiPrimitives'

type Props = {
  group: TrainingGroup
  members: TrainingGroupMember[]
}

export default function GroupMembersHeader({ group, members }: Props) {
  return (
    <>
      <ContextCard
        title={group.name ?? `Group #${group.groupId}`}
        meta={
          <>
            Group ID #{group.groupId}
            {group.groupType ? ` · ${group.groupType}` : ''}
            {` · Members: ${members.length}`}
          </>
        }
        status={group.isActive === false ? 'Inactive' : 'Active'}
      />
      {group.description?.trim() ? <p style={uiPanelFollowUpParagraphStyle}>{group.description}</p> : null}
    </>
  )
}
