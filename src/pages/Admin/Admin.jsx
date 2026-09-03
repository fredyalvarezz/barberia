import { useMemo, useState } from 'react'
import { useAppointments } from '../../context/AppointmentsContext'
import { useServices } from '../../context/ServicesContext'
import { useAuth } from '../../context/AuthContext'
import AppointmentCard from '../../components/AppointmentCard/AppointmentCard'
import './Admin.css'

const TODAY = new Date().toISOString().slice(0, 10)

export default function Admin() {
  const [tab, setTab] = useState('resumen')

  return (
    <div className="page container">
      <div className="page-header">
        <h2>Administración</h2>
        <p>Gestiona la agenda, las citas y el catálogo de servicios.</p>
      </div>

      <div className="tabs">
        {['resumen', 'agenda', 'servicios'].map((t) => (
          <button
            key={t}
            className={`tab ${tab === t ? 'is-active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'resumen' && <ResumenTab />}
      {tab === 'agenda' && <AgendaTab />}
      {tab === 'servicios' && <ServiciosTab />}
    </div>
  )
}

function ResumenTab() {
  const { appointments } = useAppointments()
  const { getServiceById } = useServices()

  const todays = appointments.filter((a) => a.date === TODAY && a.status !== 'cancelled')
  const pending = appointments.filter((a) => a.status === 'pending')
  const confirmed = appointments.filter((a) => a.status === 'confirmed')
  const completed = appointments.filter((a) => a.status === 'completed')
  const revenue = completed.reduce((sum, a) => {
    const service = getServiceById(a.serviceId)
    return sum + (service?.price || 0)
  }, 0)

  const stats = [
    { label: 'Citas de hoy', value: todays.length },
    { label: 'Pendientes', value: pending.length },
    { label: 'Confirmadas', value: confirmed.length },
    { label: 'Completadas', value: completed.length },
    { label: 'Ingresos estimados', value: `$${revenue}` },
  ]

  return (
    <div className="grid stats-grid">
      {stats.map((s) => (
        <div className="card stat-card" key={s.label}>
          <span className="stat-value">{s.value}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

function AgendaTab() {
  const [date, setDate] = useState(TODAY)
  const { getAppointmentsByDate, updateStatus, cancelAppointment } = useAppointments()
  const { getServiceById } = useServices()
  const { getUserById } = useAuth()

  const dayAppointments = useMemo(
    () => getAppointmentsByDate(date).sort((a, b) => a.time.localeCompare(b.time)),
    [date, getAppointmentsByDate]
  )

  return (
    <div>
      <div className="field agenda-date-field">
        <label htmlFor="agenda-date">Selecciona un día</label>
        <input
          id="agenda-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {dayAppointments.length === 0 ? (
        <div className="empty-state">No hay citas registradas para este día.</div>
      ) : (
        <div className="appointments-list">
          {dayAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              service={getServiceById(appointment.serviceId)}
              clientName={getUserById(appointment.userId)?.name}
              actions={
                <>
                  {appointment.status === 'pending' && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => updateStatus(appointment.id, 'confirmed')}
                    >
                      Confirmar
                    </button>
                  )}
                  {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => updateStatus(appointment.id, 'completed')}
                    >
                      Marcar completada
                    </button>
                  )}
                  {appointment.status !== 'cancelled' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => cancelAppointment(appointment.id)}
                    >
                      Cancelar
                    </button>
                  )}
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ServiciosTab() {
  const { services, addService, updateService, removeService } = useServices()
  const [form, setForm] = useState({ name: '', description: '', duration: 60, price: '' })

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.price) return
    addService({
      name: form.name.trim(),
      description: form.description.trim(),
      duration: Number(form.duration) || 60,
      price: Number(form.price) || 0,
    })
    setForm({ name: '', description: '', duration: 60, price: '' })
  }

  return (
    <div>
      <div className="card">
        <h3>Servicios actuales</h3>
        <div>
          {services.map((s) => (
            <div className="service-row" key={s.id}>
              <div>
                <strong>{s.name}</strong>
                <p className="service-row-desc">{s.description}</p>
              </div>
              <span>${s.price}</span>
              <span>{s.duration} min</span>
              <button
                className={`btn btn-sm ${s.active ? 'btn-outline' : 'btn-primary'}`}
                onClick={() => updateService(s.id, { active: !s.active })}
              >
                {s.active ? 'Desactivar' : 'Activar'}
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => removeService(s.id)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card services-admin-form">
        <h3>Agregar servicio</h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nombre</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Descripción</label>
            <input name="description" value={form.description} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Duración (min)</label>
            <input name="duration" type="number" min="15" step="15" value={form.duration} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Precio</label>
            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary">Agregar servicio</button>
        </form>
      </div>
    </div>
  )
}
