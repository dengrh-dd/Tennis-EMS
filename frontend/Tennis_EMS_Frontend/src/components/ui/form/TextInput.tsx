import type { CSSProperties, InputHTMLAttributes } from 'react'
import RootTextInput from '../TextInput'

type Props = {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  required?: boolean
  placeholder?: string
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  type?: InputHTMLAttributes<HTMLInputElement>['type']
  readOnly?: boolean
  className?: string
  style?: CSSProperties
}

/** Compatibility wrapper for legacy controlled API in `components/ui/form/TextInput`. */
export default function TextInput({
  value,
  onChange,
  disabled,
  required,
  placeholder,
  inputMode,
  type = 'text',
  readOnly,
  className,
  style,
}: Props) {
  const readonlyClass = readOnly ? 'form-input-readonly' : ''
  return (
    <RootTextInput
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      inputMode={inputMode}
      readOnly={readOnly}
      className={['form-input', 'ui-text-input', readonlyClass, className].filter(Boolean).join(' ')}
      style={style}
    />
  )
}

