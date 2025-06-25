import { useState } from 'react'
import { useData } from '../App'
import { usePermissions, PERMISSIONS } from '../contexts/PermissionsContext'
import ProtectedComponent from '../components/ProtectedComponent'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Target,
  PieChart,
  Activity,
  Filter,
  Download
} from 'lucide-react'

const Analytics = () => {
  const { leads, properties } = useData()
  const { hasPermission } = usePermissions()
  const [timeRange, setTimeRange] = useState('30') // days
  const [selectedMetric, setSelectedMetric] = useState('leads')

  // Calculate analytics data
  const totalLeads = leads.length
  const activeLeads = leads.filter(lead => !['closed-won', 'closed-lost'].includes(lead.status)).length
  const closedWonLeads = leads.filter(lead => lead.status === 'closed-won').length
  const conversionRate = totalLeads > 0 ? ((closedWonLeads / totalLeads) * 100).toFixed(1) : 0

  // Lead status distribution
  const statusDistribution = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1
    return acc
  }, {})

  // Lead source distribution
  const sourceDistribution = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1
    return acc
  }, {})

  // Recent activity (last 7 days)
  const recentActivity = leads.filter(lead => {
    const leadDate = new Date(lead.createdAt)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return leadDate >= weekAgo
  }).length

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {change >= 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )

  const ChartCard = ({ title, children }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your sales performance and lead metrics</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          
          <ProtectedComponent permission={PERMISSIONS.MANAGE_AUTOMATION}>
            <button
              onClick={() => {
                // Generate CSV data
                const csvData = [
                  ['Metric', 'Value'],
                  ['Total Leads', totalLeads],
                  ['Active Leads', activeLeads],
                  ['Conversion Rate', `${conversionRate}%`],
                  ['Properties Listed', properties.length]
                ]
                const csvContent = csvData.map(row => row.join(',')).join('\n')
                const blob = new Blob([csvContent], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`
                a.click()
                window.URL.revokeObjectURL(url)
              }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </ProtectedComponent>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="Active Leads"
          value={activeLeads}
          icon={Activity}
          color="bg-green-500"
          change={8}
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={Target}
          color="bg-purple-500"
          change={-2}
        />
        <StatCard
          title="Properties Listed"
          value={properties.length}
          icon={DollarSign}
          color="bg-orange-500"
          change={15}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Distribution */}
        <ChartCard title="Lead Status Distribution">
          <div className="space-y-3">
            {Object.entries(statusDistribution).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {status.replace('-', ' ')}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Lead Sources */}
        <ChartCard title="Lead Sources">
          <div className="space-y-3">
            {Object.entries(sourceDistribution).map(([source, count]) => (
              <div key={source} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">{source}</span>
                </div>
                <span className="text-sm text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <ChartCard title="Recent Activity">
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {recentActivity} new leads this week
          </h3>
          <p className="text-gray-600">
            Keep up the great work! Your lead generation is on track.
          </p>
        </div>
      </ChartCard>

      {/* Manager-only advanced analytics */}
      <ProtectedComponent permission={PERMISSIONS.MANAGE_USERS}>
        <ChartCard title="Team Performance">
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Team Analytics</h3>
            <p className="text-gray-600">
              Advanced team performance metrics available for managers.
            </p>
          </div>
        </ChartCard>
      </ProtectedComponent>
    </div>
  )
}

export default Analytics
