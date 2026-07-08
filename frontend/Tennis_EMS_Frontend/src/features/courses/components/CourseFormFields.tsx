import FormField from '../../../components/ui/FormField'
import TextAreaInput from '../../../components/ui/TextAreaInput'
import SelectInput from '../../../components/ui/SelectInput'
import CheckboxField from '../../../components/ui/CheckboxField'
import { COURSE_LEVELS } from '../../../api/courseApi'

type Props = {
  disabled: boolean
  description: string
  onDescriptionChange: (value: string) => void
  descriptionRows: number
  level: string
  onLevelChange: (value: string) => void
  levelRequired?: boolean
  isActive: boolean
  onIsActiveChange: (checked: boolean) => void
}

export default function CourseFormFields({
  disabled,
  description,
  onDescriptionChange,
  descriptionRows,
  level,
  onLevelChange,
  levelRequired = false,
  isActive,
  onIsActiveChange,
}: Props) {
  return (
    <>
      <FormField label="Description">
        <TextAreaInput
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={descriptionRows}
          disabled={disabled}
        />
      </FormField>

      <FormField label="Level" required={levelRequired}>
        <SelectInput value={level} onChange={(e) => onLevelChange(e.target.value)} disabled={disabled}>
          {COURSE_LEVELS.map((lv) => (
            <option key={lv} value={lv}>
              {lv}
            </option>
          ))}
        </SelectInput>
      </FormField>

      <CheckboxField
        checked={isActive}
        onChange={(e) => onIsActiveChange(e.target.checked)}
        disabled={disabled}
        label="Active"
      />
    </>
  )
}
