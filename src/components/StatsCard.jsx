import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const StatsCard = ({ title, value, change, changeType, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  }

  const changeColorClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  }

  return (
    <div className="card">
      <div className="card-content">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className={`flex items-center mt-1 ${changeColorClasses[changeType]}`}>
                {changeType === 'positive' ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : changeType === 'negative' ? (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                ) : null}
                <span className="text-sm font-medium">{change}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsCard
