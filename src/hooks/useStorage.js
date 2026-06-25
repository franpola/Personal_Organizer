import { useState, useEffect } from 'react'
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

export function useTrips() {
  const [trips, setTrips] = useState(() => loadFromStorage(STORAGE_KEY_TRIPS, sampleTrips))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips))
  }, [trips])

  const addTrip = (trip) => setTrips(prev => [trip, ...prev])
  const updateTrip = (id, updates) => setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  const deleteTrip = (id) => setTrips(prev => prev.filter(t => t.id !== id))

  return { trips, addTrip, updateTrip, deleteTrip }
}

export function useEvents() {
  const [events, setEvents] = useState(() => loadFromStorage(STORAGE_KEY_EVENTS, sampleEvents))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events))
  }, [events])

  const addEvent = (event) => setEvents(prev => [event, ...prev])
  const updateEvent = (id, updates) => setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
  const deleteEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id))

  return { events, addEvent, updateEvent, deleteEvent }
}
