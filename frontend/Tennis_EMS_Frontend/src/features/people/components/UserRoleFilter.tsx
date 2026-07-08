import type { CSSProperties } from 'react'
import '../../../components/ui/emsFormLayout.css'
import type { UserRole } from '../../../api/userApi'
import { USER_ROLES } from '../../../api/userApi'

export const ROLE_FILTER_ALL = 'ALL' as const
export type RoleFilterValue = typeof ROLE_FILTER_ALL | UserRole

type Props = {
  value: RoleFilterValue
  onChange: (value: RoleFilterValue) => void
  disabled?: boolean
  /** @deprecated Prefer `className`; default is `ems-select`. */
  style?: CSSProperties
  className?: string
}

export default function UserRoleFilter({
  value,
  onChange,
  disabled,
  style,
  className = 'ems-select',
}: Props) {
  const options: { value: RoleFilterValue; label: string }[] = [
    { value: ROLE_FILTER_ALL, label: 'All' },
    ...USER_ROLES.map((r) => ({ value: r as RoleFilterValue, label: r })),
  ]
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as RoleFilterValue)}
      disabled={disabled}
      className={className}
      style={style}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
