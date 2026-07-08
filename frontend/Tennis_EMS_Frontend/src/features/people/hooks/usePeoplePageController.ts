import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUsersByRole,
  updateUser,
  type CreateUserRequest,
  type User,
  type UserRole,
} from '../../../api/userApi'
import { ROLE_FILTER_ALL, type RoleFilterValue } from '../components/UserRoleFilter'

export type PanelMode = null | 'create' | 'edit'

function buildCreateUserRequest(
  role: UserRole,
  fields: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    adminLevel: string
    dateOfBirth: string
    certification: string
    experienceYears: string
    bio: string
    preferredName: string
    skillLevel: string
    notes: string
    emergencyContactName: string
    emergencyContactPhone: string
  },
): CreateUserRequest {
  const base = {
    email: fields.email.trim(),
    password: fields.password,
    role,
    firstName: fields.firstName.trim(),
    lastName: fields.lastName.trim(),
  }
  const phoneTrim = fields.phone.trim()
  const phone = phoneTrim === '' ? undefined : phoneTrim

  if (role === 'ADMIN') {
    return {
      ...base,
      phone,
      adminLevel: fields.adminLevel,
    }
  }
  if (role === 'COACH') {
    const ey = fields.experienceYears.trim()
    const parsed = ey === '' ? NaN : Number.parseInt(ey, 10)
    const experienceYears = Number.isFinite(parsed) ? parsed : undefined
    return {
      ...base,
      phone,
      dateOfBirth: fields.dateOfBirth || undefined,
      certification: fields.certification.trim() || undefined,
      experienceYears,
      bio: fields.bio.trim() || undefined,
    }
  }
  return {
    ...base,
    phone,
    preferredName: fields.preferredName.trim() || undefined,
    dateOfBirth: fields.dateOfBirth || undefined,
    skillLevel: fields.skillLevel,
    notes: fields.notes.trim() || undefined,
    emergencyContactName: fields.emergencyContactName.trim() || undefined,
    emergencyContactPhone: fields.emergencyContactPhone.trim() || undefined,
  }
}

export function usePeoplePageController() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [roleFilter, setRoleFilter] = useState<RoleFilterValue>(ROLE_FILTER_ALL)
  /** Only first list load toggles page `loading`; role filter refetches stay section-level (silent). */
  const isFirstUsersFetch = useRef(true)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null)

  const [panelMode, setPanelMode] = useState<PanelMode>(null)
  const [panelDetailLoading, setPanelDetailLoading] = useState(false)
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('STUDENT')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [adminLevel, setAdminLevel] = useState('STANDARD')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [certification, setCertification] = useState('')
  const [experienceYears, setExperienceYears] = useState('')
  const [bio, setBio] = useState('')
  const [preferredName, setPreferredName] = useState('')
  const [skillLevel, setSkillLevel] = useState('BEGINNER')
  const [notes, setNotes] = useState('')
  const [emergencyContactName, setEmergencyContactName] = useState('')
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('')

  const [editEmail, setEditEmail] = useState('')
  const [editIsActive, setEditIsActive] = useState(true)

  const selectedUser = useMemo(
    () =>
      selectedUserId == null ? null : users.find((u) => u.userId === selectedUserId) ?? selectedUserDetail,
    [users, selectedUserId, selectedUserDetail],
  )

  const loadUsers = useCallback(async () => {
    setError(null)
    const showPageLevelLoading = isFirstUsersFetch.current
    if (showPageLevelLoading) {
      setLoading(true)
    }
    try {
      const list = roleFilter === ROLE_FILTER_ALL ? await getAllUsers() : await getUsersByRole(roleFilter)
      setUsers(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users')
      setUsers([])
    } finally {
      if (showPageLevelLoading) {
        setLoading(false)
      }
      isFirstUsersFetch.current = false
    }
  }, [roleFilter])

  useEffect(() => {
    void loadUsers()
  }, [loadUsers])

  useEffect(() => {
    if (users.length === 0) {
      setSelectedUserId(null)
      setSelectedUserDetail(null)
      return
    }

    if (selectedUserId == null) {
      setSelectedUserId(users[0].userId)
      setSelectedUserDetail(users[0])
      return
    }

    const stillInList = users.some((u) => u.userId === selectedUserId)
    if (!stillInList) {
      setSelectedUserId(users[0].userId)
      setSelectedUserDetail(users[0])
    } else if (!selectedUserDetail || selectedUserDetail.userId !== selectedUserId) {
      setSelectedUserDetail(users.find((u) => u.userId === selectedUserId) ?? null)
    }
  }, [users, selectedUserId, selectedUserDetail])

  function clearMessages() {
    setError(null)
    setSuccess(null)
  }

  function resetCreateForm() {
    setEmail('')
    setPassword('')
    setRole('STUDENT')
    setFirstName('')
    setLastName('')
    setPhone('')
    setAdminLevel('STANDARD')
    setDateOfBirth('')
    setCertification('')
    setExperienceYears('')
    setBio('')
    setPreferredName('')
    setSkillLevel('BEGINNER')
    setNotes('')
    setEmergencyContactName('')
    setEmergencyContactPhone('')
  }

  function handleCreateRoleChange(next: UserRole) {
    setRole(next)
    if (next === 'ADMIN') {
      setDateOfBirth('')
      setCertification('')
      setExperienceYears('')
      setBio('')
      setPreferredName('')
      setSkillLevel('BEGINNER')
      setNotes('')
      setEmergencyContactName('')
      setEmergencyContactPhone('')
      setAdminLevel('STANDARD')
      return
    }
    if (next === 'COACH') {
      setAdminLevel('STANDARD')
      setPreferredName('')
      setSkillLevel('BEGINNER')
      setNotes('')
      setEmergencyContactName('')
      setEmergencyContactPhone('')
      setCertification('')
      setExperienceYears('')
      setBio('')
      return
    }
    setAdminLevel('STANDARD')
    setCertification('')
    setExperienceYears('')
    setBio('')
  }

  function handleClosePanel() {
    setPanelMode(null)
    setPanelDetailLoading(false)
    clearMessages()
  }

  async function loadUserDetail(userId: number) {
    try {
      const detail = await getUserById(userId)
      setSelectedUserDetail(detail)
      return detail
    } catch {
      setSelectedUserDetail(null)
      return null
    }
  }

  function handleSelectUser(u: User) {
    setPanelMode(null)
    setSelectedUserId(u.userId)
    void loadUserDetail(u.userId)
  }

  const handleHoverUser = useCallback((userId: number) => {
    setHoveredUserId(userId)
  }, [])

  const handleLeaveUser = useCallback(() => {
    setHoveredUserId(null)
  }, [])

  async function startEditFromUser(u: User) {
    clearMessages()
    setPanelDetailLoading(true)
    setEditEmail(u.email ?? '')
    setEditIsActive(u.isActive !== false)

    try {
      const detail = await getUserById(u.userId)
      setEditEmail(detail.email ?? '')
      setEditIsActive(detail.isActive !== false)
    } catch {
      setError('Could not load user details for editing.')
    } finally {
      setPanelDetailLoading(false)
    }
  }

  function openCreatePanel() {
    clearMessages()
    setPanelMode('create')
    setPanelDetailLoading(false)
    resetCreateForm()
  }

  function openEditPanel() {
    if (!selectedUser) return
    clearMessages()
    setPanelMode('edit')
    void startEditFromUser(selectedUser)
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    clearMessages()
    setBusy(true)
    try {
      const payload = buildCreateUserRequest(role, {
        email,
        password,
        firstName,
        lastName,
        phone,
        adminLevel,
        dateOfBirth,
        certification,
        experienceYears,
        bio,
        preferredName,
        skillLevel,
        notes,
        emergencyContactName,
        emergencyContactPhone,
      })
      const created = await createUser(payload)

      setSuccess('User created.')
      setSelectedUserId(created.userId)
      setSelectedUserDetail(created)
      resetCreateForm()
      try {
        await loadUsers()
      } catch {
        setUsers((prev) => {
          if (prev.some((u) => u.userId === created.userId)) return prev
          return [created, ...prev]
        })
        setSuccess('User created. The list could not be refreshed; showing the new user locally.')
      }
      setPanelMode(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault()
    clearMessages()
    const id = selectedUserId
    if (!id) {
      setError('No user selected.')
      return
    }

    setBusy(true)
    try {
      const updated = await updateUser(id, {
        email: editEmail.trim() || undefined,
        isActive: editIsActive,
      })

      setSuccess('User updated.')
      setSelectedUserId(updated.userId)
      setSelectedUserDetail(updated)
      await loadUsers()
      setPanelMode(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (selectedUserId == null) return
    if (!window.confirm('Delete this user? This cannot be undone.')) return

    clearMessages()
    setBusy(true)
    const deletedId = selectedUserId
    try {
      await deleteUser(deletedId)
      setSuccess('User deleted.')
      setSelectedUserId(null)
      setSelectedUserDetail(null)
      await loadUsers()
      setPanelMode(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  const isEditDisabled = selectedUserId == null || busy || panelDetailLoading || loading
  const isDeleteDisabled = selectedUserId == null || busy || loading
  const panelOpen = true
  const displayUser = selectedUserDetail ?? selectedUser

  return {
    users,
    loading,
    busy,
    error,
    success,
    roleFilter,
    setRoleFilter,
    selectedUserId,
    setSelectedUserId,
    selectedUser,
    panelMode,
    setPanelMode,
    panelDetailLoading,
    hoveredUserId,
    handleHoverUser,
    handleLeaveUser,
    email,
    setEmail,
    password,
    setPassword,
    role,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    adminLevel,
    setAdminLevel,
    dateOfBirth,
    setDateOfBirth,
    certification,
    setCertification,
    experienceYears,
    setExperienceYears,
    bio,
    setBio,
    preferredName,
    setPreferredName,
    skillLevel,
    setSkillLevel,
    notes,
    setNotes,
    emergencyContactName,
    setEmergencyContactName,
    emergencyContactPhone,
    setEmergencyContactPhone,
    editEmail,
    setEditEmail,
    editIsActive,
    setEditIsActive,
    handleCreateRoleChange,
    handleClosePanel,
    loadUserDetail,
    handleSelectUser,
    openCreatePanel,
    openEditPanel,
    handleCreate,
    handleUpdate,
    handleDelete,
    isEditDisabled,
    isDeleteDisabled,
    panelOpen,
    displayUser,
  }
}

