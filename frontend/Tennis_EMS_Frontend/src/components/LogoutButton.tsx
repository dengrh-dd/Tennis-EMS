import type { CSSProperties } from 'react'
import { useState } from 'react'
import { logout } from '../auth/authApi'

const toolbarStyle: CSSProperties = {
  marginLeft: 'auto',
  padding: '6px 14px',
  cursor: 'pointer',
}

const sidebarStyle: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  cursor: 'pointer',
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  background: '#ffffff',
  color: '#334155',
  fontWeight: 500,
}

type LogoutButtonProps = {
  /** `toolbar`: top header. `sidebar`: full-width control in the role sidebar. */
  variant?: 'toolbar' | 'sidebar'
}

export default function LogoutButton({ variant = 'toolbar' }: LogoutButtonProps) {
  const [loggingOut, setLoggingOut] = useState(false)
  const baseStyle = variant === 'sidebar' ? sidebarStyle : toolbarStyle

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
    } catch (e) {
      console.debug('[Auth] logout request failed', e)
    } finally {
      window.location.replace('/login')
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      style={{
        ...baseStyle,
        cursor: loggingOut ? 'wait' : baseStyle.cursor,
      }}
    >
      {loggingOut ? 'Signing out…' : 'Logout'}
    </button>
  )
}
