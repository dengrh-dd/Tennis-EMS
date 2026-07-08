import type { ReactNode } from 'react'
import { drillDownOuterStyle, drillDownRowStyle } from './drillDownLayout'

type Props = {
  panelOpen: boolean
  children: ReactNode
}

/** Outer shell + centered row for drill-down pages; `panelOpen` widens the content max-width. */
export default function DrillDownPageShell({ panelOpen, children }: Props) {
  return (
    <div style={drillDownOuterStyle}>
      <div style={drillDownRowStyle(panelOpen)}>{children}</div>
    </div>
  )
}

