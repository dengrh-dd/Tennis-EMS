import { Link } from 'react-router-dom'
import {
  emsDashboardBodyMutedStyle,
  emsDashboardTileCardStyle,
  emsDashboardTileDescriptionStyle,
  emsDashboardTileTitleStyle,
} from '../styles/dashboardPrimitives'

type Props = {
  title: string
  description: string
  to: string
  statusLabel?: string
}

export default function DashboardFeatureCard({ title, description, to, statusLabel }: Props) {
  return (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={emsDashboardTileCardStyle}>
        <h3 style={emsDashboardTileTitleStyle}>{title}</h3>
        <p style={emsDashboardTileDescriptionStyle}>{description}</p>
        {statusLabel ? (
          <p style={{ ...emsDashboardBodyMutedStyle, marginTop: 8, fontSize: 12 }}>{statusLabel}</p>
        ) : null}
      </div>
    </Link>
  )
}

