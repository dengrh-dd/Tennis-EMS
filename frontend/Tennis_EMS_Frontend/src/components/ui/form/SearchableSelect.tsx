import { useMemo, useState, type ReactNode } from 'react'

export type EntitySelectOption = {
  value: string
  label: string
}

type Props = {
  id?: string
  label: ReactNode
  required?: boolean
  searchPlaceholder?: string
  emptyOptionLabel: string
  options: EntitySelectOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

/**
 * Search box + native select.
 * - Submits only `value` (entity id string).
 * - Options carry display labels only.
 */
export default function SearchableSelect({
  id,
  label,
  required,
  searchPlaceholder = 'Search…',
  emptyOptionLabel,
  options,
  value,
  onChange,
  disabled,
}: Props) {
  const [q, setQ] = useState('')

  const filteredOptions = useMemo(() => {
    const qq = q.trim().toLowerCase()
    const selected = options.find((o) => o.value === value)
    const base = !qq ? options : options.filter((o) => o.label.toLowerCase().includes(qq))
    if (selected && !base.some((o) => o.value === value)) {
      return [selected, ...base]
    }
    return base
  }, [options, q, value])

  return (
    <label className="form-field" htmlFor={id}>
      <span className="form-label">{label}</span>
      <input
        id={id ? `${id}-search` : undefined}
        type="search"
        autoComplete="off"
        placeholder={searchPlaceholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        disabled={disabled}
        className="form-input"
        aria-label={typeof label === 'string' ? `Filter ${label}` : 'Filter list'}
      />
      <select
        id={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="form-select"
      >
        <option value="">{emptyOptionLabel}</option>
        {filteredOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

