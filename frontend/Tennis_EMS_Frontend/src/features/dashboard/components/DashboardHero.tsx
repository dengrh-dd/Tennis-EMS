import type { ReactNode } from 'react'
import {
  emsContentShellStyle,
  emsDashboardHeroStyle,
  emsDashboardHeroSubtitleStyle,
  emsDashboardPageTitleStyle,
} from '../styles/dashboardPrimitives'

type Props = {
  title: string
  subtitle: string
  badge?: ReactNode
}

export default function DashboardHero({ title, subtitle, badge }: Props) {
  return (
    <div style={emsContentShellStyle}>
      <div style={emsDashboardHeroStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
          <h1 style={emsDashboardPageTitleStyle}>{title}</h1>
          {badge ? <div>{badge}</div> : null}
        </div>
        <p style={emsDashboardHeroSubtitleStyle}>{subtitle}</p>
      </div>
    </div>
  )
}

