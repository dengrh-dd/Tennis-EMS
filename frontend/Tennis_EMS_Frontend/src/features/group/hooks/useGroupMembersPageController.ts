import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { EntitySelectOption } from '../../../components/ui/form/SearchableSelect'
import {
  addTrainingGroupMember,
  getTrainingGroupById,
  getTrainingGroupMembers,
  removeTrainingGroupMember,
  updateTrainingGroupMember,
  type TrainingGroup,
  type TrainingGroupMember,
} from '../../../api/trainingGroupApi'
import { getUsersByRole, type User } from '../../../api/userApi'
import { toHtmlDateInputValue } from '../../../utils/displayDate'
import { GROUPS_ROOT } from '../../../routes/featurePaths'

export function useGroupMembersPageController() {
  const { groupId: groupIdParam } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const groupId = Number(groupIdParam)

  const [group, setGroup] = useState<TrainingGroup | null>(null)
  const [members, setMembers] = useState<TrainingGroupMember[]>([])
  const [students, setStudents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [addMemberMessage, setAddMemberMessage] = useState<string | null>(null)
  const [addMemberError, setAddMemberError] = useState<string | null>(null)

  const [showAddForm, setShowAddForm] = useState(false)
  const [addStudentId, setAddStudentId] = useState('')
  const [addStartDate, setAddStartDate] = useState('')
  const [addEndDate, setAddEndDate] = useState('')

  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null)
  const [editStartDate, setEditStartDate] = useState('')
  const [editEndDate, setEditEndDate] = useState('')

  const invalidGroup = !Number.isFinite(groupId) || groupId <= 0

  const studentMap = useMemo(() => {
    const map = new Map<number, User>()
    for (const student of students) {
      if (student.profileId != null && student.profileId > 0) {
        map.set(student.profileId, student)
      }
    }
    return map
  }, [students])

  const displayedMembers = useMemo(() => {
    if (!showActiveOnly) return members
    return members.filter((member) => !member.endDate)
  }, [members, showActiveOnly])

  const availableStudentOptions = useMemo<EntitySelectOption[]>(() => {
    const enrolledIds = new Set(members.map((m) => m.studentId))
    return students
      .filter(
        (student): student is User & { profileId: number } =>
          student.profileId != null && student.profileId > 0 && !enrolledIds.has(student.profileId),
      )
      .map((student) => ({
        value: String(student.profileId),
        label: `${student.displayName?.trim() || student.email || 'Student'} (Student ID: ${student.profileId})`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [members, students])

  const loadPage = useCallback(async () => {
    if (invalidGroup) {
      setError('Invalid group in URL.')
      setLoading(false)
      setGroup(null)
      setMembers([])
      return
    }
    setError(null)
    setLoading(true)
    try {
      const [groupDetail, memberList, studentList] = await Promise.all([
        getTrainingGroupById(groupId),
        getTrainingGroupMembers(groupId),
        getUsersByRole('STUDENT'),
      ])
      setGroup(groupDetail)
      setMembers(memberList)
      setStudents(studentList)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load group members')
      setGroup(null)
      setMembers([])
      setStudents([])
    } finally {
      setLoading(false)
    }
  }, [groupId, invalidGroup])

  useEffect(() => {
    void loadPage()
  }, [loadPage])

  function clearMessages() {
    setError(null)
    setSuccess(null)
  }

  function cancelAdd() {
    setShowAddForm(false)
    setAddStudentId('')
    setAddStartDate('')
    setAddEndDate('')
    setAddMemberMessage(null)
    setAddMemberError(null)
  }

  function cancelEdit() {
    setEditingStudentId(null)
    setEditStartDate('')
    setEditEndDate('')
  }

  async function handleAddMember(e: FormEvent) {
    e.preventDefault()
    if (!group) return
    if (!addStudentId || !addStartDate) {
      setAddMemberError('Student and start date are required.')
      setAddMemberMessage(null)
      return
    }
    clearMessages()
    setAddMemberMessage(null)
    setAddMemberError(null)
    setBusy(true)
    try {
      await addTrainingGroupMember(group.groupId, {
        studentId: Number(addStudentId),
        startDate: addStartDate,
        endDate: addEndDate || null,
      })
      setAddStudentId('')
      setAddStartDate('')
      setAddEndDate('')
      setAddMemberMessage(null)
      setSuccess('Member added.')
      await loadPage()
    } catch (err) {
      setAddMemberError(err instanceof Error ? err.message : 'Add member failed')
    } finally {
      setBusy(false)
    }
  }

  function beginEdit(member: TrainingGroupMember) {
    setEditingStudentId(member.studentId)
    setEditStartDate(toHtmlDateInputValue(member.startDate))
    setEditEndDate(toHtmlDateInputValue(member.endDate))
  }

  async function saveEdit(studentId: number) {
    if (!group) return
    clearMessages()
    setBusy(true)
    try {
      await updateTrainingGroupMember(group.groupId, studentId, {
        startDate: editStartDate || undefined,
        endDate: editEndDate || null,
      })
      setSuccess('Membership updated.')
      cancelEdit()
      await loadPage()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update membership failed')
    } finally {
      setBusy(false)
    }
  }

  async function removeMember(studentId: number) {
    if (!group) return
    if (!window.confirm(`Remove student #${studentId} from this group?`)) return
    clearMessages()
    setBusy(true)
    try {
      await removeTrainingGroupMember(group.groupId, studentId)
      setSuccess('Member removed.')
      if (editingStudentId === studentId) {
        cancelEdit()
      }
      await loadPage()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Remove member failed')
    } finally {
      setBusy(false)
    }
  }

  function handleBack() {
    navigate(GROUPS_ROOT, { state: { selectedGroupId: group?.groupId ?? groupId } })
  }

  function toggleAddForm() {
    setShowAddForm((v) => !v)
    setAddMemberMessage(null)
    setAddMemberError(null)
  }

  return {
    groupId,
    invalidGroup,
    group,
    members,
    loading,
    busy,
    error,
    success,
    showAddForm,
    setShowAddForm,
    addMemberMessage,
    setAddMemberMessage,
    addMemberError,
    setAddMemberError,
    addStudentId,
    setAddStudentId,
    addStartDate,
    setAddStartDate,
    addEndDate,
    setAddEndDate,
    showActiveOnly,
    setShowActiveOnly,
    displayedMembers,
    availableStudentOptions,
    studentMap,
    students,
    editingStudentId,
    editStartDate,
    setEditStartDate,
    editEndDate,
    setEditEndDate,
    clearMessages,
    cancelAdd,
    cancelEdit,
    handleAddMember,
    beginEdit,
    saveEdit,
    removeMember,
    handleBack,
    toggleAddForm,
  }
}
