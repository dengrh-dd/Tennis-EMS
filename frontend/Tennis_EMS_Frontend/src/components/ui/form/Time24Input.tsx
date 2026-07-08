import { useEffect, useState } from 'react'
import { normalizeTime24 } from '../../../utils/displayDate'

type Props = {
  value: string
  onCommit: (hhMm24: string) => void
  disabled?: boolean
  className?: string
  id?: string
  'aria-label'?: string
  required?: boolean
}

/** 24-hour time (HH:MM). English placeholder; avoids localized native time pickers. */
export default function Time24Input({
  value,
  onCommit,
  disabled,
  className,
  id,
  'aria-label': ariaLabel,
  required,
}: Props) {
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [value])

  function commit() {
    const n = normalizeTime24(text)
    if (n) {
      onCommit(n)
      setText(n)
    } else if (text.trim() === '') {
      onCommit('')
      setText('')
    } else {
      setText(value)
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
      placeholder="HH:MM (24h)"
      className={className}
      disabled={disabled}
      required={required}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      aria-label={ariaLabel}
    />
  )
}

