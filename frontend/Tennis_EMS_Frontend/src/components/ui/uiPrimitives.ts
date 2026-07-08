import type { CSSProperties } from 'react'
import {
  uiColors,
  uiFontSize,
  uiLayout,
  uiLineHeight,
  uiRadius,
  uiShadow,
  uiSize,
  uiSpace,
} from './uiTokens'

/** Re-export palette for feature modules that import `uiColors` from primitives. */
export { uiColors } from './uiTokens'

/** EMS light-neutral surfaces — shared by `components/ui` controls and dashboard panels. */
export const uiSurfaceCardStyle: CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 400,
  padding: uiSpace.xl,
  borderRadius: uiRadius.lg,
  border: `1px solid ${uiColors.borderLight}`,
  background: uiColors.surface,
  boxShadow: uiShadow.card,
}

/** Vertical form stack — padding, gap, column flex. */
export const uiFormStackStyle: CSSProperties = {
  padding: uiSpace.mdLg,
  display: 'flex',
  flexDirection: 'column',
  gap: uiSpace.md,
  boxSizing: 'border-box',
  width: '100%',
}

/** Label + control column. */
export const uiFormFieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: uiSpace.xs,
  minWidth: 0,
}

/** Form label — matches control text size. */
export const uiFormLabelStyle: CSSProperties = {
  display: 'block',
  marginBottom: uiSpace.xs,
  fontSize: uiFontSize.body,
  color: uiColors.textLabel,
}

/** Base for text inputs and selects. */
export const uiControlBaseStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: uiSize.controlMinHeight,
  border: `1px solid ${uiColors.border}`,
  borderRadius: uiRadius.sm,
  padding: `${uiSpace.sm}px ${uiSpace.stack}px`,
  background: uiColors.surface,
  color: uiColors.text,
  fontSize: uiFontSize.body,
  lineHeight: 1.4,
  transition: 'border-color 0.14s ease, box-shadow 0.14s ease, background-color 0.14s ease',
}

export const uiTextareaBaseStyle: CSSProperties = {
  ...uiControlBaseStyle,
  minHeight: uiSize.textareaMinHeight,
  resize: 'vertical' as const,
}

export const uiControlDisabledStyle: CSSProperties = {
  background: uiColors.surfaceMuted,
  color: uiColors.textMuted,
  cursor: 'not-allowed',
}

export const uiControlReadonlyStyle: CSSProperties = {
  background: uiColors.surfaceMuted,
  color: uiColors.textLabel,
  opacity: 0.9,
}

/** Checkbox + label row. */
export const uiCheckboxRowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: uiSpace.sm,
  fontSize: uiFontSize.body,
  color: uiColors.textSoft,
}

export const uiCheckboxBoxStyle: CSSProperties = {
  width: uiSize.checkbox,
  height: uiSize.checkbox,
}

/** Outlined primary-style control (toolbar / secondary emphasis). */
export const uiButtonPrimaryStyle: CSSProperties = {
  padding: `${uiSpace.sm}px ${uiSpace.mdLg}px`,
  borderRadius: uiRadius.sm,
  border: `1px solid ${uiColors.text}`,
  background: uiColors.text,
  color: uiColors.surface,
  fontWeight: 600,
  fontSize: uiFontSize.body,
  minHeight: uiSize.buttonMinHeight,
  cursor: 'pointer',
  boxSizing: 'border-box',
  lineHeight: 1.2,
}

/** Secondary outline button. */
export const uiButtonSecondaryStyle: CSSProperties = {
  minHeight: uiSize.buttonMinHeight,
  padding: `${uiSpace.sm}px ${uiSpace.mdLg}px`,
  border: `1px solid ${uiColors.border}`,
  borderRadius: uiRadius.sm,
  background: uiColors.surface,
  color: uiColors.text,
  fontSize: uiFontSize.body,
  fontWeight: 600,
  cursor: 'pointer',
  boxSizing: 'border-box',
  lineHeight: 1.2,
}

export const uiButtonCompactStyle: CSSProperties = {
  minHeight: uiSize.buttonMinHeight,
  padding: `${uiSpace.tight}px ${uiSpace.md}px`,
  fontSize: uiFontSize.sm,
  fontWeight: 600,
}

/** Low-emphasis outline control. */
export const uiButtonGhostStyle: CSSProperties = {
  border: `1px solid transparent`,
  background: 'transparent',
  color: uiColors.textSoft,
  minHeight: uiSize.buttonMinHeight,
  padding: `${uiSpace.sm}px ${uiSpace.mdLg}px`,
  borderRadius: uiRadius.sm,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: uiFontSize.body,
  boxSizing: 'border-box',
  lineHeight: 1.2,
}

export const uiButtonDangerStyle: CSSProperties = {
  ...uiButtonSecondaryStyle,
  borderColor: uiColors.dangerBorder,
  color: uiColors.dangerText,
  background: uiColors.surface,
}

export const uiButtonDisabledStyle: CSSProperties = {
  cursor: 'not-allowed',
  opacity: 0.6,
}

/** Filled primary CTA (sign-in, main form submit). */
export const uiButtonFilledPrimaryStyle: CSSProperties = {
  width: '100%',
  padding: `${uiSpace.stack}px ${uiSpace.lg}px`,
  borderRadius: uiRadius.sm,
  border: `1px solid ${uiColors.text}`,
  background: uiColors.text,
  color: uiColors.surface,
  fontWeight: 600,
  fontSize: uiFontSize.body,
  minHeight: uiSize.buttonMinHeightLg,
  cursor: 'pointer',
  boxSizing: 'border-box',
  lineHeight: 1.2,
}

/** Bordered form section (stacked cards inside create/edit panels). */
export const uiFormSectionSurfaceStyle: CSSProperties = {
  border: `1px solid ${uiColors.borderLight}`,
  borderRadius: uiRadius.md,
  padding: uiSpace.lg,
  background: uiColors.surface,
  boxShadow: uiShadow.card,
  boxSizing: 'border-box',
  width: '100%',
}

export const uiFormDividerStyle: CSSProperties = {
  border: 'none',
  borderTop: `1px solid ${uiColors.borderLight}`,
  margin: `${uiSpace.mdLg}px 0 ${uiSpace.stack}px`,
}

/** Inset panels / insight blocks (detail columns, role insights). */
export const uiInsetPanelStyle: CSSProperties = {
  padding: uiSpace.lg,
  border: `1px solid ${uiColors.borderLight}`,
  borderRadius: uiRadius.md,
  background: uiColors.surface,
  marginBottom: uiSpace.lg,
  boxSizing: 'border-box',
  boxShadow: uiShadow.card,
}

export const uiInsetSectionHeadingStyle: CSSProperties = {
  margin: `0 0 ${uiSpace.sm}px`,
  fontSize: uiFontSize.body,
  fontWeight: 600,
  color: uiColors.textLabel,
}

export const uiInsetListItemStyle: CSSProperties = {
  padding: `${uiSpace.sm}px 0`,
  fontSize: uiFontSize.body,
  borderBottom: `1px solid ${uiColors.borderLight}`,
}

/** Two-column responsive field grid. */
export const uiFormFieldGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit, minmax(${uiLayout.formFieldMinWidth}px, 1fr))`,
  gap: uiSpace.stack,
  width: '100%',
  boxSizing: 'border-box',
}

/** Course / section summary strip on drill-down pages (matches toolbar card language). */
export const uiDrillDownContextCardStyle: CSSProperties = {
  border: `1px solid ${uiColors.borderLight}`,
  borderRadius: uiRadius.md,
  padding: `${uiSpace.mdLg}px ${uiSpace.lg}px`,
  marginBottom: uiSpace.xl,
  background: uiColors.surface,
  boxShadow: uiShadow.card,
  boxSizing: 'border-box',
}

export const uiDrillDownContextTitleStyle: CSSProperties = {
  fontWeight: 700,
  fontSize: uiFontSize.heading,
  marginBottom: uiSpace.tight,
  color: uiColors.text,
}

export const uiDrillDownContextMetaStyle: CSSProperties = {
  fontSize: uiFontSize.body,
  color: uiColors.textMuted,
}

/** Label column in read-only key / value rows (catalog side panels, summaries). */
export const uiMetaRowLabelStyle: CSSProperties = {
  minWidth: 110,
  color: uiColors.textSubtle,
  fontSize: uiFontSize.sm,
  fontWeight: 500,
}

/** Value column paired with `uiMetaRowLabelStyle`. */
export const uiMetaRowValueStyle: CSSProperties = {
  color: uiColors.text,
  fontWeight: 500,
  fontSize: uiFontSize.body,
}

/** Secondary fragment in `ContextCard` title (e.g. course #). */
export const uiContextCardTitleSuffixStyle: CSSProperties = {
  fontWeight: 500,
  color: uiColors.textMuted,
  fontSize: uiFontSize.body,
}

/** Trailing status on the meta line (e.g. Active / Inactive). */
export const uiContextCardInlineStatusStyle: CSSProperties = {
  marginLeft: uiSpace.stack,
  color: uiColors.textSubtle,
}

export const uiContextCardMetaStrongStyle: CSSProperties = {
  color: uiColors.text,
}

/** Inline aside on meta line (section status, extra tags). */
export const uiContextCardMetaAsideStyle: CSSProperties = {
  marginLeft: uiSpace.sm,
  color: uiColors.textSubtle,
}

/** Filter label + control row inside `ActionToolbar` (matches, groups). */
export const uiToolbarFilterRowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: uiSpace.md,
}

export const uiToolbarFilterLabelStyle: CSSProperties = {
  fontSize: uiFontSize.body,
  fontWeight: 600,
  color: uiColors.textLabel,
  whiteSpace: 'nowrap',
}

/** Paragraph below a context/panel card (e.g. group description). */
export const uiPanelFollowUpParagraphStyle: CSSProperties = {
  margin: `${uiSpace.md}px 0 ${uiSpace.xl}px`,
  fontSize: uiFontSize.body,
  color: uiColors.textSoft,
  lineHeight: uiLineHeight.relaxed,
}

/** Simple bordered row in stacked lists (attendance, roster previews). */
export const uiStackedListRowStyle: CSSProperties = {
  padding: uiSpace.md,
  marginBottom: uiSpace.sm,
  border: `1px solid ${uiColors.borderLight}`,
  borderRadius: uiRadius.sm,
  background: uiColors.surface,
  fontSize: uiFontSize.body,
  boxSizing: 'border-box',
}

/** Section title below page header / toolbars (list regions, attendance). */
export const uiWorkspaceSectionHeadingStyle: CSSProperties = {
  margin: `0 0 ${uiSpace.md}px`,
  fontSize: uiFontSize.titleSm,
  fontWeight: 600,
  color: uiColors.textStrong,
  letterSpacing: '-0.02em',
  lineHeight: uiLineHeight.tight,
}

/**
 * Workspace list block under toolbar/feedback.
 * Use with `WorkspaceSectionHeading` + `flushBottom`. Parent `workspaceMainColumnStyle` supplies vertical gap.
 */
export const uiWorkspaceListSectionStyle: CSSProperties = {
  paddingTop: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: uiSpace.md,
  minWidth: 0,
}

/** Inline form row: filters or short fields in one horizontal band. */
export const uiInlineFormRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: uiSpace.md,
  alignItems: 'flex-end',
}

/**
 * Single child for `ActionToolbar` `filters` slot: horizontal filter groups inside the bottom toolbar row.
 * Keeps People / Group / Match toolbar filter markup structurally parallel.
 */
export const uiToolbarFiltersClusterStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: uiSpace.md,
  minWidth: 0,
}

/** EmptyState inset inside `SelectableListShell` (heading → list gap handled by section). */
export const uiEmptyStateInSelectableListStyle: CSSProperties = {
  margin: `${uiSpace.md}px ${uiSpace.md}px ${uiSpace.lg}px`,
}

/** Selectable workspace list row — shared surface (People / Group / Match). */
export const uiSelectableListRowBaseStyle: CSSProperties = {
  padding: `${uiSpace.sm}px ${uiSpace.md}px`,
  borderBottom: `1px solid ${uiColors.borderLight}`,
  cursor: 'pointer',
  userSelect: 'none',
  boxSizing: 'border-box',
}

/** Inset from list shell padding + corner radius for row cards. */
export const uiSelectableListRowInsetStyle: CSSProperties = {
  borderRadius: uiRadius.sm,
  margin: `${uiSpace.xs}px ${uiSpace.sm}px`,
}

export function uiSelectableListRowSurface(selected: boolean, hovered: boolean): CSSProperties {
  return {
    background: selected ? uiColors.listRowSelected : hovered ? uiColors.listRowHover : uiColors.surface,
    borderLeft: `3px solid ${selected ? uiColors.listRowAccent : 'transparent'}`,
    boxShadow: hovered && !selected ? `inset 0 0 0 1px ${uiColors.borderLight}` : undefined,
    transition: 'background-color 0.14s ease, box-shadow 0.14s ease',
  }
}

export const uiSelectableListRowPrimaryTextStyle: CSSProperties = {
  fontWeight: 600,
  fontSize: uiFontSize.body,
  color: uiColors.text,
}

export const uiSelectableListRowSecondaryTextStyle: CSSProperties = {
  fontSize: uiFontSize.sm,
  color: uiColors.textMuted,
  marginTop: uiSpace.tight,
  lineHeight: uiLineHeight.body,
}

/** Tertiary line — IDs, status chips, session keys (lightest row text). */
export const uiSelectableListRowMetaTextStyle: CSSProperties = {
  fontSize: uiFontSize.xs,
  color: uiColors.textSubtle,
  marginTop: uiSpace.xs,
  lineHeight: uiLineHeight.body,
  letterSpacing: '0.01em',
}

/**
 * Multiline secondary (e.g. match lineup) — softer color + relaxed line height + wrapping.
 * Reuses the same primary→secondary spacing as `uiSelectableListRowSecondaryTextStyle`.
 */
export const uiSelectableListRowSecondaryMultilineStyle: CSSProperties = {
  ...uiSelectableListRowSecondaryTextStyle,
  color: uiColors.textSoft,
  lineHeight: uiLineHeight.relaxed,
  wordBreak: 'break-word',
}

/**
 * Inline fragment on a secondary line (role, status after email) — spacing + subtle color.
 */
export const uiSelectableListRowSecondaryAsideStyle: CSSProperties = {
  marginLeft: uiSpace.md,
  color: uiColors.textSubtle,
}
