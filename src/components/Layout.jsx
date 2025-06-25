import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../App'
import { usePermissions, PERMISSIONS } from '../contexts/PermissionsContext'
import { useLanguage } from '../contexts/LanguageContext'
import ProtectedComponent from './ProtectedComponent'
import LanguageSelector from './LanguageSelector'
import LanguageToggle from './LanguageToggle'
import {
  LayoutDashboard,
  Users,
  Home,
  Menu,
  LogOut,
  Building2,
  BarChart3,
  Zap,
  Clock,
  UserCheck
} from 'lucide-react'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const { hasPermission, hasAnyPermission, roleDisplayName } = usePermissions()
  const { t } = useLanguage()

  // Define navigation items with permissions
  const navigationItems = [
    {
      name: t('nav.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      permission: PERMISSIONS.VIEW_DASHBOARD
    },
    {
      name: t('nav.leads'),
      href: '/leads',
      icon: Users,
      permissions: [PERMISSIONS.VIEW_ALL_LEADS, PERMISSIONS.VIEW_ASSIGNED_LEADS] // Manager/Super Agent OR Agent
    },
    {
      name: t('nav.properties'),
      href: '/properties',
      icon: Home,
      permission: PERMISSIONS.VIEW_PROPERTIES
    },
    {
      name: t('nav.analytics'),
      href: '/analytics',
      icon: BarChart3,
      permission: PERMISSIONS.VIEW_ANALYTICS
    },
    {
      name: t('nav.automation'),
      href: '/automation',
      icon: Zap,
      permission: PERMISSIONS.MANAGE_AUTOMATION
    },
    {
      name: t('nav.followUp'),
      href: '/follow-up',
      icon: Clock,
      permission: PERMISSIONS.MANAGE_FOLLOW_UP
    },
    {
      name: t('nav.team'),
      href: '/team',
      icon: UserCheck,
      permission: PERMISSIONS.VIEW_TEAM
    }
  ]

  // Filter navigation based on user permissions
  const navigation = navigationItems.filter(item => {
    // If no permission required, show the item
    if (!item.permission && !item.permissions) return true

    // If single permission, check it
    if (item.permission) return hasPermission(item.permission)

    // If multiple permissions, check if user has any of them
    if (item.permissions) return hasAnyPermission(item.permissions)

    return false
  })

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">RealEstate CRM</span>
            </div>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {roleDisplayName}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100 ${
                    isActive ? 'bg-blue-100 text-blue-700' : ''
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">{t('common.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome back, {user?.name}!</span>
              <LanguageToggle />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
