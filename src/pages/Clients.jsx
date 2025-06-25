import { Plus, UserCheck } from 'lucide-react'

const Clients = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600">Manage your client relationships</p>
        </div>
        <button className="btn btn-primary btn-md">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </button>
      </div>

      {/* Coming Soon */}
      <div className="card">
        <div className="card-content">
          <div className="text-center py-12">
            <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Client Management</h3>
            <p className="mt-1 text-sm text-gray-500">
              Client relationship management features coming soon.
            </p>
            <div className="mt-6">
              <button className="btn btn-primary btn-md">
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Clients
