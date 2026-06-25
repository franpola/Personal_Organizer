import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import PlanCard from '../components/PlanCard'
import { useTrips } from '../hooks/useStorage'
import { isPast } from '../utils/helpers'
import './ListPage.css'

export default function TripsPage() {
  const { trips } = useTrips()
  const upcoming = trips.filter(t => !isPast(t.dates?.end || t.dates?.start))
    .sort((a, b) => new Date(a.dates?.start) - new Date(b.dates?.start))
  const past = trips.filter(t => isPast(t.dates?.end || t.dates?.start))
    .sort((a, b) => new Date(b.dates?.start) - new Date(a.dates?.start))

  return (
    <main className="list-page">
      <div className="list-header">
        <h1>Viajes</h1>
        <Link to="/new?type=trip" className="btn-new-page">
          <Plus size={15} /> Nuevo viaje
        </Link>
      </div>

      {upcoming.length > 0 && (
        <section className="list-section">
          <h2 className="list-section-title">Próximos</h2>
          <div className="plans-grid">
            {upcoming.map(t => <PlanCard key={t.id} plan={t} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="list-section">
          <h2 className="list-section-title">Pasados</h2>
          <div className="plans-grid">
            {past.map(t => <PlanCard key={t.id} plan={t} />)}
          </div>
        </section>
      )}

      {trips.length === 0 && (
        <div className="list-empty">
          <p>Sin viajes aún.</p>
          <Link to="/new?type=trip" className="btn-inline">Planifica tu primer viaje →</Link>
        </div>
      )}
    </main>
  )
}
