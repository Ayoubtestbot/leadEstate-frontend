import { useState, useRef } from 'react'
import { X, Upload, FileText, Table, Download, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'

const ImportLeadsModal = ({ isOpen, onClose, onImport }) => {
  const [activeTab, setActiveTab] = useState('file')
  const [dragActive, setDragActive] = useState(false)
  const [importData, setImportData] = useState([])
  const [importStatus, setImportStatus] = useState(null)
  const [errors, setErrors] = useState([])
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFileUpload = (file) => {
    setIsProcessing(true)
    setErrors([])
    
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        let data = []
        
        if (file.name.endsWith('.csv')) {
          // Parse CSV
          const text = e.target.result
          const lines = text.split('\n')
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
          
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
              const row = {}
              headers.forEach((header, index) => {
                row[header] = values[index] || ''
              })
              data.push(row)
            }
          }
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          // Excel parsing requires xlsx library
          setErrors(['Excel file support requires additional setup. Please convert to CSV format.'])
          setImportStatus('error')
          setIsProcessing(false)
          return
        }
        
        const processedData = processImportData(data)
        setImportData(processedData.validData)
        setErrors(processedData.errors)
        setImportStatus('preview')
      } catch (error) {
        setErrors([`Error parsing file: ${error.message}`])
        setImportStatus('error')
      }
      setIsProcessing(false)
    }
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file)
    } else {
      reader.readAsBinaryString(file)
    }
  }

  const processImportData = (rawData) => {
    const validData = []
    const errors = []
    
    rawData.forEach((row, index) => {
      const lead = {}
      let hasErrors = false
      
      // Map common field variations
      const fieldMappings = {
        name: ['name', 'full_name', 'fullname', 'lead_name', 'customer_name'],
        email: ['email', 'email_address', 'mail'],
        phone: ['phone', 'phone_number', 'mobile', 'contact', 'telephone'],
        city: ['city', 'location', 'address'],
        source: ['source', 'lead_source', 'origin'],
        status: ['status', 'lead_status', 'stage']
      }
      
      // Map fields
      Object.keys(fieldMappings).forEach(field => {
        const possibleKeys = fieldMappings[field]
        for (const key of possibleKeys) {
          const value = row[key] || row[key.toLowerCase()] || row[key.toUpperCase()]
          if (value) {
            lead[field] = value.toString().trim()
            break
          }
        }
      })
      
      // Validation
      if (!lead.name) {
        errors.push(`Row ${index + 2}: Name is required`)
        hasErrors = true
      }
      
      if (!lead.phone && !lead.email) {
        errors.push(`Row ${index + 2}: Either phone or email is required`)
        hasErrors = true
      }
      
      if (lead.email && !/\S+@\S+\.\S+/.test(lead.email)) {
        errors.push(`Row ${index + 2}: Invalid email format`)
        hasErrors = true
      }
      
      // Set defaults
      if (!hasErrors) {
        lead.source = lead.source || 'import'
        lead.status = lead.status || 'new'
        validData.push(lead)
      }
    })
    
    return { validData, errors }
  }

  const handleGoogleSheetsImport = async () => {
    setIsProcessing(true)
    setErrors([])
    
    try {
      // Extract sheet ID from URL
      const sheetIdMatch = googleSheetsUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
      if (!sheetIdMatch) {
        throw new Error('Invalid Google Sheets URL')
      }
      
      const sheetId = sheetIdMatch[1]
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`
      
      // Note: This would require CORS to be enabled or a backend proxy
      // For demo purposes, we'll show how it would work
      setErrors(['Google Sheets import requires backend integration for CORS handling. Please download as CSV and upload instead.'])
      setImportStatus('error')
      
    } catch (error) {
      setErrors([error.message])
      setImportStatus('error')
    }
    setIsProcessing(false)
  }

  const handleImport = () => {
    if (importData.length > 0) {
      onImport(importData)
      setImportData([])
      setImportStatus(null)
      setErrors([])
      onClose()
    }
  }

  const downloadTemplate = () => {
    const template = [
      'name,email,phone,city,source,status',
      'John Doe,john@example.com,+1234567890,New York,website,new',
      'Jane Smith,jane@example.com,+1234567891,Los Angeles,facebook,contacted'
    ].join('\n')

    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetImport = () => {
    setImportData([])
    setImportStatus(null)
    setErrors([])
    setGoogleSheetsUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Import Leads</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('file')}
              className={`py-3 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'file'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              File Upload
            </button>
            <button
              onClick={() => setActiveTab('sheets')}
              className={`py-3 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'sheets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Table className="h-4 w-4 inline mr-2" />
              Google Sheets
            </button>
          </nav>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'file' && (
            <div className="space-y-6">
              {/* Template Download */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Download className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-900">Download Template</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Use our template to ensure your data is formatted correctly.
                    </p>
                    <button
                      onClick={downloadTemplate}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Download CSV Template
                    </button>
                  </div>
                </div>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your file here or click to browse
                </h3>
                <p className="text-gray-600 mb-4">
                  Supports CSV files (.csv)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Choose File
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sheets' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-900">Google Sheets Integration</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Make sure your Google Sheet is publicly accessible or shared with view permissions.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Sheets URL
                </label>
                <input
                  type="url"
                  value={googleSheetsUrl}
                  onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleGoogleSheetsImport}
                disabled={!googleSheetsUrl || isProcessing}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Importing...' : 'Import from Google Sheets'}
              </button>
            </div>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing your file...</p>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-900">Import Errors</h4>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {importStatus === 'preview' && importData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-900">
                  Preview ({importData.length} leads)
                </h4>
                <button
                  onClick={resetImport}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Reset
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {importData.slice(0, 5).map((lead, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{lead.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{lead.email}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{lead.phone}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{lead.city}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{lead.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {importData.length > 5 && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    ... and {importData.length - 5} more leads
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {importData.length > 0 && `${importData.length} leads ready to import`}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {importData.length > 0 && (
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Import {importData.length} Leads
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportLeadsModal
