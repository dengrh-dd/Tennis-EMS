import ModalDialog from '../../../components/ui/ModalDialog'
import PanelShell from '../../../components/ui/PanelShell'
import WorkspaceSideSection from '../../../components/ui/WorkspaceSideSection'
import { CreateMatchForm, EditMatchForm } from '../components/MatchForm'
import { useMatchPageController } from '../hooks/useMatchPageController'

type MatchPageController = ReturnType<typeof useMatchPageController>

type Props = {
  ctrl: MatchPageController
}

export default function MatchPanelSection({ ctrl }: Props) {
  const displayMatch = ctrl.displayMatch

  return (
    <>
      {ctrl.panelMode === 'edit' && displayMatch && (
        <WorkspaceSideSection variant="action" title="Action panel">
          <PanelShell
            title="Edit Match"
            onClose={ctrl.handleCloseEditPanel}
            closeDisabled={ctrl.busy || ctrl.panelLoading}
          >
            <EditMatchForm
              match={displayMatch}
              busy={ctrl.busy || ctrl.panelLoading}
              formats={ctrl.formats}
              onSubmit={ctrl.handleUpdate}
              sessionId={ctrl.editSessionId}
              setSessionId={ctrl.setEditSessionId}
              formatId={ctrl.editFormatId}
              setFormatId={ctrl.setEditFormatId}
              matchType={ctrl.editMatchType}
              setMatchType={ctrl.setEditMatchType}
              title={ctrl.editTitle}
              setTitle={ctrl.setEditTitle}
              notes={ctrl.editNotes}
              setNotes={ctrl.setEditNotes}
              status={ctrl.editStatus}
              setStatus={ctrl.setEditStatus}
              winnerSide={ctrl.editWinnerSide}
              setWinnerSide={ctrl.setEditWinnerSide}
              winnerSideLabels={ctrl.editWinnerSideLabels}
            />
          </PanelShell>
        </WorkspaceSideSection>
      )}

      <ModalDialog
        open={ctrl.createModalOpen}
        title="Create Match"
        onClose={ctrl.handleCloseCreateModal}
        closeDisabled={ctrl.busy}
      >
        <CreateMatchForm
          busy={ctrl.busy || ctrl.panelLoading}
          formats={ctrl.formats}
          onSubmit={ctrl.handleCreate}
          selectedCourseId={ctrl.selectedCourseId}
          setSelectedCourseId={ctrl.setSelectedCourseId}
          selectedSectionId={ctrl.selectedSectionId}
          setSelectedSectionId={ctrl.setSelectedSectionId}
          selectedSessionId={ctrl.selectedSessionId}
          setSelectedSessionId={ctrl.setSelectedSessionId}
          courseOptions={ctrl.courseOptions}
          sectionOptions={ctrl.sectionOptions}
          sessionOptions={ctrl.sessionOptions}
          sectionsLoading={ctrl.sectionsLoading}
          sessionsLoading={ctrl.sessionsLoading}
          formatId={ctrl.formatId}
          setFormatId={ctrl.setFormatId}
          matchType={ctrl.matchType}
          setMatchType={ctrl.setMatchType}
          title={ctrl.title}
          setTitle={ctrl.setTitle}
          notes={ctrl.notes}
          setNotes={ctrl.setNotes}
          status={ctrl.status}
          setStatus={ctrl.setStatus}
          winnerSide={ctrl.winnerSide}
          setWinnerSide={ctrl.setWinnerSide}
        />
      </ModalDialog>
    </>
  )
}
