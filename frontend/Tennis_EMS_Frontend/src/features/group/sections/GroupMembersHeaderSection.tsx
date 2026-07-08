import { Link } from 'react-router-dom'
import {
  breadcrumbCurrentStyle,
  breadcrumbLinkStyle,
} from '../../../components/layout/drillDownLayout'
import PageHeader from '../../../components/ui/PageHeader'
import GroupMembersHeader from '../components/GroupMembersHeader'
import type { TrainingGroup, TrainingGroupMember } from '../../../api/trainingGroupApi'
import { GROUPS_ROOT } from '../../../routes/featurePaths'

type Props = {
  group: TrainingGroup | null
  groupId: number
  loading: boolean
  members: TrainingGroupMember[]
  onBack: () => void
}

export default function GroupMembersHeaderSection({
  group,
  groupId,
  loading,
  members,
  onBack,
}: Props) {
  return (
    <>
      <PageHeader
        breadcrumbLineHeight={1.6}
        breadcrumb={
          <>
            <Link
              to={GROUPS_ROOT}
              state={{ selectedGroupId: group?.groupId ?? groupId }}
              style={breadcrumbLinkStyle}
            >
              Group
            </Link>
            {' / '}
            <span style={breadcrumbCurrentStyle}>{group?.name ?? (loading ? '…' : `#${groupId}`)}</span>
            {' / '}
            <span style={breadcrumbCurrentStyle}>Members</span>
          </>
        }
        backLabel="← Back to Groups"
        onBack={onBack}
      />

      {!loading && group && <GroupMembersHeader group={group} members={members} />}
    </>
  )
}
