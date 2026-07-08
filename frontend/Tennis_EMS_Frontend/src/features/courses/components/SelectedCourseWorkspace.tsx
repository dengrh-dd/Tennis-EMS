import type { CourseSummary } from '../../../api/courseApi'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import PanelCard from '../../../components/ui/PanelCard'
import { uiColors, uiMetaRowLabelStyle, uiMetaRowValueStyle } from '../../../components/ui/uiPrimitives'
import { uiFontSize, uiLineHeight, uiSpace } from '../../../components/ui/uiTokens'

type Props = {
  course: CourseSummary | null
  loading: boolean
  onViewSections: (courseId: number) => void
  viewSectionsDisabled: boolean
}

/**
 * Read-only summary of the selected course in the catalog side column (create/edit panels replace this).
 */
export default function SelectedCourseWorkspace({
  course,
  loading,
  onViewSections,
  viewSectionsDisabled,
}: Props) {
  if (course) {
    return (
      <PanelCard
        marginBottom={0}
        title={course.name}
        subtitle="Overview"
        rightActions={
          <Button
            type="button"
            variant="secondary"
            disabled={viewSectionsDisabled}
            onClick={() => onViewSections(course.courseId)}
          >
            View Sections
          </Button>
        }
      >
        <div
          style={{
            borderTop: `1px solid ${uiColors.borderLight}`,
            paddingTop: uiSpace.md,
            marginTop: uiSpace.xs,
            fontSize: uiFontSize.body,
            lineHeight: uiLineHeight.relaxed,
          }}
        >
          <div style={{ display: 'flex', marginBottom: uiSpace.sm }}>
            <span style={uiMetaRowLabelStyle}>Course #</span>
            <span style={uiMetaRowValueStyle}>{course.courseNumber}</span>
          </div>
          {course.level != null && course.level !== '' ? (
            <div style={{ display: 'flex', marginBottom: uiSpace.sm }}>
              <span style={uiMetaRowLabelStyle}>Level</span>
              <span style={uiMetaRowValueStyle}>{course.level}</span>
            </div>
          ) : null}
          <div style={{ display: 'flex' }}>
            <span style={uiMetaRowLabelStyle}>Status</span>
            <span style={uiMetaRowValueStyle}>{course.isActive !== false ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </PanelCard>
    )
  }

  if (!loading) {
    return <EmptyState style={{ marginTop: uiSpace.lg }} message="Select a course or create one." />
  }

  return null
}
