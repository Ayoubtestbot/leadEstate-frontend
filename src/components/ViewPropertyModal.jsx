import { Home, DollarSign, MapPin, Calendar, Tag, Bed, Bath, Maximize } from 'lucide-react'
import Modal from './Modal'

const ViewPropertyModal = ({ isOpen, onClose, property }) => {
  if (!property) return null

  const getTypeColor = (type) => {
    switch (type) {
      case 'house':
        return 'bg-blue-100 text-blue-800'
      case 'apartment':
        return 'bg-green-100 text-green-800'
      case 'condo':
        return 'bg-purple-100 text-purple-800'
      case 'townhouse':
        return 'bg-orange-100 text-orange-800'
      case 'land':
        return 'bg-yellow-100 text-yellow-800'
      case 'commercial':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Property Details" size="lg">
      <div className="space-y-6">
        {/* Property Header */}
        <div className="flex items-start space-x-4">
          <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center">
            <Home className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h2>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(property.type)}`}>
                {property.type}
              </span>
              <span className="text-2xl font-bold text-green-600">
                ${parseInt(property.price).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Location</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Home className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-900">{property.address}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-900">
                {property.city}
                {property.state && `, ${property.state}`}
                {property.zipCode && ` ${property.zipCode}`}
              </span>
            </div>
          </div>
        </div>

        {/* Property Specifications */}
        {(property.bedrooms || property.bathrooms || property.area) && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Specifications</h3>
            <div className="grid grid-cols-3 gap-4">
              {property.bedrooms && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Bed className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{property.bedrooms}</div>
                  <div className="text-xs text-gray-500">Bedroom{property.bedrooms !== '1' ? 's' : ''}</div>
                </div>
              )}
              {property.bathrooms && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Bath className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{property.bathrooms}</div>
                  <div className="text-xs text-gray-500">Bathroom{property.bathrooms !== '1' ? 's' : ''}</div>
                </div>
              )}
              {property.area && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Maximize className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {parseInt(property.area).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Sq Ft</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {property.description && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Listed: {new Date(property.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Tag className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Property ID: #{property.id}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Status: Available
              </span>
            </div>
          </div>
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
            Edit Property
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ViewPropertyModal
