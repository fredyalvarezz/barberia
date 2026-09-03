import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const result = login(form)
    if (!result.ok) {
      setError(result.error)
      return
    }
    const redirectTo = location.state?.from || '/'
    navigate(redirectTo)
  }

  return (
    <div className="page container auth-page">
      <div className="card auth-card">
        <h2>Iniciar sesión</h2>
        <p >Accede para reservar y gestionar tus citas.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="field-error" >{error}</p>}

          <button type="submit" className="btn btn-primary btn-block">
            Entrar
          </button>
        </form>

        <p className="auth-hint">
          ¿No tienes cuenta? <Link to="/registro" className="login-link">Regístrate</Link>
        </p>
        
      </div>
    </div>
  )
}
