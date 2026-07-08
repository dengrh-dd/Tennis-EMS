import type { CSSProperties } from 'react'
import { uiColors } from '../ui/uiPrimitives'
import { uiFontSize, uiLineHeight, uiSpace } from '../ui/uiTokens'

/** Drill-down page header stack: breadcrumb + back + optional description. */

export const pageHeaderRootStyle: CSSProperties = {
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
}

export const pageHeaderDescriptionStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: uiSpace.xl,
  color: uiColors.textMuted,
  fontSize: uiFontSize.body,
  lineHeight: uiLineHeight.relaxed,
}

export const pageHeaderDescriptionStrongStyle: CSSProperties = {
  color: uiColors.text,
}
