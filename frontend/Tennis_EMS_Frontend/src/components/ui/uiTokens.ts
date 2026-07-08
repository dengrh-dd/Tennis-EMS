import type { CSSProperties } from 'react'

/**
 * EMS design tokens — primary visual source of truth for shared UI.
 *
 * - Use these values (or styles built from `uiPrimitives.ts`) for `components/ui`,
 *   `components/layout`, and cross-feature surfaces that should match the global EMS look.
 * - Avoid raw hex/px for spacing, radius, shadows, and semantic colors in new code; extend
 *   tokens here instead.
 * - Legacy CSS (`emsFormLayout.css`, `form/formControls.css`, `formControls.css`, `appSidebar.css`)
 *   mirrors these values via `src/styles/emsDesignTokens.css` — update both when changing a token.
 */

export const uiColors = {
  text: '#0f172a',
  textStrong: '#1e293b',
  textDeep: '#020617',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',
  textLabel: '#475569',
  textSoft: '#334155',
  border: '#cbd5e1',
  borderStrong: '#94a3b8',
  borderLight: '#e2e8f0',
  surface: '#ffffff',
  surfaceMuted: '#f8fafc',
  surfaceHover: '#f1f5f9',
  surfaceActive: '#eef2f7',
  focusRing: '#93c5fd',
  focusRingSoft: 'rgba(147, 197, 253, 0.35)',
  link: '#2563eb',
  linkHover: '#1d4ed8',
  required: 'coral',
  dangerText: '#b91c1c',
  dangerBorder: '#fecaca',
  dangerBorderStrong: '#fca5a5',
  dangerBg: '#ffffff',
  dangerBgHover: '#fff7f7',
  dangerBgActive: '#ffefef',
  /** Noticeably distinct from `surface` so hover reads clearly vs selected. */
  listRowHover: '#f1f5f9',
  listRowSelected: '#dbeafe',
  listRowAccent: '#2563eb',
  backdrop: 'rgba(15, 23, 42, 0.45)',
} as const

/** Semantic text roles (headings, captions, inline feedback). */
export const uiText = {
  heading: uiColors.text,
  muted: uiColors.textMuted,
  subtle: uiColors.textSubtle,
  success: '#15803d',
  error: '#c2410c',
  info: uiColors.textMuted,
} as const

/** Spacing rhythm (px) — page sections, stacks, panel padding. */
export const uiSpace = {
  xs: 4,
  tight: 6,
  sm: 8,
  /** Flex / toolbar row gap (common on management pages). */
  stack: 10,
  md: 12,
  mdLg: 14,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const

/** Border radii (px) — controls, cards, panels. */
export const uiRadius = {
  sm: 8,
  md: 10,
  lg: 12,
} as const

/** Elevation — prefer `card` for bordered panels, lists, toolbars. */
export const uiShadow = {
  card: '0 1px 2px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.08)',
  modal: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
} as const

/** @deprecated Use `uiShadow.card`. Kept for existing imports. */
export const uiShadowCard = uiShadow.card

export const uiFontSize = {
  xs: 12,
  sm: 13,
  body: 14,
  titleSm: 15,
  heading: 16,
  pageTitle: 22,
  hero: 26,
} as const

export const uiLineHeight = {
  tight: 1.25,
  body: 1.45,
  relaxed: 1.5,
} as const

/** Fixed control dimensions (px). */
export const uiSize = {
  controlMinHeight: 38,
  buttonMinHeight: 36,
  buttonMinHeightLg: 40,
  textareaMinHeight: 88,
  checkbox: 16,
} as const

/**
 * Shared layout dimensions for shell/panel/modal structures.
 * Prefer these over new one-off widths in shared UI files.
 */
export const uiLayout = {
  contentMaxWidth: 1200,
  contentMaxWidthWithPanel: 1240,
  sidePanelWidth: 390,
  modalMaxWidth: 440,
  modalMaxHeight: 720,
  responsiveActionsMinWidth: 200,
  responsiveHeaderLeadMinWidth: 240,
  formFieldMinWidth: 160,
} as const

/** Card / panel section title — aligns with `uiWorkspaceSectionHeadingStyle` rhythm. */
export const uiHeadingStyle: CSSProperties = {
  margin: `0 0 ${uiSpace.stack}px`,
  fontSize: uiFontSize.titleSm,
  fontWeight: 600,
  color: uiColors.textStrong,
  letterSpacing: '-0.02em',
  lineHeight: uiLineHeight.tight,
}

export const uiSubtitleStyle: CSSProperties = {
  margin: `0 0 ${uiSpace.stack}px`,
  color: uiText.muted,
  fontSize: uiFontSize.sm,
}

export const uiSectionLabelStyle: CSSProperties = {
  margin: `0 0 ${uiSpace.stack}px`,
  fontSize: uiFontSize.xs,
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: uiText.subtle,
}

/** Shared with `PageShell` and page-level `ActionBar` headers. */
export const uiPageTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: uiFontSize.pageTitle,
  fontWeight: 700,
  color: uiText.heading,
  lineHeight: uiLineHeight.tight,
}

export const uiPageSubtitleStyle: CSSProperties = {
  margin: 0,
  fontSize: uiFontSize.body,
  color: uiText.muted,
  lineHeight: uiLineHeight.relaxed,
}
