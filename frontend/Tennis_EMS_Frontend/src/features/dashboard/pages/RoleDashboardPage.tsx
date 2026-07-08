import type { ReactNode } from 'react'
import { uiColors } from '../../../components/ui/uiPrimitives'
import { uiSpace } from '../../../components/ui/uiTokens'
import {
  emsContentShellStyle,
  emsDashboardCardGridStyle,
  emsDashboardTwoColumnGridStyle,
} from '../styles/dashboardPrimitives'
import DashboardActionCard from '../components/DashboardActionCard'
import DashboardFeatureCard from '../components/DashboardFeatureCard'
import DashboardHero from '../components/DashboardHero'
import DashboardSection from '../components/DashboardSection'
import DashboardStatCard from '../components/DashboardStatCard'
import type { RoleDashboardConfig } from '../types/dashboard'

type Props = {
  config: RoleDashboardConfig
  extensions?: ReactNode
}

export default function RoleDashboardPage({ config, extensions }: Props) {
  return (
    <div
      style={{
        padding: `${uiSpace.lg}px ${uiSpace.lg}px ${uiSpace.xxl}px`,
        maxWidth: 1100,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <DashboardHero
        title={config.heroTitle}
        subtitle={config.heroSubtitle}
        badge={
          config.heroBadge ? (
            <span
              style={{
                borderRadius: 999,
                border: `1px solid ${uiColors.borderLight}`,
                padding: '4px 10px',
                fontSize: 12,
                color: uiColors.textMuted,
                background: uiColors.surfaceMuted,
              }}
            >
              {config.heroBadge}
            </span>
          ) : null
        }
      />

      <section style={emsContentShellStyle}>
        <div style={emsDashboardTwoColumnGridStyle}>
          <div>
            <DashboardSection title="At a glance" subtitle="High-level counts for your role.">
              <div style={emsDashboardCardGridStyle}>
                {config.stats.map((card) => (
                  <DashboardStatCard
                    key={card.id}
                    title={card.title}
                    value={card.value}
                    helperText={card.helperText}
                  />
                ))}
              </div>
            </DashboardSection>
          </div>
          <div>
            <DashboardSection
              title="Quick actions"
              subtitle="Jump to the most common tasks for this role."
            >
              <div style={emsDashboardCardGridStyle}>
                {config.actions.map((card) => (
                  <DashboardActionCard
                    key={card.id}
                    title={card.title}
                    description={card.description}
                    to={card.to}
                    buttonText={card.buttonText}
                  />
                ))}
              </div>
            </DashboardSection>
          </div>
        </div>
      </section>

      <DashboardSection
        title="Feature overview"
        subtitle="Explore the main areas of the system that are relevant to this role."
      >
        <div style={{ ...emsDashboardCardGridStyle, marginTop: uiSpace.xs }}>
          {config.features.map((card) => (
            <DashboardFeatureCard
              key={card.id}
              title={card.title}
              description={card.description}
              to={card.to}
              statusLabel={card.statusLabel}
            />
          ))}
        </div>
      </DashboardSection>

      {extensions ? <div style={{ marginTop: uiSpace.xl }}>{extensions}</div> : null}
    </div>
  )
}

