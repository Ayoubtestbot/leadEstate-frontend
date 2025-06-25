import { useState } from 'react'
import { Plus, Search, Filter, Home, Eye, Edit, Trash2 } from 'lucide-react'
import { useData } from '../App'
import { useToast } from '../components/Toast'
import AddPropertyModal from '../components/AddPropertyModal'
import ViewPropertyModal from '../components/ViewPropertyModal'
import EditPropertyModal from '../components/EditPropertyModal'
import ConfirmDialog from '../components/ConfirmDialog'

const Properties = () => {
  const { properties, addProperty, updateProperty, deleteProperty } = useData()
  const { showToast } = useToast()
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [viewProperty, setViewProperty] = useState(null)
  const [editProperty, setEditProperty] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleAddProperty = (propertyData) => {
    addProperty(propertyData)
    showToast(`Property "${propertyData.title}" added successfully!`, 'success')
  }

  const handleViewProperty = (property) => {
    setViewProperty(property)
  }

  const handleEditProperty = (property) => {
    setEditProperty(property)
  }

  const handleEditSubmit = (updatedData) => {
    updateProperty(editProperty.id, updatedData)
    showToast(`Property "${updatedData.title}" updated successfully!`, 'success')
    setEditProperty(null)
  }

  const handleDeleteProperty = (property) => {
    setDeleteConfirm(property)
  }

  const confirmDelete = () => {
    deleteProperty(deleteConfirm.id)
    showToast(`${deleteConfirm.title} deleted successfully!`, 'success')
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your property listings</p>
        </div>
        <button
          onClick={() => setShowAddProperty(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </button>
      </div>

      {/* Properties List */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {/* Property Image */}
              <div className="h-48 bg-gray-200 relative">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                {property.images && property.images.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    +{property.images.length - 1} more
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Property Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">{property.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      ${parseInt(property.price).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Property Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="text-gray-400 mr-2">📍</span>
                    <span>{property.location || `${property.city}${property.state ? `, ${property.state}` : ''}`}</span>
                  </div>
                  {property.address && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Home className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{property.address}</span>
                    </div>
                  )}
                </div>

                {/* Property Specs */}
                {(property.bedrooms || property.bathrooms || property.area) && (
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                    {property.bedrooms && (
                      <span className="flex items-center">
                        🛏️ {property.bedrooms} bed{property.bedrooms !== '1' ? 's' : ''}
                      </span>
                    )}
                    {property.bathrooms && (
                      <span className="flex items-center">
                        🚿 {property.bathrooms} bath{property.bathrooms !== '1' ? 's' : ''}
                      </span>
                    )}
                    {property.area && (
                      <span className="flex items-center">
                        📐 {parseInt(property.area).toLocaleString()} sq ft
                      </span>
                    )}
                  </div>
                )}

                {/* Description */}
                {property.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {property.description}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Added {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewProperty(property)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View Property"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditProperty(property)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Edit Property"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Property"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-8 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Home className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Yet</h3>
            <p className="text-gray-500 mb-6">
              Start building your property portfolio by adding your first property listing.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddProperty(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddPropertyModal
        isOpen={showAddProperty}
        onClose={() => setShowAddProperty(false)}
        onSubmit={handleAddProperty}
      />

      <ViewPropertyModal
        isOpen={!!viewProperty}
        onClose={() => setViewProperty(null)}
        property={viewProperty}
      />

      <EditPropertyModal
        isOpen={!!editProperty}
        onClose={() => setEditProperty(null)}
        property={editProperty}
        onSubmit={handleEditSubmit}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Property"
        message={`Are you sure you want to delete "${deleteConfirm?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}

export default Properties
