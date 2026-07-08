import type { CSSProperties, ReactNode } from 'react'
import {
  uiContextCardInlineStatusStyle,
  uiDrillDownContextCardStyle,
  uiDrillDownContextMetaStyle,
  uiDrillDownContextTitleStyle,
} from './uiPrimitives'
import { uiSpace } from './uiTokens'

type Props = {
  title: ReactNode
  /** Muted detail line(s) below the title. */
  meta?: ReactNode
  /** Optional trailing status (e.g. Active / Inactive), rendered with subtle styling on the meta line. */
  status?: ReactNode
  /** Tighter gap under the title row (e.g. compound titles with suffix). */
  titleTight?: boolean
  /** Optional override for the meta wrapper (e.g. bottom spacing inside the card). */
  metaStyle?: CSSProperties
}

/**
 * Bordered context summary for drill-down pages (course / section identity before toolbars).
 */
export default function ContextCard({ title, meta, status, titleTight, metaStyle }: Props) {
  const titleStyle: CSSProperties = {
    ...uiDrillDownContextTitleStyle,
    ...(titleTight ? { marginBottom: uiSpace.xs } : {}),
  }

  const showMetaRow = meta != null || status != null

  return (
    <section style={uiDrillDownContextCardStyle}>
      <div style={titleStyle}>{title}</div>
      {showMetaRow ? (
        <div style={{ ...uiDrillDownContextMetaStyle, ...metaStyle }}>
          {meta}
          {status != null ? <span style={uiContextCardInlineStatusStyle}>{status}</span> : null}
        </div>
      ) : null}
    </section>
  )
}
