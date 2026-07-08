type Props = {
  metaLoading: boolean
  metaError: string | null
  success: string | null
  error: string | null
  loading: boolean
}

export default function EnrollmentStatusSection({
  metaLoading,
  metaError,
  success,
  error,
  loading,
}: Props) {
  return (
    <>
      {metaLoading && <p style={{ color: '#64748b' }}>Loading context…</p>}
      {metaError && <p style={{ color: '#c2410c' }}>{metaError}</p>}
      {!metaLoading && !metaError && (
        <>
          {success && <div style={{ color: '#15803d', marginBottom: 8, fontSize: 14 }}>{success}</div>}
          {error && <div style={{ color: '#c2410c', marginBottom: 8, fontSize: 14 }}>{error}</div>}
          {loading && <div style={{ marginBottom: 8, color: '#64748b' }}>Loading…</div>}
        </>
      )}
    </>
  )
}
