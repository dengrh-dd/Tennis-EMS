import type { FormEvent } from 'react'
import {
  MATCH_STATUS_OPTIONS,
  MATCH_TYPES,
  type MatchType,
  type ScoringFormat,
  type TrainingMatch,
} from '../../../api/matchApi'
import FormField from '../../../components/ui/FormField'
import FormActionButton from '../../../components/ui/form/FormActionButton'
import '../../../components/ui/emsFormLayout.css'

type CourseOption = {
  courseId: number
  label: string
}

type SectionOption = {
  sectionId: number
  label: string
}

type SessionOption = {
  sessionId: number
  label: string
}

type BaseProps = {
  busy: boolean
  formats: ScoringFormat[]
  formatId: string
  setFormatId: (value: string) => void
  matchType: MatchType
  setMatchType: (value: MatchType) => void
  title: string
  setTitle: (value: string) => void
  notes: string
  setNotes: (value: string) => void
  status: string
  setStatus: (value: string) => void
  winnerSide: string
  setWinnerSide: (value: string) => void
  /** When set, winner dropdown shows player names but values remain A/B. */
  winnerSideLabels?: { A: string; B: string }
}

type CreateProps = BaseProps & {
  onSubmit: (e: FormEvent) => void
  selectedCourseId: string
  setSelectedCourseId: (value: string) => void
  selectedSectionId: string
  setSelectedSectionId: (value: string) => void
  selectedSessionId: string
  setSelectedSessionId: (value: string) => void
  courseOptions: CourseOption[]
  sectionOptions: SectionOption[]
  sessionOptions: SessionOption[]
  sectionsLoading: boolean
  sessionsLoading: boolean
}

type EditProps = BaseProps & {
  match: TrainingMatch
  onSubmit: (e: FormEvent) => void
  sessionId: string
  setSessionId: (value: string) => void
}

export function CreateMatchForm(props: CreateProps) {
  return <MatchFormInternal {...props} submitLabel="Create match" />
}

export function EditMatchForm({ match, ...props }: EditProps) {
  return (
    <form onSubmit={props.onSubmit} className="ems-form">
      <FormField label="Match ID">
        <input type="number" readOnly className="ems-input ems-input-readonly" value={match.matchId} />
      </FormField>
      <FormField label="Session ID" required>
        <input
          type="number"
          min={1}
          required
          disabled={props.busy}
          className="ems-input"
          value={props.sessionId}
          onChange={(e) => props.setSessionId(e.target.value)}
        />
      </FormField>
      <MatchFormFields {...props} />
      <div className="ems-form-actions ems-form-actions-end">
        <FormActionButton type="submit" variant="primary" disabled={props.busy}>
          Save changes
        </FormActionButton>
      </div>
    </form>
  )
}

function MatchFormInternal(props: CreateProps & { submitLabel: string }) {
  return (
    <form onSubmit={props.onSubmit} className="ems-form">
      <CreateSessionSelectorFields {...props} />
      <MatchFormFields
        busy={props.busy}
        formats={props.formats}
        formatId={props.formatId}
        setFormatId={props.setFormatId}
        matchType={props.matchType}
        setMatchType={props.setMatchType}
        title={props.title}
        setTitle={props.setTitle}
        notes={props.notes}
        setNotes={props.setNotes}
        status={props.status}
        setStatus={props.setStatus}
        winnerSide={props.winnerSide}
        setWinnerSide={props.setWinnerSide}
        winnerSideLabels={props.winnerSideLabels}
      />
      <div className="ems-form-actions ems-form-actions-end">
        <FormActionButton type="submit" variant="primary" disabled={props.busy}>
          {props.submitLabel}
        </FormActionButton>
      </div>
    </form>
  )
}

function MatchFormFields({
  busy,
  formats,
  formatId,
  setFormatId,
  matchType,
  setMatchType,
  title,
  setTitle,
  notes,
  setNotes,
  status,
  setStatus,
  winnerSide,
  setWinnerSide,
  winnerSideLabels,
}: BaseProps) {
  return (
    <>
      <FormField label="Scoring format" required>
        <select
          required
          disabled={busy}
          className="ems-select"
          value={formatId}
          onChange={(e) => setFormatId(e.target.value)}
        >
          <option value="">Select active format</option>
          {formats.map((format) => (
            <option key={format.formatId} value={format.formatId}>
              {format.name ?? `Format #${format.formatId}`}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Match type">
        <select
          disabled={busy}
          className="ems-select"
          value={matchType}
          onChange={(e) => setMatchType(e.target.value as MatchType)}
        >
          {MATCH_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Status">
        <select disabled={busy} className="ems-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          {MATCH_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Title">
        <input
          disabled={busy}
          className="ems-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />
      </FormField>

      <FormField label="Notes">
        <textarea
          disabled={busy}
          className="ems-textarea"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={1000}
        />
      </FormField>

      <FormField label="Winner side">
        <select
          disabled={busy}
          className="ems-select"
          value={winnerSide}
          onChange={(e) => setWinnerSide(e.target.value)}
        >
          <option value="">Not set</option>
          <option value="A">{winnerSideLabels?.A ?? 'Side A'}</option>
          <option value="B">{winnerSideLabels?.B ?? 'Side B'}</option>
        </select>
      </FormField>
    </>
  )
}

function CreateSessionSelectorFields({
  busy,
  selectedCourseId,
  setSelectedCourseId,
  selectedSectionId,
  setSelectedSectionId,
  selectedSessionId,
  setSelectedSessionId,
  courseOptions,
  sectionOptions,
  sessionOptions,
  sectionsLoading,
  sessionsLoading,
}: {
  busy: boolean
  selectedCourseId: string
  setSelectedCourseId: (value: string) => void
  selectedSectionId: string
  setSelectedSectionId: (value: string) => void
  selectedSessionId: string
  setSelectedSessionId: (value: string) => void
  courseOptions: CourseOption[]
  sectionOptions: SectionOption[]
  sessionOptions: SessionOption[]
  sectionsLoading: boolean
  sessionsLoading: boolean
}) {
  return (
    <>
      <FormField label="Course" required>
        <select
          required
          disabled={busy}
          className="ems-select"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="">Select course</option>
          {courseOptions.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Section" required>
        <select
          required
          disabled={busy || !selectedCourseId || sectionsLoading}
          className="ems-select"
          value={selectedSectionId}
          onChange={(e) => setSelectedSectionId(e.target.value)}
        >
          <option value="">{sectionsLoading ? 'Loading sections...' : 'Select section'}</option>
          {sectionOptions.map((section) => (
            <option key={section.sectionId} value={section.sectionId}>
              {section.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Session" required>
        <select
          required
          disabled={busy || !selectedSectionId || sessionsLoading}
          className="ems-select"
          value={selectedSessionId}
          onChange={(e) => setSelectedSessionId(e.target.value)}
        >
          <option value="">{sessionsLoading ? 'Loading sessions...' : 'Select session'}</option>
          {sessionOptions.map((session) => (
            <option key={session.sessionId} value={session.sessionId}>
              {session.label}
            </option>
          ))}
        </select>
      </FormField>
    </>
  )
}
