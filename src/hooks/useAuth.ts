import { createContext, useContext, useEffect, useState } from 'react'
import { AdminUser, AuthState, authenticateAdmin, getStoredAdmin, isSessionValid, logoutAdmin, storeAdmin } from '@/lib/auth'

const AuthContext = createContext<{
  auth: AuthState
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
} | null>(null)

export const AuthProvider = AuthContext.Provider

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const useAuthProvider = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  })

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = getStoredAdmin()
      const isValid = isSessionValid()
      
      if (storedUser && isValid) {
        setAuth({
          user: storedUser,
          isAuthenticated: true,
          isLoading: false
        })
      } else {
        if (storedUser && !isValid) {
          logoutAdmin()
        }
        setAuth({
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setAuth(prev => ({ ...prev, isLoading: true }))
    
    try {
      const user = await authenticateAdmin(username, password)
      
      if (user) {
        storeAdmin(user)
        setAuth({
          user,
          isAuthenticated: true,
          isLoading: false
        })
        return true
      } else {
        setAuth({
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      setAuth({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
      return false
    }
  }

  const logout = () => {
    logoutAdmin()
    setAuth({
      user: null,
      isAuthenticated: false,
      isLoading: false
    })
  }

  return {
    auth,
    login,
    logout
  }
}
