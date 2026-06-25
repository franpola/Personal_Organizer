import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Plane, Hotel, Wallet, MapPin, Plus, Trash2, Edit3, ExternalLink
} from 'lucide-react'
import { useTrips } from '../hooks/useStorage'
import DebriefSection from '../components/DebriefSection'
import {
  formatDate, formatDateShort, tripDuration, totalExpenses,
  isPast, generateId, EXPENSE_CATEGORIES
} from '../utils/helpers'
import './TripDetail.css'

const TABS = [
  { id: 'overview', label: 'Resumen' },
  { id: 'flights', label: 'Vuelos' },
  { id: 'accommodation', label: 'Alojamiento' },
  { id: 'budget', label: 'Presupuesto' },
  { id: 'map', label: 'Mapa' },
]

export default function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { trips, updateTrip, deleteTrip } = useTrips()
  const trip = trips.find(t => t.id === id)
  const [tab, setTab] = useState('overview')

  if (!trip) return (
    <div className="not-found">
      <p>Viaje no encontrado.</p>
      <Link to="/">← Inicio</Link>
    </div>
  )

  const past = isPast(trip.dates?.end || trip.dates?.start)
  const spent = totalExpenses(trip.expenses)
  const duration = tripDuration(trip.dates?.start, trip.dates?.end)

  function handleDelete() {
    if (confirm(`¿Eliminar el viaje "${trip.name}"?`)) {
      deleteTrip(id)
      navigate('/trips')
    }
  }

  function addFlight(flight) {
    updateTrip(id, { flights: [...(trip.flights || []), { ...flight, id: generateId('f') }] })
  }

  function removeFlight(fid) {
    updateTrip(id, { flights: trip.flights.filter(f => f.id !== fid) })
  }

  function addAccommodation(acc) {
    updateTrip(id, { accommodation: [...(trip.accommodation || []), { ...acc, id: generateId('a') }] })
  }

  function removeAccommodation(aid) {
    updateTrip(id, { accommodation: trip.accommodation.filter(a => a.id !== aid) })
  }

  function addExpense(exp) {
    updateTrip(id, { expenses: [...(trip.expenses || []), { ...exp, id: generateId('e') }] })
  }

  function removeExpense(eid) {
    updateTrip(id, { expenses: trip.expenses.filter(e => e.id !== eid) })
  }

  function saveDebrief(debrief) {
    updateTrip(id, { debrief, status: 'past' })
  }

  return (
    <main className="trip-detail">
      <div className="detail-header">
        <Link to="/trips" className="back-link"><ArrowLeft size={16} /> Viajes</Link>
        <div className="detail-header-main">
          <div>
            <span className="detail-type">✈️ Viaje</span>
            <h1>{trip.name}</h1>
            <p className="detail-sub">
              {trip.destination} · {formatDateShort(trip.dates?.start)} → {formatDateShort(trip.dates?.end)}
              {duration > 0 && ` · ${duration} noches`}
            </p>
          </div>
          <div className="detail-header-actions">
            <Link to={`/trips/${id}/edit`} className="btn-ghost"><Edit3 size={15} /> Editar</Link>
            <button className="btn-ghost danger" onClick={handleDelete}><Trash2 size={15} /></button>
          </div>
        </div>
        <nav className="detail-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="detail-body">
        {tab === 'overview' && (
          <OverviewTab trip={trip} spent={spent} past={past} saveDebrief={saveDebrief} />
        )}
        {tab === 'flights' && (
          <FlightsTab flights={trip.flights || []} onAdd={addFlight} onRemove={removeFlight} />
        )}
        {tab === 'accommodation' && (
          <AccommodationTab accommodation={trip.accommodation || []} onAdd={addAccommodation} onRemove={removeAccommodation} />
        )}
        {tab === 'budget' && (
          <BudgetTab
            budget={trip.budget}
            expenses={trip.expenses || []}
            spent={spent}
            onAdd={addExpense}
            onRemove={removeExpense}
            onBudgetUpdate={(b) => updateTrip(id, { budget: { ...trip.budget, ...b } })}
          />
        )}
        {tab === 'map' && (
          <MapTab destination={trip.destination} locations={trip.locations || []} />
        )}
      </div>
    </main>
  )
}

function OverviewTab({ trip, spent, past, saveDebrief }) {
  return (
    <div className="overview-tab">
      <div className="overview-stats">
        <div className="stat-card">
          <span className="stat-label">Presupuesto</span>
          <span className="stat-value">{spent} / {trip.budget?.total || '—'} {trip.budget?.currency || 'EUR'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Vuelos</span>
          <span className="stat-value">{trip.flights?.length || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Alojamientos</span>
          <span className="stat-value">{trip.accommodation?.length || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Lugares guardados</span>
          <span className="stat-value">{trip.locations?.length || 0}</span>
        </div>
      </div>

      {past && (
        <DebriefSection
          debrief={trip.debrief}
          onSave={saveDebrief}
          planName={trip.name}
        />
      )}
    </div>
  )
}

function FlightsTab({ flights, onAdd, onRemove }) {
  const [form, setForm] = useState({ from: '', to: '', date: '', time: '', airline: '', price: '', confirmationCode: '' })
  const [adding, setAdding] = useState(false)

  function submit() {
    if (!form.from || !form.to || !form.date) return
    onAdd({ ...form, price: parseFloat(form.price) || 0 })
    setForm({ from: '', to: '', date: '', time: '', airline: '', price: '', confirmationCode: '' })
    setAdding(false)
  }

  return (
    <div className="tab-content">
      <div className="tab-header-row">
        <h3>Vuelos</h3>
        <button className="btn-add" onClick={() => setAdding(true)}>
          <Plus size={15} /> Añadir vuelo
        </button>
      </div>

      {adding && (
        <div className="form-card">
          <div className="form-row">
            <Field label="Origen" value={form.from} onChange={v => setForm({ ...form, from: v })} placeholder="MAD" />
            <Field label="Destino" value={form.to} onChange={v => setForm({ ...form, to: v })} placeholder="LIS" />
          </div>
          <div className="form-row">
            <Field label="Fecha" type="date" value={form.date} onChange={v => setForm({ ...form, date: v })} />
            <Field label="Hora" type="time" value={form.time} onChange={v => setForm({ ...form, time: v })} />
          </div>
          <div className="form-row">
            <Field label="Aerolínea" value={form.airline} onChange={v => setForm({ ...form, airline: v })} placeholder="Iberia" />
            <Field label="Precio (€)" type="number" value={form.price} onChange={v => setForm({ ...form, price: v })} placeholder="89" />
          </div>
          <Field label="Código reserva" value={form.confirmationCode} onChange={v => setForm({ ...form, confirmationCode: v })} placeholder="IB7823" />
          <div className="form-actions">
            <button className="btn-ghost" onClick={() => setAdding(false)}>Cancelar</button>
            <button className="btn-primary" onClick={submit}>Guardar</button>
          </div>
        </div>
      )}

      <div className="items-list">
        {flights.length === 0 && !adding && <p className="empty-msg">Sin vuelos aún.</p>}
        {flights.map(f => (
          <div key={f.id} className="item-row">
            <Plane size={16} strokeWidth={1.5} className="item-icon" />
            <div className="item-main">
              <strong>{f.from} → {f.to}</strong>
              <span>{formatDate(f.date, { day: 'numeric', month: 'short' })} {f.time && `· ${f.time}`} {f.airline && `· ${f.airline}`}</span>
            </div>
            <div className="item-right">
              {f.price > 0 && <span className="item-price">{f.price}€</span>}
              {f.confirmationCode && <code className="item-code">{f.confirmationCode}</code>}
              <button className="btn-remove" onClick={() => onRemove(f.id)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AccommodationTab({ accommodation, onAdd, onRemove }) {
  const [form, setForm] = useState({ name: '', address: '', checkIn: '', checkOut: '', price: '', confirmationCode: '' })
  const [adding, setAdding] = useState(false)

  function submit() {
    if (!form.name || !form.checkIn) return
    onAdd({ ...form, price: parseFloat(form.price) || 0 })
    setForm({ name: '', address: '', checkIn: '', checkOut: '', price: '', confirmationCode: '' })
    setAdding(false)
  }

  return (
    <div className="tab-content">
      <div className="tab-header-row">
        <h3>Alojamiento</h3>
        <button className="btn-add" onClick={() => setAdding(true)}>
          <Plus size={15} /> Añadir
        </button>
      </div>

      {adding && (
        <div className="form-card">
          <Field label="Nombre" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Hotel Roma" />
          <Field label="Dirección" value={form.address} onChange={v => setForm({ ...form, address: v })} placeholder="Calle Mayor 1" />
          <div className="form-row">
            <Field label="Check-in" type="date" value={form.checkIn} onChange={v => setForm({ ...form, checkIn: v })} />
            <Field label="Check-out" type="date" value={form.checkOut} onChange={v => setForm({ ...form, checkOut: v })} />
          </div>
          <div className="form-row">
            <Field label="Precio total (€)" type="number" value={form.price} onChange={v => setForm({ ...form, price: v })} placeholder="200" />
            <Field label="Código reserva" value={form.confirmationCode} onChange={v => setForm({ ...form, confirmationCode: v })} placeholder="BK-12345" />
          </div>
          <div className="form-actions">
            <button className="btn-ghost" onClick={() => setAdding(false)}>Cancelar</button>
            <button className="btn-primary" onClick={submit}>Guardar</button>
          </div>
        </div>
      )}

      <div className="items-list">
        {accommodation.length === 0 && !adding && <p className="empty-msg">Sin alojamiento aún.</p>}
        {accommodation.map(a => (
          <div key={a.id} className="item-row">
            <Hotel size={16} strokeWidth={1.5} className="item-icon" />
            <div className="item-main">
              <strong>{a.name}</strong>
              <span>
                {a.address && `${a.address} · `}
                {formatDateShort(a.checkIn)} → {formatDateShort(a.checkOut)}
              </span>
            </div>
            <div className="item-right">
              {a.price > 0 && <span className="item-price">{a.price}€</span>}
              {a.confirmationCode && <code className="item-code">{a.confirmationCode}</code>}
              <button className="btn-remove" onClick={() => onRemove(a.id)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BudgetTab({ budget, expenses, spent, onAdd, onRemove, onBudgetUpdate }) {
  const [form, setForm] = useState({ date: '', category: 'food', amount: '', description: '' })
  const [adding, setAdding] = useState(false)
  const [editingBudget, setEditingBudget] = useState(false)
  const [budgetVal, setBudgetVal] = useState(budget?.total || '')

  const pct = budget?.total ? Math.min(100, Math.round((spent / budget.total) * 100)) : 0

  function submit() {
    if (!form.amount) return
    onAdd({ ...form, amount: parseFloat(form.amount) })
    setForm({ date: '', category: 'food', amount: '', description: '' })
    setAdding(false)
  }

  return (
    <div className="tab-content">
      <div className="budget-summary">
        <div className="budget-numbers">
          <div>
            <span className="budget-spent">{spent}€</span>
            <span className="budget-label"> gastado</span>
          </div>
          <div className="budget-total-row">
            {editingBudget ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="number"
                  value={budgetVal}
                  onChange={e => setBudgetVal(e.target.value)}
                  className="budget-input"
                />
                <button className="btn-primary" style={{ padding: '0.25rem 0.75rem' }} onClick={() => {
                  onBudgetUpdate({ total: parseFloat(budgetVal) || 0 })
                  setEditingBudget(false)
                }}>OK</button>
              </div>
            ) : (
              <button className="budget-total-btn" onClick={() => setEditingBudget(true)}>
                de {budget?.total || '—'}€ presupuestado ✏️
              </button>
            )}
          </div>
        </div>
        {budget?.total > 0 && (
          <div className="budget-bar-wrap">
            <div className="budget-bar">
              <div
                className="budget-bar-fill"
                style={{ width: `${pct}%`, background: pct > 90 ? 'var(--accent)' : 'var(--sky)' }}
              />
            </div>
            <span className="budget-pct">{pct}%</span>
          </div>
        )}
      </div>

      <div className="tab-header-row">
        <h3>Gastos</h3>
        <button className="btn-add" onClick={() => setAdding(true)}><Plus size={15} /> Añadir gasto</button>
      </div>

      {adding && (
        <div className="form-card">
          <div className="form-row">
            <Field label="Fecha" type="date" value={form.date} onChange={v => setForm({ ...form, date: v })} />
            <div className="field">
              <label className="field-label-sm">Categoría</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <Field label="Importe (€)" type="number" value={form.amount} onChange={v => setForm({ ...form, amount: v })} placeholder="45" />
            <Field label="Descripción" value={form.description} onChange={v => setForm({ ...form, description: v })} placeholder="Cena en..." />
          </div>
          <div className="form-actions">
            <button className="btn-ghost" onClick={() => setAdding(false)}>Cancelar</button>
            <button className="btn-primary" onClick={submit}>Guardar</button>
          </div>
        </div>
      )}

      <div className="items-list">
        {expenses.length === 0 && !adding && <p className="empty-msg">Sin gastos registrados.</p>}
        {expenses.map(e => (
          <div key={e.id} className="item-row">
            <Wallet size={16} strokeWidth={1.5} className="item-icon" />
            <div className="item-main">
              <strong>{e.description || EXPENSE_CATEGORIES[e.category]}</strong>
              <span>{EXPENSE_CATEGORIES[e.category]} {e.date && `· ${formatDateShort(e.date)}`}</span>
            </div>
            <div className="item-right">
              <span className="item-price">{e.amount}€</span>
              <button className="btn-remove" onClick={() => onRemove(e.id)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MapTab({ destination, locations }) {
  const query = encodeURIComponent(destination || '')
  const mapsUrl = `https://maps.google.com/maps?q=${query}&output=embed`

  return (
    <div className="tab-content">
      <div className="map-wrap">
        <iframe
          title="Mapa destino"
          src={mapsUrl}
          width="100%"
          height="380"
          style={{ border: 0, borderRadius: 'var(--radius-md)' }}
          allowFullScreen
          loading="lazy"
        />
      </div>
      {locations.length > 0 && (
        <div className="locations-list">
          <h3>Lugares guardados</h3>
          {locations.map(l => (
            <div key={l.id} className="item-row">
              <MapPin size={16} strokeWidth={1.5} className="item-icon" />
              <div className="item-main">
                <strong>{l.name}</strong>
                <span>{l.address}{l.notes && ` · ${l.notes}`}</span>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(l.address || l.name)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
                style={{ padding: '0.25rem' }}
              >
                <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      )}
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
