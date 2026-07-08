import type { CSSProperties } from 'react'
import { uiColors } from './uiPrimitives'
import { uiFontSize, uiRadius, uiShadow, uiSize, uiSpace } from './uiTokens'

/** Shared panel shell styles (create/edit side panels, modal chrome). */

export const panelBodyStyle: CSSProperties = {
  border: `1px solid ${uiColors.borderLight}`,
  borderRadius: uiRadius.md,
  background: uiColors.surface,
  boxShadow: uiShadow.card,
  overflow: 'hidden',
}

export const panelHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: uiSpace.md,
  padding: `${uiSpace.mdLg}px ${uiSpace.lg}px`,
  borderBottom: `1px solid ${uiColors.borderLight}`,
  background: uiColors.surfaceMuted,
}

export const panelTitleStyle: CSSProperties = {
  fontWeight: 700,
  fontSize: uiFontSize.heading,
  color: uiColors.textStrong,
  letterSpacing: '-0.02em',
  lineHeight: 1.3,
  margin: `${uiSpace.tight}px 0`,
}

/** Small label above the entity title in read-only detail panels. */
export const detailPanelEyebrowStyle: CSSProperties = {
  margin: `0 0 ${uiSpace.xs}px`,
  fontSize: uiFontSize.xs,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: uiColors.textSubtle,
}

/** Compact panel header action style (close/edit/toggle actions). */
export const panelActionButtonStyle: CSSProperties = {
  border: '1px solid transparent',
  background: 'transparent',
  color: uiColors.textSoft,
  padding: `${uiSpace.tight}px ${uiSpace.md}px`,
  borderRadius: uiRadius.sm,
  minHeight: uiSize.buttonMinHeight,
  fontSize: uiFontSize.sm,
  lineHeight: 1.3,
  cursor: 'pointer',
  fontWeight: 500,
}

export const closeButtonStyle: CSSProperties = {
  ...panelActionButtonStyle,
}
