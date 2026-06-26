import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PlannerProvider } from './context/PlannerContext'
import Navbar from './components/Navbar'
import AuthPage from './pages/AuthPage'
import Home from './pages/Home'
import TripsPage from './pages/TripsPage'
import EventsPage from './pages/EventsPage'
import TripDetail from './pages/TripDetail'
import EventDetail from './pages/EventDetail'
import NewPlan, { EditTrip, EditEvent } from './pages/NewPlan'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>
      Cargando...
    </div>
  )

  if (!user) return <AuthPage />

  return (
    <PlannerProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/:id" element={<TripDetail />} />
        <Route path="/trips/:id/edit" element={<EditTrip />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events/:id/edit" element={<EditEvent />} />
        <Route path="/new" element={<NewPlan />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </PlannerProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
