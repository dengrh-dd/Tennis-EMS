import type { CSSProperties, ReactNode } from 'react'
import { useId } from 'react'
import { uiColors } from './uiPrimitives'
import { uiFontSize, uiRadius, uiSectionLabelStyle, uiShadow, uiSpace } from './uiTokens'

type Variant = 'overview' | 'action'

type Props = {
  variant: Variant
  /** Section label (e.g. "Overview", "Action panel"). */
  title: string
  children: ReactNode
}

const overviewBlockStyle: CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  minWidth: 0,
  padding: `${uiSpace.md}px ${uiSpace.lg}px ${uiSpace.lg}px`,
  borderRadius: uiRadius.md,
  border: `1px solid ${uiColors.borderLight}`,
  background: uiColors.surface,
  boxShadow: uiShadow.card,
}

const actionBlockStyle: CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  minWidth: 0,
  padding: uiSpace.lg,
  borderRadius: uiRadius.md,
  background: uiColors.surfaceMuted,
  border: `1px solid ${uiColors.border}`,
  boxShadow: uiShadow.card,
}

const contentStyle: CSSProperties = {
  marginTop: uiSpace.sm,
  minWidth: 0,
}

const headingStyle: CSSProperties = {
  ...uiSectionLabelStyle,
  marginBottom: 0,
  fontSize: uiFontSize.xs,
  color: uiColors.textSubtle,
}

/**
 * Side column block: labeled region with overview vs action hierarchy (People / Group / Match).
 */
export default function WorkspaceSideSection({ variant, title, children }: Props) {
  const headingId = useId()
  const blockStyle = variant === 'action' ? actionBlockStyle : overviewBlockStyle

  return (
    <section style={blockStyle} aria-labelledby={headingId}>
      <h3 id={headingId} style={headingStyle}>
        {title}
      </h3>
      <div style={contentStyle}>{children}</div>
    </section>
  )
}
