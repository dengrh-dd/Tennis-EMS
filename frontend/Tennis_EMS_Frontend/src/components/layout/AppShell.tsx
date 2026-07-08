import type { CSSProperties, ReactNode } from 'react'
import { uiColors } from '../ui/uiPrimitives'

const shellStyle: CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  background: uiColors.surfaceMuted,
}

/** Consistent inset for all app roles (sidebar remains flush; main content breathes). */
const mainStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: uiColors.surfaceMuted,
  color: uiColors.text,
  boxSizing: 'border-box',
  padding: '28px 24px 32px',
}

type AppShellProps = {
  sidebar: ReactNode
  children: ReactNode
}

/**
 * Role-agnostic EMS shell: left sidebar + main column.
 * Admin, Coach, Student share this frame; navigation differs by sidebar content.
 */
export default function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <div style={shellStyle}>
      {sidebar}
      <main style={mainStyle}>{children}</main>
    </div>
  )
}
