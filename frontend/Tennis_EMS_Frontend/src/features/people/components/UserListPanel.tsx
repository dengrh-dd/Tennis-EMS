import type { User } from '../../../api/userApi'
import EmptyState from '../../../components/ui/EmptyState'
import { uiEmptyStateInSelectableListStyle } from '../../../components/ui/uiPrimitives'
import SelectableListShell from '../../../components/ui/SelectableListShell'
import UserRowItem from './UserRowItem'

type Props = {
  users: User[]
  loading: boolean
  selectedUserId: number | null
  hoveredUserId: number | null
  onSelectUser: (user: User) => void
  onHoverUser: (userId: number) => void
  onLeaveUser: () => void
}

export default function UserListPanel({
  users,
  loading,
  selectedUserId,
  hoveredUserId,
  onSelectUser,
  onHoverUser,
  onLeaveUser,
}: Props) {
  return (
    <SelectableListShell>
      {!loading && users.length === 0 && (
        <EmptyState style={uiEmptyStateInSelectableListStyle} message="No users found." />
      )}
      {users.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {users.map((u) => {
            const selected = u.userId === selectedUserId
            const hovered = u.userId === hoveredUserId
            return (
              <UserRowItem
                key={u.userId}
                user={u}
                selected={selected}
                hovered={hovered}
                onClick={() => onSelectUser(u)}
                onMouseEnter={() => onHoverUser(u.userId)}
                onMouseLeave={onLeaveUser}
              />
            )
          })}
        </ul>
      )}
    </SelectableListShell>
  )
}

