import { User, Phone, Mail, MapPin, Calendar, Tag, Home, DollarSign } from 'lucide-react'
import Modal from './Modal'
import { useData } from '../App'

const ViewLeadModal = ({ isOpen, onClose, lead }) => {
  const { properties } = useData()

  if (!lead) return null

  // Get linked properties
  const linkedProperties = properties.filter(property =>
    lead.interestedProperties?.includes(property.id)
  )

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

  const getSourceColor = (source) => {
    switch (source) {
      case 'website':
        return 'bg-blue-100 text-blue-800'
      case 'facebook':
        return 'bg-blue-100 text-blue-800'
      case 'google':
        return 'bg-green-100 text-green-800'
      case 'referral':
        return 'bg-purple-100 text-purple-800'
      case 'walk-in':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" size="md">
      <div className="space-y-6">
        {/* Lead Name */}
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{lead.name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceColor(lead.source)}`}>
                {lead.source}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-900">{lead.phone}</span>
            </div>
            {lead.email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{lead.email}</span>
              </div>
            )}
            {lead.city && (
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{lead.city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Property Interest */}
        {lead.propertyType && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Property Interest</h3>
            <div className="flex items-center space-x-3">
              <Home className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-900 capitalize">{lead.propertyType}</span>
            </div>
            {lead.budget && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">Budget: </span>
                <span className="text-sm text-gray-900">{lead.budget}</span>
              </div>
            )}
          </div>
        )}

        {/* Assignment Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Assignment</h3>
          <div className="flex items-center space-x-3">
            <User className="h-4 w-4 text-gray-400" />
            {lead.assignedTo ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Assigned to {lead.assignedTo}
              </span>
            ) : (
              <span className="text-sm text-gray-500">Unassigned</span>
            )}
          </div>
        </div>

        {/* Properties of Interest */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Properties of Interest ({linkedProperties.length})
          </h3>
          {linkedProperties.length > 0 ? (
            <div className="space-y-3">
              {linkedProperties.map((property) => (
                <div key={property.id} className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Home className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium text-gray-900">{property.title}</h4>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="h-3 w-3 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          ${parseInt(property.price).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">• {property.type}</span>
                      </div>
                      <p className="text-xs text-gray-600">{property.address}, {property.city}</p>
                      {(property.bedrooms || property.bathrooms || property.area) && (
                        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                          {property.bedrooms && <span>🛏️ {property.bedrooms} bed</span>}
                          {property.bathrooms && <span>🚿 {property.bathrooms} bath</span>}
                          {property.area && <span>📐 {parseInt(property.area).toLocaleString()} sq ft</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Home className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No properties linked yet</p>
              <p className="text-xs text-gray-400">Use the property link button to add interests</p>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Created: {new Date(lead.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Tag className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Lead ID: #{lead.id}
              </span>
            </div>
          </div>
          {lead.notes && (
            <div className="mt-3">
              <span className="text-xs text-gray-500">Notes: </span>
              <p className="text-sm text-gray-900 mt-1">{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Add edit functionality here
              onClose()
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit Lead
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ViewLeadModal
