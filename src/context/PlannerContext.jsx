import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const PlannerContext = createContext(null)

export function PlannerProvider({ children }) {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // ── Fetch from Supabase ──────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!user) { setTrips([]); setEvents([]); setLoading(false); return }
    setLoading(true)
    const [{ data: tripsData }, { data: eventsData }] = await Promise.all([
      supabase.from('trips').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('events').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ])
    setTrips((tripsData || []).map(r => ({ ...r.data, id: r.id })))
    setEvents((eventsData || []).map(r => ({ ...r.data, id: r.id })))
    setLoading(false)
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Trips ────────────────────────────────────────────────────────────────
  async function addTrip(trip) {
    const { error } = await supabase.from('trips').insert({
      id: trip.id,
      user_id: user.id,
      data: trip,
    })
    if (error) throw error
    setTrips(prev => [trip, ...prev])
  }

  async function updateTrip(id, updates) {
    const updated = { ...trips.find(t => t.id === id), ...updates }
    const { error } = await supabase.from('trips').update({ data: updated }).eq('id', id)
    if (error) throw error
    setTrips(prev => prev.map(t => t.id === id ? updated : t))
  }

  async function deleteTrip(id) {
    const { error } = await supabase.from('trips').delete().eq('id', id)
    if (error) throw error
    setTrips(prev => prev.filter(t => t.id !== id))
  }

  // ── Events ───────────────────────────────────────────────────────────────
  async function addEvent(event) {
    const { error } = await supabase.from('events').insert({
      id: event.id,
      user_id: user.id,
      data: event,
    })
    if (error) throw error
    setEvents(prev => [event, ...prev])
  }

  async function updateEvent(id, updates) {
    const updated = { ...events.find(e => e.id === id), ...updates }
    const { error } = await supabase.from('events').update({ data: updated }).eq('id', id)
    if (error) throw error
    setEvents(prev => prev.map(e => e.id === id ? updated : e))
  }

  async function deleteEvent(id) {
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) throw error
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  return (
    <PlannerContext.Provider value={{
      trips, addTrip, updateTrip, deleteTrip,
      events, addEvent, updateEvent, deleteEvent,
      loading, fetchData,
    }}>
      {children}
    </PlannerContext.Provider>
  )
}

export function useTrips() {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error('useTrips must be used inside PlannerProvider')
  return { trips: ctx.trips, addTrip: ctx.addTrip, updateTrip: ctx.updateTrip, deleteTrip: ctx.deleteTrip, loading: ctx.loading }
}

export function useEvents() {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error('useEvents must be used inside PlannerProvider')
  return { events: ctx.events, addEvent: ctx.addEvent, updateEvent: ctx.updateEvent, deleteEvent: ctx.deleteEvent, loading: ctx.loading }
}
