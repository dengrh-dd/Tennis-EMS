import type { CSSProperties, ReactNode } from 'react'
import { uiWorkspaceSectionHeadingStyle } from './uiPrimitives'

type Props = {
  children: ReactNode
  /**
   * When the parent uses flex `gap` for spacing (e.g. `uiWorkspaceListSectionStyle`),
   * set so the heading does not add an extra bottom margin.
   */
  flushBottom?: boolean
  style?: CSSProperties
}

/** H2-style section title for workspace pages (lists, attendance blocks). */
export default function WorkspaceSectionHeading({ children, flushBottom, style }: Props) {
  const headingStyle: CSSProperties = {
    ...uiWorkspaceSectionHeadingStyle,
    ...(flushBottom ? { margin: 0 } : {}),
    ...style,
  }
  return <h2 style={headingStyle}>{children}</h2>
}
