import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        // For demo purposes, create a mock user
        const mockUser = {
          id: '1',
          name: 'Demo User',
          email: 'demo@agency.com',
          role: 'admin'
        }
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: mockUser,
            token
          }
        })
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' })

      // Mock login for demo purposes
      const mockUsers = {
        'owner@agency.com': { id: '1', name: 'Agency Owner', email: 'owner@agency.com', role: 'owner' },
        'admin@agency.com': { id: '2', name: 'Admin User', email: 'admin@agency.com', role: 'admin' },
        'agent@agency.com': { id: '3', name: 'Agent User', email: 'agent@agency.com', role: 'agent' },
        'demo@agency.com': { id: '4', name: 'Demo User', email: 'demo@agency.com', role: 'admin' }
      }

      const user = mockUsers[credentials.email]
      if (user && credentials.password === 'password123') {
        const token = 'mock-jwt-token-' + Date.now()
        localStorage.setItem('token', token)

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token }
        })

        toast.success(`Welcome back, ${user.name}!`)
        return { success: true }
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      const message = error.message || 'Login failed'
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message
      })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('token')
      dispatch({ type: 'LOGOUT' })
      toast.success('Logged out successfully')
    }
  }

  const updateUser = (userData) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: userData
    })
  }

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
