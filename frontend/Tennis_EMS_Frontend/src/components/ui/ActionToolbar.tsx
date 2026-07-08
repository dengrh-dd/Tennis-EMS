import type { ReactNode } from 'react'
import {
  actionToolbarActionClusterStyle,
  actionToolbarActionsOuterStyle,
  actionToolbarButtonGroupStyle,
  actionToolbarFiltersRailStyle,
  actionToolbarInnerRowStyle,
  actionToolbarSplitFiltersRowStyle,
  actionToolbarSplitOuterStyle,
  actionToolbarSplitTopRowStyle,
  actionToolbarStyle,
  actionToolbarTitleStyle,
} from '../layout/drillDownLayout'

type Props = {
  title: string
  /** Primary buttons (Create / Save / etc.). */
  actions: ReactNode
  /**
   * When set, renders a two-row toolbar: row 1 = title + actions, row 2 = filters (full width).
   * When omitted, single row: title left, `actions` right (course drill-downs).
   */
  filters?: ReactNode
}

/**
 * Bordered toolbar for management pages.
 * With `filters`, stacks title/actions above a full-width filter band.
 */
export default function ActionToolbar({ title, actions, filters }: Props) {
  const split = filters != null

  return (
    <div style={split ? { ...actionToolbarStyle, ...actionToolbarSplitOuterStyle } : actionToolbarStyle}>
      {split ? (
        <>
          <div style={actionToolbarSplitTopRowStyle}>
            <div style={{ minWidth: 0, flex: '1 1 auto' }}>
              <div style={actionToolbarTitleStyle}>{title}</div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <div style={actionToolbarActionClusterStyle}>{actions}</div>
            </div>
          </div>
          <div style={actionToolbarSplitFiltersRowStyle}>
            <div style={actionToolbarFiltersRailStyle}>{filters}</div>
          </div>
        </>
      ) : (
        <div style={actionToolbarInnerRowStyle}>
          <div style={{ minWidth: 0, flex: '0 1 auto' }}>
            <div style={actionToolbarTitleStyle}>{title}</div>
          </div>
          <div style={actionToolbarActionsOuterStyle}>
            <div style={actionToolbarButtonGroupStyle}>{actions}</div>
          </div>
        </div>
      )}
    </div>
  )
}
