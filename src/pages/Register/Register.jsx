import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Register.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function validate() {
    const newErrors = {}
    if (form.name.trim().length < 2) newErrors.name = 'Ingresa tu nombre completo.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Correo inválido.'
    if (form.password.length < 6) newErrors.password = 'Mínimo 6 caracteres.'
    if (form.confirm !== form.password) newErrors.confirm = 'Las contraseñas no coinciden.'
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    const result = register(form)
    if (!result.ok) {
      setErrors({ email: result.error })
      return
    }
    navigate('/')
  }

  return (
    <div className="page container auth-page">
      <div className="card auth-card">
        <h2>Crear cuenta</h2>
        <p>Regístrate para reservar tu próxima cita.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Nombre completo</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="field">
            <label htmlFor="confirm">Confirmar contraseña</label>
            <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={handleChange} />
            {errors.confirm && <span className="field-error">{errors.confirm}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Crear cuenta
          </button>
        </form>

        <p className="auth-hint">
          ¿Ya tienes cuenta? <Link to="/login" className="register-link">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
