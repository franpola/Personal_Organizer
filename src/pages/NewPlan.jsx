import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, Plane, Ticket } from 'lucide-react'
import { useTrips, useEvents } from '../hooks/useStorage'
import { generateId, CATEGORY_LABELS } from '../utils/helpers'
import './NewPlan.css'

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
        <button
          className={`type-btn ${type === 'trip' ? 'active trip' : ''}`}
          onClick={() => setType('trip')}
        >
          <Plane size={16} strokeWidth={1.5} />
          Viaje
        </button>
        <button
          className={`type-btn ${type === 'event' ? 'active event' : ''}`}
          onClick={() => setType('event')}
        >
          <Ticket size={16} strokeWidth={1.5} />
          Evento
        </button>
      </div>

      {type === 'trip' ? <TripForm navigate={navigate} /> : <EventForm navigate={navigate} />}
    </main>
  )
}

function TripForm({ navigate }) {
  const { addTrip } = useTrips()
  const [form, setForm] = useState({
    name: '', destination: '', dateStart: '', dateEnd: '', budgetTotal: '', budgetCurrency: 'EUR'
  })

  function submit() {
    if (!form.name || !form.destination) return
    const trip = {
      id: generateId('trip'),
      type: 'trip',
      name: form.name,
      destination: form.destination,
      status: 'planned',
      dates: { start: form.dateStart, end: form.dateEnd },
      flights: [],
      accommodation: [],
      budget: { total: parseFloat(form.budgetTotal) || 0, currency: form.budgetCurrency },
      expenses: [],
      locations: [],
      debrief: null
    }
    addTrip(trip)
    navigate(`/trips/${trip.id}`)
  }

  return (
    <div className="plan-form">
      <Field label="Nombre del viaje *" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Escapada a Berlín" />
      <Field label="Destino *" value={form.destination} onChange={v => setForm({ ...form, destination: v })} placeholder="Berlín, Alemania" />
      <div className="form-row">
        <Field label="Fecha de salida" type="date" value={form.dateStart} onChange={v => setForm({ ...form, dateStart: v })} />
        <Field label="Fecha de vuelta" type="date" value={form.dateEnd} onChange={v => setForm({ ...form, dateEnd: v })} />
      </div>
      <div className="form-row">
        <Field label="Presupuesto (€)" type="number" value={form.budgetTotal} onChange={v => setForm({ ...form, budgetTotal: v })} placeholder="800" />
        <div className="field">
          <label className="field-label-sm">Moneda</label>
          <select value={form.budgetCurrency} onChange={e => setForm({ ...form, budgetCurrency: e.target.value })}>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>
      <button className="btn-create trip" onClick={submit} disabled={!form.name || !form.destination}>
        <Plane size={16} strokeWidth={1.5} />
        Crear viaje
      </button>
    </div>
  )
}

function EventForm({ navigate }) {
  const { addEvent } = useEvents()
  const [form, setForm] = useState({
    name: '', category: 'music', date: '', time: '',
    venueName: '', venueAddress: '', price: '', link: '', howToGet: ''
  })

  function submit() {
    if (!form.name || !form.date) return
    const event = {
      id: generateId('event'),
      type: 'event',
      name: form.name,
      category: form.category,
      status: 'planned',
      date: form.date,
      time: form.time,
      venue: { name: form.venueName, address: form.venueAddress },
      price: parseFloat(form.price) || 0,
      link: form.link,
      howToGet: form.howToGet,
      debrief: null
    }
    addEvent(event)
    navigate(`/events/${event.id}`)
  }

  return (
    <div className="plan-form">
      <Field label="Nombre del evento *" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Meetup de React Madrid" />
      <div className="form-row">
        <div className="field">
          <label className="field-label-sm">Categoría</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <Field label="Precio (€)" type="number" value={form.price} onChange={v => setForm({ ...form, price: v })} placeholder="0 = Gratis" />
      </div>
      <div className="form-row">
        <Field label="Fecha *" type="date" value={form.date} onChange={v => setForm({ ...form, date: v })} />
        <Field label="Hora" type="time" value={form.time} onChange={v => setForm({ ...form, time: v })} />
      </div>
      <Field label="Nombre del venue" value={form.venueName} onChange={v => setForm({ ...form, venueName: v })} placeholder="La Sala Madrid" />
      <Field label="Dirección" value={form.venueAddress} onChange={v => setForm({ ...form, venueAddress: v })} placeholder="C/ Ejemplo 10, Madrid" />
      <Field label="Cómo llegar" value={form.howToGet} onChange={v => setForm({ ...form, howToGet: v })} placeholder="Metro Sol (L1, L2, L3). 3 min andando." />
      <Field label="Link al evento" value={form.link} onChange={v => setForm({ ...form, link: v })} placeholder="https://meetup.com/..." />
      <button className="btn-create event" onClick={submit} disabled={!form.name || !form.date}>
        <Ticket size={16} strokeWidth={1.5} />
        Crear evento
      </button>
    </div>
  )
}

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
