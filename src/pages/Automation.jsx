import { useState } from 'react'
import { usePermissions, PERMISSIONS } from '../contexts/PermissionsContext'
import ProtectedComponent from '../components/ProtectedComponent'
import AddWorkflowModal from '../components/AddWorkflowModal'
import { useToast } from '../components/Toast'
import {
  Zap,
  Plus,
  Play,
  Pause,
  Settings,
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  Users,
  Target,
  Clock,
  BarChart3,
  Edit,
  Trash2,
  Copy
} from 'lucide-react'

const Automation = () => {
  const { hasPermission } = usePermissions()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('workflows')
  const [showAddWorkflow, setShowAddWorkflow] = useState(false)
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: 'New Lead Welcome Sequence',
      description: 'Automatically send welcome emails to new leads',
      status: 'active',
      trigger: 'New lead created',
      actions: ['Send welcome email', 'Add to CRM', 'Assign to agent'],
      leads: 45,
      conversionRate: '12%',
      lastRun: '2 hours ago'
    },
    {
      id: 2,
      name: 'Follow-up Reminder',
      description: 'Remind agents to follow up with qualified leads',
      status: 'active',
      trigger: 'Lead status = qualified',
      actions: ['Wait 1 day', 'Send reminder to agent', 'Create task'],
      leads: 23,
      conversionRate: '28%',
      lastRun: '1 hour ago'
    },
    {
      id: 3,
      name: 'Property Match Notification',
      description: 'Notify leads when matching properties are added',
      status: 'paused',
      trigger: 'New property matches lead criteria',
      actions: ['Send property alert', 'Schedule viewing'],
      leads: 12,
      conversionRate: '35%',
      lastRun: '1 day ago'
    }
  ])

  // Handler functions
  const handleAddWorkflow = (workflowData) => {
    const newWorkflow = {
      id: Date.now(),
      ...workflowData,
      trigger: 'Manual trigger',
      actions: ['Send email', 'Create task'],
      leads: 0,
      conversionRate: '0%',
      lastRun: 'Never'
    }
    setWorkflows(prev => [...prev, newWorkflow])
    showToast(`Workflow "${workflowData.name}" created successfully`, 'success')
  }

  const handleToggleWorkflow = (workflowId) => {
    setWorkflows(prev => prev.map(workflow =>
      workflow.id === workflowId
        ? {
            ...workflow,
            status: workflow.status === 'active' ? 'paused' : 'active',
            lastRun: workflow.status === 'paused' ? new Date().toLocaleString() : workflow.lastRun
          }
        : workflow
    ))
    const workflow = workflows.find(w => w.id === workflowId)
    const action = workflow?.status === 'active' ? 'paused' : 'activated'
    showToast(`Workflow ${action} successfully`, 'success')
  }

  const handleDuplicateWorkflow = (workflow) => {
    const duplicatedWorkflow = {
      ...workflow,
      id: Date.now(),
      name: `${workflow.name} (Copy)`,
      status: 'paused',
      leads: 0,
      conversionRate: '0%',
      lastRun: 'Never'
    }
    setWorkflows(prev => [...prev, duplicatedWorkflow])
    showToast(`Workflow "${workflow.name}" duplicated successfully`, 'success')
  }

  const handleDeleteWorkflow = (workflowId) => {
    const workflow = workflows.find(w => w.id === workflowId)
    if (confirm(`Are you sure you want to delete "${workflow?.name}"?`)) {
      setWorkflows(prev => prev.filter(w => w.id !== workflowId))
      showToast(`Workflow "${workflow?.name}" deleted successfully`, 'success')
    }
  }

  const templates = [
    {
      id: 1,
      name: 'Lead Nurturing Campaign',
      description: 'Multi-step email sequence for lead nurturing',
      category: 'Email Marketing',
      icon: Mail,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'SMS Follow-up',
      description: 'Automated SMS reminders and updates',
      category: 'SMS Marketing',
      icon: MessageSquare,
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Appointment Booking',
      description: 'Automated appointment scheduling workflow',
      category: 'Scheduling',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      name: 'Lead Scoring',
      description: 'Automatically score leads based on behavior',
      category: 'Lead Management',
      icon: Target,
      color: 'bg-orange-500'
    }
  ]

  const WorkflowCard = ({ workflow }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${workflow.status === 'active' ? 'bg-green-100' : 'bg-gray-100'} mr-3`}>
            <Zap className={`h-5 w-5 ${workflow.status === 'active' ? 'text-green-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
            <p className="text-sm text-gray-600">{workflow.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => alert('Edit workflow builder coming soon!')}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Edit Workflow"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDuplicateWorkflow(workflow)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Duplicate Workflow"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteWorkflow(workflow.id)}
            className="p-1 text-gray-400 hover:text-red-600"
            title="Delete Workflow"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{workflow.leads}</p>
          <p className="text-xs text-gray-600">Leads Processed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{workflow.conversionRate}</p>
          <p className="text-xs text-gray-600">Conversion Rate</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">{workflow.lastRun}</p>
          <p className="text-xs text-gray-600">Last Run</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              workflow.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {workflow.status === 'active' ? 'Active' : 'Paused'}
            </span>
            <span className="ml-3 text-sm text-gray-600">
              Trigger: {workflow.trigger}
            </span>
          </div>
          <button
            onClick={() => handleToggleWorkflow(workflow.id)}
            className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
              workflow.status === 'active'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {workflow.status === 'active' ? (
              <>
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-1" />
                Activate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  const TemplateCard = ({ template }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-lg ${template.color} mr-4`}>
          <template.icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
          <p className="text-sm text-gray-600">{template.category}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{template.description}</p>
      <button
        onClick={() => alert(`Using ${template.name} template - feature coming soon!`)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Use Template
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automation</h1>
          <p className="text-gray-600 mt-1">Automate your lead management and follow-up processes</p>
        </div>
        
        <button
          onClick={() => setShowAddWorkflow(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('workflows')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'workflows'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active Workflows
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          {workflows.map(workflow => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Automation Analytics</h3>
          <p className="text-gray-600 mb-6">
            Track the performance of your automated workflows and optimize for better results.
          </p>
          <button
            onClick={() => alert('Detailed automation analytics feature coming soon!')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            View Detailed Analytics
          </button>
        </div>
      )}

      {/* Add Workflow Modal */}
      <AddWorkflowModal
        isOpen={showAddWorkflow}
        onClose={() => setShowAddWorkflow(false)}
        onSubmit={handleAddWorkflow}
      />
    </div>
  )
}

export default Automation
