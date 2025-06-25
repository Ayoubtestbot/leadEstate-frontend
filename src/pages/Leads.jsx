import { useState } from 'react'
import {
  Plus,
  Search,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Home,
  Grid3X3,
  List,
  Users,
  Upload,
  MessageCircle
} from 'lucide-react'
import { useData, useAuth } from '../App'
import { usePermissions, PERMISSIONS } from '../contexts/PermissionsContext'
import ProtectedComponent from '../components/ProtectedComponent'
import { useToast } from '../components/Toast'
import AddLeadModal from '../components/AddLeadModal'
import ViewLeadModal from '../components/ViewLeadModal'
import EditLeadModal from '../components/EditLeadModal'
import AssignLeadModal from '../components/AssignLeadModal'
import LinkPropertyModal from '../components/LinkPropertyModal'
import WhatsAppPropertyModal from '../components/WhatsAppPropertyModal'
import ImportLeadsModal from '../components/ImportLeadsModal'
import GoogleSheetsConfig from '../components/GoogleSheetsConfig'
import KanbanView from '../components/KanbanView'
import ConfirmDialog from '../components/ConfirmDialog'

const Leads = () => {
  const { leads, properties, addLead, updateLead, deleteLead, linkPropertyToLead, unlinkPropertyFromLead } = useData()
  const { user } = useAuth()
  const { hasPermission } = usePermissions()
  const { showToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('table') // 'table' or 'kanban'
  const [showAddLead, setShowAddLead] = useState(false)
  const [viewLead, setViewLead] = useState(null)
  const [editLead, setEditLead] = useState(null)
  const [assignLead, setAssignLead] = useState(null)
  const [linkProperty, setLinkProperty] = useState(null)
  const [whatsAppLead, setWhatsAppLead] = useState(null)
  const [showImport, setShowImport] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleAddLead = (leadData) => {
    addLead(leadData)
    showToast(`Lead "${leadData.name}" added successfully!`, 'success')
  }

  const handleViewLead = (lead) => {
    setViewLead(lead)
  }

  const handleEditLead = (lead) => {
    setEditLead(lead)
  }

  const handleEditSubmit = (updatedData) => {
    updateLead(editLead.id, updatedData)
    showToast(`Lead "${updatedData.name}" updated successfully!`, 'success')
    setEditLead(null)
  }

  const handleAssignLead = (lead) => {
    setAssignLead(lead)
  }

  const handleAssignSubmit = (assignedTo) => {
    updateLead(assignLead.id, { assignedTo })
    const message = assignedTo
      ? `Lead assigned to ${assignedTo} successfully!`
      : `Lead unassigned successfully!`
    showToast(message, 'success')
    setAssignLead(null)
  }

  const handleLinkProperty = (lead) => {
    setLinkProperty(lead)
  }

  const handlePropertyLink = (propertyId) => {
    linkPropertyToLead(linkProperty.id, propertyId)
    const property = properties.find(p => p.id === propertyId)
    showToast(`${linkProperty.name} is now interested in "${property?.title}"!`, 'success')
  }

  const handlePropertyUnlink = (propertyId) => {
    unlinkPropertyFromLead(linkProperty.id, propertyId)
    const property = properties.find(p => p.id === propertyId)
    showToast(`Removed "${property?.title}" from ${linkProperty.name}'s interests`, 'success')
  }

  const handleWhatsAppLead = (lead) => {
    setWhatsAppLead(lead)
  }

  const handleImportLeads = (importedLeads) => {
    importedLeads.forEach(leadData => {
      const newLead = {
        id: Date.now() + Math.random(), // Ensure unique IDs
        ...leadData,
        createdAt: new Date().toISOString(),
        assignedTo: null,
        interestedProperties: []
      }
      addLead(newLead)
    })
    showToast(`Successfully imported ${importedLeads.length} leads`, 'success')
  }

  const handleGoogleSheetsLeads = (newLeads) => {
    newLeads.forEach(leadData => {
      const newLead = {
        id: Date.now() + Math.random(), // Ensure unique IDs
        ...leadData,
        createdAt: new Date().toISOString(),
        assignedTo: null,
        interestedProperties: []
      }
      addLead(newLead)
    })
  }

  const handleDeleteLead = (lead) => {
    setDeleteConfirm(lead)
  }

  const confirmDelete = () => {
    deleteLead(deleteConfirm.id)
    showToast(`${deleteConfirm.name} deleted successfully!`, 'success')
    setDeleteConfirm(null)
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

  // Filter leads based on search, status, and user permissions
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter

    // Role-based filtering
    if (hasPermission(PERMISSIONS.VIEW_ALL_LEADS)) {
      // Manager and Super Agent can see all leads
      return matchesSearch && matchesStatus
    } else if (hasPermission(PERMISSIONS.VIEW_ASSIGNED_LEADS)) {
      // Agent can only see their assigned leads
      return matchesSearch && matchesStatus && lead.assignedTo === user?.name
    }

    // Fallback: if no specific permissions, don't show leads
    return false
  })

  return (
    <div className="space-y-6">
      {/* Google Sheets Integration - Manager only */}
      <ProtectedComponent permission={PERMISSIONS.MANAGE_AUTOMATION}>
        <GoogleSheetsConfig onNewLeads={handleGoogleSheetsLeads} />
      </ProtectedComponent>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your real estate leads</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* View Toggle */}
          <div className="flex rounded-md border border-gray-300 bg-white">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm font-medium rounded-l-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4 mr-1 inline" />
              Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-2 text-sm font-medium rounded-r-md transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Grid3X3 className="h-4 w-4 mr-1 inline" />
              Kanban
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Import Leads - Super Agent and Manager only */}
            <ProtectedComponent permission={PERMISSIONS.IMPORT_LEADS}>
              <button
                onClick={() => setShowImport(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white shadow hover:bg-green-700 h-9 px-4 py-2 w-full sm:w-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </button>
            </ProtectedComponent>

            {/* Add Lead - Super Agent and Manager only */}
            <ProtectedComponent permission={PERMISSIONS.ADD_LEAD}>
              <button
                onClick={() => setShowAddLead(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </button>
            </ProtectedComponent>
          </div>
        </div>
      </div>

      {/* Filters - Only show for table view */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 pl-10 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-2">
                {/* Status Filter */}
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="closed-won">Closed Won</option>
                    <option value="closed-lost">Closed Lost</option>
                  </select>
                </div>

                {/* Source Filter */}
                <div className="sm:w-48">
                  <select
                    value="all"
                    className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="all">All Sources</option>
                    <option value="website">Website</option>
                    <option value="facebook">Facebook</option>
                    <option value="google">Google</option>
                    <option value="referral">Referral</option>
                    <option value="walk-in">Walk-in</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Views */}
      {viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b">
                <tr>
                  <th className="h-10 px-2 text-left align-middle font-medium text-gray-500">Lead</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-gray-500 hidden sm:table-cell">Contact</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-gray-500">Status</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-gray-500 hidden md:table-cell">Source</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-gray-500 hidden lg:table-cell">Assigned To</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-gray-500 hidden xl:table-cell">Created</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b transition-colors hover:bg-gray-50">
                  <td className="p-2 align-middle">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{lead.name}</span>
                        {lead.interestedProperties?.length > 0 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {lead.interestedProperties.length} 🏠
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 sm:hidden">
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 align-middle hidden sm:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-3 w-3 mr-1" />
                        {lead.phone}
                      </div>
                      {lead.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-3 w-3 mr-1" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                      )}
                      {lead.city && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="text-xs">📍 {lead.city}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2 align-middle">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-2 align-middle hidden md:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSourceColor(lead.source)}`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="p-2 align-middle hidden lg:table-cell">
                    {lead.assignedTo ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {lead.assignedTo}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Unassigned</span>
                    )}
                  </td>
                  <td className="p-2 align-middle hidden xl:table-cell">
                    <div className="text-sm text-gray-600">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-2 align-middle">
                    <div className="flex items-center space-x-1">
                      {/* View - All roles can view */}
                      <button
                        onClick={() => handleViewLead(lead)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Lead"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Assign - Super Agent and Manager only */}
                      <ProtectedComponent permission={PERMISSIONS.ASSIGN_LEAD}>
                        <button
                          onClick={() => handleAssignLead(lead)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Assign Lead"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                      </ProtectedComponent>

                      {/* Link Property - All roles can link properties */}
                      <button
                        onClick={() => handleLinkProperty(lead)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Link Property"
                      >
                        <Home className="h-4 w-4" />
                      </button>

                      {/* WhatsApp - All roles can send WhatsApp */}
                      <button
                        onClick={() => handleWhatsAppLead(lead)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Send Properties via WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>

                      {/* Edit - All roles can edit (filtered by permissions in component) */}
                      <ProtectedComponent permission={PERMISSIONS.EDIT_LEAD}>
                        <button
                          onClick={() => handleEditLead(lead)}
                          className="p-1 text-gray-400 hover:text-gray-600 hidden lg:inline-flex transition-colors"
                          title="Edit Lead"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </ProtectedComponent>

                      {/* Delete - Manager only */}
                      <ProtectedComponent permission={PERMISSIONS.DELETE_LEAD}>
                        <button
                          onClick={() => handleDeleteLead(lead)}
                          className="p-1 text-gray-400 hover:text-red-600 hidden lg:inline-flex transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </ProtectedComponent>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State for Table */}
        {filteredLeads.length === 0 && (
          <div className="p-8 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Get started by adding your first lead to the system.'
              }
            </p>
            <button
              onClick={() => setShowAddLead(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </button>
          </div>
        )}
        </div>
      ) : (
        /* Kanban View */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <KanbanView
            leads={filteredLeads}
            onUpdateLead={updateLead}
            onViewLead={handleViewLead}
            onEditLead={handleEditLead}
            onAssignLead={handleAssignLead}
            onLinkProperty={handleLinkProperty}
            onWhatsAppLead={handleWhatsAppLead}
            onDeleteLead={handleDeleteLead}
          />

          {/* Empty State for Kanban */}
          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Grid3X3 className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads to display</h3>
              <p className="text-gray-500 mb-6">
                Add some leads to see them organized in the Kanban board.
              </p>
              <button
                onClick={() => setShowAddLead(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddLeadModal
        isOpen={showAddLead}
        onClose={() => setShowAddLead(false)}
        onSubmit={handleAddLead}
      />

      <ViewLeadModal
        isOpen={!!viewLead}
        onClose={() => setViewLead(null)}
        lead={viewLead}
      />

      <EditLeadModal
        isOpen={!!editLead}
        onClose={() => setEditLead(null)}
        lead={editLead}
        onSubmit={handleEditSubmit}
      />

      <AssignLeadModal
        isOpen={!!assignLead}
        onClose={() => setAssignLead(null)}
        lead={assignLead}
        onSubmit={handleAssignSubmit}
      />

      <LinkPropertyModal
        isOpen={!!linkProperty}
        onClose={() => setLinkProperty(null)}
        lead={linkProperty}
        properties={properties}
        onLink={handlePropertyLink}
        onUnlink={handlePropertyUnlink}
      />

      <WhatsAppPropertyModal
        isOpen={!!whatsAppLead}
        onClose={() => setWhatsAppLead(null)}
        lead={whatsAppLead}
      />

      <ImportLeadsModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImportLeads}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}

export default Leads
