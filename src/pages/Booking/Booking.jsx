import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useServices } from '../../context/ServicesContext'
import { useAppointments } from '../../context/AppointmentsContext'
import { useAuth } from '../../context/AuthContext'
import TimeSlot from '../../components/TimeSlot/TimeSlot'
import './Booking.css'

const WEEKDAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']

function nextDays(count) {
  const days = []
  const today = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }
  return days
}

function toISODate(date) {
  return date.toISOString().slice(0, 10)
}

const STEPS = ['Servicio', 'Fecha', 'Hora', 'Notas', 'Confirmar']

export default function Booking() {
  const { activeServices, getServiceById } = useServices()
  const { getAvailableSlots, createAppointment } = useAppointments()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [step, setStep] = useState(0)
  const [serviceId, setServiceId] = useState(searchParams.get('servicio') || '')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [confirmedAppointment, setConfirmedAppointment] = useState(null)

  const days = useMemo(
    () => nextDays(18).filter((d) => d.getDay() !== 0),
    []
  )
  const selectedService = getServiceById(serviceId)
  const slots = date ? getAvailableSlots(date) : []

  function goTo(stepIndex) {
    setError('')
    setStep(stepIndex)
  }

  function handleConfirm() {
    if (!currentUser) {
      navigate('/login', { state: { from: '/reservar' } })
      return
    }
    const result = createAppointment({
      userId: currentUser.id,
      serviceId,
      date,
      time,
      notes,
    })
    if (!result.ok) {
      setError(result.error)
      goTo(2)
      return
    }
    setConfirmedAppointment(result.appointment)
  }

  if (confirmedAppointment) {
    return (
      <div className="page container">
        <div className="card confirmation-card">
          <div className="confirmation-icon">✓</div>
          <h2>Cita confirmada</h2>
          <p>
            {selectedService?.name} · {confirmedAppointment.date} a las {confirmedAppointment.time}
          </p>
          <div className="confirmation-actions">
            <button className="btn btn-outline" onClick={() => navigate('/')}>
              Volver al inicio
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/mis-citas')}>
              Ver mis citas
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page container">
      <div className="page-header">
        <h2>Reservar cita</h2>
        <p>Sigue los pasos para agendar tu próximo corte.</p>
      </div>

      <ol className="booking-steps">
        {STEPS.map((label, index) => (
          <li key={label} className={index === step ? 'is-active' : index < step ? 'is-done' : ''}>
            {label}
          </li>
        ))}
      </ol>

      <div className="card booking-panel">
        {step === 0 && (
          <>
            <h3 className="step-title">Elige un servicio</h3>
            <div className="service-options">
              {activeServices.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  className={`service-option ${serviceId === s.id ? 'is-selected' : ''}`}
                  onClick={() => setServiceId(s.id)}
                >
                  <span>{s.name}</span>
                  <span className="service-option-meta">${s.price} · {s.duration} min</span>
                </button>
              ))}
            </div>
            <div className="booking-nav">
              <span />
              <button className="btn btn-primary" disabled={!serviceId} onClick={() => goTo(1)}>
                Continuar
              </button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h3 className="step-title">Selecciona una fecha</h3>
            <div className="day-picker">
              {days.map((d) => {
                const iso = toISODate(d)
                return (
                  <button
                    type="button"
                    key={iso}
                    className={`day-option ${date === iso ? 'is-selected' : ''}`}
                    onClick={() => setDate(iso)}
                  >
                    <span className="day-weekday">{WEEKDAYS[d.getDay()]}</span>
                    <span className="day-number">{d.getDate()}</span>
                  </button>
                )
              })}
            </div>
            <div className="booking-nav">
              <button className="btn btn-outline" onClick={() => goTo(0)}>Atrás</button>
              <button className="btn btn-primary" disabled={!date} onClick={() => goTo(2)}>
                Continuar
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="step-title">Selecciona una hora</h3>
            {error && <p className="field-error">{error}</p>}
            <div className="time-grid">
              {slots.map((slot) => (
                <TimeSlot
                  key={slot.time}
                  time={slot.time}
                  available={slot.available}
                  selected={time === slot.time}
                  onSelect={setTime}
                />
              ))}
            </div>
            <div className="booking-nav">
              <button className="btn btn-outline" onClick={() => goTo(1)}>Atrás</button>
              <button className="btn btn-primary" disabled={!time} onClick={() => goTo(3)}>
                Continuar
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="step-title">Especificaciones (opcional)</h3>
            <div className="field">
              <label htmlFor="notes">Cuéntanos qué buscas</label>
              <textarea
                id="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Taper fade, laterales bajos, mantener largo arriba."
              />
            </div>
            <div className="booking-nav">
              <button className="btn btn-outline" onClick={() => goTo(2)}>Atrás</button>
              <button className="btn btn-primary" onClick={() => goTo(4)}>Continuar</button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h3 className="step-title">Confirma tu cita</h3>
            <div className="summary">
              <div className="summary-row">
                <span>Servicio</span>
                <strong>{selectedService?.name}</strong>
              </div>
              <div className="summary-row">
                <span>Precio</span>
                <strong>${selectedService?.price}</strong>
              </div>
              <div className="summary-row">
                <span>Duración</span>
                <strong>{selectedService?.duration} min</strong>
              </div>
              <div className="summary-row">
                <span>Fecha</span>
                <strong>{date}</strong>
              </div>
              <div className="summary-row">
                <span>Hora</span>
                <strong>{time}</strong>
              </div>
              {notes && (
                <div className="summary-row">
                  <span>Notas</span>
                  <strong>{notes}</strong>
                </div>
              )}
            </div>
            {!currentUser && (
              <p className="field-error">
                Debes iniciar sesión para confirmar tu cita.
              </p>
            )}
            <div className="booking-nav">
              <button className="btn btn-outline" onClick={() => goTo(3)}>Atrás</button>
              <button className="btn btn-primary" onClick={handleConfirm}>
                Confirmar cita
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
