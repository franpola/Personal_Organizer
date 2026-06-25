import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Ticket, ExternalLink, Edit3, Trash2, Navigation, FileText } from 'lucide-react'
import { useEvents } from '../context/PlannerContext'
import DebriefSection from '../components/DebriefSection'
import { formatDate, isPast, CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/helpers'
import './EventDetail.css'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { events, updateEvent, deleteEvent } = useEvents()
  const event = events.find(e => e.id === id)

  if (!event) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--ink-soft)' }}>
      <p>Evento no encontrado.</p>
      <Link to="/">← Inicio</Link>
    </div>
  )

  const past = isPast(event.date)
  const catColor = CATEGORY_COLORS[event.category] || '#888'

  function handleDelete() {
    if (confirm(`¿Eliminar "${event.name}"?`)) {
      deleteEvent(id)
      navigate('/events')
    }
  }

  function saveDebrief(debrief) {
    updateEvent(id, { debrief, status: 'past' })
  }

  const mapsQuery = encodeURIComponent(event.venue?.address || event.venue?.name || '')
  const mapsUrl = `https://maps.google.com/maps?q=${mapsQuery}&output=embed`
  const mapsLink = `https://maps.google.com/?q=${mapsQuery}`

  return (
    <main className="event-detail">
      <Link to="/events" className="back-link"><ArrowLeft size={16} /> Eventos</Link>

      <div className="event-header">
        <div className="event-cat-badge" style={{ background: catColor + '22', color: catColor }}>
          {CATEGORY_LABELS[event.category] || 'Evento'}
        </div>
        <div className="event-header-main">
          <h1>{event.name}</h1>
          <div className="event-header-actions">
            <Link to={`/events/${id}/edit`} className="btn-ghost"><Edit3 size={15} /> Editar</Link>
            <button className="btn-ghost danger" onClick={handleDelete}><Trash2 size={15} /></button>
          </div>
        </div>
      </div>

      <div className="event-body">
        <div className="event-info-col">
          <div className="info-block">
            <div className="info-row">
              <Clock size={15} strokeWidth={1.5} className="info-icon" />
              <div>
                <span className="info-label">Cuándo</span>
                <span className="info-value">{formatDate(event.date)}{event.time && ` · ${event.time}`}</span>
              </div>
            </div>

            {event.venue?.name && (
              <div className="info-row">
                <MapPin size={15} strokeWidth={1.5} className="info-icon" />
                <div>
                  <span className="info-label">Venue</span>
                  <span className="info-value">{event.venue.name}</span>
                  {event.venue.address && <span className="info-sub">{event.venue.address}</span>}
                </div>
              </div>
            )}

            {event.howToGet && (
              <div className="info-row">
                <Navigation size={15} strokeWidth={1.5} className="info-icon" />
                <div>
                  <span className="info-label">Cómo llegar</span>
                  <span className="info-value">{event.howToGet}</span>
                </div>
              </div>
            )}

            {event.price !== undefined && event.price !== null && (
              <div className="info-row">
                <Ticket size={15} strokeWidth={1.5} className="info-icon" />
                <div>
                  <span className="info-label">Precio</span>
                  <span className="info-value">{event.price === 0 ? 'Gratis' : `${event.price}€`}</span>
                </div>
              </div>
            )}

            {event.link && (
              <div className="info-row">
                <ExternalLink size={15} strokeWidth={1.5} className="info-icon" />
                <div>
                  <span className="info-label">Enlace</span>
                  <a href={event.link} target="_blank" rel="noreferrer" className="info-link">
                    {event.link.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            )}

            {event.notes && (
              <div className="info-row">
                <FileText size={15} strokeWidth={1.5} className="info-icon" />
                <div>
                  <span className="info-label">Notas</span>
                  <span className="info-value info-notes">{event.notes}</span>
                </div>
              </div>
            )}
          </div>

          {past && (
            <DebriefSection
              debrief={event.debrief}
              onSave={saveDebrief}
              planName={event.name}
            />
          )}
        </div>

        <div className="event-map-col">
          {event.venue?.name && (
            <>
              <iframe
                title="Mapa venue"
                src={mapsUrl}
                width="100%"
                height="280"
                style={{ border: 0, borderRadius: 'var(--radius-md)', display: 'block' }}
                allowFullScreen
                loading="lazy"
              />
              <a href={mapsLink} target="_blank" rel="noreferrer" className="maps-link">
                <Navigation size={13} /> Abrir en Google Maps
              </a>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
