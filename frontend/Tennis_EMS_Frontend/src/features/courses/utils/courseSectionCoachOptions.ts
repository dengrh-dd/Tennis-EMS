import type { User } from '../../../api/userApi'

export type CoachSelectOption = { value: string; label: string }

export function coachOptionsFromUsers(users: User[]): CoachSelectOption[] {
  return users
    .filter((u) => u.profileId != null && u.profileId > 0)
    .map((u) => {
      const pid = u.profileId as number
      const name = u.displayName?.trim() || u.email || 'Coach'
      return {
        value: String(pid),
        label: `${name} (Coach ID: ${pid})`,
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label))
}

/** Ensures the current edit coach id appears in the list when unlisted. */
export function withUnlistedCoachOption(
  base: CoachSelectOption[],
  editCoachId: string,
): CoachSelectOption[] {
  const out = [...base]
  if (editCoachId) {
    const has = out.some((o) => o.value === editCoachId)
    if (!has) {
      out.push({
        value: editCoachId,
        label: `Coach ID ${editCoachId} (unlisted)`,
      })
    }
  }
  return out.sort((a, b) => a.label.localeCompare(b.label))
}
