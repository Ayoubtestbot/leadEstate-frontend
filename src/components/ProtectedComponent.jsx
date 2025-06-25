import { usePermissions } from '../contexts/PermissionsContext'

const ProtectedComponent = ({ 
  permission, 
  permissions, 
  requireAll = false, 
  children, 
  fallback = null,
  showFallback = false 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

  let hasAccess = false

  if (permission) {
    // Single permission check
    hasAccess = hasPermission(permission)
  } else if (permissions) {
    // Multiple permissions check
    if (requireAll) {
      hasAccess = hasAllPermissions(permissions)
    } else {
      hasAccess = hasAnyPermission(permissions)
    }
  } else {
    // No permissions specified, allow access
    hasAccess = true
  }

  if (!hasAccess) {
    if (showFallback && fallback) {
      return fallback
    }
    return null
  }

  return children
}

// Specialized components for common use cases
export const ManagerOnly = ({ children, fallback = null }) => (
  <ProtectedComponent 
    permission="manage_users" 
    fallback={fallback}
    showFallback={!!fallback}
  >
    {children}
  </ProtectedComponent>
)

export const SuperAgentAndAbove = ({ children, fallback = null }) => (
  <ProtectedComponent 
    permissions={["import_leads", "assign_lead"]} 
    requireAll={true}
    fallback={fallback}
    showFallback={!!fallback}
  >
    {children}
  </ProtectedComponent>
)

export const AgentAndAbove = ({ children, fallback = null }) => (
  <ProtectedComponent 
    permission="view_dashboard"
    fallback={fallback}
    showFallback={!!fallback}
  >
    {children}
  </ProtectedComponent>
)

export default ProtectedComponent
