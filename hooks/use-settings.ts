import { useState, useEffect } from 'react'

interface Settings {
  // General Settings
  companyName: string
  companyEmail: string
  timezone: string
  dateFormat: string
  language: string
  
  // Notification Settings
  emailNotifications: boolean
  pushNotifications: boolean
  taskReminders: boolean
  projectUpdates: boolean
  weeklyReports: boolean
  
  // Security Settings
  twoFactorAuth: boolean
  sessionTimeout: number
  passwordExpiry: number
  loginAttempts: number
  
  // Appearance Settings
  theme: 'light' | 'dark' | 'auto'
  sidebarCollapsed: boolean
  compactMode: boolean
  
  // Integration Settings
  slackIntegration: boolean
  githubIntegration: boolean
  googleCalendar: boolean
  jiraIntegration: boolean
  
  // Data Settings
  autoBackup: boolean
  backupFrequency: string
  dataRetention: number
  exportFormat: string
}

const defaultSettings: Settings = {
  companyName: "NexaPro",
  companyEmail: "admin@nexapro.com",
  timezone: "Asia/Jakarta",
  dateFormat: "DD/MM/YYYY",
  language: "en",
  emailNotifications: true,
  pushNotifications: true,
  taskReminders: true,
  projectUpdates: true,
  weeklyReports: false,
  twoFactorAuth: false,
  sessionTimeout: 30,
  passwordExpiry: 90,
  loginAttempts: 5,
  theme: 'light',
  sidebarCollapsed: false,
  compactMode: false,
  slackIntegration: false,
  githubIntegration: false,
  googleCalendar: false,
  jiraIntegration: false,
  autoBackup: true,
  backupFrequency: "daily",
  dataRetention: 365,
  exportFormat: "csv"
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load settings from localStorage and backend
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load from localStorage first
      const savedSettings = localStorage.getItem("nexapro_settings")
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsedSettings })
      }

      // Try to load from backend
      try {
        const response = await fetch("https://nexapro.web.id/api/admin/settings")
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            const backendSettings = { ...defaultSettings, ...data.data }
            setSettings(backendSettings)
            localStorage.setItem("nexapro_settings", JSON.stringify(backendSettings))
          }
        }
      } catch (backendError) {
        console.warn("Failed to load settings from backend, using localStorage:", backendError)
      }
    } catch (err) {
      setError("Failed to load settings")
      console.error("Settings load error:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      setError(null)
      const updatedSettings = { ...settings, ...newSettings }
      
      // Update local state
      setSettings(updatedSettings)
      
      // Save to localStorage
      localStorage.setItem("nexapro_settings", JSON.stringify(updatedSettings))
      
      // Try to save to backend
      try {
        const response = await fetch("https://nexapro.web.id/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSettings),
        })
        
        if (!response.ok) {
          throw new Error("Backend save failed")
        }
      } catch (backendError) {
        console.warn("Failed to save settings to backend:", backendError)
        // Settings are still saved locally, so we don't throw an error
      }
      
      return { success: true }
    } catch (err) {
      setError("Failed to update settings")
      console.error("Settings update error:", err)
      return { success: false, error: err }
    }
  }

  const resetSettings = async () => {
    try {
      setError(null)
      setSettings(defaultSettings)
      localStorage.setItem("nexapro_settings", JSON.stringify(defaultSettings))
      
      // Try to reset on backend
      try {
        await fetch("https://nexapro.web.id/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(defaultSettings),
        })
      } catch (backendError) {
        console.warn("Failed to reset settings on backend:", backendError)
      }
      
      return { success: true }
    } catch (err) {
      setError("Failed to reset settings")
      console.error("Settings reset error:", err)
      return { success: false, error: err }
    }
  }

  const exportData = async (type: string = 'all', format: string = 'csv') => {
    try {
      setError(null)
      
      const response = await fetch("https://nexapro.web.id/api/admin/settings/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, format }),
      })
      
      if (!response.ok) {
        throw new Error("Export failed")
      }
      
      const data = await response.json()
      return data
    } catch (err) {
      setError("Failed to export data")
      console.error("Export error:", err)
      return { success: false, error: err }
    }
  }

  const createBackup = async () => {
    try {
      setError(null)
      
      const response = await fetch("https://nexapro.web.id/api/admin/settings/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      
      if (!response.ok) {
        throw new Error("Backup failed")
      }
      
      const data = await response.json()
      return data
    } catch (err) {
      setError("Failed to create backup")
      console.error("Backup error:", err)
      return { success: false, error: err }
    }
  }

  const getStatistics = async () => {
    try {
      setError(null)
      
      const response = await fetch("https://nexapro.web.id/api/admin/settings/statistics")
      
      if (!response.ok) {
        throw new Error("Failed to get statistics")
      }
      
      const data = await response.json()
      return data
    } catch (err) {
      setError("Failed to get statistics")
      console.error("Statistics error:", err)
      return { success: false, error: err }
    }
  }

  // Apply theme to document
  useEffect(() => {
    const applyTheme = (theme: string) => {
      const root = document.documentElement
      
      if (theme === 'dark') {
        root.classList.add('dark')
      } else if (theme === 'light') {
        root.classList.remove('dark')
      } else if (theme === 'auto') {
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
    }

    applyTheme(settings.theme)
  }, [settings.theme])

  // Apply compact mode
  useEffect(() => {
    const root = document.documentElement
    if (settings.compactMode) {
      root.classList.add('compact-mode')
    } else {
      root.classList.remove('compact-mode')
    }
  }, [settings.compactMode])

  return {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings,
    exportData,
    createBackup,
    getStatistics,
    reload: loadSettings,
  }
} 