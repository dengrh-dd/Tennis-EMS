import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { isoDateToUsDisplay, usDisplayToIsoDate } from '../../../utils/displayDate'

type Props = {
  value: string
  onCommit: (isoYyyyMmDd: string) => void
  disabled?: boolean
  className?: string
  style?: CSSProperties
  id?: string
  'aria-label'?: string
  required?: boolean
}

/**
 * English-only calendar input (MM/DD/YY).
 * Stores ISO `yyyy-MM-dd` via `onCommit`.
 */
export default function DateInput({
  value,
  onCommit,
  disabled,
  className,
  style,
  id,
  'aria-label': ariaLabel,
  required,
}: Props) {
  const [text, setText] = useState(() => isoDateToUsDisplay(value))

  useEffect(() => {
    setText(isoDateToUsDisplay(value))
  }, [value])

  function commit() {
    const iso = usDisplayToIsoDate(text)
    if (iso) {
      onCommit(iso)
      setText(isoDateToUsDisplay(iso))
    } else if (text.trim() === '') {
      onCommit('')
      setText('')
    } else {
      setText(isoDateToUsDisplay(value))
    }
  }

  return (
    <input
      id={id}
      type="text"
      lang="en-US"
      spellCheck={false}
      inputMode="numeric"
      autoComplete="off"
      placeholder="MM/DD/YY"
      className={className}
      style={style}
      disabled={disabled}
      required={required}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      aria-label={ariaLabel}
    />
  )
}

