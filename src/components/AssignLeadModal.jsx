import { useState } from 'react'
import { UserCheck, Users } from 'lucide-react'
import { useData } from '../App'
import Modal from './Modal'

const AssignLeadModal = ({ isOpen, onClose, lead, onSubmit }) => {
  const { teamMembers } = useData()
  const [selectedAgent, setSelectedAgent] = useState(lead?.assignedTo || '')

  // Get active team members for assignment
  const activeTeamMembers = teamMembers.filter(member => member.status === 'active')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(selectedAgent || null)
    onClose()
  }

  if (!lead) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Lead" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Current Assignment */}
        {lead.assignedTo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Currently assigned to: <strong>{lead.assignedTo}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Agent Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign to Agent
          </label>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Unassigned</option>
            {activeTeamMembers.map(member => (
              <option key={member.id} value={member.name}>
                {member.name} ({member.role === 'manager' ? 'Manager' : member.role === 'super_agent' ? 'Super Agent' : 'Agent'})
              </option>
            ))}
          </select>
        </div>

        {/* Assignment Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            💡 The assigned agent will be notified and can manage this lead.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedAgent ? 'Assign Lead' : 'Unassign Lead'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AssignLeadModal
