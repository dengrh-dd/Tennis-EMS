import { useOutletContext } from 'react-router-dom'
import type { AppOutletContext } from '../routes/outletContext'
import type { Permission } from './types'
import { roleHasPermission } from './rolePermissions'

/**
 * Permission checks for the authenticated area. Requires `AppOutletContext` from `ProtectedRoute`.
 */
export function usePermission() {
  const ctx = useOutletContext<AppOutletContext | null>()
  const role = ctx?.user.role

  function can(permission: Permission): boolean {
    if (!role) return false
    return roleHasPermission(role, permission)
  }

  return { can, role, user: ctx?.user ?? null }
}
