import { createContext, useContext, useState, useEffect } from 'react'
import { sampleTrips, sampleEvents } from '../data/sampleData'

const STORAGE_KEY_TRIPS = 'wanderlog_trips'
const STORAGE_KEY_EVENTS = 'wanderlog_events'

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
    return fallback
  } catch {
    return fallback
  }
}

const PlannerContext = createContext(null)

export function PlannerProvider({ children }) {
  const [trips, setTrips] = useState(() => loadFromStorage(STORAGE_KEY_TRIPS, sampleTrips))
  const [events, setEvents] = useState(() => loadFromStorage(STORAGE_KEY_EVENTS, sampleEvents))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips))
  }, [trips])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events))
  }, [events])

  const addTrip = (trip) => setTrips(prev => [trip, ...prev])
  const updateTrip = (id, updates) => setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  const deleteTrip = (id) => setTrips(prev => prev.filter(t => t.id !== id))

  const addEvent = (event) => setEvents(prev => [event, ...prev])
  const updateEvent = (id, updates) => setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
  const deleteEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id))

  return (
    <PlannerContext.Provider value={{
      trips, addTrip, updateTrip, deleteTrip,
      events, addEvent, updateEvent, deleteEvent
    }}>
      {children}
    </PlannerContext.Provider>
  )
}

export function useTrips() {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error('useTrips must be used inside PlannerProvider')
  return { trips: ctx.trips, addTrip: ctx.addTrip, updateTrip: ctx.updateTrip, deleteTrip: ctx.deleteTrip }
}

export function useEvents() {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error('useEvents must be used inside PlannerProvider')
  return { events: ctx.events, addEvent: ctx.addEvent, updateEvent: ctx.updateEvent, deleteEvent: ctx.deleteEvent }
}
