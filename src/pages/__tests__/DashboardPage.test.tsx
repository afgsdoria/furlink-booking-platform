import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import DashboardPage from '../DashboardPage'

// Mock the auth context
const mockProfile = {
  id: '123',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  role: 'pet_owner' as const,
  date_of_birth: '1990-01-01',
  mobile_number: '+1234567890',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

const mockSignOut = vi.fn()

vi.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuthContext: () => ({
    profile: mockProfile,
    signOut: mockSignOut,
    user: { id: '123' },
    loading: false
  })
}))

const renderDashboardPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dashboard with user information', () => {
    renderDashboardPage()
    
    expect(screen.getByText('Welcome back, John!')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('pet owner')).toBeInTheDocument()
  })

  it('shows become service provider link for pet owners', () => {
    renderDashboardPage()
    
    expect(screen.getByText('Become a Service Provider')).toBeInTheDocument()
  })

  it('displays empty state for service providers', () => {
    renderDashboardPage()
    
    expect(screen.getByText('No service providers yet')).toBeInTheDocument()
    expect(screen.getByText('Service providers are currently being reviewed and approved. Check back soon!')).toBeInTheDocument()
  })

  it('shows stats cards with zero values', () => {
    renderDashboardPage()
    
    expect(screen.getByText('Upcoming Appointments')).toBeInTheDocument()
    expect(screen.getByText('Reviews Given')).toBeInTheDocument()
    expect(screen.getByText('Total Bookings')).toBeInTheDocument()
    
    // Check for zero values
    const zeroValues = screen.getAllByText('0')
    expect(zeroValues).toHaveLength(3)
  })

  it('renders navigation with furlink logo', () => {
    renderDashboardPage()
    
    expect(screen.getByText('furlink')).toBeInTheDocument()
  })

  it('shows loading state when profile is not loaded', () => {
    vi.mocked(vi.importActual('../../contexts/AuthContext')).useAuthContext = () => ({
      profile: null,
      signOut: mockSignOut,
      user: { id: '123' },
      loading: true
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardPage />
        </AuthProvider>
      </BrowserRouter>
    )
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})