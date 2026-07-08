import type { CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import LogoutButton from '../LogoutButton'
import './appSidebar.css'

export type AppSidebarNavItem = {
  to: string
  label: string
  /**
   * When set, this item is active when the pathname matches this segment exactly or a deeper path
   * under it (e.g. `/courses` + `/courses/12/sections`).
   * When omitted, only an exact match on `to` counts (e.g. dashboard roots).
   */
  activePrefix?: string
}

const sidebarStyle: CSSProperties = {
  width: 232,
  borderRight: '1px solid #e2e8f0',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: '#f8fafc',
  color: '#0f172a',
}

const headerStyle: CSSProperties = {
  padding: '20px 18px 12px',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
  color: '#64748b',
}

const navStyle: CSSProperties = {
  padding: '8px 12px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
}

const logoutWrapStyle: CSSProperties = {
  marginTop: 'auto',
  padding: '14px 12px 18px',
  borderTop: '1px solid #e2e8f0',
}

type AppSidebarProps = {
  roleLabel: string
  items: AppSidebarNavItem[]
  navAriaLabel: string
}

/** Normalize so `/student` and `/student/` behave the same. */
function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.replace(/\/+$/, '') || '/'
  }
  return pathname
}

function isItemActive(normalizedPath: string, item: AppSidebarNavItem): boolean {
  const to = normalizePathname(item.to)
  if (item.activePrefix) {
    const prefix = normalizePathname(item.activePrefix)
    return normalizedPath === prefix || normalizedPath.startsWith(prefix + '/')
  }
  return normalizedPath === to
}

/**
 * Pick the single best-matching nav item so only one row shows active styling.
 * More specific (longer matching prefix / path) wins over generic roots.
 */
function resolveActiveNavItemIndex(
  normalizedPath: string,
  items: AppSidebarNavItem[],
): number {
  let bestIndex = -1
  let bestScore = -1

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (!isItemActive(normalizedPath, item)) continue

    let score: number
    if (item.activePrefix) {
      const prefix = normalizePathname(item.activePrefix)
      score = normalizedPath === prefix ? 1000 + prefix.length : 500 + prefix.length
    } else {
      score = normalizePathname(item.to).length
    }

    if (score > bestScore) {
      bestScore = score
      bestIndex = i
    }
  }

  return bestIndex
}

export default function AppSidebar({ roleLabel, items, navAriaLabel }: AppSidebarProps) {
  const location = useLocation()
  const normalizedPath = normalizePathname(location.pathname)
  const activeIndex = resolveActiveNavItemIndex(normalizedPath, items)

  return (
    <aside style={sidebarStyle}>
      <div style={headerStyle}>{roleLabel}</div>
      <nav style={navStyle} aria-label={navAriaLabel}>
        {items.map((item, index) => {
          const isActive = index === activeIndex
          return (
            <Link
              key={item.to}
              to={item.to}
              className={['app-sidebar-nav-link', isActive ? 'app-sidebar-nav-link--active' : '']
                .filter(Boolean)
                .join(' ')}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div style={logoutWrapStyle}>
        <LogoutButton variant="sidebar" />
      </div>
    </aside>
  )
}
