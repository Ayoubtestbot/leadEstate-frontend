import { User } from 'lucide-react'

const Profile = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your profile information</p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="card">
        <div className="card-content">
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">User Profile</h3>
            <p className="mt-1 text-sm text-gray-500">
              Profile management features coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
