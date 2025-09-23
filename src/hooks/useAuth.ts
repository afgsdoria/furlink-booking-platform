import { useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
}

interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  dateOfBirth: string
  mobileNumber: string
}

interface SignInData {
  email: string
  password: string
  ipAddress?: string
  userAgent?: string
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({ ...prev, session, user: session?.user ?? null }))
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({ ...prev, session, user: session?.user ?? null }))
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setAuthState(prev => ({ ...prev, profile: null, loading: false }))
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      setAuthState(prev => ({ ...prev, profile, loading: false }))
    } catch (error) {
      console.error('Error fetching profile:', error)
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const signUp = async (data: SignUpData): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            date_of_birth: data.dateOfBirth,
            mobile_number: data.mobileNumber
          }
        }
      })

      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signIn = async (data: SignInData): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      // Log session if sign in successful
      if (!error && data.ipAddress) {
        await logSession(data.ipAddress, data.userAgent)
      }

      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
      // Update session logout time
      if (authState.user) {
        await updateSessionLogout(authState.user.id)
      }

      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const logSession = async (ipAddress: string, userAgent?: string) => {
    if (!authState.user) return

    try {
      await supabase
        .from('user_sessions')
        .insert({
          user_id: authState.user.id,
          ip_address: ipAddress,
          user_agent: userAgent || null
        })
    } catch (error) {
      console.error('Error logging session:', error)
    }
  }

  const updateSessionLogout = async (userId: string) => {
    try {
      // Update the most recent session without logout_time
      await supabase
        .from('user_sessions')
        .update({ logout_time: new Date().toISOString() })
        .eq('user_id', userId)
        .is('logout_time', null)
        .order('login_time', { ascending: false })
        .limit(1)
    } catch (error) {
      console.error('Error updating session logout:', error)
    }
  }

  const updateProfile = async (updates: Partial<Profile>): Promise<{ error: Error | null }> => {
    if (!authState.user) {
      return { error: new Error('No user logged in') }
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authState.user.id)

      if (error) throw error

      // Refresh profile
      await fetchProfile(authState.user.id)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    updateProfile
  }
}