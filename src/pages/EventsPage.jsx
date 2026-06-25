import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import PlanCard from '../components/PlanCard'
import { useEvents } from '../hooks/useStorage'
import { isPast, CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/helpers'
import './ListPage.css'

export default function EventsPage() {
  const { events } = useEvents()
  const [filter, setFilter] = useState('all')

  const upcoming = events.filter(e => !isPast(e.date))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
  const past = events.filter(e => isPast(e.date))
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const cats = [...new Set(events.map(e => e.category))]

  const filterEvents = arr => filter === 'all' ? arr : arr.filter(e => e.category === filter)

  return (
    <main className="list-page">
      <div className="list-header">
        <h1>Eventos</h1>
        <Link to="/new?type=event" className="btn-new-page">
          <Plus size={15} /> Nuevo evento
        </Link>
      </div>

      {cats.length > 1 && (
        <div className="filter-row">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          {cats.map(c => (
            <button
              key={c}
              className={`filter-btn ${filter === c ? 'active' : ''}`}
              onClick={() => setFilter(c)}
              style={filter === c ? { background: CATEGORY_COLORS[c], color: 'white', borderColor: CATEGORY_COLORS[c] } : {}}
            >
              {CATEGORY_LABELS[c] || c}
            </button>
          ))}
        </div>
      )}

      {filterEvents(upcoming).length > 0 && (
        <section className="list-section">
          <h2 className="list-section-title">Próximos</h2>
          <div className="plans-grid">
            {filterEvents(upcoming).map(e => <PlanCard key={e.id} plan={e} />)}
          </div>
        </section>
      )}

      {filterEvents(past).length > 0 && (
        <section className="list-section">
          <h2 className="list-section-title">Pasados</h2>
          <div className="plans-grid">
            {filterEvents(past).map(e => <PlanCard key={e.id} plan={e} />)}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <div className="list-empty">
          <p>Sin eventos aún.</p>
          <Link to="/new?type=event" className="btn-inline">Añade tu primer evento →</Link>
        </div>
      )}
    </main>
  )
}

// Need useState import
import { useState } from 'react'
