import type { CSSProperties, ReactNode } from 'react'
import RootFormField from '../FormField'

type Props = {
  label: ReactNode
  children: ReactNode
  style?: CSSProperties
  labelStyle?: CSSProperties
}

/**
 * Compatibility wrapper for legacy `components/ui/form/FormField` imports.
 * Canonical form field lives at `components/ui/FormField`.
 */
export default function FormField({ label, children, style, labelStyle }: Props) {
  return (
    <RootFormField label={label} style={style} labelStyle={labelStyle}>
      {children}
    </RootFormField>
  )
}

