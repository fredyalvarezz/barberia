import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import "./Profile.css";

export default function Profile() {
  const { currentUser, updateProfile } = useAuth()
  const [form, setForm] = useState({ name: currentUser.name, email: currentUser.email })
  const [saved, setSaved] = useState(false)

  function handleChange(e) {
    setSaved(false)
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    updateProfile(form)
    setSaved(true)
  }

  return (
    <div className="page container">
      <div className="page-header">
        <h2>Mi perfil</h2>
        <p>Actualiza tu información de contacto.</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="field">
          <label htmlFor="name">Nombre completo</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Rol</label>
          <input value={currentUser.role === 'admin' ? 'Administrador' : 'Cliente'} disabled />
        </div>

        {saved && (
          <p>
            Perfil actualizado.
          </p>
        )}

        <button type="submit" className="btn btn-primary">
          Guardar cambios
        </button>
      </form>
    </div>
  )
}
