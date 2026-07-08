import type { ReactNode } from 'react'
import { selectableListShellStyle } from '../layout/drillDownLayout'

type Props = {
  children: ReactNode
}

export default function SelectableListShell({ children }: Props) {
  return <div style={selectableListShellStyle}>{children}</div>
}

