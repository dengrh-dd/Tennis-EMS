import { Link } from 'react-router-dom'
import { uiColors } from '../../../components/ui/uiPrimitives'
import {
  emsDashboardTileCardStyle,
  emsDashboardTileDescriptionStyle,
  emsDashboardTileTitleStyle,
} from '../styles/dashboardPrimitives'

type Props = {
  title: string
  description: string
  to: string
  buttonText?: string
}

export default function DashboardActionCard({ title, description, to, buttonText }: Props) {
  return (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={emsDashboardTileCardStyle}>
        <h3 style={emsDashboardTileTitleStyle}>{title}</h3>
        <p style={emsDashboardTileDescriptionStyle}>{description}</p>
        {buttonText ? (
          <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: uiColors.link }}>{buttonText}</div>
        ) : null}
      </div>
    </Link>
  )
}

