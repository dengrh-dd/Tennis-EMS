import type { FormEvent } from 'react'
import SearchableSelect from '../../../components/ui/form/SearchableSelect'
import FormField from '../../../components/ui/FormField'
import TextInput from '../../../components/ui/form/TextInput'
import FormActionButton from '../../../components/ui/form/FormActionButton'
import PanelShell from '../../../components/ui/PanelShell'
import type { CoachSelectOption } from '../utils/courseSectionCoachOptions'
import type { CourseSectionsPageCreateForm } from '../hooks/useCourseSectionsPageController'
import SectionFormFields from './SectionFormFields'
import '../../../components/ui/formControls.css'

type Props = {
  courseId: number
  form: CourseSectionsPageCreateForm
  coachSelectOptions: CoachSelectOption[]
  coachesLoading: boolean
  busy: boolean
  onClose: () => void
  onSubmit: (e: FormEvent) => void
}

export default function SectionCreatePanel({
  courseId,
  form,
  coachSelectOptions,
  coachesLoading,
  busy,
  onClose,
  onSubmit,
}: Props) {
  const {
    coachId,
    setCoachId,
    name,
    setName,
    syllabus,
    setSyllabus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    maxStudents,
    setMaxStudents,
  } = form

  const coachDisabled = busy || coachesLoading || coachSelectOptions.length === 0

  return (
    <PanelShell title="Create Section" onClose={onClose} closeDisabled={busy}>
      <form onSubmit={onSubmit} className="form-root">
        <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
          Course ID: <strong>{courseId}</strong> (from URL)
        </p>
        <SearchableSelect
          id="section-create-coach"
          label={
            <>
              Coach <span style={{ color: 'coral' }}>*</span>
            </>
          }
          required
          emptyOptionLabel={coachesLoading ? 'Loading coaches…' : 'Select a coach'}
          options={coachSelectOptions}
          value={coachId}
          onChange={setCoachId}
          disabled={coachDisabled}
          searchPlaceholder="Search coaches by name…"
        />
        <FormField label={<>Section name / code <span style={{ color: 'coral' }}>*</span></>}>
          <TextInput value={name} onChange={setName} required disabled={busy} />
        </FormField>
        <SectionFormFields
          disabled={busy}
          syllabusLabel="Syllabus (optional)"
          syllabus={syllabus}
          onSyllabusChange={setSyllabus}
          startDate={startDate}
          onStartDateCommit={setStartDate}
          endDate={endDate}
          onEndDateCommit={setEndDate}
          maxStudents={maxStudents}
          onMaxStudentsChange={setMaxStudents}
          maxStudentsLabel="Max students (optional)"
        />
        <FormActionButton type="submit" disabled={busy} style={{ alignSelf: 'flex-start' }}>
          Create section
        </FormActionButton>
      </form>
    </PanelShell>
  )
}
