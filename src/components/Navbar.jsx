import { Link, useLocation } from 'react-router-dom'
import { Compass, Plus, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  const { user, signOut } = useAuth()

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <Compass size={20} strokeWidth={1.5} />
        <span>Wanderlog</span>
      </Link>
      <nav className="navbar-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Inicio</Link>
        <Link to="/trips" className={location.pathname.startsWith('/trips') && !location.pathname.includes('new') ? 'active' : ''}>Viajes</Link>
        <Link to="/events" className={location.pathname.startsWith('/events') && !location.pathname.includes('new') ? 'active' : ''}>Eventos</Link>
      </nav>
      <div className="navbar-actions">
        <Link to="/new" className="btn-new">
          <Plus size={16} />
          <span>Nuevo</span>
        </Link>
        {user && (
          <button className="btn-signout" onClick={signOut} title={user.email}>
            <LogOut size={16} />
          </button>
        )}
      </div>
    </header>
  )
}
