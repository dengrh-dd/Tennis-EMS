import { drillDownRightPanelColumnStyle, workspacePageStackStyle } from '../../../components/layout/drillDownLayout'
import PageShell from '../../../components/layout/PageShell'
import SplitPageLayout from '../../../components/layout/SplitPageLayout'
import ActionBar from '../../../components/ui/ActionBar'
import Button from '../../../components/ui/Button'
import PageFeedback from '../../../components/ui/PageFeedback'
import StatusMessage from '../../../components/ui/StatusMessage'
import CourseCatalogSection from '../components/CourseCatalogSection'
import CourseCreatePanel from '../components/CourseCreatePanel'
import CourseEditPanel from '../components/CourseEditPanel'
import SelectedCourseWorkspace from '../components/SelectedCourseWorkspace'
import { useCoursesPageController } from '../hooks/useCoursesPageController'

export default function CoursesPage() {
  const ctrl = useCoursesPageController()

  const headerActions =
    ctrl.canCreate || ctrl.canEdit ? (
      <>
        {ctrl.canCreate ? (
          <Button type="button" variant="primary" onClick={ctrl.openCreatePanel} disabled={ctrl.isCreateDisabled}>
            Create Course
          </Button>
        ) : null}
        {ctrl.canEdit ? (
          <Button type="button" variant="secondary" onClick={ctrl.openEditPanel} disabled={ctrl.isEditDisabled}>
            Edit Selected Course
          </Button>
        ) : null}
      </>
    ) : undefined

  if (!ctrl.canView) {
    return (
      <PageShell title="Course catalog" subtitle="Browse and manage program courses.">
        <StatusMessage variant="info" message="You do not have access to the course catalog." />
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div style={workspacePageStackStyle}>
        <ActionBar
          title="Course catalog"
          subtitle="Select a course to open sections or manage the catalog."
          actions={headerActions}
        />

        <SplitPageLayout
          main={
            <>
              <PageFeedback
                success={ctrl.success}
                error={ctrl.error}
                loading={ctrl.loading}
                loadingMessage="Loading courses…"
              />
              <CourseCatalogSection
                loading={ctrl.loading}
                busy={ctrl.busy}
                courses={ctrl.courses}
                selectedCourseId={ctrl.selectedCourseId}
                panelsOpen={false}
                canDelete={ctrl.canDelete}
                onSelectCourse={ctrl.handleSelectCourse}
                onViewSections={ctrl.handleViewSections}
                onArchive={ctrl.canDelete ? ctrl.handleArchive : undefined}
              />
            </>
          }
          side={
            <div style={drillDownRightPanelColumnStyle}>
              {ctrl.showCreateForm ? (
                <CourseCreatePanel form={ctrl.createForm} busy={ctrl.busy} onClose={ctrl.handleClosePanel} onSubmit={ctrl.handleCreate} />
              ) : null}
              {ctrl.showEditForm ? (
                <CourseEditPanel
                  busy={ctrl.busy}
                  panelDetailLoading={ctrl.panelDetailLoading}
                  form={ctrl.editForm}
                  onClose={ctrl.handleClosePanel}
                  onSubmit={ctrl.handleUpdate}
                />
              ) : null}
              {!ctrl.showCreateForm && !ctrl.showEditForm ? (
                <SelectedCourseWorkspace
                  course={ctrl.selectedCourse}
                  loading={ctrl.loading}
                  onViewSections={ctrl.handleViewSections}
                  viewSectionsDisabled={ctrl.busy || ctrl.loading}
                />
              ) : null}
            </div>
          }
        />
      </div>
    </PageShell>
  )
}
