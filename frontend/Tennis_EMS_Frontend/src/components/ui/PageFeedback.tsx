import type { CSSProperties, ReactNode } from 'react'
import StatusMessage from './StatusMessage'
import { uiColors } from './uiPrimitives'
import { uiSpace } from './uiTokens'

const dismissButtonStyle: CSSProperties = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: 18,
  lineHeight: 1,
  padding: '2px 6px',
  color: uiColors.textMuted,
}

type Props = {
  success?: string | null
  error?: string | null
  loading?: boolean
  /** Shown when `loading` is true. */
  loadingMessage?: string
  /** When set, success/error rows show a dismiss control (e.g. clear feedback in the controller). */
  onDismiss?: () => void
}

/**
 * Page-level success / error / loading stack for list and management views.
 * Uses `StatusMessage` for consistent EMS styling.
 */
function FeedbackRow({
  children,
  onDismiss,
}: {
  children: ReactNode
  onDismiss?: () => void
}) {
  if (!onDismiss) return <>{children}</>
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: uiSpace.stack }}>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss message"
        title="Dismiss"
        style={dismissButtonStyle}
      >
        ×
      </button>
    </div>
  )
}

export default function PageFeedback({
  success,
  error,
  loading,
  loadingMessage = 'Loading…',
  onDismiss,
}: Props) {
  const hasAny = Boolean(success?.trim()) || Boolean(error?.trim()) || loading
  if (!hasAny) return null

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: uiSpace.md,
        marginBottom: uiSpace.md,
      }}
    >
      {success?.trim() ? (
        <FeedbackRow onDismiss={onDismiss}>
          <StatusMessage variant="success" message={success.trim()} role="status" marginBottom={0} />
        </FeedbackRow>
      ) : null}
      {!success?.trim() && error?.trim() ? (
        <FeedbackRow onDismiss={onDismiss}>
          <StatusMessage variant="error" message={error.trim()} role="alert" marginBottom={0} />
        </FeedbackRow>
      ) : null}
      {loading ? (
        <StatusMessage variant="info" message={loadingMessage} role="status" marginBottom={0} />
      ) : null}
    </div>
  )
}
