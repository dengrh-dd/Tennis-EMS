import AddGroupMemberForm from '../components/AddGroupMemberForm'
import type { User } from '../../../api/userApi'
import type { FormEvent } from 'react'
import type { EntitySelectOption } from '../../../components/ui/form/SearchableSelect'

type Props = {
  open: boolean
  busy: boolean
  students: User[]
  studentId: string
  setStudentId: (value: string) => void
  studentOptions: EntitySelectOption[]
  startDate: string
  setStartDate: (value: string) => void
  endDate: string
  setEndDate: (value: string) => void
  onSubmit: (e: FormEvent) => void
  onCancel: () => void
  inlineMessage?: string | null
  inlineError?: string | null
}

export default function GroupMembersAddSection({
  open,
  busy,
  students,
  studentId,
  setStudentId,
  studentOptions,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onSubmit,
  onCancel,
  inlineMessage,
  inlineError,
}: Props) {
  if (!open) return null

  return (
    <AddGroupMemberForm
      busy={busy}
      students={students}
      studentId={studentId}
      setStudentId={setStudentId}
      studentOptions={studentOptions}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      onSubmit={onSubmit}
      onCancel={onCancel}
      inlineMessage={inlineMessage}
      inlineError={inlineError}
    />
  )
}
