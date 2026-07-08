import type { CourseSummary } from '../../../api/courseApi'
import Button from '../../../components/ui/Button'
import styles from './CourseCatalogList.module.css'

type Props = {
  courses: CourseSummary[]
  selectedCourseId: number | null
  onSelectCourse: (course: CourseSummary) => void
  onViewSections: (courseId: number) => void
  onArchive?: (courseId: number) => void
  /** When true, row actions include Archive for active courses. */
  canArchive?: boolean
  disabled?: boolean
}

export default function CourseCatalogList({
  courses,
  selectedCourseId,
  onSelectCourse,
  onViewSections,
  onArchive,
  canArchive = false,
  disabled = false,
}: Props) {
  return (
    <ul className={styles.list}>
      {courses.map((c) => {
        const selected = c.courseId === selectedCourseId
        const rowClass = [styles.row, selected ? styles.rowSelected : ''].filter(Boolean).join(' ')

        return (
          <li
            key={c.courseId}
            className={rowClass}
            onClick={() => onSelectCourse(c)}
            aria-selected={selected}
          >
            <div className={styles.rowInner}>
              <div className={styles.main}>
                <div className={styles.courseTitle}>{c.name}</div>
                <div className={styles.meta}>
                  #{c.courseNumber}
                  {c.level != null && c.level !== '' && ` · ${c.level}`}
                  <span className={styles.status}>{c.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>

              <div className={styles.actions}>
                <Button
                  type="button"
                  variant="secondary"
                  size="compact"
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewSections(c.courseId)
                  }}
                  disabled={disabled}
                >
                  View Sections
                </Button>

                {canArchive && c.isActive !== false && onArchive ? (
                  <Button
                    type="button"
                    variant="danger"
                    size="compact"
                    onClick={(e) => {
                      e.stopPropagation()
                      onArchive(c.courseId)
                    }}
                    disabled={disabled}
                  >
                    Archive
                  </Button>
                ) : null}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
