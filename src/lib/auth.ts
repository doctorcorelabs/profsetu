import { supabase } from './supabase'

export interface AdminUser {
  id: string
  username: string
}

export interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Simple password hashing (in production, use bcrypt)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const authenticateAdmin = async (username: string, password: string): Promise<AdminUser | null> => {
  try {
    const hashedPassword = await hashPassword(password)
    
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, username')
      .eq('username', username)
      .eq('password_hash', hashedPassword)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return null
    }

    if (!data) {
      return null
    }

    return data
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export const logoutAdmin = (): void => {
  localStorage.removeItem('admin_user')
  localStorage.removeItem('admin_session')
}

export const getStoredAdmin = (): AdminUser | null => {
  try {
    const stored = localStorage.getItem('admin_user')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const storeAdmin = (user: AdminUser): void => {
  localStorage.setItem('admin_user', JSON.stringify(user))
  localStorage.setItem('admin_session', Date.now().toString())
}

export const isSessionValid = (): boolean => {
  try {
    const sessionTime = localStorage.getItem('admin_session')
    if (!sessionTime) return false
    
    const sessionAge = Date.now() - parseInt(sessionTime)
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    
    return sessionAge < maxAge
  } catch {
    return false
  }
}
