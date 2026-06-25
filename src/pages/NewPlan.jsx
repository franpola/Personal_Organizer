import { useState } from 'react'
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plane, Ticket } from 'lucide-react'
import { useTrips, useEvents } from '../context/PlannerContext'
import { generateId, CATEGORY_LABELS } from '../utils/helpers'
import './NewPlan.css'

// ─── /new ────────────────────────────────────────────────────────────────────

export default function NewPlan() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const defaultType = params.get('type') || 'trip'
  const [type, setType] = useState(defaultType)

  return (
    <main className="new-plan">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Inicio</Link>
      <h1>Nuevo plan</h1>
      <div className="type-toggle">
        <button className={`type-btn ${type === 'trip' ? 'active trip' : ''}`} onClick={() => setType('trip')}>
          <Plane size={16} strokeWidth={1.5} /> Viaje
        </button>
        <button className={`type-btn ${type === 'event' ? 'active event' : ''}`} onClick={() => setType('event')}>
          <Ticket size={16} strokeWidth={1.5} /> Evento
        </button>
      </div>
      {type === 'trip'
        ? <TripForm navigate={navigate} />
        : <EventForm navigate={navigate} />
      }
    </main>
  )
}

// ─── /trips/:id/edit ─────────────────────────────────────────────────────────

export function EditTrip() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { trips } = useTrips()
  const trip = trips.find(t => t.id === id)

  if (!trip) return (
    <main className="new-plan">
      <Link to="/trips" className="back-link"><ArrowLeft size={16} /> Viajes</Link>
      <p style={{ color: 'var(--ink-soft)', marginTop: '2rem' }}>Viaje no encontrado.</p>
    </main>
  )

  return (
    <main className="new-plan">
      <Link to={`/trips/${id}`} className="back-link"><ArrowLeft size={16} /> Volver al viaje</Link>
      <h1>Editar viaje</h1>
      <TripForm navigate={navigate} existing={trip} />
    </main>
  )
}

// ─── /events/:id/edit ────────────────────────────────────────────────────────

export function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { events } = useEvents()
  const event = events.find(e => e.id === id)

  if (!event) return (
    <main className="new-plan">
      <Link to="/events" className="back-link"><ArrowLeft size={16} /> Eventos</Link>
      <p style={{ color: 'var(--ink-soft)', marginTop: '2rem' }}>Evento no encontrado.</p>
    </main>
  )

  return (
    <main className="new-plan">
      <Link to={`/events/${id}`} className="back-link"><ArrowLeft size={16} /> Volver al evento</Link>
      <h1>Editar evento</h1>
      <EventForm navigate={navigate} existing={event} />
    </main>
  )
}

// ─── TripForm ─────────────────────────────────────────────────────────────────

function TripForm({ navigate, existing }) {
  const { addTrip, updateTrip } = useTrips()
  const isEdit = !!existing

  const [form, setForm] = useState({
    name:           existing?.name ?? '',
    destination:    existing?.destination ?? '',
    dateStart:      existing?.dates?.start ?? '',
    dateEnd:        existing?.dates?.end ?? '',
    budgetTotal:    String(existing?.budget?.total ?? ''),
    budgetCurrency: existing?.budget?.currency ?? 'EUR',
  })

  function submit() {
    if (!form.name || !form.destination) return
    if (isEdit) {
      updateTrip(existing.id, {
        name:        form.name,
        destination: form.destination,
        dates:       { start: form.dateStart, end: form.dateEnd },
        budget:      { total: parseFloat(form.budgetTotal) || 0, currency: form.budgetCurrency },
      })
      navigate(`/trips/${existing.id}`)
    } else {
      const trip = {
        id:            generateId('trip'),
        type:          'trip',
        name:          form.name,
        destination:   form.destination,
        status:        'planned',
        dates:         { start: form.dateStart, end: form.dateEnd },
        flights:       [],
        accommodation: [],
        budget:        { total: parseFloat(form.budgetTotal) || 0, currency: form.budgetCurrency },
        expenses:      [],
        locations:     [],
        debrief:       null,
      }
      addTrip(trip)
      navigate(`/trips/${trip.id}`)
    }
  }

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="plan-form">
      <Field label="Nombre del viaje *" value={form.name} onChange={set('name')} placeholder="Escapada a Berlín" />
      <Field label="Destino *" value={form.destination} onChange={set('destination')} placeholder="Berlín, Alemania" />
      <div className="form-row">
        <Field label="Fecha de salida" type="date" value={form.dateStart} onChange={set('dateStart')} />
        <Field label="Fecha de vuelta" type="date" value={form.dateEnd}   onChange={set('dateEnd')} />
      </div>
      <div className="form-row">
        <Field label="Presupuesto (€)" type="number" value={form.budgetTotal} onChange={set('budgetTotal')} placeholder="800" />
        <div className="field">
          <label className="field-label-sm">Moneda</label>
          <select value={form.budgetCurrency} onChange={e => set('budgetCurrency')(e.target.value)}>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>
      <button className="btn-create trip" onClick={submit} disabled={!form.name || !form.destination}>
        <Plane size={16} strokeWidth={1.5} />
        {isEdit ? 'Guardar cambios' : 'Crear viaje'}
      </button>
    </div>
  )
}

// ─── EventForm ────────────────────────────────────────────────────────────────

function EventForm({ navigate, existing }) {
  const { addEvent, updateEvent } = useEvents()
  const isEdit = !!existing

  const [form, setForm] = useState({
    name:         existing?.name ?? '',
    category:     existing?.category ?? 'music',
    date:         existing?.date ?? '',
    time:         existing?.time ?? '',
    venueName:    existing?.venue?.name ?? '',
    venueAddress: existing?.venue?.address ?? '',
    price:        existing?.price != null ? String(existing.price) : '',
    link:         existing?.link ?? '',
    howToGet:     existing?.howToGet ?? '',
    notes:        existing?.notes ?? '',
  })

  function submit() {
    if (!form.name || !form.date) return
    const payload = {
      name:     form.name,
      category: form.category,
      date:     form.date,
      time:     form.time,
      venue:    { name: form.venueName, address: form.venueAddress },
      price:    parseFloat(form.price) || 0,
      link:     form.link,
      howToGet: form.howToGet,
      notes:    form.notes,
    }
    if (isEdit) {
      updateEvent(existing.id, payload)
      navigate(`/events/${existing.id}`)
    } else {
      const event = {
        ...payload,
        id:      generateId('event'),
        type:    'event',
        status:  'planned',
        debrief: null,
      }
      addEvent(event)
      navigate(`/events/${event.id}`)
    }
  }

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="plan-form">
      <Field label="Nombre del evento *" value={form.name} onChange={set('name')} placeholder="Meetup de React Madrid" />
      <div className="form-row">
        <div className="field">
          <label className="field-label-sm">Categoría</label>
          <select value={form.category} onChange={e => set('category')(e.target.value)}>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <Field label="Precio (€)" type="number" value={form.price} onChange={set('price')} placeholder="0 = Gratis" />
      </div>
      <div className="form-row">
        <Field label="Fecha *" type="date" value={form.date} onChange={set('date')} />
        <Field label="Hora"    type="time" value={form.time} onChange={set('time')} />
      </div>
      <Field label="Nombre del venue"  value={form.venueName}    onChange={set('venueName')}    placeholder="La Sala Madrid" />
      <Field label="Dirección"         value={form.venueAddress} onChange={set('venueAddress')} placeholder="C/ Ejemplo 10, Madrid" />
      <Field label="Cómo llegar"       value={form.howToGet}     onChange={set('howToGet')}     placeholder="Metro Sol (L1, L2, L3). 3 min andando." />
      <Field label="Link al evento"    value={form.link}         onChange={set('link')}         placeholder="https://meetup.com/..." />
      <TextArea label="Notas" value={form.notes} onChange={set('notes')} placeholder="Descripción del evento, qué esperar, qué llevar..." rows={5} />
      <button className="btn-create event" onClick={submit} disabled={!form.name || !form.date}>
        <Ticket size={16} strokeWidth={1.5} />
        {isEdit ? 'Guardar cambios' : 'Crear evento'}
      </button>
    </div>
  )
}

// ─── Field components ─────────────────────────────────────────────────────────

function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div className="field">
      <label className="field-label-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

function TextArea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div className="field">
      <label className="field-label-sm">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          padding: '0.6rem 0.875rem',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--paper-card)',
          color: 'var(--ink)',
          resize: 'vertical',
          lineHeight: '1.6',
          transition: 'border-color 0.15s',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  )
}
