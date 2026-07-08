import type { ReactNode } from 'react'
import { breadcrumbBarStyle } from '../layout/drillDownLayout'
import { uiSpace } from './uiTokens'

type Props = {
  children: ReactNode
  marginBottom?: number
  lineHeight?: number
}

export default function BreadcrumbBar({ children, marginBottom = uiSpace.lg, lineHeight }: Props) {
  return <div style={breadcrumbBarStyle(marginBottom, lineHeight)}>{children}</div>
}

