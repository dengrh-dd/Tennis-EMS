import type { CSSProperties } from 'react'
import { drillDownBackLinkStyle } from '../layout/drillDownLayout'
import { uiSpace } from './uiTokens'

type Props = {
  label: string
  onClick: () => void
  /** Space below the back control (before the next page block). */
  marginBottom?: number
  style?: CSSProperties
}

export default function BackLink({ label, onClick, marginBottom = uiSpace.lg, style }: Props) {
  return (
    <div style={{ marginBottom, ...style }}>
      <button type="button" onClick={onClick} style={drillDownBackLinkStyle}>
        {label}
      </button>
    </div>
  )
}

