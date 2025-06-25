import { useState } from 'react'
import { X, Clock, Phone, Mail, Calendar, MessageSquare } from 'lucide-react'
import { useData } from '../App'

const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const { leads, teamMembers } = useData()
  const [formData, setFormData] = useState({
    leadId: '',
    type: 'call',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    description: '',
    assignedTo: teamMembers.find(m => m.status === 'active')?.name || ''
  })
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    if (!formData.leadId) newErrors.leadId = 'Please select a lead'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required'
    if (!formData.dueTime) newErrors.dueTime = 'Due time is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Combine date and time
    const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`)
    
    const taskData = {
      ...formData,
      dueDate: dueDateTime,
      leadName: leads.find(l => l.id === parseInt(formData.leadId))?.name || 'Unknown Lead'
    }

    onSubmit(taskData)
    setFormData({
      leadId: '',
      type: 'call',
      priority: 'medium',
      dueDate: '',
      dueTime: '',
      description: '',
      assignedTo: teamMembers.find(m => m.status === 'active')?.name || ''
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

  const getTaskIcon = (type) => {
    switch (type) {
      case 'call': return Phone
      case 'email': return Mail
      case 'meeting': return Calendar
      case 'sms': return MessageSquare
      default: return Clock
    }
  }

  // Get tomorrow as default date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Follow-up Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Lead Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lead *
            </label>
            <select
              value={formData.leadId}
              onChange={(e) => handleChange('leadId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.leadId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a lead</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} - {lead.phone}
                </option>
              ))}
            </select>
            {errors.leadId && <p className="text-red-500 text-xs mt-1">{errors.leadId}</p>}
          </div>

          {/* Task Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'call', label: 'Phone Call', icon: Phone },
                { value: 'email', label: 'Email', icon: Mail },
                { value: 'meeting', label: 'Meeting', icon: Calendar },
                { value: 'sms', label: 'SMS', icon: MessageSquare }
              ].map(type => {
                const Icon = type.icon
                return (
                  <label key={type.value} className="flex items-center p-2 border rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={(e) => handleChange('type', e.target.value)}
                      className="mr-2"
                    />
                    <Icon className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm">{type.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority *
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          {/* Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate || defaultDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dueDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Time *
              </label>
              <input
                type="time"
                value={formData.dueTime}
                onChange={(e) => handleChange('dueTime', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dueTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.dueTime && <p className="text-red-500 text-xs mt-1">{errors.dueTime}</p>}
            </div>
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
              placeholder="Describe what needs to be done..."
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => handleChange('assignedTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select team member</option>
              {teamMembers.filter(m => m.status === 'active').map(member => (
                <option key={member.id} value={member.name}>
                  {member.name} ({member.role === 'manager' ? 'Manager' : member.role === 'super_agent' ? 'Super Agent' : 'Agent'})
                </option>
              ))}
            </select>
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
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTaskModal
