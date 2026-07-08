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
import {
  uiContextCardMetaAsideStyle,
  uiContextCardMetaStrongStyle,
  uiContextCardTitleSuffixStyle,
} from '../../../components/ui/uiPrimitives'
import { uiSpace } from '../../../components/ui/uiTokens'
import { ADMIN_COURSES, courseSectionsPath } from '../routes'
import { formatDisplayDate } from '../../../utils/displayDate'
import { useSectionSessionsPageController } from '../hooks/useSectionSessionsPageController'

import SessionCatalogSection from '../components/SessionCatalogSection'
import SessionCreatePanel from '../components/SessionCreatePanel'
import SessionEditPanel from '../components/SessionEditPanel'

export default function SectionSessionsPage() {
  const ctrl = useSectionSessionsPageController()
  const sectionsPath = courseSectionsPath(ctrl.courseId)

  const mainColumn = (
    <div style={workspaceMainColumnStyle}>
      <PageHeader
        breadcrumbLineHeight={1.6}
        breadcrumb={
          <>
            <Link to={ADMIN_COURSES} style={breadcrumbLinkStyle}>
              Courses
            </Link>
            {' / '}
            <Link to={sectionsPath} style={breadcrumbLinkStyle}>
              {ctrl.courseTitle}
            </Link>
            {' / '}
            <span style={breadcrumbCurrentStyle}>{ctrl.sectionTitle}</span>
            {' / '}
            <span style={breadcrumbCurrentStyle}>Sessions</span>
          </>
        }
        backLabel="← Back to Sections"
        onBack={ctrl.handleBackToSections}
      />

      {ctrl.invalidIds && (
        <StatusMessage variant="error" message="Invalid course or section in URL." marginBottom={uiSpace.md} />
      )}

      {!ctrl.invalidIds && ctrl.course && ctrl.section && (
        <ContextCard
          titleTight
          title={
            <>
              {ctrl.course.name}{' '}
              <span style={uiContextCardTitleSuffixStyle}>#{ctrl.course.courseNumber}</span>
            </>
          }
          meta={
            <>
              Section: <strong style={uiContextCardMetaStrongStyle}>{ctrl.section.name}</strong>
              {ctrl.section.coachId != null && ` · Coach ID ${ctrl.section.coachId}`}
              {ctrl.section.startDate != null &&
                ctrl.section.startDate !== '' &&
                ` · ${formatDisplayDate(ctrl.section.startDate)}`}
              {ctrl.section.endDate != null &&
                ctrl.section.endDate !== '' &&
                ` – ${formatDisplayDate(ctrl.section.endDate)}`}
              {ctrl.section.status != null && ctrl.section.status !== '' && (
                <span style={uiContextCardMetaAsideStyle}>{ctrl.section.status}</span>
              )}
              {ctrl.section.isActive != null && (
                <span style={uiContextCardMetaAsideStyle}>
                  {ctrl.section.isActive ? 'Active' : 'Inactive'}
                </span>
              )}
            </>
          }
          metaStyle={{ marginBottom: uiSpace.sm }}
        />
      )}

      <ActionToolbar
        title="Sessions"
        actions={
          <>
            <Button type="button" variant="primary" onClick={ctrl.openCreatePanel} disabled={ctrl.isCreateDisabled}>
              Create Session
            </Button>

            <Button type="button" variant="secondary" onClick={ctrl.openEditPanel} disabled={ctrl.isEditDisabled}>
              Edit Selected Session
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={ctrl.handleToolbarAttendance}
              disabled={ctrl.isAttendanceNavDisabled}
            >
              Attendance
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

      <SessionCatalogSection
        sessions={ctrl.sessions}
        selectedSessionId={ctrl.selectedSessionId}
        loading={ctrl.loading}
        invalidIds={ctrl.invalidIds}
        busy={ctrl.busy}
        onSelectSession={ctrl.handleSelectSession}
        onAttendance={ctrl.handleAttendance}
        onCancelSession={ctrl.handleCancelSession}
      />
    </div>
  )

  const sideColumn = ctrl.panelOpen ? (
    <div style={drillDownRightPanelColumnStyle}>
      {ctrl.showCreatePanel && (
        <SessionCreatePanel
          sectionId={ctrl.sectionId}
          form={ctrl.createForm}
          courts={ctrl.courts}
          courtsLoading={ctrl.courtsLoading}
          busy={ctrl.busy}
          panelDetailLoading={ctrl.panelDetailLoading}
          onClose={ctrl.handleClosePanel}
          onSubmit={ctrl.handleCreate}
        />
      )}

      {ctrl.showEditPanel && (
        <SessionEditPanel
          form={ctrl.editForm}
          courtOptions={ctrl.courtsForEditDropdown}
          courtsLoading={ctrl.courtsLoading}
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
