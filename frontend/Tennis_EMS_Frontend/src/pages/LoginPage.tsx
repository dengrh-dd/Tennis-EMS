import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../auth/authApi'
import { roleHome } from '../auth/roleHome'
import FormField from '../components/ui/FormField'
import InlineFeedback from '../components/ui/InlineFeedback'
import {
  uiButtonDisabledStyle,
  uiButtonFilledPrimaryStyle,
  uiColors,
  uiControlBaseStyle,
  uiFormStackStyle,
  uiSurfaceCardStyle,
} from '../components/ui/uiPrimitives'
import { uiPageSubtitleStyle, uiPageTitleStyle, uiSpace } from '../components/ui/uiTokens'

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      const user = await login(email, password)
      navigate(roleHome(user.role), { replace: true })
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: uiSpace.lg,
        background: uiColors.surfaceMuted,
      }}
    >
      <div style={uiSurfaceCardStyle}>
        <header style={{ marginBottom: uiSpace.xl }}>
          <h1 style={{ ...uiPageTitleStyle, fontSize: 22 }}>Sign in</h1>
          <p style={{ ...uiPageSubtitleStyle, marginTop: uiSpace.sm }}>Tennis EMS — use your program account.</p>
        </header>

        <form onSubmit={handleSubmit} style={{ ...uiFormStackStyle, padding: 0 }}>
          <FormField label="Email">
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={uiControlBaseStyle}
              placeholder="you@example.com"
            />
          </FormField>

          <FormField label="Password">
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={uiControlBaseStyle}
              placeholder="Enter password"
            />
          </FormField>

          {errorMsg ? <InlineFeedback type="error" message={errorMsg} dense style={{ marginBottom: 0 }} /> : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...uiButtonFilledPrimaryStyle,
              ...(loading ? uiButtonDisabledStyle : {}),
              marginTop: uiSpace.sm,
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
