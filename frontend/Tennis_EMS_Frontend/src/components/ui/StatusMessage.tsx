import type { CSSProperties } from 'react'
import { uiFontSize, uiLineHeight, uiSpace, uiText } from './uiTokens'

type Variant = 'success' | 'error' | 'info'

const variantColor: Record<Variant, string> = {
  success: uiText.success,
  error: uiText.error,
  info: uiText.info,
}

type Props = {
  variant: Variant
  message: string
  marginBottom?: number
  style?: CSSProperties
  id?: string
  role?: 'status' | 'alert'
}

/** Inline status line for list pages (success / error / info). */
export default function StatusMessage({
  variant,
  message,
  marginBottom = uiSpace.md,
  style,
  id,
  role,
}: Props) {
  return (
    <div
      id={id}
      role={role}
      style={{
        color: variantColor[variant],
        marginBottom,
        fontSize: uiFontSize.body,
        lineHeight: uiLineHeight.body,
        ...style,
      }}
    >
      {message}
    </div>
  )
}
