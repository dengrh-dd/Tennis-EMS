import type { ReactNode } from 'react'
import { pageHeaderRootStyle } from '../layout/pageHeaderLayout'
import BackLink from './BackLink'
import BreadcrumbBar from './BreadcrumbBar'
import { uiSpace } from './uiTokens'

type Props = {
  /** Breadcrumb trail (typically `Link` + separators + current segment). */
  breadcrumb: ReactNode
  backLabel: string
  onBack: () => void
  /** Optional line below the back control (section ID, helper copy). */
  description?: ReactNode
  /** Passed through to `BreadcrumbBar` for multi-line trails. */
  breadcrumbLineHeight?: number
  /**
   * Space below the breadcrumb block before the back control.
   * @default uiSpace.sm
   */
  breadcrumbMarginBottom?: number
}

/**
 * Drill-down page chrome: breadcrumb strip, back navigation, optional description.
 */
export default function PageHeader({
  breadcrumb,
  backLabel,
  onBack,
  description,
  breadcrumbLineHeight,
  breadcrumbMarginBottom = uiSpace.sm,
}: Props) {
  return (
    <header style={pageHeaderRootStyle}>
      <BreadcrumbBar marginBottom={breadcrumbMarginBottom} lineHeight={breadcrumbLineHeight}>
        {breadcrumb}
      </BreadcrumbBar>
      <BackLink label={backLabel} onClick={onBack} />
      {description}
    </header>
  )
}
