import type { CSSProperties, ReactNode } from 'react'
import { uiColors, uiFormFieldStyle, uiFormLabelStyle } from './uiPrimitives'

/** Label row in stacked fields — `uiFormFieldStyle` `gap` supplies spacing to the control. */
const formFieldLabelRowStyle: CSSProperties = {
  ...uiFormLabelStyle,
  marginBottom: 0,
}

type Props = {
  label: ReactNode
  children: ReactNode
  /** When true, appends a required indicator after the label. */
  required?: boolean
  style?: CSSProperties
  labelStyle?: CSSProperties
}

/** Label + control column — shared field chrome for management forms. */
export default function FormField({ label, children, required, style, labelStyle }: Props) {
  return (
    <div style={{ ...uiFormFieldStyle, ...style }}>
      <div style={{ ...formFieldLabelRowStyle, ...labelStyle }}>
        {label}
        {required ? <span style={{ color: uiColors.required }}> *</span> : null}
      </div>
      {children}
    </div>
  )
}
