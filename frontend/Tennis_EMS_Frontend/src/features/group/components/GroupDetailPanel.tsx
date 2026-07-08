import type { ReactNode } from 'react'
import DetailPanelShell, { type DetailPanelAction } from '../../../components/ui/DetailPanelShell'

type Props = {
  title: string
  onEdit: () => void
  editDisabled?: boolean
  onViewMembers?: () => void
  viewMembersDisabled?: boolean
  children: ReactNode
}

export default function GroupDetailPanel({
  title,
  onEdit,
  editDisabled,
  onViewMembers,
  viewMembersDisabled,
  children,
}: Props) {
  const actions: DetailPanelAction[] = []
  if (onViewMembers) {
    actions.push({
      label: 'View Members',
      onClick: onViewMembers,
      disabled: viewMembersDisabled,
    })
  }
  actions.push({ label: 'Edit', onClick: onEdit, disabled: editDisabled })

  return (
    <DetailPanelShell eyebrow="Overview" title={title} actions={actions}>
      {children}
    </DetailPanelShell>
  )
}
