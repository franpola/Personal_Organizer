import { Link, useLocation } from 'react-router-dom'
import { Compass, Calendar, Plus } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <Compass size={20} strokeWidth={1.5} />
        <span>Wanderlog</span>
      </Link>
      <nav className="navbar-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Inicio
        </Link>
        <Link to="/trips" className={location.pathname.startsWith('/trips') && !location.pathname.includes('new') ? 'active' : ''}>
          Viajes
        </Link>
        <Link to="/events" className={location.pathname.startsWith('/events') && !location.pathname.includes('new') ? 'active' : ''}>
          Eventos
        </Link>
      </nav>
      <div className="navbar-actions">
        <Link to="/new" className="btn-new">
          <Plus size={16} />
          <span>Nuevo</span>
        </Link>
      </div>
    </header>
  )
}
