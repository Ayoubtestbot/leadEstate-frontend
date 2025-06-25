import { useState } from 'react'
import { Home, Users, Link, Unlink, DollarSign } from 'lucide-react'
import Modal from './Modal'

const LinkPropertyModal = ({ isOpen, onClose, lead, properties, onLink, onUnlink }) => {
  const [selectedProperty, setSelectedProperty] = useState('')

  const handleLink = () => {
    if (selectedProperty) {
      onLink(parseInt(selectedProperty))
      setSelectedProperty('')
      onClose()
    }
  }

  const handleUnlink = (propertyId) => {
    onUnlink(propertyId)
  }

  if (!lead) return null

  // Get linked properties
  const linkedProperties = properties.filter(property => 
    lead.interestedProperties?.includes(property.id)
  )

  // Get available properties (not linked)
  const availableProperties = properties.filter(property => 
    !lead.interestedProperties?.includes(property.id)
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Property Interest" size="lg">
      <div className="space-y-6">
        {/* Lead Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{lead.name}</h3>
              <p className="text-sm text-gray-500">{lead.phone}</p>
              {lead.city && (
                <p className="text-xs text-gray-500">📍 {lead.city}</p>
              )}
            </div>
          </div>
        </div>

        {/* Currently Interested Properties */}
        {linkedProperties.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Properties of Interest ({linkedProperties.length})
            </h3>
            <div className="space-y-3">
              {linkedProperties.map((property) => (
                <div key={property.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Home className="h-4 w-4 text-green-600" />
                        <h4 className="font-medium text-gray-900">{property.title}</h4>
                        <span className="text-sm text-green-600 font-medium">
                          ${parseInt(property.price).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{property.address}, {property.city}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="capitalize">{property.type}</span>
                        {property.bedrooms && <span>🛏️ {property.bedrooms} bed</span>}
                        {property.bathrooms && <span>🚿 {property.bathrooms} bath</span>}
                        {property.area && <span>📐 {parseInt(property.area).toLocaleString()} sq ft</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnlink(property.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Remove Interest"
                    >
                      <Unlink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Property Interest */}
        {availableProperties.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Add Property Interest
            </h3>
            <div className="flex space-x-3">
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a property...</option>
                {availableProperties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.title} - ${parseInt(property.price).toLocaleString()} ({property.city})
                  </option>
                ))}
              </select>
              <button
                onClick={handleLink}
                disabled={!selectedProperty}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Link className="h-4 w-4" />
                <span>Add Interest</span>
              </button>
            </div>
          </div>
        )}

        {/* No Properties Available */}
        {availableProperties.length === 0 && linkedProperties.length === 0 && (
          <div className="text-center py-8">
            <Home className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Properties Available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add some properties first to link them to leads.
            </p>
          </div>
        )}

        {/* All Properties Linked */}
        {availableProperties.length === 0 && linkedProperties.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              ✅ This lead is interested in all available properties!
            </p>
          </div>
        )}

        {/* Info Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            💡 Linking properties helps track which properties each lead is interested in and enables better follow-up.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default LinkPropertyModal
