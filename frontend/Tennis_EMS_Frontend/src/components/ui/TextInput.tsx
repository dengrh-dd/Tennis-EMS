import type { CSSProperties, InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import './formControls.css'
import { uiControlBaseStyle, uiControlDisabledStyle, uiControlReadonlyStyle } from './uiPrimitives'

type Props = {
  style?: CSSProperties
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'style'>

const TextInput = forwardRef<HTMLInputElement, Props>(function TextInput(
  { style, disabled, readOnly, className, ...rest },
  ref,
) {
  const readOnlyStyle = readOnly ? uiControlReadonlyStyle : {}
  const disabledStyle = disabled ? uiControlDisabledStyle : {}
  return (
    <input
      ref={ref}
      disabled={disabled}
      readOnly={readOnly}
      className={['ui-text-input', className].filter(Boolean).join(' ')}
      style={{
        ...uiControlBaseStyle,
        ...readOnlyStyle,
        ...disabledStyle,
        ...style,
      }}
      {...rest}
    />
  )
})

export default TextInput
