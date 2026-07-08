import type { ReactNode } from 'react'
import {
  emsDashboardSectionPanelStyle,
  emsDashboardSectionSubtitleStyle,
  emsDashboardSectionTitleStyle,
} from '../styles/dashboardPrimitives'

type Props = {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function StudentDashboardSection({ title, subtitle, children }: Props) {
  return (
    <section style={emsDashboardSectionPanelStyle}>
      <h3 style={emsDashboardSectionTitleStyle}>{title}</h3>
      {subtitle ? <p style={emsDashboardSectionSubtitleStyle}>{subtitle}</p> : null}
      {children}
    </section>
  )
}

