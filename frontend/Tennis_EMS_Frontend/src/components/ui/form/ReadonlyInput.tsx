import type { CSSProperties, InputHTMLAttributes } from 'react'
import TextInput from '../TextInput'

type Props = {
  value: string
  disabled?: boolean
  required?: boolean
  type?: InputHTMLAttributes<HTMLInputElement>['type']
  className?: string
  style?: CSSProperties
  ariaLabel?: string
}

export default function ReadonlyInput({ value, disabled = true, required, type = 'text', className, style, ariaLabel }: Props) {
  return (
    <TextInput
      type={type}
      value={value}
      disabled={disabled}
      required={required}
      readOnly
      className={['form-input', 'ui-text-input', 'form-input-readonly', className].filter(Boolean).join(' ')}
      style={style}
      aria-label={ariaLabel}
    />
  )
}

