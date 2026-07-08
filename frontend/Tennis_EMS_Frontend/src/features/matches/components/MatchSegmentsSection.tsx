import type { ComponentProps } from 'react'
import MatchSegmentsPanel from './MatchSegmentsPanel'

type Props = ComponentProps<typeof MatchSegmentsPanel>

export default function MatchSegmentsSection(props: Props) {
  return <MatchSegmentsPanel {...props} />
}

