/**
 * US-style display formatting for the English-only UI (MM/DD/YY).
 * Internal wire values remain ISO `yyyy-MM-dd` / local `yyyy-MM-ddTHH:mm` for APIs.
 */

const US_DATE: Intl.DateTimeFormatOptions = {
  month: '2-digit',
  day: '2-digit',
  year: '2-digit',
}

const US_DATE_TIME: Intl.DateTimeFormatOptions = {
  month: '2-digit',
  day: '2-digit',
  year: '2-digit',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
}

function parseLocalCalendarDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim())
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2]) - 1
  const d = Number(m[3])
  const dt = new Date(y, mo, d)
  if (Number.isNaN(dt.getTime())) return null
  if (dt.getFullYear() !== y || dt.getMonth() !== mo || dt.getDate() !== d) return null
  return dt
}

/** User-facing calendar date (MM/DD/YY). Accepts ISO date or datetime strings. */
export function formatDisplayDate(value: string | null | undefined): string {
  if (value == null || value === '') return '—'
  const trimmed = value.trim()
  const local = parseLocalCalendarDate(trimmed)
  if (local) {
    return local.toLocaleDateString('en-US', US_DATE)
  }
  const parsed = new Date(trimmed)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString('en-US', US_DATE)
  }
  return trimmed
}

/** User-facing date and time in US locale (date portion MM/DD/YY). */
export function formatDisplayDateTime(value: string | null | undefined): string {
  if (value == null || value === '') return '—'
  const trimmed = value.trim()
  const parsed = new Date(trimmed)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleString('en-US', US_DATE_TIME)
  }
  return trimmed
}

/** `yyyy-MM-dd` → `MM/DD/YY` for English text fields (empty in → empty out). */
export function isoDateToUsDisplay(iso: string | null | undefined): string {
  if (iso == null || iso === '') return ''
  const trimmed = iso.trim()
  if (trimmed.length < 10) return ''
  const dt = parseLocalCalendarDate(trimmed)
  if (!dt) return ''
  return dt.toLocaleDateString('en-US', US_DATE)
}

/**
 * Parses U.S. typed dates: `M/D/YYYY`, `MM/DD/YYYY`, `M/D/YY`, `MM/DD/YY`.
 * Two-digit years: 00–69 → 2000–2069, 70–99 → 1970–1999.
 */
export function usDisplayToIsoDate(text: string): string | null {
  const t = text.trim()
  if (t === '') return null
  const m4 = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(t)
  const m2 = /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/.exec(t)
  let month: number
  let day: number
  let year: number
  if (m4) {
    month = Number(m4[1])
    day = Number(m4[2])
    year = Number(m4[3])
  } else if (m2) {
    month = Number(m2[1])
    day = Number(m2[2])
    const yy = Number(m2[3])
    year = yy <= 69 ? 2000 + yy : 1900 + yy
  } else {
    return null
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const d = new Date(year, month - 1, day)
  if (
    Number.isNaN(d.getTime()) ||
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return null
  }
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** Normalizes API values to `yyyy-MM-dd` for internal state (same as trimming ISO date). */
export function toHtmlDateInputValue(value: string | null | undefined): string {
  if (!value) return ''
  return value.length >= 10 ? value.slice(0, 10) : value
}

/** Split `yyyy-MM-ddTHH:mm[:ss][.fff]` (no Z) into date + `HH:mm`. */
export function splitLocalDateTime(iso: string | null | undefined): { date: string; time: string } {
  if (!iso) return { date: '', time: '' }
  const s = String(iso).replace(/Z$/, '').replace(/\+00:00$/, '')
  const tIndex = s.indexOf('T')
  if (tIndex === -1) {
    return s.length >= 10 ? { date: s.slice(0, 10), time: '' } : { date: '', time: '' }
  }
  const date = s.slice(0, 10)
  const afterT = s.slice(tIndex + 1)
  const hm = afterT.length >= 5 ? afterT.slice(0, 5) : ''
  return { date, time: hm }
}

/** 24-hour `HH:mm`; returns null if invalid. */
export function normalizeTime24(text: string): string | null {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(text.trim())
  if (!m) return null
  const h = Number(m[1])
  const min = m[2]
  if (h > 23) return null
  return `${String(h).padStart(2, '0')}:${min}`
}

/** Build local `yyyy-MM-ddTHH:mm` for session payloads (both parts required). */
export function joinLocalDateTime(dateIso: string, timeHm: string): string {
  const t = normalizeTime24(timeHm)
  const d = dateIso.trim()
  if (!d || !t) return ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return ''
  return `${d}T${t}`
}
