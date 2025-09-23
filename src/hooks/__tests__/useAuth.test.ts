import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '../useAuth'

// Mock Supabase
const mockSupabase = {
  auth: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn()
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn()
      }))
    })),
    insert: vi.fn(),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        is: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn()
          }))
        }))
      }))
    }))
  }))
}

vi.mock('../lib/supabase', () => ({
  supabase: mockSupabase
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementations
    mockSupabase.auth.getSession.mockResolvedValue({ 
      data: { session: null }, 
      error: null 
    })
    
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    })
  })

  it('initializes with loading state', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBe(null)
    expect(result.current.profile).toBe(null)
    expect(result.current.session).toBe(null)
  })

  it('handles successful sign up', async () => {
    mockSupabase.auth.signUp.mockResolvedValue({ error: null })
    
    const { result } = renderHook(() => useAuth())
    
    const signUpData = {
      email: 'test@example.com',
      password: 'Test123!',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      mobileNumber: '+1234567890'
    }
    
    const response = await result.current.signUp(signUpData)
    
    expect(response.error).toBe(null)
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Test123!',
      options: {
        data: {
          first_name: 'John',
          last_name: 'Doe',
          date_of_birth: '1990-01-01',
          mobile_number: '+1234567890'
        }
      }
    })
  })

  it('handles sign up error', async () => {
    const error = { message: 'Email already registered' }
    mockSupabase.auth.signUp.mockResolvedValue({ error })
    
    const { result } = renderHook(() => useAuth())
    
    const signUpData = {
      email: 'test@example.com',
      password: 'Test123!',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      mobileNumber: '+1234567890'
    }
    
    const response = await result.current.signUp(signUpData)
    
    expect(response.error).toEqual(error)
  })

  it('handles successful sign in', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null })
    mockSupabase.from.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null })
    })
    
    const { result } = renderHook(() => useAuth())
    
    // Mock user state
    result.current.user = { id: '123' } as any
    
    const signInData = {
      email: 'test@example.com',
      password: 'password123',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0'
    }
    
    const response = await result.current.signIn(signInData)
    
    expect(response.error).toBe(null)
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('handles sign in error', async () => {
    const error = { message: 'Invalid login credentials' }
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ error })
    
    const { result } = renderHook(() => useAuth())
    
    const signInData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    }
    
    const response = await result.current.signIn(signInData)
    
    expect(response.error).toEqual(error)
  })

  it('handles sign out', async () => {
    mockSupabase.auth.signOut.mockResolvedValue({ error: null })
    mockSupabase.from.mockReturnValue({
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          is: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn().mockResolvedValue({ error: null })
            }))
          }))
        }))
      }))
    })
    
    const { result } = renderHook(() => useAuth())
    
    // Mock user state
    result.current.user = { id: '123' } as any
    
    const response = await result.current.signOut()
    
    expect(response.error).toBe(null)
    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
  })

  it('updates profile successfully', async () => {
    const mockProfile = {
      id: '123',
      first_name: 'John',
      last_name: 'Doe',
      role: 'pet_owner' as const
    }
    
    mockSupabase.from.mockReturnValue({
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null })
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ 
            data: mockProfile, 
            error: null 
          })
        }))
      }))
    })
    
    const { result } = renderHook(() => useAuth())
    
    // Mock user state
    result.current.user = { id: '123' } as any
    
    const updates = { first_name: 'Jane' }
    const response = await result.current.updateProfile(updates)
    
    expect(response.error).toBe(null)
  })
})