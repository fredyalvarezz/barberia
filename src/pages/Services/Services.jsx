import { useServices } from '../../context/ServicesContext'
import ServiceCard from '../../components/ServiceCard/ServiceCard'

export default function Services() {
  const { activeServices } = useServices()

  return (
    <div className="page container">
      <div className="page-header">
        <h2>Nuestros servicios</h2>
        <p>Elige el corte que buscas y reserva en menos de un minuto.</p>
      </div>

      {activeServices.length === 0 ? (
        <div className="empty-state">No hay servicios disponibles por el momento.</div>
      ) : (
        <div className="grid grid-3">
          {activeServices.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}
    </div>
  )
}
