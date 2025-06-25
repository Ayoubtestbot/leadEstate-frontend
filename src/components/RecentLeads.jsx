import { formatDistanceToNow } from 'date-fns'
import { User, Phone, Mail } from 'lucide-react'

const RecentLeads = ({ leads = [] }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'qualified':
        return 'bg-green-100 text-green-800'
      case 'proposal':
        return 'bg-purple-100 text-purple-800'
      case 'negotiation':
        return 'bg-orange-100 text-orange-800'
      case 'closed-won':
        return 'bg-green-100 text-green-800'
      case 'closed-lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No recent leads</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div key={lead._id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {lead.name}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          <div className="flex space-x-1">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Phone className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Mail className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      <div className="pt-2">
        <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
          View all leads →
        </button>
      </div>
    </div>
  )
}

export default RecentLeads
