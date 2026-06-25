import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PlannerProvider } from './context/PlannerContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import TripsPage from './pages/TripsPage'
import EventsPage from './pages/EventsPage'
import TripDetail from './pages/TripDetail'
import EventDetail from './pages/EventDetail'
import NewPlan, { EditTrip, EditEvent } from './pages/NewPlan'

export default function App() {
  return (
    <PlannerProvider>
      <BrowserRouter>
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
        </Routes>
      </BrowserRouter>
    </PlannerProvider>
  )
}
