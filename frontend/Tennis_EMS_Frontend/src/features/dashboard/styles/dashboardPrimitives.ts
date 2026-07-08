import type { CSSProperties } from 'react'
import { uiColors } from '../../../components/ui/uiPrimitives'
import { uiFontSize, uiLineHeight, uiShadowCard, uiSpace, uiText } from '../../../components/ui/uiTokens'

/**
 * Shared EMS dashboard visual language for role dashboards.
 * Uses the same light-neutral tokens as `components/ui`.
 */

export const emsContentShellStyle: CSSProperties = {
  maxWidth: 1100,
  margin: '0 auto',
  width: '100%',
  boxSizing: 'border-box',
}

export const emsDashboardHeroStyle: CSSProperties = {
  marginBottom: uiSpace.xl,
  paddingBottom: uiSpace.lg,
  borderBottom: `1px solid ${uiColors.borderLight}`,
}

export const emsDashboardPageTitleStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: uiSpace.stack,
  fontSize: uiFontSize.hero,
  fontWeight: 700,
  color: uiText.heading,
  letterSpacing: '-0.03em',
  lineHeight: uiLineHeight.tight,
}

export const emsDashboardHeroSubtitleStyle: CSSProperties = {
  margin: 0,
  color: uiColors.textMuted,
  fontSize: 15,
  lineHeight: 1.5,
}

export const emsDashboardTwoColumnGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: uiSpace.xl,
  marginBottom: uiSpace.xl,
}

export const emsDashboardSectionLabelStyle: CSSProperties = {
  fontSize: uiFontSize.xs,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  margin: `0 0 ${uiSpace.sm}px`,
  color: uiColors.textSubtle,
}

/** Inline meta suffix on list rows (status chips, secondary fragments). */
export const emsDashboardListMetaStyle: CSSProperties = {
  color: uiColors.textMuted,
}

/** Inline summary card (e.g. current session block on home dashboards). */
export const emsDashboardSessionCardStyle: CSSProperties = {
  padding: 14,
  border: `1px solid ${uiColors.borderLight}`,
  borderRadius: 8,
  background: uiColors.surface,
  boxShadow: uiShadowCard,
}

export const emsDashboardCardGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: 14,
}

/** Primary tile / panel card on role dashboards. */
export const emsDashboardTileCardStyle: CSSProperties = {
  display: 'block',
  padding: uiSpace.lg,
  border: `1px solid ${uiColors.borderLight}`,
  borderRadius: 10,
  minHeight: 112,
  boxSizing: 'border-box',
  width: '100%',
  minWidth: 0,
  background: uiColors.surface,
  boxShadow: uiShadowCard,
}

export const emsDashboardTileTitleStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: uiSpace.sm,
  fontSize: uiFontSize.titleSm,
  fontWeight: 600,
  color: uiText.heading,
  letterSpacing: '-0.02em',
  lineHeight: uiLineHeight.tight,
}

export const emsDashboardTileDescriptionStyle: CSSProperties = {
  margin: 0,
  color: uiColors.textMuted,
  fontSize: 13,
  lineHeight: 1.4,
}

export const emsDashboardManagementHeadingStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 12,
  color: uiText.heading,
}

export const emsDashboardQuickRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  alignItems: 'center',
  marginTop: 12,
}

export const emsDashboardQuickLinkStyle: CSSProperties = {
  fontSize: 14,
  color: uiColors.link,
  textDecoration: 'none',
}

export const emsDashboardBodyMutedStyle: CSSProperties = {
  margin: 0,
  color: uiColors.textMuted,
  fontSize: 14,
  lineHeight: 1.5,
}

export const emsDashboardPrimaryLineStyle: CSSProperties = {
  fontSize: 17,
  fontWeight: 500,
  color: uiColors.text,
}

export const emsDashboardSecondaryLineStyle: CSSProperties = {
  fontSize: 14,
  color: uiColors.textMuted,
  marginTop: 6,
}

/** Content panel for dashboard widgets (no fixed min-height). */
export const emsDashboardSectionPanelStyle: CSSProperties = {
  display: 'block',
  padding: uiSpace.lg,
  border: `1px solid ${uiColors.borderLight}`,
  borderRadius: 10,
  boxSizing: 'border-box',
  width: '100%',
  minWidth: 0,
  minHeight: 120,
  background: uiColors.surfaceMuted,
  boxShadow: uiShadowCard,
}

export const emsDashboardSectionTitleStyle: CSSProperties = {
  margin: '0 0 6px',
  fontSize: 16,
  fontWeight: 600,
  color: uiText.heading,
}

export const emsDashboardSectionSubtitleStyle: CSSProperties = {
  margin: '0 0 14px',
  fontSize: 13,
  color: uiColors.textMuted,
  lineHeight: 1.45,
}

export const emsDashboardListStyle: CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  color: uiColors.textSoft,
  fontSize: 14,
  lineHeight: 1.55,
}

export const emsDashboardErrorTextStyle: CSSProperties = {
  color: uiText.error,
  fontSize: 14,
  margin: 0,
}
