import type { CurrentUser } from './types'

export async function me(): Promise<CurrentUser> {
    const res = await fetch('/auth/me', {
        method: 'GET',
        credentials: 'include',
    })

    if (!res.ok) {
        throw new Error('NOT_LOGGED_IN')
    }

    return res.json()
}

export async function login(email: string, password: string): Promise<CurrentUser> {
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
        throw new Error(text || 'LOGIN_FAILED')
    }

    return res.json()
}