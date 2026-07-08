import type { CSSProperties, ReactNode } from 'react'
import './emsFormLayout.css'
import { uiLayout, uiPageSubtitleStyle, uiPageTitleStyle, uiSpace } from './uiTokens'

type Props = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  title?: string
  subtitle?: string
  actions?: ReactNode
}

function hasPageHeader(title?: string, subtitle?: string, actions?: ReactNode): boolean {
  return Boolean(title?.trim() || subtitle?.trim() || actions != null)
}

/**
 * Form action row (`ems-form-actions`) or optional page header (title + actions).
 */
export default function ActionBar({
  children,
  className = 'ems-form-actions',
  style,
  title,
  subtitle,
  actions,
}: Props) {
  if (hasPageHeader(title, subtitle, actions)) {
    const showLead = Boolean(title?.trim() || subtitle?.trim())
    return (
      <div style={{ marginBottom: uiSpace.lg, width: '100%', minWidth: 0, boxSizing: 'border-box', ...style }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: uiSpace.stack,
            alignItems: 'flex-start',
            justifyContent: showLead ? 'space-between' : 'flex-end',
          }}
        >
          {showLead ? (
            <div style={{ minWidth: 0, flex: `1 1 ${uiLayout.responsiveHeaderLeadMinWidth}px` }}>
              {title?.trim() ? <h1 style={uiPageTitleStyle}>{title.trim()}</h1> : null}
              {subtitle?.trim() ? (
                <p
                  style={
                    title?.trim()
                      ? { ...uiPageSubtitleStyle, margin: `${uiSpace.sm}px 0 0` }
                      : uiPageSubtitleStyle
                  }
                >
                  {subtitle.trim()}
                </p>
              ) : null}
            </div>
          ) : null}
          {actions != null ? (
            <div className="ems-form-actions" style={{ flex: '0 0 auto', marginTop: 0 }}>
              {actions}
            </div>
          ) : null}
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}
