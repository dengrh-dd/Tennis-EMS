import { uiColors } from '../../../components/ui/uiPrimitives'
import { uiFontSize, uiLineHeight } from '../../../components/ui/uiTokens'
import {
  emsDashboardBodyMutedStyle,
  emsDashboardTileCardStyle,
  emsDashboardTileDescriptionStyle,
  emsDashboardTileTitleStyle,
} from '../styles/dashboardPrimitives'

type Props = {
  title: string
  value: string
  helperText?: string
}

export default function DashboardStatCard({ title, value, helperText }: Props) {
  return (
    <div style={emsDashboardTileCardStyle}>
      <h3 style={emsDashboardTileTitleStyle}>{title}</h3>
      <div
        style={{
          fontSize: uiFontSize.hero,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: uiLineHeight.tight,
          color: uiColors.textDeep,
          marginBottom: helperText ? 6 : 0,
        }}
      >
        {value}
      </div>
      {helperText ? <p style={{ ...emsDashboardTileDescriptionStyle, ...emsDashboardBodyMutedStyle }}>{helperText}</p> : null}
    </div>
  )
}

