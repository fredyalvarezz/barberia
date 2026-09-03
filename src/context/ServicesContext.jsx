import { createContext, useContext, useEffect, useState } from 'react'
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../data/storage'
import { initialServices } from '../data/services'

const ServicesContext = createContext(null)

export function ServicesProvider({ children }) {
  const [services, setServices] = useState(() =>
    loadFromStorage(STORAGE_KEYS.services, initialServices)
  )

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.services, services)
  }, [services])

  function addService(service) {
    const newService = {
      id: `svc-${Date.now()}`,
      active: true,
      ...service,
    }
    setServices((prev) => [...prev, newService])
  }

  function updateService(id, updates) {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    )
  }

  function removeService(id) {
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  function getServiceById(id) {
    return services.find((s) => s.id === id) || null
  }

  const value = {
    services,
    activeServices: services.filter((s) => s.active),
    addService,
    updateService,
    removeService,
    getServiceById,
  }

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  )
}

export function useServices() {
  const ctx = useContext(ServicesContext)
  if (!ctx) throw new Error('useServices debe usarse dentro de <ServicesProvider>')
  return ctx
}
