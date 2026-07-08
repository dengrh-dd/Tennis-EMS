import MatchDetailView from '../components/MatchDetailView'
import { useMatchDetailController } from '../hooks/useMatchDetailController'

export default function MatchDetailPage() {
  const controller = useMatchDetailController()
  return <MatchDetailView controller={controller} />
}
