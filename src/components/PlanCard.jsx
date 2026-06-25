import { Link } from 'react-router-dom'
import { MapPin, Calendar, Star, Clock, Plane, Ticket } from 'lucide-react'
import { formatDateShort, daysUntil, CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/helpers'
import './PlanCard.css'

export default function PlanCard({ plan }) {
  const isTrip = plan.type === 'trip'
  const past = plan.status === 'past'
  
  const targetDate = isTrip ? plan.dates?.start : plan.date
  const days = !past && targetDate ? daysUntil(targetDate) : null

  const dateLabel = isTrip
    ? (plan.dates?.start && plan.dates?.end 
        ? `${formatDateShort(plan.dates.start)} → ${formatDateShort(plan.dates.end)}`
        : 'Fechas no definidas')
    : (plan.date 
        ? `${formatDateShort(plan.date)}${plan.time ? ` · ${plan.time}` : ''}`
        : 'Fecha no definida')

  const linkTo = isTrip ? `/trips/${plan.id}` : `/events/${plan.id}`

  return (
    <Link to={linkTo} className={`plan-card ${past ? 'past' : 'upcoming'}`}>
      <div className="plan-card-type">
        {isTrip
          ? <Plane size={13} strokeWidth={1.5} />
          : <Ticket size={13} strokeWidth={1.5} />
        }
        <span>{isTrip ? 'Viaje' : CATEGORY_LABELS[plan.category] || 'Evento'}</span>
        {!isTrip && (
          <span
            className="cat-dot"
            style={{ background: CATEGORY_COLORS[plan.category] || '#888' }}
          />
        )}
      </div>

      <h3 className="plan-card-name">{plan.name}</h3>

      <div className="plan-card-meta">
        <span className="meta-item">
          <Calendar size={13} />
          {dateLabel}
        </span>
        {(isTrip ? plan.destination : plan.venue?.name) && (
          <span className="meta-item">
            <MapPin size={13} />
            {isTrip ? plan.destination : plan.venue?.name}
          </span>
        )}
      </div>

      {!past && days !== null && (
        <div className="plan-card-countdown">
          <Clock size={12} />
          {days === 0 ? '¡Hoy!' : days === 1 ? 'Mañana' : `En ${days} días`}
        </div>
      )}

      {past && plan.debrief && (
        <div className="plan-card-debrief">
          <div className="debrief-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < plan.debrief.rating ? 'currentColor' : 'none'}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <p className="debrief-preview">{plan.debrief.text}</p>
        </div>
      )}

      {past && !plan.debrief && (
        <div className="plan-card-no-debrief">
          Añade tu valoración →
        </div>
      )}
    </Link>
  )
}
