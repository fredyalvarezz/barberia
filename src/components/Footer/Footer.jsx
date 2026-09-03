import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <h4>
            BARBER<span className="footer-brand-accent">ÍA</span>
          </h4>
          <p>Cortes con carácter, atención al detalle.</p>
        </div>

        <div>
          <h4 className="footer-heading">Horario</h4>
          <p>Lunes a sábado · 10:00 – 20:00</p>
          <p>Domingo cerrado</p>
        </div>

        <div>
          <h4 className="footer-heading">Contacto</h4>
          <p>Av. Principal 123, Agua Prieta</p>
          <p>+52 633 000 0000</p>
        </div>
      </div>

      <div className="container">
        <p className="footer-copyright">
          © {new Date().getFullYear()} Barbería Iwaya. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
