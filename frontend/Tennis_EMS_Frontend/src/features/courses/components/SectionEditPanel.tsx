import type { FormEvent } from 'react'
import SearchableSelect from '../../../components/ui/form/SearchableSelect'
import FormField from '../../../components/ui/FormField'
import TextInput from '../../../components/ui/form/TextInput'
import ReadonlyInput from '../../../components/ui/form/ReadonlyInput'
import FormActionButton from '../../../components/ui/form/FormActionButton'
import PanelShell from '../../../components/ui/PanelShell'
import type { CoachSelectOption } from '../utils/courseSectionCoachOptions'
import type { CourseSectionsPageEditForm } from '../hooks/useCourseSectionsPageController'
import SectionFormFields from './SectionFormFields'
import '../../../components/ui/formControls.css'

type Props = {
  form: CourseSectionsPageEditForm
  coachSelectOptionsEdit: CoachSelectOption[]
  coachesLoading: boolean
  busy: boolean
  panelDetailLoading: boolean
  onClose: () => void
  onSubmit: (e: FormEvent) => void
}

export default function SectionEditPanel({
  form,
  coachSelectOptionsEdit,
  coachesLoading,
  busy,
  panelDetailLoading,
  onClose,
  onSubmit,
}: Props) {
  const {
    sectionId,
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

  const disabled = busy || panelDetailLoading
  const coachDisabled = disabled || coachesLoading || coachSelectOptionsEdit.length === 0

  return (
    <PanelShell title="Edit Section" onClose={onClose} closeDisabled={busy || panelDetailLoading}>
      <form onSubmit={onSubmit} className="form-root">
        {panelDetailLoading && (
          <div style={{ color: '#64748b', fontSize: 14 }}>Loading section details…</div>
        )}
        <FormField label="Section ID">
          <ReadonlyInput value={sectionId} ariaLabel="Section ID" />
        </FormField>
        <SearchableSelect
          id="section-edit-coach"
          label={
            <>
              Coach <span style={{ color: 'coral' }}>*</span>
            </>
          }
          required
          emptyOptionLabel={coachesLoading ? 'Loading coaches…' : 'Select a coach'}
          options={coachSelectOptionsEdit}
          value={coachId}
          onChange={setCoachId}
          disabled={coachDisabled}
          searchPlaceholder="Search coaches by name…"
        />
        <FormField label={<>Name <span style={{ color: 'coral' }}>*</span></>}>
          <TextInput value={name} onChange={setName} required disabled={disabled} />
        </FormField>
        <SectionFormFields
          disabled={disabled}
          syllabusLabel="Syllabus"
          syllabus={syllabus}
          onSyllabusChange={setSyllabus}
          startDate={startDate}
          onStartDateCommit={setStartDate}
          endDate={endDate}
          onEndDateCommit={setEndDate}
          maxStudents={maxStudents}
          onMaxStudentsChange={setMaxStudents}
          maxStudentsLabel="Max students"
        />
        <FormActionButton type="submit" disabled={disabled} style={{ alignSelf: 'flex-start' }}>
          Save changes
        </FormActionButton>
      </form>
    </PanelShell>
  )
}
