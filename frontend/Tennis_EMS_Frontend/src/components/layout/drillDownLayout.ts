import type { CSSProperties } from 'react'
import { uiColors } from '../ui/uiPrimitives'
import { uiFontSize, uiLayout, uiRadius, uiShadow, uiSize, uiSpace } from '../ui/uiTokens'

/** Shared drill-down page layout primitives (outer shell, columns, toolbars). */

export const drillDownOuterStyle: CSSProperties = {
  padding: 0,
  color: uiColors.text,
  width: '100%',
  boxSizing: 'border-box',
}

export function drillDownRowStyle(panelOpen: boolean): CSSProperties {
  return {
    maxWidth: panelOpen ? uiLayout.contentMaxWidthWithPanel : uiLayout.contentMaxWidth,
    margin: '0 auto',
    display: 'flex',
    gap: uiSpace.xl,
    alignItems: 'flex-start',
    width: '100%',
  }
}

export const drillDownMainColumnStyle: CSSProperties = {
  flex: '1 1 auto',
  minWidth: 0,
}

/** Fixed-width column for create/edit side panels. */
export const drillDownRightPanelColumnStyle: CSSProperties = {
  width: uiLayout.sidePanelWidth,
  flex: `0 0 ${uiLayout.sidePanelWidth}px`,
}

/**
 * Vertical rhythm for management pages: toolbar → feedback → list without ad-hoc margins.
 * Pair with `actionToolbarStyle` (marginBottom: 0) so spacing comes from this gap alone.
 */
export const workspacePageStackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: uiSpace.lg,
  minWidth: 0,
  width: '100%',
}

/**
 * Main column for management workspace landing pages (People, Group, Match).
 * Flex column so toolbar → feedback → list align predictably.
 */
export const workspaceMainColumnStyle: CSSProperties = {
  ...drillDownMainColumnStyle,
  ...workspacePageStackStyle,
}

/**
 * Side column: overview + panel stack with consistent vertical gap.
 */
export const workspaceSideColumnStyle: CSSProperties = {
  ...drillDownRightPanelColumnStyle,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: uiSpace.lg,
}

/**
 * Stack below `PageHeader` on detail/workspace pages (error, loading, sections).
 */
export const workspaceDetailStackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: uiSpace.lg,
  minWidth: 0,
}

const breadcrumbBase: CSSProperties = {
  paddingTop: 0,
  paddingBottom: uiSpace.sm,
  fontSize: 13,
  color: uiColors.textMuted,
  borderBottom: `1px solid ${uiColors.borderLight}`,
}

export function breadcrumbBarStyle(marginBottom: number, lineHeight?: number): CSSProperties {
  return {
    ...breadcrumbBase,
    marginBottom,
    ...(lineHeight != null ? { lineHeight } : {}),
  }
}

/** Title row + action buttons — shared toolbar chrome. */
export const actionToolbarStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: uiSpace.stack,
  alignItems: 'center',
  justifyContent: 'space-between',
  border: `1px solid ${uiColors.borderLight}`,
  borderRadius: uiRadius.md,
  padding: `${uiSpace.mdLg}px ${uiSpace.lg}px`,
  marginBottom: 0,
  background: uiColors.surface,
  boxShadow: uiShadow.card,
}

/** When `ActionToolbar` has `filters`, stack title+actions above the filter band. */
export const actionToolbarSplitOuterStyle: CSSProperties = {
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 0,
  flexWrap: 'nowrap',
}

/** Top row: page toolbar title (left) and action buttons (right). */
export const actionToolbarSplitTopRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: uiSpace.stack,
  width: '100%',
  minWidth: 0,
  minHeight: uiSize.buttonMinHeight,
}

/** Bottom row: full-width filter control band below the title/actions row. */
export const actionToolbarSplitFiltersRowStyle: CSSProperties = {
  width: '100%',
  minWidth: 0,
  paddingTop: uiSpace.md,
  borderTop: `1px solid ${uiColors.borderLight}`,
  boxSizing: 'border-box',
}

/** Workspace toolbar label — strong but below page title; distinct from filter labels. */
export const actionToolbarTitleStyle: CSSProperties = {
  color: uiColors.textStrong,
  fontWeight: 600,
  fontSize: uiFontSize.titleSm,
  letterSpacing: '-0.02em',
  lineHeight: 1.35,
}

/** Title + actions row inside `ActionToolbar`. */
export const actionToolbarInnerRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: uiSpace.stack,
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  minWidth: 0,
}

/** Right column that grows for action buttons. */
export const actionToolbarActionsOuterStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: uiSpace.stack,
  alignItems: 'center',
  justifyContent: 'flex-end',
  minWidth: 0,
  flex: `1 1 ${uiLayout.responsiveActionsMinWidth}px`,
}

export const actionToolbarButtonGroupStyle: CSSProperties = {
  display: 'flex',
  gap: uiSpace.stack,
  flexWrap: 'wrap',
  alignItems: 'center',
}

export const actionToolbarTitleColumnStyle: CSSProperties = {
  flex: '0 0 auto',
  minWidth: 0,
}

/**
 * Full-width filter rail: horizontal groups, wrapping only when needed on narrow widths.
 * Sits in the bottom row of split `ActionToolbar`.
 */
export const actionToolbarFiltersRailStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: uiSpace.md,
  width: '100%',
  minWidth: 0,
  padding: `${uiSpace.sm}px ${uiSpace.md}px`,
  background: uiColors.surfaceMuted,
  borderRadius: uiRadius.sm,
  border: `1px solid ${uiColors.borderLight}`,
  boxSizing: 'border-box',
  minHeight: uiSize.buttonMinHeight + 2,
}

/** Action buttons — right-aligned cluster (single-row toolbars or top row of split). */
export const actionToolbarActionsZoneStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: uiSpace.stack,
  flex: '0 1 auto',
  marginLeft: 'auto',
}

/** Tight grouping for related buttons inside the actions zone. */
export const actionToolbarActionClusterStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: uiSpace.stack,
}

/** Default primary toolbar button (Create / Edit actions). */
export const toolbarPrimaryButtonStyle: CSSProperties = {
  padding: `${uiSpace.sm}px ${uiSpace.mdLg}px`,
  borderRadius: uiRadius.sm,
  border: `1px solid ${uiColors.border}`,
  background: uiColors.surface,
  color: uiColors.text,
  fontWeight: 600,
}

/** Bordered list region for selectable rows. */
export const selectableListShellStyle: CSSProperties = {
  border: `1px solid ${uiColors.borderLight}`,
  borderRadius: uiRadius.md,
  padding: uiSpace.xs,
  minHeight: 120,
  background: uiColors.surfaceMuted,
  boxShadow: uiShadow.card,
}

export const drillDownBackLinkStyle: CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: uiColors.link,
  cursor: 'pointer',
  fontSize: uiFontSize.sm,
  fontWeight: 600,
  lineHeight: 1.45,
  padding: 0,
}

/** Breadcrumb trail links — use with `react-router` `Link`. */
export const breadcrumbLinkStyle: CSSProperties = {
  color: uiColors.textMuted,
  fontWeight: 500,
  textDecoration: 'none',
}

export const breadcrumbCurrentStyle: CSSProperties = {
  color: uiColors.text,
  fontWeight: 600,
}
