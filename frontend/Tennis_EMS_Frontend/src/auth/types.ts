export type Role = 'ADMIN' | 'COACH' | 'STUDENT'

export type CurrentUser = {
  userId: number
  email: string
  role: Role
  profileId: number | null
  displayName: string | null
}