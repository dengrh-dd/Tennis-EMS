import type { ComponentProps } from 'react'
import MatchPlayersPanel from './MatchPlayersPanel'

type Props = ComponentProps<typeof MatchPlayersPanel>

export default function MatchPlayersSection(props: Props) {
  return <MatchPlayersPanel {...props} />
}

