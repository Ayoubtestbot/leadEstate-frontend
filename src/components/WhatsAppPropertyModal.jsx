import { useState } from 'react'
import { X, MessageCircle, Send, Image, MapPin, DollarSign, Home } from 'lucide-react'
import { useData } from '../App'

const WhatsAppPropertyModal = ({ isOpen, onClose, lead }) => {
  const { properties } = useData()
  const [selectedProperties, setSelectedProperties] = useState([])
  const [customMessage, setCustomMessage] = useState('')

  if (!isOpen || !lead) return null

  // Filter available properties (you could add more sophisticated filtering)
  const availableProperties = properties.filter(property => property.status === 'available')

  const togglePropertySelection = (propertyId) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  const generateWhatsAppMessage = () => {
    const selectedProps = properties.filter(p => selectedProperties.includes(p.id))
    
    let message = `Hi ${lead.name}! 👋\n\n`
    message += `I found some amazing properties that might interest you:\n\n`
    
    selectedProps.forEach((property, index) => {
      message += `🏠 *${property.title}*\n`
      message += `📍 ${property.location}\n`
      message += `💰 $${property.price?.toLocaleString()}\n`
      message += `🛏️ ${property.bedrooms} bed, ${property.bathrooms} bath\n`
      message += `📐 ${property.area} sq ft\n`
      
      if (property.description) {
        message += `📝 ${property.description.substring(0, 100)}${property.description.length > 100 ? '...' : ''}\n`
      }
      
      message += `\n`
    })
    
    if (customMessage.trim()) {
      message += `${customMessage}\n\n`
    }
    
    message += `Would you like to schedule a viewing? Let me know! 😊\n\n`
    message += `Best regards,\nYour Real Estate Agent`
    
    return encodeURIComponent(message)
  }

  const sendWhatsAppMessage = () => {
    if (selectedProperties.length === 0) {
      alert('Please select at least one property to share.')
      return
    }

    const message = generateWhatsAppMessage()
    const phoneNumber = lead.phone.replace(/\D/g, '') // Remove non-digits
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    
    window.open(whatsappUrl, '_blank')
    onClose()
  }

  const PropertyCard = ({ property }) => {
    const isSelected = selectedProperties.includes(property.id)
    
    return (
      <div 
        onClick={() => togglePropertySelection(property.id)}
        className={`border rounded-lg p-4 cursor-pointer transition-all ${
          isSelected 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {property.images && property.images.length > 0 ? (
              <img 
                src={property.images[0]} 
                alt={property.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <Home className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {property.title}
            </h4>
            <div className="mt-1 space-y-1">
              <div className="flex items-center text-xs text-gray-600">
                <MapPin className="h-3 w-3 mr-1" />
                {property.location}
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <DollarSign className="h-3 w-3 mr-1" />
                ${property.price?.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">
                {property.bedrooms} bed • {property.bathrooms} bath • {property.area} sq ft
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              isSelected 
                ? 'border-green-500 bg-green-500' 
                : 'border-gray-300'
            }`}>
              {isSelected && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <MessageCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Send Properties via WhatsApp
              </h2>
              <p className="text-sm text-gray-600">
                Share properties with {lead.name} ({lead.phone})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Property Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Select Properties to Share
            </h3>
            
            {availableProperties.length > 0 ? (
              <div className="space-y-3">
                {availableProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Home className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No properties available to share</p>
              </div>
            )}
          </div>

          {/* Custom Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a personal message..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Preview */}
          {selectedProperties.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Message Preview:</h4>
              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 max-h-32 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans">
                  {decodeURIComponent(generateWhatsAppMessage())}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedProperties.length} propert{selectedProperties.length === 1 ? 'y' : 'ies'} selected
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={sendWhatsAppMessage}
              disabled={selectedProperties.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Send className="h-4 w-4 mr-2" />
              Send via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhatsAppPropertyModal
