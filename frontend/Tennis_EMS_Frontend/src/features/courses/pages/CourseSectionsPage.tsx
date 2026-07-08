import { Link } from 'react-router-dom'
import DrillDownPageShell from '../../../components/layout/DrillDownPageShell'
import SplitPageLayout from '../../../components/layout/SplitPageLayout'
import {
  breadcrumbCurrentStyle,
  breadcrumbLinkStyle,
  drillDownRightPanelColumnStyle,
  workspaceMainColumnStyle,
} from '../../../components/layout/drillDownLayout'
import ActionToolbar from '../../../components/ui/ActionToolbar'
import Button from '../../../components/ui/Button'
import ContextCard from '../../../components/ui/ContextCard'
import PageFeedback from '../../../components/ui/PageFeedback'
import PageHeader from '../../../components/ui/PageHeader'
import StatusMessage from '../../../components/ui/StatusMessage'
import { uiSpace } from '../../../components/ui/uiTokens'
import CourseSectionCatalogSection from '../components/CourseSectionCatalogSection'
import SectionCreatePanel from '../components/SectionCreatePanel'
import SectionEditPanel from '../components/SectionEditPanel'
import { useCourseSectionsPageController } from '../hooks/useCourseSectionsPageController'
import { ADMIN_COURSES } from '../routes'

export default function CourseSectionsPage() {
  const ctrl = useCourseSectionsPageController()

  const mainColumn = (
    <div style={workspaceMainColumnStyle}>
      <PageHeader
        breadcrumb={
          <>
            <Link to={ADMIN_COURSES} style={breadcrumbLinkStyle}>
              Courses
            </Link>
            {' / '}
            <span style={breadcrumbCurrentStyle}>{ctrl.courseTitle}</span>
          </>
        }
        backLabel="← Back to Courses"
        onBack={ctrl.handleBackToCourses}
      />

      {ctrl.invalidCourse && (
        <StatusMessage variant="error" message="Invalid course in URL." marginBottom={uiSpace.md} />
      )}

      {!ctrl.invalidCourse && ctrl.course && (
        <ContextCard
          title={ctrl.course.name}
          meta={
            <>
              Code #{ctrl.course.courseNumber}
              {ctrl.course.level != null && ctrl.course.level !== '' && ` · ${ctrl.course.level}`}
            </>
          }
          status={ctrl.course.isActive !== false ? 'Active' : 'Inactive'}
        />
      )}

      <ActionToolbar
        title="Sections"
        actions={
          <>
            <Button type="button" variant="primary" onClick={ctrl.openCreatePanel} disabled={ctrl.isCreateDisabled}>
              Create Section
            </Button>
            <Button type="button" variant="secondary" onClick={ctrl.openEditPanel} disabled={ctrl.isEditDisabled}>
              Edit Selected Section
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={ctrl.handleToolbarEnrollment}
              disabled={ctrl.isEnrollmentNavDisabled}
            >
              Enrollment / roster
            </Button>
          </>
        }
      />

      <PageFeedback
        success={ctrl.success}
        error={ctrl.error}
        loading={ctrl.loading}
        loadingMessage="Loading…"
      />

      <CourseSectionCatalogSection
        sections={ctrl.sections}
        selectedSectionId={ctrl.selectedSectionId}
        loading={ctrl.loading}
        invalidCourse={ctrl.invalidCourse}
        busy={ctrl.busy}
        onSelectSection={ctrl.handleSelectSection}
        onViewSessions={ctrl.handleViewSessions}
        onViewEnrollment={ctrl.handleViewEnrollment}
        onArchive={ctrl.handleArchiveSection}
      />
    </div>
  )

  const sideColumn = ctrl.panelOpen ? (
    <div style={drillDownRightPanelColumnStyle}>
      {ctrl.showCreatePanel && (
        <SectionCreatePanel
          courseId={ctrl.courseId}
          form={ctrl.createForm}
          coachSelectOptions={ctrl.coachSelectOptions}
          coachesLoading={ctrl.coachesLoading}
          busy={ctrl.busy}
          onClose={ctrl.handleClosePanel}
          onSubmit={ctrl.handleCreate}
        />
      )}
      {ctrl.showEditPanel && (
        <SectionEditPanel
          form={ctrl.editForm}
          coachSelectOptionsEdit={ctrl.coachSelectOptionsEdit}
          coachesLoading={ctrl.coachesLoading}
          busy={ctrl.busy}
          panelDetailLoading={ctrl.panelDetailLoading}
          onClose={ctrl.handleClosePanel}
          onSubmit={ctrl.handleUpdate}
        />
      )}
    </div>
  ) : null

  return (
    <DrillDownPageShell panelOpen={ctrl.panelOpen}>
      <SplitPageLayout main={mainColumn} side={sideColumn} />
    </DrillDownPageShell>
  )
}
