import { Outlet, useOutletContext } from 'react-router-dom'
import AppSidebar from './AppSidebar'
import AppShell from './AppShell'
import { emsContentShellStyle } from '../../features/dashboard/styles/dashboardPrimitives'
import { ROLE_NAV_ARIA_LABEL, ROLE_NAV_ITEMS, ROLE_SIDEBAR_LABEL } from './roleNav'
import type { AppOutletContext } from '../../routes/outletContext'

/**
 * Shared EMS layout: `AppShell` + role-based sidebar from `roleNav` + main `Outlet`.
 * Student views use the shared content shell width; coach/management routes control width in page shells.
 */
export default function AppLayout() {
  const ctx = useOutletContext<AppOutletContext>()
  const { user } = ctx
  const role = user.role
  const items = ROLE_NAV_ITEMS[role]
  const sidebar = (
    <AppSidebar
      roleLabel={ROLE_SIDEBAR_LABEL[role]}
      items={items}
      navAriaLabel={ROLE_NAV_ARIA_LABEL[role]}
    />
  )

  const wrapConstrained = role === 'STUDENT'

  return (
    <AppShell sidebar={sidebar}>
      {wrapConstrained ? (
        <div style={emsContentShellStyle}>
          <Outlet context={ctx} />
        </div>
      ) : (
        <Outlet context={ctx} />
      )}
    </AppShell>
  )
}
