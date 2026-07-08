import type { CurrentUser } from './types'

export async function me(): Promise<CurrentUser> {
  console.debug('[Auth] GET /auth/me')
  const res = await fetch('/auth/me', {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    console.debug('[Auth] /auth/me not ok', res.status)
    throw new Error('NOT_LOGGED_IN')
  }

  const data = (await res.json()) as CurrentUser
  console.debug('[Auth] /auth/me userId', data.userId, 'role', data.role)
  return data
}

export async function login(email: string, password: string): Promise<CurrentUser> {
  console.debug('[Auth] POST /auth/login', { email })
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.debug('[Auth] /auth/login failed', res.status, text)
    throw new Error(text || 'LOGIN_FAILED')
  }

  /** Backend returns LoginResponseDTO — same fields as CurrentUserDTO / CurrentUser */
  const data = (await res.json()) as CurrentUser
  console.debug('[Auth] /auth/login ok userId', data.userId, 'role', data.role)
  return data
}

/**
 * End the server session. Backend: `AuthController` → POST `/auth/logout` (empty body, 200).
 */
export async function logout(): Promise<void> {
  console.debug('[Auth] POST /auth/logout')
  const res = await fetch('/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    console.debug('[Auth] /auth/logout not ok', res.status)
    throw new Error('LOGOUT_FAILED')
  }
}
