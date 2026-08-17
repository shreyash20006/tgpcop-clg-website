import { useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import type { UserRole } from '@/types/database'
import { AuthContext } from './authTypes'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        fetchRole(s.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        fetchRole(s.user.id)
      } else {
        setRole(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchRole(userId: string): Promise<UserRole | null> {
    try {
      const { data, error } = await supabase!
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle()

      if (error || !data) {
        setRole('student')
        return 'student'
      }
      const r = (data.role as UserRole) ?? 'student'
      setRole(r)
      return r
    } catch {
      setRole(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  async function signUp(email: string, password: string, fullName: string) {
    if (!supabase) return { error: 'Supabase is not configured' }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    return { error: error?.message ?? null }
  }

  async function signIn(email: string, password: string) {
    if (!supabase) return { error: 'Supabase is not configured' }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }

    let fetchedRole: UserRole | null = null
    if (data?.user) {
      setUser(data.user)
      setSession(data.session)
      fetchedRole = await fetchRole(data.user.id)
    }
    return { error: null, role: fetchedRole }
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setRole(null)
  }

  async function resetPassword(email: string) {
    if (!supabase) return { error: 'Supabase is not configured' }
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error: error?.message ?? null }
  }

  return (
    <AuthContext.Provider
      value={{ user, session, role, loading, signUp, signIn, signOut, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}
