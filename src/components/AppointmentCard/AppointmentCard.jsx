import './AppointmentCard.css'

const STATUS_LABEL = {
  pending: 'pendiente',
  confirmed: 'confirmada',
  completed: 'completada',
  cancelled: 'cancelada',
}

export default function AppointmentCard({
  appointment,
  service,
  clientName,
  actions,
}) {
  return (
    <div className="card appointment-card">
      <div className="appointment-main">
        <div className="appointment-time">
          <strong>{appointment.time}</strong>
          <span>{appointment.date}</span>
        </div>

        <div className="appointment-details">
          <div className="appointment-details-top">
            <h4 style={{ fontSize: '1rem' }}>{service?.name || 'Servicio eliminado'}</h4>
            <span className={`badge badge-${appointment.status}`}>
              {STATUS_LABEL[appointment.status]}
            </span>
          </div>
          {clientName && <p className="appointment-client">Cliente: {clientName}</p>}
          {appointment.notes && <p className="appointment-note">“{appointment.notes}”</p>}
        </div>
      </div>

      {actions && <div className="appointment-actions">{actions}</div>}
    </div>
  )
}
