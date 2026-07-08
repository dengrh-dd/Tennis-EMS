import type { CSSProperties } from 'react'
import type { User } from '../../../api/userApi'
import { uiInsetPanelStyle } from '../../../components/ui/uiPrimitives'
import { uiFontSize, uiSpace, uiText } from '../../../components/ui/uiTokens'

type Props = {
  user: User
}

const rowStyle: CSSProperties = {
  display: 'flex',
  gap: uiSpace.sm,
  marginBottom: uiSpace.sm,
  fontSize: uiFontSize.body,
  color: uiText.heading,
}

const labelStyle: CSSProperties = {
  color: uiText.subtle,
  fontWeight: 500,
  minWidth: 90,
}

export default function UserDetailCard({ user }: Props) {
  const displayName = user.displayName ?? user.email ?? `User #${user.userId}`
  return (
    <div style={uiInsetPanelStyle}>
      <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600, color: uiText.heading }}>User details</h3>
      <div style={rowStyle}>
        <span style={labelStyle}>ID</span>
        <span>{user.userId}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Name</span>
        <span>{displayName}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Email</span>
        <span>{user.email ?? '—'}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Role</span>
        <span>{user.role ?? '—'}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Status</span>
        <span>{user.isActive === true ? 'Active' : user.isActive === false ? 'Inactive' : '—'}</span>
      </div>
    </div>
  )
}
