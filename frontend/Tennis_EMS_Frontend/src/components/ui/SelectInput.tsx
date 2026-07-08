import type { CSSProperties, ReactNode, SelectHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import './formControls.css'
import { uiControlBaseStyle, uiControlDisabledStyle } from './uiPrimitives'

type Props = {
  style?: CSSProperties
  selectStyle?: CSSProperties
  children: ReactNode
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'style'>

const SelectInput = forwardRef<HTMLSelectElement, Props>(function SelectInput(
  { style, disabled, className, children, ...rest },
  ref,
) {
  const disabledStyle = disabled ? uiControlDisabledStyle : {}
  return (
    <select
      ref={ref}
      disabled={disabled}
      className={['ui-select-input', className].filter(Boolean).join(' ')}
      style={{
        ...uiControlBaseStyle,
        ...disabledStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </select>
  )
})

export default SelectInput
