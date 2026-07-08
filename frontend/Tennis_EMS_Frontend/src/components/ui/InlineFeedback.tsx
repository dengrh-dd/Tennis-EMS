import type { CSSProperties } from 'react'
import { uiFontSize, uiSpace, uiText } from './uiTokens'

export type InlineFeedbackType = 'success' | 'error' | 'info'

const typeColor: Record<InlineFeedbackType, string> = {
  success: uiText.success,
  error: uiText.error,
  info: uiText.info,
}

type Props = {
  type: InlineFeedbackType
  message: string
  dense?: boolean
  style?: CSSProperties
}

/** Short status text inside a panel or form region. */
export default function InlineFeedback({ type, message, dense, style }: Props) {
  return (
    <div
      role={type === 'error' ? 'alert' : undefined}
      style={{
        color: typeColor[type],
        fontSize: dense ? uiFontSize.sm : uiFontSize.body,
        marginBottom: dense ? 0 : uiSpace.md,
        lineHeight: 1.4,
        wordBreak: 'break-word',
        ...style,
      }}
    >
      {message}
    </div>
  )
}
