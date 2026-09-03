import { createContext, useContext, useEffect, useState } from 'react'
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../data/storage'
import { TIME_SLOTS } from '../data/services'

const AppointmentsContext = createContext(null)

export function AppointmentsProvider({ children }) {
  const [appointments, setAppointments] = useState(() =>
    loadFromStorage(STORAGE_KEYS.appointments, [])
  )

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.appointments, appointments)
  }, [appointments])

  function getAppointmentsByDate(date) {
    return appointments.filter((a) => a.date === date && a.status !== 'cancelled')
  }

  function getAvailableSlots(date) {
    const taken = new Set(getAppointmentsByDate(date).map((a) => a.time))
    return TIME_SLOTS.map((time) => ({ time, available: !taken.has(time) }))
  }

  function createAppointment({ userId, serviceId, date, time, notes }) {
    const alreadyTaken = getAppointmentsByDate(date).some((a) => a.time === time)
    if (alreadyTaken) {
      return { ok: false, error: 'Ese horario ya fue reservado. Elige otro.' }
    }
    const appointment = {
      id: `apt-${Date.now()}`,
      userId,
      serviceId,
      date,
      time,
      notes: notes?.trim() || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setAppointments((prev) => [...prev, appointment])
    return { ok: true, appointment }
  }

  function cancelAppointment(id) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    )
  }

  function updateStatus(id, status) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    )
  }

  function getAppointmentsByUser(userId) {
    return appointments
      .filter((a) => a.userId === userId)
      .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
  }

  const value = {
    appointments,
    getAppointmentsByDate,
    getAvailableSlots,
    createAppointment,
    cancelAppointment,
    updateStatus,
    getAppointmentsByUser,
  }

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  )
}

export function useAppointments() {
  const ctx = useContext(AppointmentsContext)
  if (!ctx) throw new Error('useAppointments debe usarse dentro de <AppointmentsProvider>')
  return ctx
}
