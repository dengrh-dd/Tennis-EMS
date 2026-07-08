import type { CSSProperties, ReactNode } from 'react'
import Button from './Button'
import { uiColors } from './uiPrimitives'
import {
  detailPanelEyebrowStyle,
  panelActionButtonStyle,
  panelBodyStyle,
  panelHeaderStyle,
  panelTitleStyle,
} from './panelShellStyles'
import { uiSpace } from './uiTokens'

/** Outline actions in read-only detail column headers. */
export const detailPanelActionButtonStyle: CSSProperties = {
  ...panelActionButtonStyle,
}

export type DetailPanelAction = {
  label: string
  onClick: () => void
  disabled?: boolean
}

type Props = {
  /** Optional section label (e.g. "Overview") above the entity title. */
  eyebrow?: string
  title: string
  actions?: DetailPanelAction[]
  children: ReactNode
}

/** Read-only detail column: bordered panel, title row, optional action buttons, padded body. */
export default function DetailPanelShell({ eyebrow, title, actions, children }: Props) {
  return (
    <aside style={panelBodyStyle}>
      <div style={panelHeaderStyle}>
        <div style={{ minWidth: 0, flex: '1 1 auto' }}>
          {eyebrow?.trim() ? <div style={detailPanelEyebrowStyle}>{eyebrow.trim()}</div> : null}
          <div style={panelTitleStyle}>{title}</div>
        </div>
        {actions != null && actions.length > 0 ? (
          <div style={{ display: 'flex', gap: uiSpace.sm, flexWrap: 'wrap', flexShrink: 0 }}>
            {actions.map((action, index) => {
              const disabled = action.disabled ?? false
              return (
                <Button
                  key={`${action.label}-${index}`}
                  onClick={action.onClick}
                  variant="secondary"
                  size="compact"
                  disabled={disabled}
                >
                  {action.label}
                </Button>
              )
            })}
          </div>
        ) : null}
      </div>
      <div style={{ padding: uiSpace.lg, background: uiColors.surface }}>{children}</div>
    </aside>
  )
}
