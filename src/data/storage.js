

export function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // almacenamiento no disponible: se ignora silenciosamente
  }
}

export const STORAGE_KEYS = {
  users: 'barberia_users',
  session: 'barberia_session',
  services: 'barberia_services',
  appointments: 'barberia_appointments',
}
