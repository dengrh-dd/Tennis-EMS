import type { FormEvent } from 'react'
import SectionCard from '../../../components/ui/SectionCard'
import ActionBar from '../../../components/ui/ActionBar'
import Button from '../../../components/ui/Button'
import FormField from '../../../components/ui/FormField'
import TextInput from '../../../components/ui/TextInput'
import { uiFormStackStyle } from '../../../components/ui/uiPrimitives'
import CourseFormFields from './CourseFormFields'
import type { CoursesPageCreateForm } from '../hooks/useCoursesPageController'

type Props = {
  busy: boolean
  form: CoursesPageCreateForm
  onClose: () => void
  onSubmit: (e: FormEvent) => void
}

export default function CourseCreatePanel({ busy, form, onClose, onSubmit }: Props) {
  const {
    name,
    setName,
    courseNumber,
    setCourseNumber,
    description,
    setDescription,
    level,
    setLevel,
    isActiveNew,
    setIsActiveNew,
  } = form

  return (
    <SectionCard label="Create course" marginBottom={0}>
      <ActionBar className="ems-form-actions ems-form-actions-end">
        <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
          Close
        </Button>
      </ActionBar>
      <form onSubmit={onSubmit} style={uiFormStackStyle}>
        <FormField label="Name" required>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} required disabled={busy} />
        </FormField>

        <FormField label="Course number" required>
          <TextInput
            value={courseNumber}
            onChange={(e) => setCourseNumber(e.target.value)}
            required
            placeholder="Unique code"
            disabled={busy}
          />
        </FormField>

        <CourseFormFields
          disabled={busy}
          description={description}
          onDescriptionChange={setDescription}
          descriptionRows={3}
          level={level}
          onLevelChange={setLevel}
          levelRequired
          isActive={isActiveNew}
          onIsActiveChange={setIsActiveNew}
        />

        <ActionBar className="ems-form-actions ems-form-footer">
          <Button type="submit" variant="secondary" disabled={busy}>
            Create course
          </Button>
        </ActionBar>
      </form>
    </SectionCard>
  )
}
