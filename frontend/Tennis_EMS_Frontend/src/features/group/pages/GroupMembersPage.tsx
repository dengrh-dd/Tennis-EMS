import DrillDownPageShell from '../../../components/layout/DrillDownPageShell'
import SplitPageLayout from '../../../components/layout/SplitPageLayout'
import { workspaceMainColumnStyle } from '../../../components/layout/drillDownLayout'
import { useGroupMembersPageController } from '../hooks/useGroupMembersPageController'
import {
  GroupMembersAddSection,
  GroupMembersHeaderSection,
  GroupMembersListSection,
  GroupMembersStatusSection,
  GroupMembersToolbarSection,
} from '../sections'

export default function GroupMembersPage() {
  const ctrl = useGroupMembersPageController()

  const main = (
    <div style={workspaceMainColumnStyle}>
      <GroupMembersHeaderSection
        group={ctrl.group}
        groupId={ctrl.groupId}
        loading={ctrl.loading}
        members={ctrl.members}
        onBack={ctrl.handleBack}
      />
      <GroupMembersStatusSection
        success={ctrl.success}
        error={ctrl.error}
        loading={ctrl.loading}
        group={ctrl.group}
      />
      <GroupMembersToolbarSection
        loading={ctrl.loading}
        busy={ctrl.busy}
        group={ctrl.group}
        showActiveOnly={ctrl.showActiveOnly}
        onShowActiveOnlyChange={ctrl.setShowActiveOnly}
        showAddForm={ctrl.showAddForm}
        onToggleAddForm={ctrl.toggleAddForm}
      />
      <GroupMembersAddSection
        open={ctrl.showAddForm && Boolean(ctrl.group)}
        busy={ctrl.busy}
        students={ctrl.students}
        studentId={ctrl.addStudentId}
        setStudentId={ctrl.setAddStudentId}
        studentOptions={ctrl.availableStudentOptions}
        startDate={ctrl.addStartDate}
        setStartDate={ctrl.setAddStartDate}
        endDate={ctrl.addEndDate}
        setEndDate={ctrl.setAddEndDate}
        onSubmit={ctrl.handleAddMember}
        onCancel={ctrl.cancelAdd}
        inlineMessage={ctrl.addMemberMessage}
        inlineError={ctrl.addMemberError}
      />
      <GroupMembersListSection
        loading={ctrl.loading}
        members={ctrl.displayedMembers}
        studentMap={ctrl.studentMap}
        busy={ctrl.busy}
        editingStudentId={ctrl.editingStudentId}
        editStartDate={ctrl.editStartDate}
        setEditStartDate={ctrl.setEditStartDate}
        editEndDate={ctrl.editEndDate}
        setEditEndDate={ctrl.setEditEndDate}
        onEdit={ctrl.beginEdit}
        onCancelEdit={ctrl.cancelEdit}
        onSaveEdit={ctrl.saveEdit}
        onRemove={ctrl.removeMember}
      />
    </div>
  )

  return (
    <DrillDownPageShell panelOpen={false}>
      <SplitPageLayout main={main} />
    </DrillDownPageShell>
  )
}
