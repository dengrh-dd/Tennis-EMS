import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { TrainingGroup } from '../../../api/trainingGroupApi'
import { getTrainingGroupById, getTrainingGroupMembers } from '../../../api/trainingGroupApi'
import { GROUP_TYPE_FILTER_ALL, type GroupTypeFilterValue } from '../components/GroupTypeFilter'
import { getGroups } from '../services/groupService'

export type ActiveFilter = 'ALL' | 'ACTIVE_ONLY'

type LocationState = { selectedGroupId?: number } | null

type Props = {
  setError: (value: string | null) => void
}

export function useGroupListState({ setError }: Props) {
  const location = useLocation()
  const [groups, setGroups] = useState<TrainingGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<GroupTypeFilterValue>(GROUP_TYPE_FILTER_ALL)
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('ALL')
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [selectedGroupDetail, setSelectedGroupDetail] = useState<TrainingGroup | null>(null)
  const [memberCount, setMemberCount] = useState<number | null>(null)
  const [hoveredGroupId, setHoveredGroupId] = useState<number | null>(null)
  /** Only first list load toggles page `loading`; filter refetches stay section-level (silent). */
  const isFirstGroupsFetch = useRef(true)

  const selectedGroup = useMemo(
    () =>
      selectedGroupId == null
        ? null
        : groups.find((group) => group.groupId === selectedGroupId) ?? selectedGroupDetail,
    [groups, selectedGroupId, selectedGroupDetail],
  )

  const loadGroups = useCallback(async () => {
    setError(null)
    const showPageLevelLoading = isFirstGroupsFetch.current
    if (showPageLevelLoading) {
      setLoading(true)
    }
    try {
      const list = await getGroups({ typeFilter, activeFilter })
      setGroups(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load groups')
      setGroups([])
    } finally {
      if (showPageLevelLoading) {
        setLoading(false)
      }
      isFirstGroupsFetch.current = false
    }
  }, [activeFilter, setError, typeFilter])

  useEffect(() => {
    void loadGroups()
  }, [loadGroups])

  useEffect(() => {
    const state = location.state as LocationState
    if (state?.selectedGroupId != null && Number.isFinite(state.selectedGroupId)) {
      setSelectedGroupId(state.selectedGroupId)
    }
  }, [location.state])

  useEffect(() => {
    if (groups.length === 0) {
      if (loading) return
      setSelectedGroupId(null)
      setSelectedGroupDetail(null)
      setMemberCount(null)
      return
    }

    if (selectedGroupId == null) {
      setSelectedGroupId(groups[0].groupId)
      setSelectedGroupDetail(groups[0])
      return
    }

    const stillInList = groups.some((group) => group.groupId === selectedGroupId)
    if (!stillInList) {
      setSelectedGroupId(groups[0].groupId)
      setSelectedGroupDetail(groups[0])
    } else if (!selectedGroupDetail || selectedGroupDetail.groupId !== selectedGroupId) {
      setSelectedGroupDetail(groups.find((group) => group.groupId === selectedGroupId) ?? null)
    }
  }, [groups, loading, selectedGroupDetail, selectedGroupId])

  const loadGroupDetail = useCallback(async (groupId: number) => {
    try {
      const detail = await getTrainingGroupById(groupId)
      setSelectedGroupDetail(detail)
      return detail
    } catch {
      setSelectedGroupDetail(null)
      return null
    }
  }, [])

  const loadGroupMemberCount = useCallback(async (group: TrainingGroup | null) => {
    if (!group) {
      setMemberCount(null)
      return
    }
    try {
      const list = await getTrainingGroupMembers(group.groupId)
      setMemberCount(list.length)
    } catch {
      setMemberCount(null)
    }
  }, [])

  useEffect(() => {
    void loadGroupMemberCount(selectedGroup)
  }, [loadGroupMemberCount, selectedGroup])

  return {
    groups,
    loading,
    typeFilter,
    setTypeFilter,
    activeFilter,
    setActiveFilter,
    selectedGroupId,
    setSelectedGroupId,
    selectedGroup,
    selectedGroupDetail,
    setSelectedGroupDetail,
    memberCount,
    setMemberCount,
    hoveredGroupId,
    setHoveredGroupId,
    loadGroups,
    loadGroupDetail,
  }
}
