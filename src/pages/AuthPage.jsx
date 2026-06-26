import { useState } from 'react'
import { Compass } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './AuthPage.css'

export default function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    setMessage('')
    if (!email || !password) { setError('Rellena email y contraseña.'); return }
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
        setMessage('Cuenta creada. Revisa tu email para confirmar el registro.')
      }
    } catch (err) {
      setError(err.message || 'Error al autenticar.')
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Compass size={28} strokeWidth={1.5} />
          <span>Wanderlog</span>
        </div>
        <h1>{mode === 'login' ? 'Bienvenido' : 'Crear cuenta'}</h1>
        <p className="auth-sub">
          {mode === 'login'
            ? 'Accede para ver tus viajes y eventos.'
            : 'Empieza a planificar tus aventuras.'}
        </p>

        <div className="auth-fields">
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKey}
              placeholder="tu@email.com"
              autoFocus
            />
          </div>
          <div className="auth-field">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        </div>

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-message">{message}</p>}

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>

        <p className="auth-toggle">
          {mode === 'login' ? (
            <>¿Sin cuenta? <button onClick={() => { setMode('register'); setError(''); setMessage('') }}>Regístrate</button></>
          ) : (
            <>¿Ya tienes cuenta? <button onClick={() => { setMode('login'); setError(''); setMessage('') }}>Inicia sesión</button></>
          )}
        </p>
      </div>
    </div>
  )
}
