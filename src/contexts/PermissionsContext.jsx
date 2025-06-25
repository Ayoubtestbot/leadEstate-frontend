import { createContext, useContext } from 'react'

const PermissionsContext = createContext()

// Define user roles and their permissions
export const USER_ROLES = {
  MANAGER: 'manager',
  SUPER_AGENT: 'super_agent', 
  AGENT: 'agent'
}

// Define permissions for each role
export const PERMISSIONS = {
  // Dashboard permissions
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_FULL_STATS: 'view_full_stats',
  
  // Lead permissions
  VIEW_ALL_LEADS: 'view_all_leads',
  VIEW_ASSIGNED_LEADS: 'view_assigned_leads',
  ADD_LEAD: 'add_lead',
  EDIT_LEAD: 'edit_lead',
  DELETE_LEAD: 'delete_lead',
  ASSIGN_LEAD: 'assign_lead',
  IMPORT_LEADS: 'import_leads',
  
  // Property permissions
  VIEW_PROPERTIES: 'view_properties',
  ADD_PROPERTY: 'add_property',
  EDIT_PROPERTY: 'edit_property',
  DELETE_PROPERTY: 'delete_property',
  
  // Advanced features
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_AUTOMATION: 'manage_automation',
  MANAGE_FOLLOW_UP: 'manage_follow_up',
  
  // User management
  MANAGE_USERS: 'manage_users',
  VIEW_TEAM: 'view_team'
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  [USER_ROLES.MANAGER]: [
    // Dashboard
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_FULL_STATS,
    
    // Leads - Full access
    PERMISSIONS.VIEW_ALL_LEADS,
    PERMISSIONS.ADD_LEAD,
    PERMISSIONS.EDIT_LEAD,
    PERMISSIONS.DELETE_LEAD,
    PERMISSIONS.ASSIGN_LEAD,
    PERMISSIONS.IMPORT_LEADS,
    
    // Properties - Full access
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.ADD_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.DELETE_PROPERTY,
    
    // Advanced features - Full access
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_AUTOMATION,
    PERMISSIONS.MANAGE_FOLLOW_UP,
    
    // User management
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_TEAM
  ],
  
  [USER_ROLES.SUPER_AGENT]: [
    // Dashboard
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_FULL_STATS,
    
    // Leads - Can manage but not delete
    PERMISSIONS.VIEW_ALL_LEADS,
    PERMISSIONS.ADD_LEAD,
    PERMISSIONS.EDIT_LEAD,
    PERMISSIONS.ASSIGN_LEAD,
    PERMISSIONS.IMPORT_LEADS,
    
    // Properties - View only
    PERMISSIONS.VIEW_PROPERTIES,
    
    // Analytics
    PERMISSIONS.VIEW_ANALYTICS,
    
    // Team view
    PERMISSIONS.VIEW_TEAM
  ],
  
  [USER_ROLES.AGENT]: [
    // Dashboard - Limited
    PERMISSIONS.VIEW_DASHBOARD,
    
    // Leads - Only assigned leads
    PERMISSIONS.VIEW_ASSIGNED_LEADS,
    PERMISSIONS.EDIT_LEAD, // Can edit their assigned leads
    
    // Properties - View only
    PERMISSIONS.VIEW_PROPERTIES
  ]
}

// Permission checker functions
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false
  const rolePermissions = ROLE_PERMISSIONS[userRole] || []
  return rolePermissions.includes(permission)
}

export const hasAnyPermission = (userRole, permissions) => {
  return permissions.some(permission => hasPermission(userRole, permission))
}

export const hasAllPermissions = (userRole, permissions) => {
  return permissions.every(permission => hasPermission(userRole, permission))
}

// Role display names
export const ROLE_DISPLAY_NAMES = {
  [USER_ROLES.MANAGER]: 'Manager',
  [USER_ROLES.SUPER_AGENT]: 'Super Agent',
  [USER_ROLES.AGENT]: 'Agent'
}

// Role descriptions
export const ROLE_DESCRIPTIONS = {
  [USER_ROLES.MANAGER]: 'Full access to all features including automation, analytics, and user management',
  [USER_ROLES.SUPER_AGENT]: 'Can import leads, assign leads, view analytics, and manage properties',
  [USER_ROLES.AGENT]: 'Can view assigned leads, properties, and basic dashboard'
}

// Permission Provider Component
export const PermissionsProvider = ({ children, userRole }) => {
  const checkPermission = (permission) => hasPermission(userRole, permission)
  const checkAnyPermission = (permissions) => hasAnyPermission(userRole, permissions)
  const checkAllPermissions = (permissions) => hasAllPermissions(userRole, permissions)

  const value = {
    userRole,
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions,
    roleDisplayName: ROLE_DISPLAY_NAMES[userRole],
    roleDescription: ROLE_DESCRIPTIONS[userRole]
  }

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  )
}

// Hook to use permissions
export const usePermissions = () => {
  const context = useContext(PermissionsContext)
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider')
  }
  return context
}

export default PermissionsContext
