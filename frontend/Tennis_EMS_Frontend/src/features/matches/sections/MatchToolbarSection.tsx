import type { CSSProperties } from 'react'
import ActionToolbar from '../../../components/ui/ActionToolbar'
import Button from '../../../components/ui/Button'
import ToolbarFilterField from '../../../components/ui/ToolbarFilterField'
import { uiSpace } from '../../../components/ui/uiTokens'
import '../../../components/ui/emsFormLayout.css'
import type { MatchFilterStatus, MatchFilterType } from '../hooks/useMatchPageController'
import { useMatchPageController } from '../hooks/useMatchPageController'

type MatchPageController = ReturnType<typeof useMatchPageController>

type Props = {
  ctrl: MatchPageController
}

/**
 * Two fixed rows (placement below): row1 = Course + Section (50/50), row2 = Session + Status + Type.
 * Twelve `minmax(0,1fr)` tracks keep widths stable; content cannot collapse to one row.
 */
const matchFiltersGridStyle: CSSProperties = {
  display: 'grid',
  width: '100%',
  minWidth: 0,
  gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
  gridTemplateRows: 'auto auto',
  columnGap: uiSpace.md,
  rowGap: uiSpace.md,
  alignItems: 'end',
}

const matchFilterCellBase: CSSProperties = {
  minWidth: 0,
  width: '100%',
}

/** Row 1: Course + Section each span 6 columns (~half the filter bar each). */
const matchFilterCellCourse: CSSProperties = {
  ...matchFilterCellBase,
  gridColumn: '1 / 7',
  gridRow: 1,
}

const matchFilterCellSection: CSSProperties = {
  ...matchFilterCellBase,
  gridColumn: '7 / 13',
  gridRow: 1,
}

/** Row 2: Session (5 cols), Status (3 cols), Type (4 cols). */
const matchFilterCellSession: CSSProperties = {
  ...matchFilterCellBase,
  gridColumn: '1 / 6',
  gridRow: 2,
}

const matchFilterCellStatus: CSSProperties = {
  ...matchFilterCellBase,
  gridColumn: '6 / 9',
  gridRow: 2,
}

const matchFilterCellType: CSSProperties = {
  ...matchFilterCellBase,
  gridColumn: '9 / 13',
  gridRow: 2,
}

/**
 * Label stays auto width; control sits in a flexible column so long selected labels cannot widen the slot.
 */
const matchFilterFieldRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  alignItems: 'center',
  gap: uiSpace.md,
  width: '100%',
  minWidth: 0,
}

/** Ellipsis where the UA supports it; primary readability gain is wider Course/Section columns. */
const matchSelectStyle: CSSProperties = {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

export default function MatchToolbarSection({ ctrl }: Props) {
  return (
    <ActionToolbar
      title="Match"
      filters={
        <div style={matchFiltersGridStyle}>
          <div style={matchFilterCellCourse}>
            <ToolbarFilterField label="Course" rootStyle={matchFilterFieldRowStyle}>
              <select
                value={ctrl.filterCourseId}
                onChange={(e) => ctrl.setFilterCourseId(e.target.value)}
                disabled={ctrl.loading || ctrl.busy}
                className="ems-select"
                style={matchSelectStyle}
              >
                <option value="">All courses</option>
                {ctrl.courseOptions.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.label}
                  </option>
                ))}
              </select>
            </ToolbarFilterField>
          </div>
          <div style={matchFilterCellSection}>
            <ToolbarFilterField label="Section" rootStyle={matchFilterFieldRowStyle}>
              <select
                value={ctrl.filterSectionId}
                onChange={(e) => ctrl.setFilterSectionId(e.target.value)}
                disabled={ctrl.loading || ctrl.busy || !ctrl.filterCourseId || ctrl.filterSectionsLoading}
                className="ems-select"
                style={matchSelectStyle}
              >
                <option value="">{ctrl.filterSectionsLoading ? 'Loading sections...' : 'All sections'}</option>
                {ctrl.filterSectionOptions.map((section) => (
                  <option key={section.sectionId} value={section.sectionId}>
                    {section.label}
                  </option>
                ))}
              </select>
            </ToolbarFilterField>
          </div>
          <div style={matchFilterCellSession}>
            <ToolbarFilterField label="Session" rootStyle={matchFilterFieldRowStyle}>
              <select
                value={ctrl.filterSessionId}
                onChange={(e) => ctrl.setFilterSessionId(e.target.value)}
                disabled={ctrl.loading || ctrl.busy || !ctrl.filterSectionId || ctrl.filterSessionsLoading}
                className="ems-select"
                style={matchSelectStyle}
              >
                <option value="">{ctrl.filterSessionsLoading ? 'Loading sessions...' : 'All sessions'}</option>
                {ctrl.filterSessionOptions.map((session) => (
                  <option key={session.sessionId} value={session.sessionId}>
                    {session.label}
                  </option>
                ))}
              </select>
            </ToolbarFilterField>
          </div>
          <div style={matchFilterCellStatus}>
            <ToolbarFilterField label="Status" rootStyle={matchFilterFieldRowStyle}>
              <select
                value={ctrl.statusFilter}
                onChange={(e) => ctrl.setStatusFilter(e.target.value as MatchFilterStatus)}
                disabled={ctrl.loading || ctrl.busy}
                className="ems-select"
                style={matchSelectStyle}
              >
                <option value="ALL">All</option>
                {ctrl.MATCH_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </ToolbarFilterField>
          </div>
          <div style={matchFilterCellType}>
            <ToolbarFilterField label="Type" rootStyle={matchFilterFieldRowStyle}>
              <select
                value={ctrl.typeFilter}
                onChange={(e) => ctrl.setTypeFilter(e.target.value as MatchFilterType)}
                disabled={ctrl.loading || ctrl.busy}
                className="ems-select"
                style={matchSelectStyle}
              >
                <option value="ALL">All</option>
                {ctrl.MATCH_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </ToolbarFilterField>
          </div>
        </div>
      }
      actions={
        <>
          <Button variant="secondary" onClick={() => void ctrl.loadMatches()} disabled={ctrl.busy}>
            Refresh
          </Button>
          <Button variant="primary" onClick={ctrl.openCreateModal} disabled={ctrl.busy}>
            Create Match
          </Button>
          <Button variant="secondary" onClick={ctrl.openEditPanel} disabled={ctrl.isEditDisabled}>
            Edit Selected
          </Button>
          <Button variant="danger" onClick={ctrl.handleDelete} disabled={ctrl.isDeleteDisabled}>
            Delete
          </Button>
        </>
      }
    />
  )
}
