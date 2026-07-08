import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react'
import './formControls.css'
import { uiCheckboxBoxStyle, uiCheckboxRowStyle } from './uiPrimitives'

type Props = {
  label: ReactNode
  style?: CSSProperties
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'style' | 'type'>

/**
 * Checkbox + label row — uses `formControls.css` for `:focus-visible` / `:disabled` (`.ui-checkbox-input`).
 */
export default function CheckboxField({ label, style, className, disabled, ...rest }: Props) {
  return (
    <label
      style={{
        ...uiCheckboxRowStyle,
        ...(disabled ? { opacity: 0.7, cursor: 'not-allowed' } : {}),
        ...style,
      }}
      className={className}
    >
      <input
        type="checkbox"
        disabled={disabled}
        className="ui-checkbox-input"
        style={uiCheckboxBoxStyle}
        {...rest}
      />
      <span>{label}</span>
    </label>
  )
}
