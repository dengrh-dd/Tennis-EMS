import type { CourseSummary } from '../../../api/courseApi'
import PanelCard from '../../../components/ui/PanelCard'
import SectionCard from '../../../components/ui/SectionCard'
import EmptyState from '../../../components/ui/EmptyState'
import CourseCatalogList from './CourseCatalogList'

type Props = {
  loading: boolean
  busy: boolean
  courses: CourseSummary[]
  selectedCourseId: number | null
  panelsOpen: boolean
  canDelete: boolean
  onSelectCourse: (course: CourseSummary) => void
  onViewSections: (courseId: number) => void
  onArchive?: (courseId: number) => void
}

export default function CourseCatalogSection({
  loading,
  busy,
  courses,
  selectedCourseId,
  panelsOpen,
  canDelete,
  onSelectCourse,
  onViewSections,
  onArchive,
}: Props) {
  return (
    <SectionCard label="Catalog" marginBottom={panelsOpen ? 16 : 0}>
      <PanelCard
        title="Course list"
        subtitle="Click a row to select it. Use View Sections to open the section hierarchy."
        marginBottom={0}
      >
        {!loading && courses.length === 0 ? <EmptyState message="No courses yet." /> : null}
        {courses.length > 0 ? (
          <CourseCatalogList
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={onSelectCourse}
            onViewSections={onViewSections}
            onArchive={onArchive}
            canArchive={canDelete}
            disabled={busy || loading}
          />
        ) : null}
      </PanelCard>
    </SectionCard>
  )
}
