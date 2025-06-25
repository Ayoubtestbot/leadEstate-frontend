import { useState } from 'react'
import { Phone, Mail, MapPin, Home, Eye, Edit, UserCheck, Trash2, MessageCircle } from 'lucide-react'
import { usePermissions, PERMISSIONS } from '../contexts/PermissionsContext'
import ProtectedComponent from './ProtectedComponent'

const KanbanView = ({
  leads,
  onUpdateLead,
  onViewLead,
  onEditLead,
  onAssignLead,
  onLinkProperty,
  onWhatsAppLead,
  onDeleteLead
}) => {
  const [draggedLead, setDraggedLead] = useState(null)
  const { hasPermission } = usePermissions()

  const columns = [
    { id: 'new', title: 'New Leads', color: 'bg-blue-50 border-blue-200', headerColor: 'bg-blue-100' },
    { id: 'contacted', title: 'Contacted', color: 'bg-yellow-50 border-yellow-200', headerColor: 'bg-yellow-100' },
    { id: 'qualified', title: 'Qualified', color: 'bg-green-50 border-green-200', headerColor: 'bg-green-100' },
    { id: 'proposal', title: 'Proposal', color: 'bg-purple-50 border-purple-200', headerColor: 'bg-purple-100' },
    { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-50 border-orange-200', headerColor: 'bg-orange-100' },
    { id: 'closed-won', title: 'Closed Won', color: 'bg-emerald-50 border-emerald-200', headerColor: 'bg-emerald-100' },
    { id: 'closed-lost', title: 'Closed Lost', color: 'bg-red-50 border-red-200', headerColor: 'bg-red-100' }
  ]

  const getLeadsByStatus = (status) => {
    return leads.filter(lead => lead.status === status)
  }

  const handleDragStart = (e, lead) => {
    setDraggedLead(lead)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, newStatus) => {
    e.preventDefault()
    if (draggedLead && draggedLead.status !== newStatus) {
      onUpdateLead(draggedLead.id, { status: newStatus })
    }
    setDraggedLead(null)
  }

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
        return 'bg-emerald-100 text-emerald-800'
      case 'closed-lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnLeads = getLeadsByStatus(column.id)
        
        return (
          <div
            key={column.id}
            className={`flex-shrink-0 w-72 ${column.color} border rounded-lg`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className={`${column.headerColor} px-4 py-3 rounded-t-lg border-b`}>
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{column.title}</h3>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-gray-700">
                  {columnLeads.length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className="p-2 space-y-2 min-h-[200px]">
              {columnLeads.map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead)}
                  className={`bg-white rounded-md border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-move ${
                    draggedLead?.id === lead.id ? 'opacity-50' : ''
                  }`}
                >
                  {/* Lead Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-1 mb-1">
                        <h4 className="font-medium text-gray-900 text-sm">{lead.name}</h4>
                        {lead.interestedProperties?.length > 0 && (
                          <span className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {lead.interestedProperties.length} 🏠
                          </span>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1 mb-2">
                    <div className="flex items-center text-xs text-gray-600">
                      <Phone className="h-3 w-3 mr-1 text-gray-400" />
                      <span className="truncate">{lead.phone}</span>
                    </div>
                    {lead.email && (
                      <div className="flex items-center text-xs text-gray-600">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                    )}
                    {lead.city && (
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="truncate">{lead.city}</span>
                      </div>
                    )}
                  </div>

                  {/* Assignment */}
                  {lead.assignedTo && (
                    <div className="mb-2">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        👤 {lead.assignedTo}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-0.5">
                      {/* View - All roles */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onViewLead(lead)
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Lead"
                      >
                        <Eye className="h-3 w-3" />
                      </button>

                      {/* Assign - Super Agent and Manager only */}
                      <ProtectedComponent permission={PERMISSIONS.ASSIGN_LEAD}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onAssignLead(lead)
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Assign Lead"
                        >
                          <UserCheck className="h-3 w-3" />
                        </button>
                      </ProtectedComponent>

                      {/* Link Property - All roles */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onLinkProperty(lead)
                        }}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Link Property"
                      >
                        <Home className="h-3 w-3" />
                      </button>

                      {/* WhatsApp - All roles */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onWhatsAppLead(lead)
                        }}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Send Properties via WhatsApp"
                      >
                        <MessageCircle className="h-3 w-3" />
                      </button>

                      {/* Edit - All roles can edit their assigned leads */}
                      <ProtectedComponent permission={PERMISSIONS.EDIT_LEAD}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditLead(lead)
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit Lead"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                      </ProtectedComponent>

                      {/* Delete - Manager only */}
                      <ProtectedComponent permission={PERMISSIONS.DELETE_LEAD}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteLead(lead)
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </ProtectedComponent>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {columnLeads.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-sm">No leads in this stage</div>
                  <div className="text-xs mt-1">Drag leads here to update status</div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default KanbanView
