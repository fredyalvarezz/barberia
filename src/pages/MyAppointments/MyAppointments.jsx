import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAppointments } from '../../context/AppointmentsContext'
import { useServices } from '../../context/ServicesContext'
import AppointmentCard from '../../components/AppointmentCard/AppointmentCard'
import './MyAppointments.css'

const TODAY = new Date().toISOString().slice(0, 10)

export default function MyAppointments() {
  const { currentUser } = useAuth()
  const { getAppointmentsByUser, cancelAppointment } = useAppointments()
  const { getServiceById } = useServices()
  const [tab, setTab] = useState('upcoming')

  const all = getAppointmentsByUser(currentUser.id)
  const upcoming = all.filter(
    (a) => a.status !== 'cancelled' && a.status !== 'completed' && a.date >= TODAY
  )
  const history = all.filter(
    (a) => a.status === 'cancelled' || a.status === 'completed' || a.date < TODAY
  )

  const list = tab === 'upcoming' ? upcoming : history

  return (
    <div className="page container">
      <div className="page-header">
        <h2>Mis citas</h2>
        <p>Consulta tus próximas citas y tu historial.</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${tab === 'upcoming' ? 'is-active' : ''}`}
          onClick={() => setTab('upcoming')}
        >
          Próximas ({upcoming.length})
        </button>
        <button
          className={`tab ${tab === 'history' ? 'is-active' : ''}`}
          onClick={() => setTab('history')}
        >
          Historial ({history.length})
        </button>
      </div>

      {list.length === 0 ? (
        <div className="empty-state">
          {tab === 'upcoming' ? (
            <>
              <p>Aún no tienes citas próximas.</p>
              <Link to="/reservar" className="btn btn-primary empty-state-action">
                Reservar cita
              </Link>
            </>
          ) : (
            <p>Todavía no hay historial de citas.</p>
          )}
        </div>
      ) : (
        <div className="appointments-list">
          {list.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              service={getServiceById(appointment.serviceId)}
              actions={
                tab === 'upcoming' &&
                appointment.status !== 'cancelled' && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => cancelAppointment(appointment.id)}
                  >
                    Cancelar cita
                  </button>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
