import type { User } from '../../../api/userApi'
import {
  uiSelectableListRowBaseStyle,
  uiSelectableListRowInsetStyle,
  uiSelectableListRowPrimaryTextStyle,
  uiSelectableListRowSecondaryAsideStyle,
  uiSelectableListRowSecondaryTextStyle,
  uiSelectableListRowSurface,
} from '../../../components/ui/uiPrimitives'
import { uiSpace } from '../../../components/ui/uiTokens'

type Props = {
  user: User
  selected: boolean
  hovered: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export default function UserRowItem({ user, selected, hovered, onClick, onMouseEnter, onMouseLeave }: Props) {
  const displayName = user.displayName ?? user.email ?? `User #${user.userId}`

  return (
    <li
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        ...uiSelectableListRowBaseStyle,
        ...uiSelectableListRowInsetStyle,
        ...uiSelectableListRowSurface(selected, hovered),
      }}
      aria-selected={selected}
    >
      <div
        style={{
          display: 'flex',
          gap: uiSpace.md,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: '1 1 240px', minWidth: 0 }}>
          <div
            style={{
              ...uiSelectableListRowPrimaryTextStyle,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {displayName}
          </div>
          <div style={uiSelectableListRowSecondaryTextStyle}>
            {user.email}
            <span style={uiSelectableListRowSecondaryAsideStyle}>
              {user.role ?? '—'}
              {user.isActive === false ? ' · Inactive' : ''}
            </span>
          </div>
        </div>
      </div>
    </li>
  )
}
