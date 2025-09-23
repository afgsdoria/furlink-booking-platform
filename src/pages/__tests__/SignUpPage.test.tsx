import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import SignUpPage from '../SignUpPage'

// Mock the auth context
const mockSignUp = vi.fn()
vi.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuthContext: () => ({
    signUp: mockSignUp,
    user: null,
    loading: false
  })
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

const renderSignUpPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <SignUpPage />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('SignUpPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sign up form', () => {
    renderSignUpPage()
    
    expect(screen.getByText('Create your account')).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('shows password requirements when typing password', async () => {
    renderSignUpPage()
    
    const passwordInput = screen.getByLabelText(/^password/i)
    fireEvent.change(passwordInput, { target: { value: 'Test123!' } })
    
    await waitFor(() => {
      expect(screen.getByText('8-12 characters')).toBeInTheDocument()
      expect(screen.getByText('Uppercase letter')).toBeInTheDocument()
      expect(screen.getByText('Lowercase letter')).toBeInTheDocument()
      expect(screen.getByText('Number')).toBeInTheDocument()
      expect(screen.getByText('Special character')).toBeInTheDocument()
    })
  })

  it('validates required fields', async () => {
    renderSignUpPage()
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument()
      expect(screen.getByText('Last name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
  })

  it('validates password confirmation', async () => {
    renderSignUpPage()
    
    fireEvent.change(screen.getByLabelText(/^password/i), { 
      target: { value: 'Test123!' } 
    })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { 
      target: { value: 'Different123!' } 
    })
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('toggles password visibility', () => {
    renderSignUpPage()
    
    const passwordInput = screen.getByLabelText(/^password/i)
    const toggleButton = passwordInput.parentElement?.querySelector('button')
    
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    if (toggleButton) {
      fireEvent.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')
    }
  })

  it('submits form with valid data', async () => {
    mockSignUp.mockResolvedValue({ error: null })
    renderSignUpPage()
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/first name/i), { 
      target: { value: 'John' } 
    })
    fireEvent.change(screen.getByLabelText(/last name/i), { 
      target: { value: 'Doe' } 
    })
    fireEvent.change(screen.getByLabelText(/email address/i), { 
      target: { value: 'john@example.com' } 
    })
    fireEvent.change(screen.getByLabelText(/date of birth/i), { 
      target: { value: '1990-01-01' } 
    })
    fireEvent.change(screen.getByLabelText(/mobile number/i), { 
      target: { value: '+1234567890' } 
    })
    fireEvent.change(screen.getByLabelText(/^password/i), { 
      target: { value: 'Test123!' } 
    })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { 
      target: { value: 'Test123!' } 
    })
    fireEvent.click(screen.getByRole('checkbox'))
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'Test123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        mobileNumber: '+1234567890'
      })
    })
  })

  it('handles sign up error', async () => {
    mockSignUp.mockResolvedValue({ 
      error: { message: 'Email already registered' } 
    })
    renderSignUpPage()
    
    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/first name/i), { 
      target: { value: 'John' } 
    })
    fireEvent.change(screen.getByLabelText(/last name/i), { 
      target: { value: 'Doe' } 
    })
    fireEvent.change(screen.getByLabelText(/email address/i), { 
      target: { value: 'john@example.com' } 
    })
    fireEvent.change(screen.getByLabelText(/date of birth/i), { 
      target: { value: '1990-01-01' } 
    })
    fireEvent.change(screen.getByLabelText(/mobile number/i), { 
      target: { value: '+1234567890' } 
    })
    fireEvent.change(screen.getByLabelText(/^password/i), { 
      target: { value: 'Test123!' } 
    })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { 
      target: { value: 'Test123!' } 
    })
    fireEvent.click(screen.getByRole('checkbox'))
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email already registered')).toBeInTheDocument()
    })
  })
})