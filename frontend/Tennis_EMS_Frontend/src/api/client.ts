const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

export type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

/**
 * Fetch wrapper: credentials always included, JSON headers, error handling.
 */
export async function apiFetch(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { body, headers = {}, ...rest } = options
  const res = await fetch(url, {
    ...rest,
    credentials: 'include',
    headers: { ...defaultHeaders, ...headers },
    // We only support JSON request bodies here; when `body` is omitted, send `undefined`
    // so `fetch()` doesn't see an `unknown` type.
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const message = await parseErrorMessageFromResponse(res)
    throw new Error(message)
  }

  return res
}

/** Backend `ErrorResponseDTO` uses `message`; some proxies use other fields. */
async function parseErrorMessageFromResponse(res: Response): Promise<string> {
  const contentType = res.headers.get('content-type')
  const text = await res.text()
  if (contentType?.includes('application/json') && text) {
    try {
      const data = JSON.parse(text) as Record<string, unknown>
      const msg =
        (typeof data.message === 'string' && data.message) ||
        (typeof data.error === 'string' && data.error) ||
        (typeof data.detail === 'string' && data.detail)
      if (msg) return msg
    } catch {
      /* fall through */
    }
  }
  return text.trim() || res.statusText || 'Request failed'
}

/**
 * GET and parse JSON.
 */
export async function apiGet<T>(url: string): Promise<T> {
  const res = await apiFetch(url, { method: 'GET' })
  return parseJsonBody<T>(res)
}

/**
 * POST with optional JSON body and parse response.
 */
export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const res = await apiFetch(url, { method: 'POST', body })
  return parseJsonBody<T>(res)
}

/**
 * PUT with optional JSON body and parse response.
 */
export async function apiPut<T>(url: string, body?: unknown): Promise<T> {
  const res = await apiFetch(url, { method: 'PUT', body })
  return parseJsonBody<T>(res)
}

/**
 * PATCH with optional JSON body and parse response.
 */
export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
  const res = await apiFetch(url, { method: 'PATCH', body })
  return parseJsonBody<T>(res)
}

async function parseJsonBody<T>(res: Response): Promise<T> {
  const text = await res.text()
  if (!text.trim()) {
    throw new Error('Empty response body from server.')
  }
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error('Invalid JSON in response from server.')
  }
}

/**
 * DELETE and optionally parse JSON response.
 */
export async function apiDelete<T = void>(url: string): Promise<T> {
  const res = await apiFetch(url, { method: 'DELETE' })
  const text = await res.text()
  if (!text) return undefined as T
  try {
    return JSON.parse(text) as T
  } catch {
    return undefined as T
  }
}
