import type { CSSProperties, ReactNode } from 'react'
import { panelBodyStyle } from './panelShellStyles'
import { uiHeadingStyle, uiLayout, uiSpace, uiSubtitleStyle } from './uiTokens'

type Props = {
  title?: string
  subtitle?: string
  rightActions?: ReactNode
  children: ReactNode
  marginBottom?: number
  style?: CSSProperties
}

/**
 * Bordered panel matching drill-down cards (courses, lists).
 */
export default function PanelCard({
  title,
  subtitle,
  rightActions,
  children,
  marginBottom = uiSpace.mdLg,
  style,
}: Props) {
  const showHeaderRow = Boolean(title?.trim() || subtitle?.trim() || rightActions)

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
      {showHeaderRow && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: uiSpace.stack,
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: uiSpace.md,
          }}
        >
          <div style={{ minWidth: 0, flex: `1 1 ${uiLayout.responsiveActionsMinWidth}px` }}>
            {title?.trim() ? <h3 style={uiHeadingStyle}>{title}</h3> : null}
            {subtitle?.trim() ? <p style={uiSubtitleStyle}>{subtitle}</p> : null}
          </div>
          {rightActions != null ? <div style={{ flex: '0 0 auto' }}>{rightActions}</div> : null}
        </div>
      )}
      {children}
    </section>
  )
}
