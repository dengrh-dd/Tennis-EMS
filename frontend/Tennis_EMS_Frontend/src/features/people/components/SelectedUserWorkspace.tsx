import type { User } from '../../../api/userApi'
import EmptyState from '../../../components/ui/EmptyState'
import CoachUserInsights from './CoachUserInsights'
import StudentUserInsights from './StudentUserInsights'
import UserDetailCard from './UserDetailCard'
import UserDetailPanel from './UserDetailPanel'

type Props = {
  user: User | null
  loading: boolean
  onEdit: () => void
  editDisabled?: boolean
}

/**
 * Composes read-only user detail and role-specific insights for the People side column.
 */
export default function SelectedUserWorkspace({ user, loading, onEdit, editDisabled }: Props) {
  if (user) {
    return (
      <UserDetailPanel
        title={user.displayName ?? user.email ?? `User #${user.userId}`}
        onEdit={onEdit}
        editDisabled={editDisabled}
      >
        <UserDetailCard user={user} />
        {user.role === 'STUDENT' && <StudentUserInsights userId={user.userId} />}
        {user.role === 'COACH' && <CoachUserInsights userId={user.userId} />}
      </UserDetailPanel>
    )
  }

  if (!loading) {
    return <EmptyState style={{ marginTop: 0 }} message="Select a user or create one." />
  }

  return null
}
