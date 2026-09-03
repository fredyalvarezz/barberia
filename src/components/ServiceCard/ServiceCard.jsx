import { Link } from 'react-router-dom'
import './ServiceCard.css'

export default function ServiceCard({ service }) {
  return (
    <div className="card service-card">
      <div>
        <h3>{service.name}</h3>
        <p>{service.description}</p>
      </div>

      <div className="service-card-footer">
        <div>
          <strong className="service-card-price">${service.price}</strong>
          <span className="service-card-duration"> · {service.duration} min</span>
        </div>
        
      </div>
    </div>
  )
}
