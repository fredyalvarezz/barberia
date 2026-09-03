import { Link } from 'react-router-dom'
import { useServices } from '../../context/ServicesContext'
import ServiceCard from '../../components/ServiceCard/ServiceCard'
import './Home.css'

export default function Home() {
  const { activeServices } = useServices()
  const featured = activeServices.slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <p className="hero-kicker">Barbería Iwaya</p>

            <h1 className="hero-title">
              Tu estilo.
              <br />
              Tu momento.
            </h1>

            <p className="hero-subtitle">
              Cortes de precisión, atención personalizada y un espacio
              pensado para que salgas exactamente como lo imaginaste.
            </p>

          
          </div>

          <div className="hero-image">
            <img
              src="/images/barberia-hero.webp"
              alt="Barbería Iwaya"
            />
          </div>
        </div>
      </section>

      {/* SERVICIOS DESTACADOS */}
      <section className="page container">
        <div className="page-header">
          <h2>Servicios destacados</h2>
          <p>Los cortes que más piden nuestros clientes.</p>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-3">
            {featured.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </div>
        ) : (
          <p className="empty-message">
            Actualmente no hay servicios disponibles.
          </p>
        )}
      </section>

      {/* SOBRE NOSOTROS */}
      <section className="page container about">
        <div>
          <h2>Sobre nosotros</h2>

          <p className="about-text">
            Combinamos técnica clásica y tendencias actuales. Cada cita es
            un espacio para escuchar lo que buscas y entregarte un resultado
            con el que te sientas seguro.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container cta-inner">
          <div>
            <h2>¿Listo para tu próximo corte?</h2>

            <p className="cta-text">
              Reserva tu cita y déjanos encargarnos del resto.
            </p>
          </div>

          <Link to="/reservar" className="btn btn-primary">
            Agendar cita
          </Link>
        </div>
      </section>
    </>
  )
}
