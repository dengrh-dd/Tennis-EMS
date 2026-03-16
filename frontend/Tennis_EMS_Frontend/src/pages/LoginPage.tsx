import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../auth/authApi'
import type { Role } from '../auth/types'

function roleHome(role: Role) {
    if (role === 'ADMIN') return '/admin'
    if (role === 'COACH') return '/coach'
    return '/student'
}

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
        } catch (err: any) {
            setErrorMsg(err.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: 20, maxWidth: 360 }}>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <div>Email</div>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: 8 }}
                        placeholder="Enter email"
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <div>Password</div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: 8 }}
                        placeholder="Enter password"
                    />
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            {errorMsg && (
                <div style={{ marginTop: 12, color: 'red' }}>
                    {errorMsg}
                </div>
            )}
        </div>
    )
}