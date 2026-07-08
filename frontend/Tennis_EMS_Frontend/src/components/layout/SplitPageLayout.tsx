import type { ReactNode } from 'react'
import { uiSpace } from '../ui/uiTokens'

type Props = {
  /** Primary column (e.g. list + feedback). */
  main: ReactNode
  /** Secondary column (e.g. detail, forms, insights). Omit for a single full-width main column. */
  side?: ReactNode | null
  gap?: number
}

/**
 * Two-column workspace for management pages: main list/workspace + fixed-width side column.
 * Wraps on narrow viewports. When `side` is omitted, main fills the row.
 */
export default function SplitPageLayout({ main, side, gap = uiSpace.xl }: Props) {
  if (side == null) {
    return <div style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}>{main}</div>
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap,
        alignItems: 'flex-start',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ flex: '1 1 280px', minWidth: 0 }}>{main}</div>
      <div style={{ flex: '0 1 390px', maxWidth: '100%', minWidth: 0 }}>{side}</div>
    </div>
  )
}
