import { useEffect, type CSSProperties, type ReactNode } from 'react'
import './buttonInteractions.css'
import {
  closeButtonStyle,
  panelBodyStyle,
  panelHeaderStyle,
  panelTitleStyle,
} from './panelShellStyles'
import { uiColors } from './uiPrimitives'
import { uiLayout, uiShadow, uiSpace } from './uiTokens'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  closeDisabled?: boolean
  children: ReactNode
}

const backdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: uiSpace.xl,
  boxSizing: 'border-box',
  background: uiColors.backdrop,
}

const dialogStyle: CSSProperties = {
  width: `min(100%, ${uiLayout.modalMaxWidth}px)`,
  maxHeight: `min(90vh, ${uiLayout.modalMaxHeight}px)`,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: uiShadow.modal,
}

const dialogBodyStyle: CSSProperties = {
  padding: `0 ${uiSpace.lg}px ${uiSpace.lg}px`,
  overflow: 'auto',
  flex: '1 1 auto',
  minHeight: 0,
}

/** Centered modal — same chrome as side panels (header + bordered body). */
export default function ModalDialog({ open, title, onClose, closeDisabled, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !closeDisabled) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeDisabled, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ems-modal-dialog-title"
      style={backdropStyle}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !closeDisabled) onClose()
      }}
    >
      <div style={{ ...panelBodyStyle, ...dialogStyle }} onMouseDown={(e) => e.stopPropagation()}>
        <div style={panelHeaderStyle}>
          <div id="ems-modal-dialog-title" style={panelTitleStyle}>
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ui-interactive-button ui-interactive-button--ghost"
            style={closeButtonStyle}
            disabled={closeDisabled}
          >
            Close
          </button>
        </div>
        <div style={dialogBodyStyle}>{children}</div>
      </div>
    </div>
  )
}
