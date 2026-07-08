import type { ComponentProps } from 'react'
import MatchSummaryPanel from './MatchSummaryPanel'

type Props = ComponentProps<typeof MatchSummaryPanel>

export default function MatchSummarySection(props: Props) {
  return <MatchSummaryPanel {...props} />
}

