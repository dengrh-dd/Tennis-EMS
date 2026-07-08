import type { CSSProperties, ReactNode } from 'react'
import { uiPageSubtitleStyle, uiPageTitleStyle, uiSpace } from '../ui/uiTokens'

type Props = {
  /** Page heading; omit on drill-down pages when the breadcrumb carries the title. */
  title?: string
  subtitle?: string
  toolbar?: ReactNode
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/** Page heading + optional toolbar + body wrapper for feature pages. */
export default function PageShell({ title, subtitle, toolbar, children, className, style }: Props) {
  const showHeading = Boolean(title?.trim()) || Boolean(subtitle?.trim())

  return (
    <div className={className} style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', ...style }}>
      {showHeading && (
        <div style={{ marginBottom: toolbar ? uiSpace.md : uiSpace.lg }}>
          {title?.trim() ? <h1 style={uiPageTitleStyle}>{title}</h1> : null}
          {subtitle?.trim() ? (
            <p
              style={
                title?.trim()
                  ? { ...uiPageSubtitleStyle, margin: `${uiSpace.sm}px 0 0` }
                  : uiPageSubtitleStyle
              }
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      )}
      {toolbar}
      {children}
    </div>
  )
}
