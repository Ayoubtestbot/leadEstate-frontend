import { useState } from 'react'
import { useData } from '../App'
import { usePermissions, PERMISSIONS } from '../contexts/PermissionsContext'
import ProtectedComponent from '../components/ProtectedComponent'
import AddTaskModal from '../components/AddTaskModal'
import { useToast } from '../components/Toast'
import {
  Clock,
  Plus,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  User,
  AlertCircle,
  CheckCircle,
  Filter,
  Search,
  Bell,
  Target,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const FollowUp = () => {
  const { leads } = useData()
  const { hasPermission } = usePermissions()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [showAddTask, setShowAddTask] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [followUpTasks, setFollowUpTasks] = useState([
    // Initial sample tasks
    {
      id: 1,
      leadId: 2,
      leadName: 'Sarah Johnson',
      type: 'call',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      description: 'Follow up on property viewing interest',
      status: 'pending',
      assignedTo: 'Demo Agent',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      leadId: 3,
      leadName: 'Mike Wilson',
      type: 'email',
      priority: 'medium',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      description: 'Send property recommendations based on criteria',
      status: 'pending',
      assignedTo: 'Demo Agent',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    {
      id: 3,
      leadId: 4,
      leadName: 'Emily Davis',
      type: 'meeting',
      priority: 'high',
      dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago (overdue)
      description: 'Schedule property viewing appointment',
      status: 'overdue',
      assignedTo: 'Demo Super Agent',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
    }
  ])

  // Handler functions
  const handleAddTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      status: 'pending',
      createdAt: new Date()
    }
    setFollowUpTasks(prev => [...prev, newTask])
    showToast(`Task created for ${taskData.leadName}`, 'success')
  }

  const handleMarkComplete = (taskId) => {
    setFollowUpTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status: 'completed', completedAt: new Date() }
        : task
    ))
    showToast('Task marked as complete', 'success')
  }

  const handleReschedule = (taskId) => {
    // For now, just add 1 day to the due date
    setFollowUpTasks(prev => prev.map(task =>
      task.id === taskId
        ? {
            ...task,
            dueDate: new Date(task.dueDate.getTime() + 24 * 60 * 60 * 1000),
            status: task.status === 'overdue' ? 'pending' : task.status
          }
        : task
    ))
    showToast('Task rescheduled for tomorrow', 'success')
  }

  // Filter tasks based on active tab and search
  const filteredTasks = followUpTasks.filter(task => {
    const matchesTab = activeTab === 'all' || task.status === activeTab
    const matchesSearch = task.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    return matchesTab && matchesSearch && matchesPriority
  })

  const getTaskIcon = (type) => {
    switch (type) {
      case 'call': return Phone
      case 'email': return Mail
      case 'meeting': return Calendar
      case 'sms': return MessageSquare
      default: return Clock
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDueDate = (date) => {
    const now = new Date()
    const diffMs = date - now
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffMs < 0) {
      return `Overdue by ${Math.abs(diffDays)} day(s)`
    } else if (diffHours < 24) {
      return `Due in ${diffHours} hour(s)`
    } else {
      return `Due in ${diffDays} day(s)`
    }
  }

  const TaskCard = ({ task }) => {
    const TaskIcon = getTaskIcon(task.type)
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${task.status === 'overdue' ? 'bg-red-100' : 'bg-blue-100'} mr-3`}>
              <TaskIcon className={`h-5 w-5 ${task.status === 'overdue' ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{task.leadName}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority} priority
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {task.assignedTo}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formatDueDate(task.dueDate)}
          </div>
        </div>

        {task.status === 'pending' && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleMarkComplete(task.id)}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              Mark Complete
            </button>
            <button
              onClick={() => handleReschedule(task.id)}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              Reschedule
            </button>
          </div>
        )}

        {task.status === 'completed' && task.completedAt && (
          <div className="text-sm text-green-600 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Completed {new Date(task.completedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    )
  }

  const pendingTasks = followUpTasks.filter(task => task.status === 'pending').length
  const overdueTasks = followUpTasks.filter(task => task.status === 'overdue').length
  const completedTasks = followUpTasks.filter(task => task.status === 'completed').length

  // Calendar helper functions
  const getWeekStart = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }

  const getWeekDays = (weekStart) => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      days.push(day)
    }
    return days
  }

  const getTasksForDate = (date) => {
    return followUpTasks.filter(task => {
      const taskDate = new Date(task.dueDate)
      return taskDate.toDateString() === date.toDateString()
    })
  }

  const weekStart = getWeekStart(currentWeek)
  const weekDays = getWeekDays(weekStart)

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() + (direction * 7))
    setCurrentWeek(newWeek)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Follow-up Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track your lead follow-up activities</p>
        </div>
        
        <button
          onClick={() => setShowAddTask(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pendingTasks}</p>
              <p className="text-sm text-gray-600">Pending Tasks</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{overdueTasks}</p>
              <p className="text-sm text-gray-600">Overdue Tasks</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
              <p className="text-sm text-gray-600">Completed Tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'pending', label: 'Pending', count: pendingTasks },
            { key: 'overdue', label: 'Overdue', count: overdueTasks },
            { key: 'completed', label: 'Completed', count: completedTasks },
            { key: 'calendar', label: 'Calendar', count: null },
            { key: 'all', label: 'All Tasks', count: followUpTasks.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} {tab.count !== null && `(${tab.count})`}
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'calendar' ? (
        /* Calendar View */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Week of {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateWeek(-1)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentWeek(new Date())}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateWeek(1)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {weekDays.map(day => {
              const dayTasks = getTasksForDate(day)
              const isToday = day.toDateString() === new Date().toDateString()

              return (
                <div key={day.toISOString()} className="bg-white min-h-[120px] p-2">
                  <div className={`text-sm font-medium mb-2 ${
                    isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {day.getDate()}
                  </div>

                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        className={`text-xs p-1 rounded truncate cursor-pointer ${
                          task.status === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 'high'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                        title={`${task.leadName} - ${task.description}`}
                      >
                        {task.leadName}
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* Tasks List View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {filteredTasks.length === 0 && activeTab !== 'calendar' && (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600">
            {searchTerm || priorityFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Create your first follow-up task to get started.'
            }
          </p>
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onSubmit={handleAddTask}
      />
    </div>
  )
}

export default FollowUp
