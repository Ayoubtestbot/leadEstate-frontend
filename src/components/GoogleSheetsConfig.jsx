import { useState, useEffect } from 'react'
import { Settings, RefreshCw, CheckCircle, AlertCircle, ExternalLink, Clock } from 'lucide-react'
import googleSheetsService, { isValidSheetsUrl } from '../services/googleSheetsService'
import { useToast } from './Toast'

const GoogleSheetsConfig = ({ onNewLeads }) => {
  const { showToast } = useToast()
  const [config, setConfig] = useState(googleSheetsService.getConfig())
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [syncStatus, setSyncStatus] = useState(googleSheetsService.getSyncStatus())
  const [showConfig, setShowConfig] = useState(false)

  useEffect(() => {
    // Update sync status every 30 seconds
    const interval = setInterval(() => {
      setSyncStatus(googleSheetsService.getSyncStatus())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Start polling if enabled
    if (config.enabled && config.sheetUrl) {
      googleSheetsService.startPolling((newLeads) => {
        onNewLeads(newLeads)
        showToast(`${newLeads.length} new leads imported from Google Sheets`, 'success')
      })
    } else {
      googleSheetsService.stopPolling()
    }

    return () => googleSheetsService.stopPolling()
  }, [config.enabled, config.sheetUrl, onNewLeads, showToast])

  const handleConfigChange = (field, value) => {
    const newConfig = { ...config, [field]: value }
    setConfig(newConfig)
  }

  const handleSaveConfig = () => {
    try {
      googleSheetsService.configure(config)
      showToast('Google Sheets configuration saved', 'success')
      setSyncStatus(googleSheetsService.getSyncStatus())
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  const handleTestConnection = async () => {
    if (!config.sheetUrl) {
      showToast('Please enter a Google Sheets URL', 'error')
      return
    }

    if (!isValidSheetsUrl(config.sheetUrl)) {
      showToast('Please enter a valid Google Sheets URL', 'error')
      return
    }

    setIsTestingConnection(true)
    setConnectionStatus(null)

    try {
      const result = await googleSheetsService.testConnection(config.sheetUrl)
      setConnectionStatus(result)
      
      if (result.success) {
        showToast(result.message, 'success')
      } else {
        showToast(result.message, 'error')
      }
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: 'Connection failed due to CORS restrictions. Please use a backend proxy.',
        leadCount: 0,
        sampleLeads: []
      })
      showToast('Connection test failed', 'error')
    }

    setIsTestingConnection(false)
  }

  const handleManualSync = async () => {
    try {
      const leads = await googleSheetsService.manualSync()
      onNewLeads(leads)
      showToast(`Manually imported ${leads.length} leads from Google Sheets`, 'success')
      setSyncStatus(googleSheetsService.getSyncStatus())
    } catch (error) {
      showToast(`Manual sync failed: ${error.message}`, 'error')
    }
  }

  const formatLastSync = (lastSync) => {
    if (!lastSync) return 'Never'
    const date = new Date(lastSync)
    return date.toLocaleString()
  }

  const formatNextSync = (nextSync) => {
    if (!nextSync) return 'Not scheduled'
    const date = new Date(nextSync)
    const now = new Date()
    const diffMinutes = Math.ceil((date - now) / (1000 * 60))
    return `In ${diffMinutes} minutes`
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Settings className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Google Sheets Integration</h3>
        </div>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showConfig ? 'Hide' : 'Configure'}
        </button>
      </div>

      {/* Status */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              config.enabled ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              Status: {config.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">
              Last Sync: {formatLastSync(syncStatus.lastSync)}
            </span>
          </div>
          
          {syncStatus.isPolling && (
            <div className="flex items-center">
              <RefreshCw className="h-4 w-4 text-blue-500 mr-2 animate-spin" />
              <span className="text-sm text-gray-600">
                Next: {formatNextSync(syncStatus.nextSync)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Configuration */}
      {showConfig && (
        <div className="p-4 space-y-4">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Enable Google Sheets Integration
            </label>
            <button
              onClick={() => handleConfigChange('enabled', !config.enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.enabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Google Sheets URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Sheets URL
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={config.sheetUrl}
                onChange={(e) => handleConfigChange('sheetUrl', e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection || !config.sheetUrl}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestingConnection ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  'Test'
                )}
              </button>
            </div>
          </div>

          {/* Polling Interval */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check for new leads every (minutes)
            </label>
            <select
              value={config.pollingInterval / 60000}
              onChange={(e) => handleConfigChange('pollingInterval', parseInt(e.target.value) * 60000)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 minute</option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </div>

          {/* Connection Status */}
          {connectionStatus && (
            <div className={`p-3 rounded-md ${
              connectionStatus.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start">
                {connectionStatus.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                )}
                <div>
                  <p className={`text-sm font-medium ${
                    connectionStatus.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {connectionStatus.message}
                  </p>
                  {connectionStatus.success && connectionStatus.sampleLeads.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-green-700 mb-1">Sample leads found:</p>
                      <ul className="text-xs text-green-600 space-y-1">
                        {connectionStatus.sampleLeads.map((lead, index) => (
                          <li key={index}>• {lead.name} - {lead.email || lead.phone}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Setup Instructions:</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Create a Google Sheet with columns: <code className="bg-blue-100 px-1 rounded">name, email, phone, city, source, status</code></li>
              <li>Add your lead data to the sheet (name and email/phone are required)</li>
              <li>Make the sheet publicly viewable: <strong>Share → Anyone with the link can view</strong></li>
              <li>Copy the sheet URL and paste it above</li>
              <li>Test the connection to verify data access</li>
              <li>Enable the integration for automatic syncing</li>
            </ol>
            <div className="mt-3 p-2 bg-blue-100 rounded">
              <p className="text-xs text-blue-800 font-medium">Try with demo sheet:</p>
              <div className="flex items-center justify-between mt-1">
                <code className="text-xs text-blue-700 flex-1 mr-2">https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit</code>
                <button
                  onClick={() => handleConfigChange('sheetUrl', 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit')}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Use Demo
                </button>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              <strong>Note:</strong> Uses CORS proxy services to access your sheet. Ensure your sheet is publicly accessible.
            </p>
          </div>

          {/* Troubleshooting */}
          {connectionStatus && !connectionStatus.success && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">Troubleshooting:</h4>
              <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                <li>Ensure your Google Sheet is shared as "Anyone with the link can view"</li>
                <li>Check that your sheet has a header row with column names</li>
                <li>Verify you have at least one data row with name and email/phone</li>
                <li>Make sure the URL is the full Google Sheets URL (not a shortened link)</li>
                <li>Try refreshing the page and testing again</li>
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleSaveConfig}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Configuration
            </button>
            {config.enabled && config.sheetUrl && (
              <button
                onClick={handleManualSync}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Manual Sync Now
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GoogleSheetsConfig
