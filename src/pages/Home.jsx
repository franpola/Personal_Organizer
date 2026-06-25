import { Link } from 'react-router-dom'
import { Plus, Plane, Ticket } from 'lucide-react'
import PlanCard from '../components/PlanCard'
import { useTrips } from '../context/PlannerContext'
import { useEvents } from '../context/PlannerContext'
import { isPast } from '../utils/helpers'
import './Home.css'

export default function Home() {
  const { trips } = useTrips()
  const { events } = useEvents()

  const allPlans = [
    ...trips.map(t => ({ ...t, type: 'trip', sortDate: t.dates?.start })),
    ...events.map(e => ({ ...e, type: 'event', sortDate: e.date }))
  ]

  const upcoming = allPlans
    .filter(p => !isPast(p.sortDate))
    .sort((a, b) => new Date(a.sortDate) - new Date(b.sortDate))

  const past = allPlans
    .filter(p => isPast(p.sortDate))
    .sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate))

  const pastNoDebrief = past.filter(p => !p.debrief)

  return (
    <main className="home">
      <section className="home-hero">
        <div className="hero-text">
          <h1>Tus planes,<br /><em>en un solo sitio</em></h1>
          <p>Viajes, eventos, y lo que aprendiste en cada uno.</p>
        </div>
        <div className="hero-actions">
          <Link to="/new?type=trip" className="hero-btn trip">
            <Plane size={18} strokeWidth={1.5} />
            Nuevo viaje
          </Link>
          <Link to="/new?type=event" className="hero-btn event">
            <Ticket size={18} strokeWidth={1.5} />
            Nuevo evento
          </Link>
        </div>
      </section>

      {pastNoDebrief.length > 0 && (
        <section className="home-section debrief-nudge">
          <h2 className="section-title">
            <span className="section-dot accent" />
            Pendientes de valorar
          </h2>
          <div className="plans-grid">
            {pastNoDebrief.slice(0, 3).map(plan => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="home-section">
          <h2 className="section-title">
            <span className="section-dot sky" />
            Próximos
          </h2>
          <div className="plans-grid">
            {upcoming.map(plan => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length === 0 && (
        <section className="home-empty">
          <p>No tienes planes próximos.</p>
          <Link to="/new" className="btn-inline">Crear uno →</Link>
        </section>
      )}

      {past.length > 0 && (
        <section className="home-section">
          <h2 className="section-title">
            <span className="section-dot muted" />
            Archivo
          </h2>
          <div className="plans-grid">
            {past.slice(0, 6).map(plan => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
          {past.length > 6 && (
            <div className="see-all-row">
              <Link to="/trips" className="btn-inline">Ver todos los viajes →</Link>
              <Link to="/events" className="btn-inline">Ver todos los eventos →</Link>
            </div>
          )}
        </section>
      )}
    </main>
  )
}
