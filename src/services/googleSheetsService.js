// Google Sheets Integration Service
// This service handles importing leads from Google Sheets

class GoogleSheetsService {
  constructor() {
    this.pollingInterval = null
    this.lastCheckTime = localStorage.getItem('lastSheetsCheck') || new Date().toISOString()
    this.sheetsConfig = this.loadSheetsConfig()
  }

  loadSheetsConfig() {
    const saved = localStorage.getItem('googleSheetsConfig')
    return saved ? JSON.parse(saved) : {
      enabled: false,
      sheetUrl: '',
      pollingInterval: 300000, // 5 minutes
      lastSync: null
    }
  }

  saveSheetsConfig(config) {
    this.sheetsConfig = { ...this.sheetsConfig, ...config }
    localStorage.setItem('googleSheetsConfig', JSON.stringify(this.sheetsConfig))
  }

  // Extract sheet ID from Google Sheets URL
  extractSheetId(url) {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    return match ? match[1] : null
  }

  // Convert Google Sheets URL to CSV export URL
  getCSVUrl(sheetUrl) {
    const sheetId = this.extractSheetId(sheetUrl)
    if (!sheetId) return null
    
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`
  }

  // Parse CSV data into lead objects
  parseCSVData(csvText) {
    try {
      // Clean up the CSV text
      const cleanText = csvText.trim()
      if (!cleanText) {
        console.warn('Empty CSV text provided')
        return []
      }

      // Split into lines and filter out empty lines
      const lines = cleanText.split('\n').filter(line => line.trim())
      if (lines.length < 2) {
        console.warn('CSV must have at least header and one data row')
        return []
      }

      // Parse headers - handle quoted fields and various separators
      const headerLine = lines[0]
      const headers = this.parseCSVLine(headerLine).map(h => h.toLowerCase().trim())

      console.log('Parsed headers:', headers)

      const leads = []

      // Map common field variations
      const fieldMappings = {
        name: ['name', 'full_name', 'fullname', 'lead_name', 'customer_name', 'client_name', 'contact_name'],
        email: ['email', 'email_address', 'mail', 'e-mail', 'email address'],
        phone: ['phone', 'phone_number', 'mobile', 'contact', 'telephone', 'cell', 'phone number'],
        city: ['city', 'location', 'address', 'area', 'region'],
        source: ['source', 'lead_source', 'origin', 'channel', 'lead source'],
        status: ['status', 'lead_status', 'stage', 'state', 'lead status'],
        notes: ['notes', 'comments', 'description', 'remarks', 'note']
      }

      // Process each data row
      for (let i = 1; i < lines.length; i++) {
        const values = this.parseCSVLine(lines[i])
        const lead = {}

        // Map fields based on headers
        Object.keys(fieldMappings).forEach(field => {
          const possibleHeaders = fieldMappings[field]
          for (let j = 0; j < headers.length; j++) {
            if (possibleHeaders.includes(headers[j]) && values[j] && values[j].trim()) {
              lead[field] = values[j].trim()
              break
            }
          }
        })

        // Validate required fields
        if (lead.name && (lead.phone || lead.email)) {
          // Validate email format if provided
          if (lead.email && !/\S+@\S+\.\S+/.test(lead.email)) {
            console.warn(`Invalid email format for ${lead.name}: ${lead.email}`)
            continue
          }

          // Set defaults
          lead.source = lead.source || 'google_sheets'
          lead.status = lead.status || 'new'
          lead.id = Date.now() + Math.random() // Temporary ID
          lead.createdAt = new Date().toISOString()
          lead.assignedTo = null
          lead.interestedProperties = []

          leads.push(lead)
          console.log('Parsed lead:', lead)
        } else {
          console.warn(`Skipping row ${i + 1}: Missing required fields (name and phone/email)`, { name: lead.name, phone: lead.phone, email: lead.email })
        }
      }

      console.log(`Successfully parsed ${leads.length} leads from ${lines.length - 1} rows`)
      return leads

    } catch (error) {
      console.error('Error parsing CSV data:', error)
      throw new Error(`Failed to parse CSV data: ${error.message}`)
    }
  }

  // Helper method to parse a single CSV line, handling quoted fields
  parseCSVLine(line) {
    const result = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  }

  // Fetch data from Google Sheets using CORS proxy
  async fetchSheetsData(sheetUrl) {
    try {
      const csvUrl = this.getCSVUrl(sheetUrl)
      if (!csvUrl) {
        throw new Error('Invalid Google Sheets URL')
      }

      // Try multiple CORS proxy services
      const corsProxies = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/',
        'https://api.codetabs.com/v1/proxy?quest='
      ]

      let lastError = null

      for (const proxy of corsProxies) {
        try {
          const proxyUrl = proxy + encodeURIComponent(csvUrl)
          console.log('Trying proxy:', proxy)

          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'text/csv, text/plain, */*'
            }
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const csvText = await response.text()

          // Validate that we got CSV data
          if (!csvText || csvText.trim().length === 0) {
            throw new Error('Empty response from Google Sheets')
          }

          // Check if it looks like CSV (has commas or is structured data)
          if (!csvText.includes(',') && !csvText.includes('\n')) {
            throw new Error('Response does not appear to be CSV data')
          }

          console.log('Successfully fetched data via proxy:', proxy)
          return this.parseCSVData(csvText)

        } catch (error) {
          console.warn(`Proxy ${proxy} failed:`, error.message)
          lastError = error
          continue
        }
      }

      // If all proxies failed, throw the last error
      throw new Error(`All CORS proxies failed. Last error: ${lastError?.message || 'Unknown error'}. Please ensure your Google Sheet is publicly accessible.`)

    } catch (error) {
      console.error('Error fetching Google Sheets data:', error)
      throw error
    }
  }

  // Start polling Google Sheets for new data
  startPolling(onNewLeads) {
    if (this.pollingInterval) {
      this.stopPolling()
    }

    if (!this.sheetsConfig.enabled || !this.sheetsConfig.sheetUrl) {
      return
    }

    this.pollingInterval = setInterval(async () => {
      try {
        const leads = await this.fetchSheetsData(this.sheetsConfig.sheetUrl)
        
        // Filter leads created after last check
        const newLeads = leads.filter(lead => {
          const leadTime = new Date(lead.createdAt)
          const lastCheck = new Date(this.lastCheckTime)
          return leadTime > lastCheck
        })

        if (newLeads.length > 0) {
          onNewLeads(newLeads)
          this.lastCheckTime = new Date().toISOString()
          localStorage.setItem('lastSheetsCheck', this.lastCheckTime)
        }

        this.saveSheetsConfig({ lastSync: new Date().toISOString() })
      } catch (error) {
        console.error('Error during Google Sheets polling:', error)
      }
    }, this.sheetsConfig.pollingInterval)
  }

  // Stop polling
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }
  }

  // Configure Google Sheets integration
  configure(config) {
    this.saveSheetsConfig(config)
    
    if (config.enabled && config.sheetUrl) {
      // Validate the URL
      const sheetId = this.extractSheetId(config.sheetUrl)
      if (!sheetId) {
        throw new Error('Invalid Google Sheets URL format')
      }
    }
  }

  // Get current configuration
  getConfig() {
    return { ...this.sheetsConfig }
  }

  // Test connection to Google Sheets
  async testConnection(sheetUrl) {
    try {
      const leads = await this.fetchSheetsData(sheetUrl)
      return {
        success: true,
        message: `Successfully connected. Found ${leads.length} leads.`,
        leadCount: leads.length,
        sampleLeads: leads.slice(0, 3) // Return first 3 leads as sample
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        leadCount: 0,
        sampleLeads: []
      }
    }
  }

  // Manual sync from Google Sheets
  async manualSync() {
    if (!this.sheetsConfig.sheetUrl) {
      throw new Error('No Google Sheets URL configured')
    }

    const leads = await this.fetchSheetsData(this.sheetsConfig.sheetUrl)
    this.saveSheetsConfig({ lastSync: new Date().toISOString() })
    return leads
  }

  // Get sync status
  getSyncStatus() {
    return {
      enabled: this.sheetsConfig.enabled,
      lastSync: this.sheetsConfig.lastSync,
      isPolling: !!this.pollingInterval,
      nextSync: this.pollingInterval ? 
        new Date(Date.now() + this.sheetsConfig.pollingInterval).toISOString() : 
        null
    }
  }
}

// Create singleton instance
const googleSheetsService = new GoogleSheetsService()

export default googleSheetsService

// Helper function to create a demo Google Sheets URL for testing
export const createDemoSheetsUrl = () => {
  // This would be a real Google Sheets URL in production
  return 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit'
}

// Helper function to validate Google Sheets URL format
export const isValidSheetsUrl = (url) => {
  const pattern = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/
  return pattern.test(url)
}
