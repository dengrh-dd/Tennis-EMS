import type { ReactNode } from 'react'
import { uiSpace } from '../../../components/ui/uiTokens'
import {
  emsContentShellStyle,
  emsDashboardSectionLabelStyle,
  emsDashboardSectionPanelStyle,
  emsDashboardSectionSubtitleStyle,
} from '../styles/dashboardPrimitives'

type Props = {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function DashboardSection({ title, subtitle, children }: Props) {
  return (
    <section style={{ ...emsContentShellStyle, marginTop: uiSpace.xl }}>
      <h2 style={emsDashboardSectionLabelStyle}>{title}</h2>
      <div style={emsDashboardSectionPanelStyle}>
        {subtitle ? <p style={emsDashboardSectionSubtitleStyle}>{subtitle}</p> : null}
        {children}
      </div>
    </section>
  )
}

