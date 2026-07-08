import type { TrainingGroup } from '../../../api/trainingGroupApi'

type Props = {
  success: string | null
  error: string | null
  loading: boolean
  group: TrainingGroup | null
}

export default function GroupMembersStatusSection({ success, error, loading, group }: Props) {
  return (
    <>
      {success && <div style={{ color: '#15803d', marginBottom: 12, fontSize: 14 }}>{success}</div>}
      {error && <div style={{ color: '#c2410c', marginBottom: 12, fontSize: 14 }}>{error}</div>}
      {loading && <p style={{ color: '#64748b', marginTop: 0, marginBottom: 16 }}>Loading group members…</p>}
      {group?.isActive === false && (
        <p style={{ marginTop: 0, marginBottom: 12, color: '#64748b', fontSize: 14 }}>
          This group is inactive; adding new members is disabled.
        </p>
      )}
    </>
  )
}
