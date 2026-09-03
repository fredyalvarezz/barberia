import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'

import { AuthProvider } from './context/AuthContext.jsx'
import { ServicesProvider } from './context/ServicesContext.jsx'
import { AppointmentsProvider } from './context/AppointmentsContext.jsx'

import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/barberia">

      <AuthProvider>
        <ServicesProvider>
          <AppointmentsProvider>
            <App />
          </AppointmentsProvider>
        </ServicesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
