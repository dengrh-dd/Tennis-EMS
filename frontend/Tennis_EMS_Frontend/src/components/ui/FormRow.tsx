import type { CSSProperties, ReactNode } from 'react'

type Props = {
  children: ReactNode
  columns?: number | string
  gap?: number
  style?: CSSProperties
}

export default function FormRow({ children, columns = 2, gap = 8, style }: Props) {
  const template = typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: template,
        gap,
        width: '100%',
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
