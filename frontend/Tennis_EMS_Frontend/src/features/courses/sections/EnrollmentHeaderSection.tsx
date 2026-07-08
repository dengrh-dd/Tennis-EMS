import { Link } from 'react-router-dom'
import {
  breadcrumbCurrentStyle,
  breadcrumbLinkStyle,
} from '../../../components/layout/drillDownLayout'
import {
  pageHeaderDescriptionStrongStyle,
  pageHeaderDescriptionStyle,
} from '../../../components/layout/pageHeaderLayout'
import PageHeader from '../../../components/ui/PageHeader'
import { ADMIN_COURSES, courseSectionsPath } from '../routes'

type Props = {
  invalidIds: boolean
  courseId: number
  courseTitle: string
  sectionTitle: string
  sectionId: number
  onBack: () => void
}

export default function EnrollmentHeaderSection({
  invalidIds,
  courseId,
  courseTitle,
  sectionTitle,
  sectionId,
  onBack,
}: Props) {
  return (
    <PageHeader
      breadcrumb={
        <>
          <Link to={ADMIN_COURSES} style={breadcrumbLinkStyle}>
            Courses
          </Link>
          {' / '}
          {!invalidIds ? (
            <Link to={courseSectionsPath(courseId)} style={breadcrumbLinkStyle}>
              {courseTitle}
            </Link>
          ) : (
            <span style={breadcrumbLinkStyle}>{courseTitle}</span>
          )}
          {' / '}
          <span style={breadcrumbCurrentStyle}>{sectionTitle}</span>
          {' / '}
          <span style={breadcrumbCurrentStyle}>Enrollment</span>
        </>
      }
      backLabel="← Back to sections"
      onBack={onBack}
      description={
        <p style={pageHeaderDescriptionStyle}>
          Section ID <strong style={pageHeaderDescriptionStrongStyle}>{sectionId}</strong>
          {invalidIds && ' — invalid URL.'}
        </p>
      }
    />
  )
}
