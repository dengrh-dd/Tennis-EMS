import type { ReactNode } from 'react'
import DetailPanelShell from '../../../components/ui/DetailPanelShell'

type Props = {
  title: string
  onEdit: () => void
  editDisabled?: boolean
  children: ReactNode
}

export default function UserDetailPanel({ title, onEdit, editDisabled, children }: Props) {
  return (
    <DetailPanelShell
      eyebrow="Overview"
      title={title}
      actions={[{ label: 'Edit', onClick: onEdit, disabled: editDisabled }]}
    >
      {children}
    </DetailPanelShell>
  )
}
