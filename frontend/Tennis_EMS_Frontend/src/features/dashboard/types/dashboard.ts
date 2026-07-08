export type DashboardStatCardConfig = {
  id: string
  title: string
  value: string
  helperText?: string
}

export type DashboardActionCardConfig = {
  id: string
  title: string
  description: string
  to: string
  buttonText?: string
}

export type DashboardFeatureCardConfig = {
  id: string
  title: string
  description: string
  to: string
  statusLabel?: string
}

export type RoleDashboardConfig = {
  roleLabel: string
  heroTitle: string
  heroSubtitle: string
  heroBadge?: string
  stats: DashboardStatCardConfig[]
  actions: DashboardActionCardConfig[]
  features: DashboardFeatureCardConfig[]
}

