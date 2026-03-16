import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { me } from './authApi'
import type { Role } from './types'

function roleHome(role: Role) {
  if (role === 'ADMIN') return '/admin'
  if (role === 'COACH') return '/coach'
  return '/student'
}

export default function AuthGate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    me()
      .then((user) => {
        navigate(roleHome(user.role), { replace: true })
      })
      .catch(() => {
        navigate('/login', { replace: true })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [navigate])

  if (loading) {
    return <div style={{ padding: 20 }}>Checking login status...</div>
  }

  return <div style={{ padding: 20 }}>Redirecting...</div>
}