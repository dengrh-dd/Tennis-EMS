import DrillDownPageShell from '../../../components/layout/DrillDownPageShell'
import SplitPageLayout from '../../../components/layout/SplitPageLayout'
import { drillDownMainColumnStyle } from '../../../components/layout/drillDownLayout'
import { useEnrollmentPageController } from '../hooks/useEnrollmentPageController'
import {
  EnrollmentFormSection,
  EnrollmentHeaderSection,
  EnrollmentListSection,
  EnrollmentStatusSection,
} from '../sections'

export default function EnrollmentPage() {
  const ctrl = useEnrollmentPageController()

  const main = (
    <div style={drillDownMainColumnStyle}>
      <EnrollmentHeaderSection
        invalidIds={ctrl.invalidIds}
        courseId={ctrl.courseId}
        courseTitle={ctrl.courseTitle}
        sectionTitle={ctrl.sectionTitle}
        sectionId={ctrl.sectionId}
        onBack={ctrl.backToSections}
      />

      <EnrollmentStatusSection
        metaLoading={ctrl.metaLoading}
        metaError={ctrl.metaError}
        success={ctrl.success}
        error={ctrl.error}
        loading={ctrl.loading}
      />

      {!ctrl.metaLoading && !ctrl.metaError && (
        <>
          <EnrollmentFormSection
            loading={ctrl.loading}
            studentUsersLoading={ctrl.studentUsersLoading}
            enrollStudentOptions={ctrl.enrollStudentOptions}
            studentIdToEnroll={ctrl.studentIdToEnroll}
            onStudentChange={ctrl.setStudentIdToEnroll}
            onSubmit={ctrl.handleEnroll}
          />
          <EnrollmentListSection students={ctrl.students} loading={ctrl.loading} onDrop={ctrl.handleDrop} />
        </>
      )}
    </div>
  )

  return (
    <DrillDownPageShell panelOpen={false}>
      <SplitPageLayout main={main} />
    </DrillDownPageShell>
  )
}
