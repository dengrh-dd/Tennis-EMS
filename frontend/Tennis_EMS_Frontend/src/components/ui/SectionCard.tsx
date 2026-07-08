import type { CSSProperties, ReactNode } from 'react'
import { panelBodyStyle } from './panelShellStyles'
import { uiSectionLabelStyle, uiSpace } from './uiTokens'

type Props = {
  /** Small caps label above the block (optional). */
  label?: string
  children: ReactNode
  marginBottom?: number
  style?: CSSProperties
  contentStyle?: CSSProperties
}

/**
 * Subsection panel — lighter than `PanelCard`, for grouping within a page (e.g. student courses).
 */
export default function SectionCard({
  label,
  children,
  marginBottom = uiSpace.lg,
  style,
  contentStyle,
}: Props) {
  return (
    <section
      style={{
        ...panelBodyStyle,
        padding: uiSpace.lg,
        marginBottom,
        boxSizing: 'border-box',
        width: '100%',
        minWidth: 0,
        ...style,
      }}
    >
      {label?.trim() ? <h2 style={uiSectionLabelStyle}>{label.trim()}</h2> : null}
      <div style={{ ...contentStyle }}>{children}</div>
    </section>
  )
}
