import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Services from './pages/Services/Services'
import Booking from './pages/Booking/Booking'
import MyAppointments from './pages/MyAppointments/MyAppointments'
import Profile from './pages/Profile/Profile'
import Admin from './pages/Admin/Admin'

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          {/* PÚBLICAS */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/registro" element={<Register />} />

          <Route path="/servicios" element={<Services />} />

          {/* RESERVA */}
          <Route
            path="/reservar"
            element={<Booking />}
          />

          {/* USUARIO AUTENTICADO */}
          <Route
            path="/mis-citas"
            element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

function NotFound() {
  return (
    <div
      className="page container"
      style={{ textAlign: 'center' }}
    >
      <h2>404</h2>

      <p style={{ marginTop: 8 }}>
        La página que buscas no existe.
      </p>
    </div>
  )
}
