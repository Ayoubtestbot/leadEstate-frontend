import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext, useContext, useEffect } from 'react'
import { ToastProvider } from './components/Toast'
import { PermissionsProvider, USER_ROLES } from './contexts/PermissionsContext'
import { LanguageProvider } from './contexts/LanguageContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Properties from './pages/Properties'
import Analytics from './pages/Analytics'
import Automation from './pages/Automation'
import FollowUp from './pages/FollowUp'
import Team from './pages/Team'

// Simple Auth Context
const AuthContext = createContext()

// Data Context for shared state
const DataContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('token')
    if (token) {
      verifyToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.data)
      } else {
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        localStorage.setItem('token', data.data.token)
        setUser(data.data.user)
        setLoading(false)
        return { success: true }
      } else {
        setLoading(false)
        return { success: false, message: data.message || 'Login failed' }
      }
    } catch (error) {
      setLoading(false)
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

const DataProvider = ({ children }) => {
  // Load data from localStorage or use default data
  const loadLeads = () => {
    const saved = localStorage.getItem('crm_leads')
    if (saved) {
      return JSON.parse(saved)
    }
    return [
      {
        id: 1,
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        city: 'New York',
        status: 'new',
        source: 'website',
        propertyType: 'house',
        assignedTo: null,
        interestedProperties: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1 (555) 987-6543',
        city: 'Los Angeles',
        status: 'contacted',
        source: 'facebook',
        propertyType: 'apartment',
        assignedTo: 'Demo Agent',
        interestedProperties: [],
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        name: 'Mike Wilson',
        email: 'mike@example.com',
        phone: '+1 (555) 456-7890',
        city: 'Chicago',
        status: 'qualified',
        source: 'google',
        propertyType: 'condo',
        assignedTo: 'Demo Agent',
        interestedProperties: [],
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 4,
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '+1 (555) 234-5678',
        city: 'Miami',
        status: 'proposal',
        source: 'referral',
        propertyType: 'villa',
        assignedTo: 'Demo Super Agent',
        interestedProperties: [],
        createdAt: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: 5,
        name: 'Robert Brown',
        email: 'robert@example.com',
        phone: '+1 (555) 345-6789',
        city: 'Seattle',
        status: 'negotiation',
        source: 'walk-in',
        propertyType: 'townhouse',
        assignedTo: 'Demo Manager',
        interestedProperties: [],
        createdAt: new Date(Date.now() - 345600000).toISOString()
      },
      {
        id: 6,
        name: 'Lisa Garcia',
        email: 'lisa@example.com',
        phone: '+1 (555) 456-7890',
        city: 'Austin',
        status: 'closed-won',
        source: 'website',
        propertyType: 'apartment',
        assignedTo: 'Demo Agent',
        interestedProperties: [],
        createdAt: new Date(Date.now() - 432000000).toISOString()
      }
    ]
  }

  const loadProperties = () => {
    const saved = localStorage.getItem('crm_properties')
    if (saved) {
      return JSON.parse(saved)
    }
    // Default sample properties with images
    return [
      {
        id: 1,
        title: 'Modern Downtown Apartment',
        location: 'Downtown, New York',
        price: 450000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        type: 'apartment',
        status: 'available',
        description: 'Beautiful modern apartment in the heart of downtown with stunning city views.',
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400'
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Luxury Family House',
        location: 'Beverly Hills, CA',
        price: 1200000,
        bedrooms: 4,
        bathrooms: 3,
        area: 2800,
        type: 'house',
        status: 'available',
        description: 'Spacious family home with pool and garden in prestigious neighborhood.',
        images: [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400'
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  }

  const loadTeamMembers = () => {
    const saved = localStorage.getItem('crm_team_members')
    if (saved) {
      return JSON.parse(saved)
    }
    // Default team members
    return [
      {
        id: 1,
        name: 'Demo Manager',
        email: 'manager@demo.com',
        phone: '+1 (555) 123-4567',
        role: 'manager',
        status: 'active',
        joinDate: '2023-01-15',
        avatar: null,
        stats: {
          totalLeads: 15,
          activeLeads: 8,
          closedDeals: 7,
          conversionRate: 47
        }
      },
      {
        id: 2,
        name: 'Demo Super Agent',
        email: 'super@demo.com',
        phone: '+1 (555) 234-5678',
        role: 'super_agent',
        status: 'active',
        joinDate: '2023-02-20',
        avatar: null,
        stats: {
          totalLeads: 12,
          activeLeads: 6,
          closedDeals: 6,
          conversionRate: 50
        }
      },
      {
        id: 3,
        name: 'Demo Agent',
        email: 'agent@demo.com',
        phone: '+1 (555) 345-6789',
        role: 'agent',
        status: 'active',
        joinDate: '2023-03-10',
        avatar: null,
        stats: {
          totalLeads: 8,
          activeLeads: 5,
          closedDeals: 3,
          conversionRate: 38
        }
      }
    ]
  }

  const [leads, setLeads] = useState(loadLeads)
  const [properties, setProperties] = useState(loadProperties)
  const [teamMembers, setTeamMembers] = useState(loadTeamMembers)

  // Save to localStorage whenever data changes
  const saveLeads = (newLeads) => {
    localStorage.setItem('crm_leads', JSON.stringify(newLeads))
    setLeads(newLeads)
  }

  const saveProperties = (newProperties) => {
    localStorage.setItem('crm_properties', JSON.stringify(newProperties))
    setProperties(newProperties)
  }

  const saveTeamMembers = (newTeamMembers) => {
    localStorage.setItem('crm_team_members', JSON.stringify(newTeamMembers))
    setTeamMembers(newTeamMembers)
  }

  const addLead = (leadData) => {
    const newLead = {
      id: Date.now(),
      ...leadData,
      status: 'new',
      assignedTo: null,
      interestedProperties: [],
      createdAt: new Date().toISOString()
    }
    const newLeads = [...leads, newLead]
    saveLeads(newLeads)
    return newLead
  }

  const addProperty = (propertyData) => {
    const newProperty = {
      id: Date.now(),
      ...propertyData,
      status: 'available',
      createdAt: new Date().toISOString()
    }
    const newProperties = [...properties, newProperty]
    saveProperties(newProperties)
    return newProperty
  }

  const updateLead = (id, updates) => {
    const newLeads = leads.map(lead =>
      lead.id === id ? { ...lead, ...updates } : lead
    )
    saveLeads(newLeads)
  }

  const deleteLead = (id) => {
    const newLeads = leads.filter(lead => lead.id !== id)
    saveLeads(newLeads)
  }

  const updateProperty = (id, updates) => {
    const newProperties = properties.map(property =>
      property.id === id ? { ...property, ...updates } : property
    )
    saveProperties(newProperties)
  }

  const deleteProperty = (id) => {
    const newProperties = properties.filter(property => property.id !== id)
    saveProperties(newProperties)

    // Remove property from all leads' interested properties
    const newLeads = leads.map(lead => ({
      ...lead,
      interestedProperties: lead.interestedProperties?.filter(propId => propId !== id) || []
    }))
    saveLeads(newLeads)
  }

  const linkPropertyToLead = (leadId, propertyId) => {
    const newLeads = leads.map(lead => {
      if (lead.id === leadId) {
        const interestedProperties = lead.interestedProperties || []
        if (!interestedProperties.includes(propertyId)) {
          return {
            ...lead,
            interestedProperties: [...interestedProperties, propertyId]
          }
        }
      }
      return lead
    })
    saveLeads(newLeads)
  }

  const unlinkPropertyFromLead = (leadId, propertyId) => {
    const newLeads = leads.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          interestedProperties: (lead.interestedProperties || []).filter(id => id !== propertyId)
        }
      }
      return lead
    })
    saveLeads(newLeads)
  }

  const addTeamMember = (memberData) => {
    const newMember = {
      id: Date.now(),
      ...memberData,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      avatar: null,
      stats: {
        totalLeads: 0,
        activeLeads: 0,
        closedDeals: 0,
        conversionRate: 0
      }
    }
    const newTeamMembers = [...teamMembers, newMember]
    saveTeamMembers(newTeamMembers)
    return newMember
  }

  const updateTeamMember = (id, updates) => {
    const newTeamMembers = teamMembers.map(member =>
      member.id === id ? { ...member, ...updates } : member
    )
    saveTeamMembers(newTeamMembers)
  }

  const deleteTeamMember = (id) => {
    const newTeamMembers = teamMembers.filter(member => member.id !== id)
    saveTeamMembers(newTeamMembers)

    // Unassign leads from deleted team member
    const newLeads = leads.map(lead =>
      lead.assignedTo === teamMembers.find(m => m.id === id)?.name
        ? { ...lead, assignedTo: null }
        : lead
    )
    saveLeads(newLeads)
  }

  return (
    <DataContext.Provider value={{
      leads,
      properties,
      teamMembers,
      addLead,
      addProperty,
      addTeamMember,
      updateLead,
      deleteLead,
      updateProperty,
      deleteProperty,
      updateTeamMember,
      deleteTeamMember,
      linkPropertyToLead,
      unlinkPropertyFromLead
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export const useData = () => useContext(DataContext)

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <ToastProvider>
            <AppWithPermissions />
          </ToastProvider>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

// Separate component to access user data for permissions
const AppWithPermissions = () => {
  const { user } = useAuth()

  return (
    <PermissionsProvider userRole={user?.role}>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <Layout>
                  <Leads />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties"
            element={
              <ProtectedRoute>
                <Layout>
                  <Properties />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/automation"
            element={
              <ProtectedRoute>
                <Layout>
                  <Automation />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/follow-up"
            element={
              <ProtectedRoute>
                <Layout>
                  <FollowUp />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <Layout>
                  <Team />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </PermissionsProvider>
  )
}

export default App
