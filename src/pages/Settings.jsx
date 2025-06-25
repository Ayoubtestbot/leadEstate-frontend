import { Settings as SettingsIcon } from 'lucide-react'

const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your agency settings</p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="card">
        <div className="card-content">
          <div className="text-center py-12">
            <SettingsIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Agency Settings</h3>
            <p className="mt-1 text-sm text-gray-500">
              Agency configuration and settings features coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
