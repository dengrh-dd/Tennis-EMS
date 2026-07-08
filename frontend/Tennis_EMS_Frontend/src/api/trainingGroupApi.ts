import { apiDelete, apiGet, apiPost, apiPut } from './client'

const BASE = '/api/training-groups'

export const TRAINING_GROUP_TYPES = ['TRAINING_GROUP', 'CLASS_GROUP', 'CLUB_TEAM'] as const
export type TrainingGroupType = (typeof TRAINING_GROUP_TYPES)[number]

export type TrainingGroup = {
  groupId: number
  name: string | null
  groupType: TrainingGroupType | null
  description: string | null
  isActive: boolean | null
}

export type CreateTrainingGroupRequest = {
  name: string
  groupType: TrainingGroupType
  description?: string | null
  isActive?: boolean
}

export type UpdateTrainingGroupRequest = {
  name?: string
  groupType?: TrainingGroupType
  description?: string | null
  isActive?: boolean
}

export type TrainingGroupMember = {
  groupId: number
  studentId: number
  startDate: string | null
  endDate: string | null
  /** Present on `GET /api/training-groups/student/{studentId}` responses. */
  active?: boolean | null
}

export type AddTrainingGroupMemberRequest = {
  studentId: number
  startDate: string
  endDate?: string | null
}

export type UpdateTrainingGroupMemberRequest = {
  startDate?: string
  endDate?: string | null
}

export async function getAllTrainingGroups(): Promise<TrainingGroup[]> {
  return apiGet<TrainingGroup[]>(BASE)
}

export async function getActiveTrainingGroups(): Promise<TrainingGroup[]> {
  return apiGet<TrainingGroup[]>(`${BASE}/active`)
}

export async function getTrainingGroupsByType(groupType: TrainingGroupType): Promise<TrainingGroup[]> {
  return apiGet<TrainingGroup[]>(`${BASE}/type/${groupType}`)
}

export async function getTrainingGroupById(id: number): Promise<TrainingGroup> {
  return apiGet<TrainingGroup>(`${BASE}/${id}`)
}

export async function createTrainingGroup(payload: CreateTrainingGroupRequest): Promise<TrainingGroup> {
  return apiPost<TrainingGroup>(BASE, payload)
}

export async function updateTrainingGroup(
  id: number,
  payload: UpdateTrainingGroupRequest
): Promise<TrainingGroup> {
  return apiPut<TrainingGroup>(`${BASE}/${id}`, payload)
}

export async function deleteTrainingGroup(id: number): Promise<void> {
  return apiDelete<void>(`${BASE}/${id}`)
}

export async function getTrainingGroupMembers(groupId: number): Promise<TrainingGroupMember[]> {
  return apiGet<TrainingGroupMember[]>(`${BASE}/${groupId}/members`)
}

export async function getActiveTrainingGroupMembers(groupId: number): Promise<TrainingGroupMember[]> {
  return apiGet<TrainingGroupMember[]>(`${BASE}/${groupId}/members/active`)
}

/** Membership rows for one student (staff or the student themself). */
export async function getMembershipsByStudent(studentId: number): Promise<TrainingGroupMember[]> {
  return apiGet<TrainingGroupMember[]>(`${BASE}/student/${studentId}`)
}

export async function addTrainingGroupMember(
  groupId: number,
  payload: AddTrainingGroupMemberRequest
): Promise<TrainingGroupMember> {
  return apiPost<TrainingGroupMember>(`${BASE}/${groupId}/members`, payload)
}

export async function updateTrainingGroupMember(
  groupId: number,
  studentId: number,
  payload: UpdateTrainingGroupMemberRequest
): Promise<TrainingGroupMember> {
  return apiPut<TrainingGroupMember>(`${BASE}/${groupId}/members/${studentId}`, payload)
}

export async function removeTrainingGroupMember(groupId: number, studentId: number): Promise<void> {
  return apiDelete<void>(`${BASE}/${groupId}/members/${studentId}`)
}
