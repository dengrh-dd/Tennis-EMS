import type { FormEvent } from 'react'
import type { User, UserRole } from '../../../api/userApi'
import { ADMIN_LEVELS, STUDENT_SKILL_LEVELS, USER_ROLES } from '../../../api/userApi'
import '../../../components/ui/formControls.css'
import DateInput from '../../../components/ui/form/DateInput'
import FormField from '../../../components/ui/FormField'
import {
  uiButtonDisabledStyle,
  uiButtonFilledPrimaryStyle,
  uiCheckboxBoxStyle,
  uiCheckboxRowStyle,
  uiColors,
  uiControlBaseStyle,
  uiControlDisabledStyle,
  uiControlReadonlyStyle,
  uiFormDividerStyle,
  uiFormFieldGridStyle,
  uiFormSectionSurfaceStyle,
  uiFormStackStyle,
  uiTextareaBaseStyle,
} from '../../../components/ui/uiPrimitives'
import { uiSectionLabelStyle, uiSpace } from '../../../components/ui/uiTokens'

function fieldStyle(busy: boolean) {
  return { ...uiControlBaseStyle, ...(busy ? uiControlDisabledStyle : {}) }
}

type CreateFormProps = {
  busy: boolean
  onSubmit: (e: FormEvent) => void
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  role: UserRole
  setRole: (v: UserRole) => void
  firstName: string
  setFirstName: (v: string) => void
  lastName: string
  setLastName: (v: string) => void
  phone: string
  setPhone: (v: string) => void
  adminLevel: string
  setAdminLevel: (v: string) => void
  dateOfBirth: string
  setDateOfBirth: (v: string) => void
  certification: string
  setCertification: (v: string) => void
  experienceYears: string
  setExperienceYears: (v: string) => void
  bio: string
  setBio: (v: string) => void
  preferredName: string
  setPreferredName: (v: string) => void
  skillLevel: string
  setSkillLevel: (v: string) => void
  notes: string
  setNotes: (v: string) => void
  emergencyContactName: string
  setEmergencyContactName: (v: string) => void
  emergencyContactPhone: string
  setEmergencyContactPhone: (v: string) => void
}

type EditFormProps = {
  busy: boolean
  user: User
  onSubmit: (e: FormEvent) => void
  email: string
  setEmail: (v: string) => void
  isActive: boolean
  setIsActive: (v: boolean) => void
}

const subSectionHeadingStyle = {
  fontSize: 12,
  fontWeight: 600 as const,
  color: uiColors.textMuted,
  marginTop: 4,
  marginBottom: uiSpace.sm,
}

export function CreateUserForm(props: CreateFormProps) {
  const {
    busy,
    onSubmit,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    adminLevel,
    setAdminLevel,
    dateOfBirth,
    setDateOfBirth,
    certification,
    setCertification,
    experienceYears,
    setExperienceYears,
    bio,
    setBio,
    preferredName,
    setPreferredName,
    skillLevel,
    setSkillLevel,
    notes,
    setNotes,
    emergencyContactName,
    setEmergencyContactName,
    emergencyContactPhone,
    setEmergencyContactPhone,
  } = props

  const fs = fieldStyle(busy)

  return (
    <form onSubmit={onSubmit} style={{ ...uiFormStackStyle, paddingTop: 0 }}>
      <div style={{ ...uiFormSectionSurfaceStyle, marginBottom: uiSpace.md }}>
        <div style={{ ...uiSectionLabelStyle, marginBottom: uiSpace.md }}>Account</div>
        <FormField label="Email" required>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={busy}
            className="ui-text-input"
            style={fs}
            autoComplete="off"
          />
        </FormField>
        <FormField label="Password" required>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={busy}
            className="ui-text-input"
            style={fs}
            autoComplete="new-password"
          />
        </FormField>
        <FormField label="Role" required>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            disabled={busy}
            className="ui-select-input"
            style={fs}
          >
            {USER_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div style={{ ...uiFormSectionSurfaceStyle, marginBottom: uiSpace.md }}>
        <div style={{ ...uiSectionLabelStyle, marginBottom: uiSpace.md }}>Profile</div>
        <div style={uiFormFieldGridStyle}>
          <FormField label="First name" required>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={busy}
              className="ui-text-input"
              style={fs}
            />
          </FormField>
          <FormField label="Last name" required>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={busy}
              className="ui-text-input"
              style={fs}
            />
          </FormField>
        </div>

        <hr style={uiFormDividerStyle} />
        <div style={subSectionHeadingStyle}>Role details</div>

        {role === 'ADMIN' && (
          <>
            <FormField label="Phone">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={busy}
                className="ui-text-input"
                style={fs}
                inputMode="tel"
                autoComplete="tel"
              />
            </FormField>
            <FormField label="Admin level">
              <select
                value={adminLevel}
                onChange={(e) => setAdminLevel(e.target.value)}
                disabled={busy}
                className="ui-select-input"
                style={fs}
              >
                {ADMIN_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </FormField>
          </>
        )}

        {role === 'COACH' && (
          <>
            <FormField label="Phone">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={busy}
                className="ui-text-input"
                style={fs}
                inputMode="tel"
                autoComplete="tel"
              />
            </FormField>
            <FormField label="Date of birth">
              <DateInput
                value={dateOfBirth}
                onCommit={setDateOfBirth}
                disabled={busy}
                className="ui-text-input"
                style={fs}
                aria-label="Coach date of birth"
              />
            </FormField>
            <FormField label="Certification">
              <input
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
                disabled={busy}
                className="ui-text-input"
                style={fs}
              />
            </FormField>
            <FormField label="Experience (years)">
              <input
                type="number"
                min={0}
                step={1}
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                disabled={busy}
                className="ui-text-input"
                style={fs}
              />
            </FormField>
            <FormField label="Bio">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={busy}
                className="ui-textarea-input"
                style={{ ...uiTextareaBaseStyle, ...(busy ? uiControlDisabledStyle : {}) }}
                rows={3}
              />
            </FormField>
          </>
        )}

        {role === 'STUDENT' && (
          <>
            <FormField label="Preferred name">
              <input
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                disabled={busy}
                className="ui-text-input"
                style={fs}
                placeholder="Optional"
              />
            </FormField>
            <FormField label="Phone">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={busy}
                className="ui-text-input"
                style={fs}
                inputMode="tel"
                autoComplete="tel"
              />
            </FormField>
            <FormField label="Date of birth">
              <DateInput
                value={dateOfBirth}
                onCommit={setDateOfBirth}
                disabled={busy}
                className="ui-text-input"
                style={fs}
                aria-label="Student date of birth"
              />
            </FormField>
            <FormField label="Skill level">
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                disabled={busy}
                className="ui-select-input"
                style={fs}
              >
                {STUDENT_SKILL_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Notes">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={busy}
                className="ui-textarea-input"
                style={{ ...uiTextareaBaseStyle, ...(busy ? uiControlDisabledStyle : {}) }}
                rows={2}
              />
            </FormField>
            <div style={uiFormFieldGridStyle}>
              <FormField label="Emergency contact name">
                <input
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  disabled={busy}
                  className="ui-text-input"
                  style={fs}
                />
              </FormField>
              <FormField label="Emergency contact phone">
                <input
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  disabled={busy}
                  className="ui-text-input"
                  style={fs}
                  inputMode="tel"
                />
              </FormField>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: uiSpace.sm }}>
        <button
          type="submit"
          disabled={busy}
          style={{
            ...uiButtonFilledPrimaryStyle,
            ...(busy ? uiButtonDisabledStyle : {}),
          }}
        >
          Create user
        </button>
      </div>
    </form>
  )
}

export function EditUserForm({ busy, user, onSubmit, email, setEmail, isActive, setIsActive }: EditFormProps) {
  const fs = fieldStyle(busy)
  const readonly = { ...uiControlBaseStyle, ...uiControlReadonlyStyle }

  return (
    <form onSubmit={onSubmit} style={{ ...uiFormStackStyle, paddingTop: 0 }}>
      <FormField label="User ID">
        <input type="number" value={user.userId} readOnly className="ui-text-input" style={readonly} />
      </FormField>
      <FormField label="Email">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} className="ui-text-input" style={fs} />
      </FormField>
      <label style={{ ...uiCheckboxRowStyle, marginBottom: uiSpace.sm }}>
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          disabled={busy}
          className="ui-checkbox-input"
          style={uiCheckboxBoxStyle}
        />
        <span>Active</span>
      </label>
      <button
        type="submit"
        disabled={busy}
        style={{
          ...uiButtonFilledPrimaryStyle,
          width: 'auto',
          alignSelf: 'flex-start',
          ...(busy ? uiButtonDisabledStyle : {}),
        }}
      >
        Save changes
      </button>
    </form>
  )
}
