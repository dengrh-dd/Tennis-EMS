import type { CSSProperties, TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import './formControls.css'
import { uiControlDisabledStyle, uiTextareaBaseStyle } from './uiPrimitives'

type Props = {
  style?: CSSProperties
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'>

const TextAreaInput = forwardRef<HTMLTextAreaElement, Props>(function TextAreaInput(
  { style, disabled, className, rows = 3, ...rest },
  ref,
) {
  const disabledStyle = disabled ? uiControlDisabledStyle : {}
  return (
    <textarea
      ref={ref}
      disabled={disabled}
      rows={rows}
      className={['ui-textarea-input', className].filter(Boolean).join(' ')}
      style={{
        ...uiTextareaBaseStyle,
        ...disabledStyle,
        ...style,
      }}
      {...rest}
    />
  )
})

export default TextAreaInput
