import type { FormEvent } from 'react'
import SectionCard from '../../../components/ui/SectionCard'
import ActionBar from '../../../components/ui/ActionBar'
import Button from '../../../components/ui/Button'
import FormField from '../../../components/ui/FormField'
import TextInput from '../../../components/ui/TextInput'
import StatusMessage from '../../../components/ui/StatusMessage'
import { uiFormStackStyle } from '../../../components/ui/uiPrimitives'
import CourseFormFields from './CourseFormFields'
import type { CoursesPageEditForm } from '../hooks/useCoursesPageController'

type Props = {
  busy: boolean
  panelDetailLoading: boolean
  form: CoursesPageEditForm
  onClose: () => void
  onSubmit: (e: FormEvent) => void
}

export default function CourseEditPanel({ busy, panelDetailLoading, form, onClose, onSubmit }: Props) {
  const {
    courseId,
    name,
    setName,
    courseNumber,
    setCourseNumber,
    description,
    setDescription,
    level,
    setLevel,
    isActive,
    setIsActive,
  } = form

  const disabled = busy || panelDetailLoading

  return (
    <SectionCard label="Edit course" marginBottom={0}>
      <ActionBar className="ems-form-actions ems-form-actions-end">
        <Button type="button" variant="ghost" onClick={onClose} disabled={disabled}>
          Close
        </Button>
      </ActionBar>
      <form onSubmit={onSubmit} style={uiFormStackStyle}>
        {panelDetailLoading ? (
          <StatusMessage variant="info" message="Loading course details…" marginBottom={10} role="status" />
        ) : null}

        <FormField label="Course ID" required>
          <TextInput type="number" value={courseId} required min={1} disabled />
        </FormField>

        <FormField label="Name">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} disabled={disabled} />
        </FormField>

        <FormField label="Course number">
          <TextInput value={courseNumber} onChange={(e) => setCourseNumber(e.target.value)} disabled={disabled} />
        </FormField>

        <CourseFormFields
          disabled={disabled}
          description={description}
          onDescriptionChange={setDescription}
          descriptionRows={2}
          level={level}
          onLevelChange={setLevel}
          isActive={isActive}
          onIsActiveChange={setIsActive}
        />

        <ActionBar className="ems-form-actions ems-form-footer">
          <Button type="submit" variant="secondary" disabled={disabled}>
            Save changes
          </Button>
        </ActionBar>
      </form>
    </SectionCard>
  )
}
