'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// Mock user type for demo mode
interface MockUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

interface AuthContextType {
  user: MockUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  isDemo: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo mode storage key
const DEMO_USER_KEY = 'smart-waste-demo-user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(true)
  const isDemo = true // Always demo mode until Firebase is configured

  useEffect(() => {
    // Demo mode - check localStorage
    const storedUser = typeof window !== 'undefined' 
      ? localStorage.getItem(DEMO_USER_KEY) 
      : null
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem(DEMO_USER_KEY)
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Demo mode - simulate login (password not validated in demo)
    if (!email) throw new Error('Email is required')
    const demoUser: MockUser = {
      uid: 'demo-' + Date.now(),
      email: email,
      displayName: email.split('@')[0],
      photoURL: null,
    }
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser))
    setUser(demoUser)
  }

  const signUp = async (email: string, password: string) => {
    // Demo mode - simulate registration
    if (!email) throw new Error('Email is required')
    if (password.length < 6) throw new Error('Password must be at least 6 characters')
    const demoUser: MockUser = {
      uid: 'demo-' + Date.now(),
      email: email,
      displayName: email.split('@')[0],
      photoURL: null,
    }
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser))
    setUser(demoUser)
  }

  const signInWithGoogle = async () => {
    // Demo mode - simulate Google login
    const demoUser: MockUser = {
      uid: 'demo-google-' + Date.now(),
      email: 'demo@gmail.com',
      displayName: 'Demo User',
      photoURL: null,
    }
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser))
    setUser(demoUser)
  }

  const logout = async () => {
    localStorage.removeItem(DEMO_USER_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, logout, isDemo }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
