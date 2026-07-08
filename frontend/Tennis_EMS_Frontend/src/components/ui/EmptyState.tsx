import type { CSSProperties } from 'react'
import { uiFontSize, uiLineHeight, uiText } from './uiTokens'

type Props = {
  message: string
  style?: CSSProperties
}

/** Empty list / no-data message for management lists and panels. */
export default function EmptyState({ message, style }: Props) {
  return (
    <p
      style={{
        margin: 0,
        color: uiText.muted,
        fontSize: uiFontSize.body,
        lineHeight: uiLineHeight.body,
        wordBreak: 'break-word',
        ...style,
      }}
    >
      {message}
    </p>
  )
}
