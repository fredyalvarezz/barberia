import { createContext, useContext, useEffect, useState } from 'react'
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../data/storage'

const AuthContext = createContext(null)

function seedUsers() {
  const existing = loadFromStorage(STORAGE_KEYS.users, null)
  if (existing) return existing
  const seeded = [
    {
      id: 'user-admin',
      name: 'Administrador',
      email: 'admin@barberia.com',
      password: 'admin123',
      role: 'admin',
    },
  ]
  saveToStorage(STORAGE_KEYS.users, seeded)
  return seeded
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(seedUsers)
  const [currentUser, setCurrentUser] = useState(() =>
    loadFromStorage(STORAGE_KEYS.session, null)
  )

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.users, users)
  }, [users])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.session, currentUser)
  }, [currentUser])

  function register({ name, email, password }) {
    const emailTaken = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )
    if (emailTaken) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' }
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: 'client',
    }
    setUsers((prev) => [...prev, newUser])
    setCurrentUser(newUser)
    return { ok: true }
  }

  function login({ email, password }) {
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    )
    if (!found) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' }
    }
    setCurrentUser(found)
    return { ok: true }
  }

  function logout() {
    setCurrentUser(null)
  }

  function updateProfile(updates) {
    if (!currentUser) return
    const updated = { ...currentUser, ...updates }
    setCurrentUser(updated)
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
  }

  function getUserById(id) {
    return users.find((u) => u.id === id) || null
  }

  const value = {
    currentUser,
    isAdmin: currentUser?.role === 'admin',
    register,
    login,
    logout,
    updateProfile,
    getUserById,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
