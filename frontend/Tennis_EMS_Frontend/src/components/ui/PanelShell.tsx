import type { ReactNode } from 'react'
import Button from './Button'
import {
  closeButtonStyle,
  panelBodyStyle,
  panelHeaderStyle,
  panelTitleStyle,
} from './panelShellStyles'

type Props = {
  title: string
  onClose: () => void
  closeDisabled?: boolean
  children: ReactNode
}

/** Right-side create/edit panel: bordered shell + title row with Close + body content. */
export default function PanelShell({ title, onClose, closeDisabled, children }: Props) {
  return (
    <aside style={panelBodyStyle}>
      <div style={panelHeaderStyle}>
        <div style={panelTitleStyle}>{title}</div>
        <Button type="button" onClick={onClose} variant="ghost" size="compact" style={closeButtonStyle} disabled={closeDisabled}>
          Close
        </Button>
      </div>
      {children}
    </aside>
  )
}

