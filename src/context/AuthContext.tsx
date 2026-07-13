import { createContext, useContext } from 'react'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  isAdmin: boolean
  isAnonymous: boolean
}

export const AuthContext = createContext<{
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInAnon: () => Promise<void>
  signOut: () => Promise<void>
} | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
