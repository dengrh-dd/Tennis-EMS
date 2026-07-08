import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import './buttonInteractions.css'
import {
  uiButtonCompactStyle,
  uiButtonDangerStyle,
  uiButtonDisabledStyle,
  uiButtonGhostStyle,
  uiButtonPrimaryStyle,
  uiButtonSecondaryStyle,
} from './uiPrimitives'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

type Props = {
  variant?: ButtonVariant
  size?: 'default' | 'compact'
  children: ReactNode
  isLoading?: boolean
  loadingText?: ReactNode
  style?: CSSProperties
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'>

const variantStyle: Record<ButtonVariant, CSSProperties> = {
  primary: uiButtonPrimaryStyle,
  secondary: uiButtonSecondaryStyle,
  danger: uiButtonDangerStyle,
  ghost: uiButtonGhostStyle,
}

/** Outline / filled-adjacent button variants for toolbars and forms. */
export default function Button({
  variant = 'secondary',
  size = 'default',
  disabled,
  isLoading = false,
  loadingText = 'Loading...',
  style,
  type = 'button',
  className,
  children,
  ...rest
}: Props) {
  const base = variantStyle[variant]
  const compact = size === 'compact' ? uiButtonCompactStyle : {}
  const computedDisabled = disabled || isLoading
  return (
    <button
      type={type}
      disabled={computedDisabled}
      aria-busy={isLoading || undefined}
      className={['ui-interactive-button', `ui-interactive-button--${variant}`, isLoading ? 'ui-interactive-button--loading' : '', className]
        .filter(Boolean)
        .join(' ')}
      style={{
        ...base,
        ...compact,
        ...(computedDisabled ? uiButtonDisabledStyle : {}),
        ...style,
      }}
      {...rest}
    >
      {isLoading ? loadingText : children}
    </button>
  )
}
