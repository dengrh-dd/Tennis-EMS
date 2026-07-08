import type { CSSProperties } from 'react'
import type { TrainingGroup } from '../../../api/trainingGroupApi'
import { uiInsetPanelStyle, uiMetaRowLabelStyle, uiMetaRowValueStyle } from '../../../components/ui/uiPrimitives'
import { uiFontSize, uiSpace, uiText } from '../../../components/ui/uiTokens'

type Props = {
  group: TrainingGroup
  memberCount?: number
}

const rowStyle: CSSProperties = {
  display: 'flex',
  gap: uiSpace.sm,
  marginBottom: uiSpace.sm,
  fontSize: uiFontSize.body,
}

const headingStyle: CSSProperties = {
  margin: `0 0 ${uiSpace.md}px`,
  fontSize: uiFontSize.titleSm,
  fontWeight: 600,
  color: uiText.heading,
}

export default function GroupDetailCard({ group, memberCount }: Props) {
  return (
    <div style={uiInsetPanelStyle}>
      <h4 style={headingStyle}>Training group details</h4>
      <div style={rowStyle}>
        <span style={uiMetaRowLabelStyle}>Group ID</span>
        <span style={uiMetaRowValueStyle}>{group.groupId}</span>
      </div>
      <div style={rowStyle}>
        <span style={uiMetaRowLabelStyle}>Name</span>
        <span style={uiMetaRowValueStyle}>{group.name ?? '—'}</span>
      </div>
      <div style={rowStyle}>
        <span style={uiMetaRowLabelStyle}>Group type</span>
        <span style={uiMetaRowValueStyle}>{group.groupType ?? '—'}</span>
      </div>
      <div style={rowStyle}>
        <span style={uiMetaRowLabelStyle}>Status</span>
        <span style={uiMetaRowValueStyle}>{group.isActive === false ? 'Inactive' : 'Active'}</span>
      </div>
      <div style={rowStyle}>
        <span style={uiMetaRowLabelStyle}>Description</span>
        <span style={uiMetaRowValueStyle}>{group.description?.trim() ? group.description : '—'}</span>
      </div>
      <div style={{ ...rowStyle, marginBottom: 0 }}>
        <span style={uiMetaRowLabelStyle}>Members</span>
        <span style={uiMetaRowValueStyle}>{memberCount ?? 0}</span>
      </div>
    </div>
  )
}

