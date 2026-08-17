import { createContext } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import type { UserRole } from '@/types/database'

export interface AuthContextType {
  user: User | null
  session: Session | null
  role: UserRole | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null; role?: UserRole | null }>
  signInWithOAuth: (provider: 'google' | 'linkedin' | 'linkedin_oidc') => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
