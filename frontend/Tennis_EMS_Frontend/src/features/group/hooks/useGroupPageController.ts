import { useState, type FormEvent } from 'react'
import {
  type TrainingGroup,
} from '../../../api/trainingGroupApi'
import { deleteGroupById, useGroupActions } from './useGroupActions'
import { useGroupForm } from './useGroupForm'
import { useGroupListState, type ActiveFilter } from './useGroupListState'

export type PanelMode = null | 'create' | 'edit'
export type { ActiveFilter }

export function useGroupPageController() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [panelMode, setPanelMode] = useState<PanelMode>(null)
  const [panelDetailLoading, setPanelDetailLoading] = useState(false)
  const listState = useGroupListState({ setError })

  function clearFeedback() {
    setError(null)
    setSuccess(null)
  }

  const formCtrl = useGroupForm({
    selectedGroupId: listState.selectedGroupId,
    loadGroupDetail: listState.loadGroupDetail,
  })

  function resetSelectionState() {
    listState.setSelectedGroupId(null)
    listState.setSelectedGroupDetail(null)
    listState.setMemberCount(null)
  }

  const actions = useGroupActions()

  function closePanel() {
    setPanelMode(null)
    setPanelDetailLoading(false)
  }

  function openCreatePanel() {
    clearFeedback()
    setPanelMode('create')
    setPanelDetailLoading(false)
    formCtrl.resetForm()
  }

  async function openEditPanel() {
    if (!listState.selectedGroup) return
    clearFeedback()
    setPanelMode('edit')
    setPanelDetailLoading(true)
    try {
      const detail = await formCtrl.hydrateFromEditGroup(listState.selectedGroup)
      if (!detail) {
        setError('Could not load group details for editing.')
      }
    } finally {
      setPanelDetailLoading(false)
    }
  }

  async function submitCreate(e: FormEvent) {
    e.preventDefault()
    clearFeedback()
    setBusy(true)
    try {
      const created = await formCtrl.submitCreate()
      setSuccess('Group created.')
      listState.setSelectedGroupId(created.groupId)
      listState.setSelectedGroupDetail(created)
      formCtrl.resetForm()
      await listState.loadGroups()
      closePanel()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setBusy(false)
    }
  }

  async function submitUpdate(e: FormEvent) {
    e.preventDefault()
    clearFeedback()
    setBusy(true)
    try {
      const updated = await formCtrl.submitUpdate()
      setSuccess('Group updated.')
      listState.setSelectedGroupId(updated.groupId)
      listState.setSelectedGroupDetail(updated)
      await listState.loadGroups()
      closePanel()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleDeleteGroup() {
    const selectedGroupId = listState.selectedGroupId
    if (selectedGroupId == null) return
    if (!window.confirm('Delete this group? This cannot be undone.')) return
    clearFeedback()
    setBusy(true)
    try {
      await deleteGroupById(selectedGroupId)
      setSuccess('Group deleted.')
      resetSelectionState()
      await listState.loadGroups()
      closePanel()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  function selectGroup(group: TrainingGroup) {
    closePanel()
    clearFeedback()
    listState.setSelectedGroupId(group.groupId)
    void listState.loadGroupDetail(group.groupId)
  }

  function hoverGroupEnter(groupId: number) {
    listState.setHoveredGroupId(groupId)
  }

  function hoverGroupLeave() {
    listState.setHoveredGroupId(null)
  }

  const flags = {
    isEditDisabled: listState.selectedGroupId == null || busy || panelDetailLoading || listState.loading,
    isDeleteDisabled: listState.selectedGroupId == null || busy || listState.loading,
    isViewMembersDisabled: listState.selectedGroupId == null || busy || listState.loading,
    panelOpen: panelMode !== null || !!listState.selectedGroupDetail || !!listState.selectedGroup,
  }

  return {
    list: {
      groups: listState.groups,
      loading: listState.loading,
      typeFilter: listState.typeFilter,
      setTypeFilter: listState.setTypeFilter,
      activeFilter: listState.activeFilter,
      setActiveFilter: listState.setActiveFilter,
      selectedGroupId: listState.selectedGroupId,
      selectedGroup: listState.selectedGroup,
      displayGroup: listState.selectedGroupDetail ?? listState.selectedGroup,
      memberCount: listState.memberCount,
      hoveredGroupId: listState.hoveredGroupId,
    },
    form: {
      model: formCtrl.form,
      setForm: formCtrl.setForm,
      panelMode,
      panelDetailLoading,
      openCreatePanel,
      openEditPanel,
      closePanel,
      submitCreate,
      submitUpdate,
    },
    feedback: {
      busy,
      error,
      success,
      clear: clearFeedback,
    },
    actions: {
      selectGroup,
      hoverGroupEnter,
      hoverGroupLeave,
      viewMembers: actions.handleViewMembers,
      deleteGroup: handleDeleteGroup,
    },
    flags,
  }
}

