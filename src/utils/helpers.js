export function formatDate(dateStr, opts = {}) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...opts
  })
}

export function formatDateShort(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

export function isPast(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr + 'T23:59:00') < new Date()
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr + 'T12:00:00') - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function tripDuration(start, end) {
  if (!start || !end) return 0
  const diff = new Date(end) - new Date(start)
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

export function totalExpenses(expenses = []) {
  return expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
}

export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
}

export const CATEGORY_LABELS = {
  music: 'Música',
  art: 'Arte',
  sport: 'Deporte',
  food: 'Gastronomía',
  tech: 'Tecnología',
  social: 'Social',
  culture: 'Cultura',
  other: 'Otro'
}

export const CATEGORY_COLORS = {
  music: '#c8562a',
  art: '#5a4fcf',
  sport: '#2d7a4f',
  food: '#b07d2a',
  tech: '#3a7ca5',
  social: '#c84f8a',
  culture: '#6a4f3a',
  other: '#666688'
}

export const EXPENSE_CATEGORIES = {
  transport: 'Transporte',
  accommodation: 'Alojamiento',
  food: 'Comida',
  activities: 'Actividades',
  shopping: 'Compras',
  other: 'Otro'
}
