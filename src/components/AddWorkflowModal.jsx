import { useState } from 'react'
import { X, Zap, Mail, MessageSquare, Phone, Calendar } from 'lucide-react'

const AddWorkflowModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: 'new_lead',
    category: 'lead_management',
    actions: []
  })
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Workflow name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const workflowData = {
      ...formData,
      status: 'active',
      leadsProcessed: 0,
      conversionRate: 0
    }

    onSubmit(workflowData)
    setFormData({
      name: '',
      description: '',
      trigger: 'new_lead',
      category: 'lead_management',
      actions: []
    })
    setErrors({})
    onClose()
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const triggers = [
    { value: 'new_lead', label: 'New Lead Created' },
    { value: 'lead_updated', label: 'Lead Status Updated' },
    { value: 'property_viewed', label: 'Property Viewed' },
    { value: 'no_response', label: 'No Response After X Days' },
    { value: 'manual', label: 'Manual Trigger' }
  ]

  const categories = [
    { value: 'lead_management', label: 'Lead Management' },
    { value: 'email_marketing', label: 'Email Marketing' },
    { value: 'sms_marketing', label: 'SMS Marketing' },
    { value: 'scheduling', label: 'Scheduling' },
    { value: 'follow_up', label: 'Follow-up' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Workflow</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Workflow Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workflow Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter workflow name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe what this workflow does"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Trigger */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trigger *
            </label>
            <select
              value={formData.trigger}
              onChange={(e) => handleChange('trigger', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {triggers.map(trigger => (
                <option key={trigger.value} value={trigger.value}>
                  {trigger.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actions (Preview)
            </label>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600 mb-3">
                Actions will be configured in the workflow builder after creation.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  <Mail className="h-3 w-3 mr-1" />
                  Send Email
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Send SMS
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule Task
                </span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex items-start">
              <Zap className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Workflow Builder</h4>
                <p className="text-sm text-blue-700 mt-1">
                  After creating this workflow, you'll be able to add and configure specific actions, 
                  set conditions, and customize the automation flow.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Workflow
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddWorkflowModal
