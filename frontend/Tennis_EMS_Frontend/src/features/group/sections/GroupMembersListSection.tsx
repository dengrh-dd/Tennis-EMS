import GroupMemberList from '../components/GroupMemberList'
import type { TrainingGroupMember } from '../../../api/trainingGroupApi'
import type { User } from '../../../api/userApi'

type Props = {
  loading: boolean
  members: TrainingGroupMember[]
  studentMap: Map<number, User>
  busy: boolean
  editingStudentId: number | null
  editStartDate: string
  setEditStartDate: (value: string) => void
  editEndDate: string
  setEditEndDate: (value: string) => void
  onEdit: (member: TrainingGroupMember) => void
  onCancelEdit: () => void
  onSaveEdit: (studentId: number) => void
  onRemove: (studentId: number) => void
}

export default function GroupMembersListSection({
  loading,
  members,
  studentMap,
  busy,
  editingStudentId,
  editStartDate,
  setEditStartDate,
  editEndDate,
  setEditEndDate,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onRemove,
}: Props) {
  if (loading) return null

  return (
    <GroupMemberList
      members={members}
      studentMap={studentMap}
      busy={busy}
      editingStudentId={editingStudentId}
      editStartDate={editStartDate}
      setEditStartDate={setEditStartDate}
      editEndDate={editEndDate}
      setEditEndDate={setEditEndDate}
      onEdit={onEdit}
      onCancelEdit={onCancelEdit}
      onSaveEdit={onSaveEdit}
      onRemove={onRemove}
    />
  )
}
