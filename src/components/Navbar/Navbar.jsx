import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  const linkClass = ({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          BARBER<span>ÍA</span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <nav className={`navbar-links ${open ? 'is-open' : ''}`}>
          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
            Inicio
          </NavLink>
          <NavLink to="/servicios" className={linkClass} onClick={() => setOpen(false)}>
            Servicios
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>
              Administración
            </NavLink>
          )}

          {currentUser && !isAdmin && (
            <NavLink to="/mis-citas" className={linkClass} onClick={() => setOpen(false)}>
              Mis citas
            </NavLink>
          )}

          {currentUser && (
            <NavLink to="/perfil" className={linkClass} onClick={() => setOpen(false)}>
              Perfil
            </NavLink>
          )}

          {currentUser ? (
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Cerrar sesión
            </button>
          ) : (
            <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>
              Iniciar sesión
            </NavLink>
          )}

          {!isAdmin && (
            <Link to="/reservar" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
              Reservar cita
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
