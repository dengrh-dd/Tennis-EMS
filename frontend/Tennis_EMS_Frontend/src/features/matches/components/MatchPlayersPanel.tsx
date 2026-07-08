import type { FormEvent } from 'react'
import type { MatchSide, MatchSidePlayer, MatchType } from '../../../api/matchApi'
import ActionBar from '../../../components/ui/ActionBar'
import EmptyState from '../../../components/ui/EmptyState'
import FormField from '../../../components/ui/FormField'
import FormRow from '../../../components/ui/FormRow'
import InlineFeedback from '../../../components/ui/InlineFeedback'
import PanelCard from '../../../components/ui/PanelCard'
import '../../../components/ui/emsFormLayout.css'

type StudentOption = {
  studentId: number
  label: string
}

type Props = {
  players: MatchSidePlayer[]
  students: StudentOption[]
  busy: boolean
  matchType: MatchType
  addSide: MatchSide
  setAddSide: (value: MatchSide) => void
  addPosition: string
  setAddPosition: (value: string) => void
  addStudentId: string
  setAddStudentId: (value: string) => void
  onSubmitAdd: (e: FormEvent) => void
  onDeletePlayer: (side: MatchSide, position: number) => void
  inlineMessage?: string | null
  inlineError?: string | null
}

export default function MatchPlayersPanel({
  players,
  students,
  busy,
  matchType,
  addSide,
  setAddSide,
  addPosition,
  setAddPosition,
  addStudentId,
  setAddStudentId,
  onSubmitAdd,
  onDeletePlayer,
  inlineMessage,
  inlineError,
}: Props) {
  const maxPlayersPerSide = matchType === 'DOUBLES' ? 2 : 1
  const sideACount = players.filter((player) => player.side === 'A').length
  const sideBCount = players.filter((player) => player.side === 'B').length
  const sideCapReached = addSide === 'A' ? sideACount >= maxPlayersPerSide : sideBCount >= maxPlayersPerSide

  const subtitle =
    matchType === 'DOUBLES' ? 'Doubles: max 2 players per side.' : 'Singles: max 1 player per side.'

  return (
    <PanelCard title="Players" subtitle={subtitle}>
      <form onSubmit={onSubmitAdd} className="ems-form" style={{ padding: 0 }}>
        <FormRow
          columns={
            matchType === 'DOUBLES' ? 'repeat(4, minmax(0, 1fr))' : 'minmax(0, 1fr) minmax(0, 2fr)'
          }
        >
          <FormField label="Side" required>
            <select
              className="ems-select"
              disabled={busy}
              value={addSide}
              onChange={(e) => setAddSide(e.target.value as MatchSide)}
            >
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </FormField>
          {matchType === 'DOUBLES' && (
            <FormField label="Position" required>
              <select
                required
                className="ems-select"
                disabled={busy}
                value={addPosition}
                onChange={(e) => setAddPosition(e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </FormField>
          )}
          <FormField
            label="Student"
            required
            style={matchType === 'DOUBLES' ? { gridColumn: 'span 2' } : undefined}
          >
            <select
              required
              className="ems-select"
              disabled={busy}
              value={addStudentId}
              onChange={(e) => setAddStudentId(e.target.value)}
            >
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student.studentId} value={student.studentId}>
                  {student.label}
                </option>
              ))}
            </select>
          </FormField>
        </FormRow>

        {inlineMessage ? <InlineFeedback type="success" message={inlineMessage} dense /> : null}
        {inlineError ? <InlineFeedback type="error" message={inlineError} dense /> : null}

        <ActionBar>
          <button type="submit" disabled={busy || sideCapReached} className="ems-action-button">
            Add player
          </button>
        </ActionBar>
      </form>

      <div style={{ marginTop: 12 }}>
        {players.length === 0 && <EmptyState message="No players assigned yet." />}
        {players.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '6px 4px' }}>Side</th>
                {matchType === 'DOUBLES' && <th style={{ padding: '6px 4px' }}>Position</th>}
                <th style={{ padding: '6px 4px' }}>Student</th>
                <th style={{ padding: '6px 4px' }} />
              </tr>
            </thead>
            <tbody>
              {players
                .slice()
                .sort((a, b) => (a.side === b.side ? a.position - b.position : a.side.localeCompare(b.side)))
                .map((player) => {
                  const student = students.find((item) => item.studentId === player.studentId)
                  return (
                    <tr key={`${player.side}-${player.position}`} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 4px' }}>{player.side}</td>
                      {matchType === 'DOUBLES' && <td style={{ padding: '8px 4px' }}>{player.position}</td>}
                      <td style={{ padding: '8px 4px' }}>
                        {student?.label ?? `Student #${player.studentId}`}
                      </td>
                      <td style={{ padding: '8px 4px', textAlign: 'right' }}>
                        <ActionBar style={{ marginTop: 0, justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            disabled={busy}
                            className="ems-action-button"
                            onClick={() => onDeletePlayer(player.side as MatchSide, player.position)}
                          >
                            Remove
                          </button>
                        </ActionBar>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        )}
      </div>
    </PanelCard>
  )
}
