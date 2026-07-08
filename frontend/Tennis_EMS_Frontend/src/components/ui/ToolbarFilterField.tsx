import type { CSSProperties, ReactNode } from 'react'
import { uiToolbarFilterLabelStyle, uiToolbarFilterRowStyle } from './uiPrimitives'

type Props = {
  /** Visible label for the filter control. */
  label: string
  /** Typically a `select` or small custom control. */
  children: ReactNode
  /** Merged onto the root label row (e.g. Match page grid slot layout). */
  rootStyle?: CSSProperties
}

/**
 * Label + inline control for `ActionToolbar` filter rows (People / Group / Match).
 */
export default function ToolbarFilterField({ label, children, rootStyle }: Props) {
  return (
    <label style={{ ...uiToolbarFilterRowStyle, ...rootStyle }}>
      <span style={uiToolbarFilterLabelStyle}>{label}</span>
      {children}
    </label>
  )
}
