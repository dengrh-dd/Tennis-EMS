import PanelShell from '../../../components/ui/PanelShell'
import WorkspaceSideSection from '../../../components/ui/WorkspaceSideSection'
import { CreateUserForm, EditUserForm } from '../components/UserForm'
import { usePeoplePageController } from '../hooks/usePeoplePageController'

type PeoplePageController = ReturnType<typeof usePeoplePageController>

type Props = {
  ctrl: PeoplePageController
}

export default function PeoplePanelSection({ ctrl }: Props) {
  if (ctrl.panelMode === null) return null

  return (
    <WorkspaceSideSection variant="action" title="Action panel">
      {ctrl.panelMode === 'create' && (
        <PanelShell title="Create User" onClose={ctrl.handleClosePanel} closeDisabled={ctrl.busy}>
          <CreateUserForm
            busy={ctrl.busy || ctrl.panelDetailLoading}
            onSubmit={ctrl.handleCreate}
            email={ctrl.email}
            setEmail={ctrl.setEmail}
            password={ctrl.password}
            setPassword={ctrl.setPassword}
            role={ctrl.role}
            setRole={ctrl.handleCreateRoleChange}
            firstName={ctrl.firstName}
            setFirstName={ctrl.setFirstName}
            lastName={ctrl.lastName}
            setLastName={ctrl.setLastName}
            phone={ctrl.phone}
            setPhone={ctrl.setPhone}
            adminLevel={ctrl.adminLevel}
            setAdminLevel={ctrl.setAdminLevel}
            dateOfBirth={ctrl.dateOfBirth}
            setDateOfBirth={ctrl.setDateOfBirth}
            certification={ctrl.certification}
            setCertification={ctrl.setCertification}
            experienceYears={ctrl.experienceYears}
            setExperienceYears={ctrl.setExperienceYears}
            bio={ctrl.bio}
            setBio={ctrl.setBio}
            preferredName={ctrl.preferredName}
            setPreferredName={ctrl.setPreferredName}
            skillLevel={ctrl.skillLevel}
            setSkillLevel={ctrl.setSkillLevel}
            notes={ctrl.notes}
            setNotes={ctrl.setNotes}
            emergencyContactName={ctrl.emergencyContactName}
            setEmergencyContactName={ctrl.setEmergencyContactName}
            emergencyContactPhone={ctrl.emergencyContactPhone}
            setEmergencyContactPhone={ctrl.setEmergencyContactPhone}
          />
        </PanelShell>
      )}

      {ctrl.panelMode === 'edit' && ctrl.selectedUser && (
        <PanelShell title="Edit User" onClose={ctrl.handleClosePanel} closeDisabled={ctrl.busy || ctrl.panelDetailLoading}>
          <EditUserForm
            busy={ctrl.busy || ctrl.panelDetailLoading}
            user={ctrl.selectedUser}
            onSubmit={ctrl.handleUpdate}
            email={ctrl.editEmail}
            setEmail={ctrl.setEditEmail}
            isActive={ctrl.editIsActive}
            setIsActive={ctrl.setEditIsActive}
          />
        </PanelShell>
      )}
    </WorkspaceSideSection>
  )
}
