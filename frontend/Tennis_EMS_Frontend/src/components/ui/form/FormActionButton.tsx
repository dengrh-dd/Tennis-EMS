import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import Button from '../Button'

type Props = {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  style?: CSSProperties
  children: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'>

/** Compatibility wrapper: routes legacy form action buttons through shared Button primitive. */
export default function FormActionButton({
  type = 'button',
  disabled,
  variant = 'secondary',
  style,
  children,
  ...rest
}: Props) {
  return (
    <Button type={type} disabled={disabled} variant={variant} style={style} {...rest}>
      {children}
    </Button>
  )
}

