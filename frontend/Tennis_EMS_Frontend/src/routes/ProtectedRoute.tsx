import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { me } from '../auth/authApi'
import { roleHome } from '../auth/roleHome'
import type { CurrentUser, Role } from '../auth/types'
import type { AppOutletContext } from './outletContext'

export const ALLOW_ADMIN_COACH: Role[] = ['ADMIN', 'COACH']
export const ALLOW_COACH: Role[] = ['COACH']
export const ALLOW_STUDENT: Role[] = ['STUDENT']

type ProtectedRouteProps = {
  allowedRoles: readonly Role[]
}

/**
 * Ensures a session exists and the user role is allowed for this subtree.
 * Exposes `{ user }` via Outlet context for `AppLayout` and `usePermission`.
 */
export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const navigate = useNavigate()
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    me()
      .then((u) => {
        if (cancelled) return
        if (!allowedRoles.includes(u.role)) {
          navigate(roleHome(u.role), { replace: true })
          return
        }
        setUser(u)
      })
      .catch(() => {
        if (!cancelled) navigate('/login', { replace: true })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [allowedRoles, navigate])

  if (loading) {
    return (
      <div style={{ padding: 28, fontSize: 14, color: '#64748b', background: '#f1f5f9', minHeight: '100vh' }}>
        Loading…
      </div>
    )
  }

  if (!user) {
    return null
  }

  const context: AppOutletContext = { user }
  return <Outlet context={context} />
}
