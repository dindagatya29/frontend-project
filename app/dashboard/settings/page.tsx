"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, User, Bell, Shield, Palette, Database, Globe, Mail, Key, X } from "lucide-react"

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

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userPermissions, setUserPermissions] = useState<string[]>([])
  const [settings, setSettings] = useState<Settings>({
    // General Settings
    companyName: "NexaPro",
    companyEmail: "admin@nexapro.com",
    timezone: "Asia/Jakarta",
    dateFormat: "DD/MM/YYYY",
    language: "en",
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    projectUpdates: true,
    weeklyReports: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    
    // Appearance Settings
    theme: 'light',
    sidebarCollapsed: false,
    compactMode: false,
    
    // Integration Settings
    slackIntegration: false,
    githubIntegration: false,
    googleCalendar: false,
    jiraIntegration: false,
    
    // Data Settings
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: 365,
    exportFormat: "csv"
  })
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [backupLoading, setBackupLoading] = useState(false)
  const [statistics, setStatistics] = useState<any>(null)

  // Get current user and permissions
  useEffect(() => {
    const userStr = localStorage.getItem("nexapro_user")
    if (userStr) {
      const user = JSON.parse(userStr)
      setCurrentUser(user)
      
      // Fetch user permissions from backend
      fetch(`http://localhost:8000/api/admin/user-permissions/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setUserPermissions(data.data.map((p: any) => p.name))
          }
        })
        .catch(() => {
          // Fallback to role-based permissions if API fails
          const rolePermissions = {
            admin: [
              "manage_users", "manage_projects", "manage_tasks", "view_reports", 
              "export_data", "manage_settings", "manage_integrations", "manage_roles",
              "track_time", "view_projects", "manage_team"
            ],
            project_manager: [
              "manage_projects", "manage_tasks", "assign_tasks", "view_reports",
              "export_data", "manage_team", "view_time_tracking", "track_time", "view_projects"
            ],
            member: [
              "view_projects", "manage_own_tasks", "comment_tasks", "upload_files",
              "track_time", "view_own_reports"
            ]
          }
          setUserPermissions(rolePermissions[user.role as keyof typeof rolePermissions] || [])
        })
    }
  }, [])

  // Permission check functions
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false
    if (currentUser.role === "admin") return true // Admin has all permissions
    return userPermissions.includes(permission)
  }

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("nexapro_settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Load statistics on component mount
  useEffect(() => {
    loadStatistics()
  }, [])

  // Load statistics
  const loadStatistics = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/settings/statistics")
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStatistics(data.data)
        }
      }
    } catch (error) {
      console.error("Failed to load statistics:", error)
    }
  }

  // Save settings
  const handleSaveSettings = async () => {
    if (!hasPermission("manage_settings")) {
      setSaveStatus({type: 'error', message: 'You don\'t have permission to change settings'})
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }

    setSaving(true)
    
    try {
      // Save to localStorage
      localStorage.setItem("nexapro_settings", JSON.stringify(settings))
      
      // Save to backend (if API exists)
      await fetch("http://localhost:8000/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      
      setSaveStatus({type: 'success', message: 'Settings saved successfully'})
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      setSaveStatus({type: 'error', message: 'Failed to save settings'})
      setTimeout(() => setSaveStatus(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  // Update setting
  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    
    // Apply changes immediately for certain settings
    if (key === 'theme') {
      const root = document.documentElement
      if (value === 'dark') {
        root.classList.add('dark')
      } else if (value === 'light') {
        root.classList.remove('dark')
      } else if (value === 'auto') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
    }
    
    if (key === 'compactMode') {
      const root = document.documentElement
      if (value) {
        root.classList.add('compact-mode')
      } else {
        root.classList.remove('compact-mode')
      }
    }
    
    if (key === 'sidebarCollapsed') {
      // Dispatch custom event for sidebar layout
      window.dispatchEvent(new CustomEvent('settingsChanged', {
        detail: { key, value }
      }))
    }
    
    // Dispatch event for notification settings
    if (key === 'emailNotifications' || 
        key === 'pushNotifications' || 
        key === 'taskReminders' || 
        key === 'projectUpdates' || 
        key === 'weeklyReports') {
      window.dispatchEvent(new CustomEvent('settingsChanged', {
        detail: { key, value }
      }))
    }
    
    // Save to localStorage immediately
    const updatedSettings = { ...settings, [key]: value }
    localStorage.setItem("nexapro_settings", JSON.stringify(updatedSettings))
  }

  // Reset settings
  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
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
      setSettings(defaultSettings)
      localStorage.setItem("nexapro_settings", JSON.stringify(defaultSettings))
    }
  }

  // Export data
  const handleExportData = async () => {
    if (!hasPermission("export_data")) {
      setSaveStatus({type: 'error', message: 'You don\'t have permission to export data'})
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }

    setExportLoading(true)
    try {
      // Fetch data from multiple endpoints
      const [projectsRes, tasksRes, usersRes, filesRes] = await Promise.all([
        fetch("http://localhost:8000/api/projects"),
        fetch("http://localhost:8000/api/tasks"),
        fetch("http://localhost:8000/api/users"),
        fetch("http://localhost:8000/api/files")
      ])

      const projectsData = await projectsRes.json()
      const tasksData = await tasksRes.json()
      const usersData = await usersRes.json()
      const filesData = await filesRes.json()

      // Prepare export data
      const exportData = {
        timestamp: new Date().toISOString(),
        exportedBy: currentUser?.name || currentUser?.email || 'Unknown',
        data: {
          projects: projectsData.data || [],
          tasks: tasksData.data || [],
          users: usersData.data || [],
          files: filesData.data || []
        }
      }

      let content = ''
      let mimeType = ''
      let fileExtension = ''
      let fileName = `nexapro_export_${new Date().toISOString().split('T')[0]}`

      // Generate content based on selected format
      switch (settings.exportFormat.toLowerCase()) {
        case 'csv':
          content = generateCSVContent(exportData)
          mimeType = 'text/csv;charset=utf-8;'
          fileExtension = 'csv'
          break
        case 'json':
          content = generateJSONContent(exportData)
          mimeType = 'application/json;charset=utf-8;'
          fileExtension = 'json'
          break
        case 'excel':
          content = generateExcelContent(exportData)
          mimeType = 'text/tab-separated-values;charset=utf-8;'
          fileExtension = 'xls'
          break
        case 'xml':
          content = generateXMLContent(exportData)
          mimeType = 'application/xml;charset=utf-8;'
          fileExtension = 'xml'
          break
        default:
          content = generateCSVContent(exportData)
          mimeType = 'text/csv;charset=utf-8;'
          fileExtension = 'csv'
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${fileName}.${fileExtension}`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      setSaveStatus({type: 'success', message: `Data exported successfully in ${settings.exportFormat.toUpperCase()} format to your downloads folder`})
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      console.error('Export error:', error)
      setSaveStatus({type: 'error', message: 'Failed to export data'})
      setTimeout(() => setSaveStatus(null), 3000)
    } finally {
      setExportLoading(false)
    }
  }

  // Generate CSV content
  const generateCSVContent = (exportData: any) => {
    // Add BOM for UTF-8 support
    const BOM = '\uFEFF'
    let csvContent = BOM
    
    // Projects CSV
    if (exportData.data.projects.length > 0) {
      csvContent += '=== PROJECTS ===\n'
      const projectHeaders = Object.keys(exportData.data.projects[0]).join(',')
      csvContent += projectHeaders + '\n'
      exportData.data.projects.forEach((project: any) => {
        csvContent += Object.values(project).map((value: any) => {
          if (value === null || value === undefined) return ''
          const stringValue = String(value)
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        }).join(',') + '\n'
      })
      csvContent += '\n'
    }

    // Tasks CSV
    if (exportData.data.tasks.length > 0) {
      csvContent += '=== TASKS ===\n'
      const taskHeaders = Object.keys(exportData.data.tasks[0]).join(',')
      csvContent += taskHeaders + '\n'
      exportData.data.tasks.forEach((task: any) => {
        csvContent += Object.values(task).map((value: any) => {
          if (value === null || value === undefined) return ''
          const stringValue = String(value)
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        }).join(',') + '\n'
      })
      csvContent += '\n'
    }

    // Users CSV
    if (exportData.data.users.length > 0) {
      csvContent += '=== USERS ===\n'
      const userHeaders = Object.keys(exportData.data.users[0]).join(',')
      csvContent += userHeaders + '\n'
      exportData.data.users.forEach((user: any) => {
        csvContent += Object.values(user).map((value: any) => {
          if (value === null || value === undefined) return ''
          const stringValue = String(value)
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        }).join(',') + '\n'
      })
      csvContent += '\n'
    }

    // Files CSV
    if (exportData.data.files.length > 0) {
      csvContent += '=== FILES ===\n'
      const fileHeaders = Object.keys(exportData.data.files[0]).join(',')
      csvContent += fileHeaders + '\n'
      exportData.data.files.forEach((file: any) => {
        csvContent += Object.values(file).map((value: any) => {
          if (value === null || value === undefined) return ''
          const stringValue = String(value)
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        }).join(',') + '\n'
      })
    }

    return csvContent
  }

  // Generate JSON content
  const generateJSONContent = (exportData: any) => {
    return JSON.stringify(exportData, null, 2)
  }

  // Generate Excel content (proper XLSX format)
  const generateExcelContent = (exportData: any) => {
    // Create a proper Excel-compatible format with table structure
    const BOM = '\uFEFF' // Byte Order Mark for UTF-8
    let excelContent = BOM
    
    // Add Excel metadata
    excelContent += 'NexaPro Data Export\n'
    excelContent += `Exported on: ${new Date().toLocaleString()}\n`
    excelContent += `Exported by: ${exportData.exportedBy}\n`
    excelContent += '\n'
    
    // Projects Table
    if (exportData.data.projects.length > 0) {
      excelContent += 'PROJECTS TABLE\n'
      excelContent += '='.repeat(80) + '\n'
      
      // Get all unique headers from all projects
      const allProjectKeys = new Set<string>()
      exportData.data.projects.forEach((project: any) => {
        Object.keys(project).forEach(key => allProjectKeys.add(key))
      })
      const projectHeaders = Array.from(allProjectKeys)
      
      // Create header row with proper column names
      const headerRow = projectHeaders.map(header => {
        // Convert snake_case to Title Case
        return header
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      })
      excelContent += headerRow.join('\t') + '\n'
      
      // Create separator line
      excelContent += '-'.repeat(headerRow.join('\t').length) + '\n'
      
      // Table data with proper formatting
      exportData.data.projects.forEach((project: any) => {
        const rowData = projectHeaders.map(header => {
          const value = project[header]
          if (value === null || value === undefined) return ''
          
          let stringValue = String(value)
          
          // Format dates
          if (header.includes('date') || header.includes('created') || header.includes('updated')) {
            try {
              const date = new Date(stringValue)
              if (!isNaN(date.getTime())) {
                stringValue = date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })
              }
            } catch (e) {
              // Keep original value if date parsing fails
            }
          }
          
          // Clean up special characters that might break Excel
          stringValue = stringValue
            .replace(/\t/g, ' ') // Replace tabs with spaces
            .replace(/\n/g, ' ') // Replace newlines with spaces
            .replace(/\r/g, ' ') // Replace carriage returns with spaces
            .replace(/[object Object]/g, '') // Remove [object Object]
            .trim()
          
          return stringValue
        })
        excelContent += rowData.join('\t') + '\n'
      })
      excelContent += '\n\n'
    }

    // Tasks Table
    if (exportData.data.tasks.length > 0) {
      excelContent += 'TASKS TABLE\n'
      excelContent += '='.repeat(80) + '\n'
      
      // Get all unique headers from all tasks
      const allTaskKeys = new Set<string>()
      exportData.data.tasks.forEach((task: any) => {
        Object.keys(task).forEach(key => allTaskKeys.add(key))
      })
      const taskHeaders = Array.from(allTaskKeys)
      
      // Create header row with proper column names
      const headerRow = taskHeaders.map(header => {
        // Convert snake_case to Title Case
        return header
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      })
      excelContent += headerRow.join('\t') + '\n'
      
      // Create separator line
      excelContent += '-'.repeat(headerRow.join('\t').length) + '\n'
      
      // Table data with proper formatting
      exportData.data.tasks.forEach((task: any) => {
        const rowData = taskHeaders.map(header => {
          const value = task[header]
          if (value === null || value === undefined) return ''
          
          let stringValue = String(value)
          
          // Format dates
          if (header.includes('date') || header.includes('created') || header.includes('updated')) {
            try {
              const date = new Date(stringValue)
              if (!isNaN(date.getTime())) {
                stringValue = date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })
              }
            } catch (e) {
              // Keep original value if date parsing fails
            }
          }
          
          // Clean up special characters that might break Excel
          stringValue = stringValue
            .replace(/\t/g, ' ') // Replace tabs with spaces
            .replace(/\n/g, ' ') // Replace newlines with spaces
            .replace(/\r/g, ' ') // Replace carriage returns with spaces
            .replace(/[object Object]/g, '') // Remove [object Object]
            .trim()
          
          return stringValue
        })
        excelContent += rowData.join('\t') + '\n'
      })
      excelContent += '\n\n'
    }

    // Users Table
    if (exportData.data.users.length > 0) {
      excelContent += 'USERS TABLE\n'
      excelContent += '='.repeat(80) + '\n'
      
      // Get all unique headers from all users
      const allUserKeys = new Set<string>()
      exportData.data.users.forEach((user: any) => {
        Object.keys(user).forEach(key => allUserKeys.add(key))
      })
      const userHeaders = Array.from(allUserKeys)
      
      // Create header row with proper column names
      const headerRow = userHeaders.map(header => {
        // Convert snake_case to Title Case
        return header
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      })
      excelContent += headerRow.join('\t') + '\n'
      
      // Create separator line
      excelContent += '-'.repeat(headerRow.join('\t').length) + '\n'
      
      // Table data with proper formatting
      exportData.data.users.forEach((user: any) => {
        const rowData = userHeaders.map(header => {
          const value = user[header]
          if (value === null || value === undefined) return ''
          
          let stringValue = String(value)
          
          // Format dates
          if (header.includes('date') || header.includes('created') || header.includes('updated')) {
            try {
              const date = new Date(stringValue)
              if (!isNaN(date.getTime())) {
                stringValue = date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })
              }
            } catch (e) {
              // Keep original value if date parsing fails
            }
          }
          
          // Clean up special characters that might break Excel
          stringValue = stringValue
            .replace(/\t/g, ' ') // Replace tabs with spaces
            .replace(/\n/g, ' ') // Replace newlines with spaces
            .replace(/\r/g, ' ') // Replace carriage returns with spaces
            .replace(/[object Object]/g, '') // Remove [object Object]
            .trim()
          
          return stringValue
        })
        excelContent += rowData.join('\t') + '\n'
      })
      excelContent += '\n\n'
    }

    // Files Table
    if (exportData.data.files.length > 0) {
      excelContent += 'FILES TABLE\n'
      excelContent += '='.repeat(80) + '\n'
      
      // Get all unique headers from all files
      const allFileKeys = new Set<string>()
      exportData.data.files.forEach((file: any) => {
        Object.keys(file).forEach(key => allFileKeys.add(key))
      })
      const fileHeaders = Array.from(allFileKeys)
      
      // Create header row with proper column names
      const headerRow = fileHeaders.map(header => {
        // Convert snake_case to Title Case
        return header
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      })
      excelContent += headerRow.join('\t') + '\n'
      
      // Create separator line
      excelContent += '-'.repeat(headerRow.join('\t').length) + '\n'
      
      // Table data with proper formatting
      exportData.data.files.forEach((file: any) => {
        const rowData = fileHeaders.map(header => {
          const value = file[header]
          if (value === null || value === undefined) return ''
          
          let stringValue = String(value)
          
          // Format dates
          if (header.includes('date') || header.includes('created') || header.includes('updated')) {
            try {
              const date = new Date(stringValue)
              if (!isNaN(date.getTime())) {
                stringValue = date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })
              }
            } catch (e) {
              // Keep original value if date parsing fails
            }
          }
          
          // Clean up special characters that might break Excel
          stringValue = stringValue
            .replace(/\t/g, ' ') // Replace tabs with spaces
            .replace(/\n/g, ' ') // Replace newlines with spaces
            .replace(/\r/g, ' ') // Replace carriage returns with spaces
            .replace(/[object Object]/g, '') // Remove [object Object]
            .trim()
          
          return stringValue
        })
        excelContent += rowData.join('\t') + '\n'
      })
      excelContent += '\n'
    }

    // Add summary
    excelContent += '\nSUMMARY\n'
    excelContent += '='.repeat(50) + '\n'
    excelContent += `Total Projects: ${exportData.data.projects.length}\n`
    excelContent += `Total Tasks: ${exportData.data.tasks.length}\n`
    excelContent += `Total Users: ${exportData.data.users.length}\n`
    excelContent += `Total Files: ${exportData.data.files.length}\n`

    return excelContent
  }

  // Generate XML content
  const generateXMLContent = (exportData: any) => {
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xmlContent += '<nexapro_export>\n'
    xmlContent += `  <metadata>\n`
    xmlContent += `    <timestamp>${exportData.timestamp}</timestamp>\n`
    xmlContent += `    <exported_by>${escapeXml(exportData.exportedBy)}</exported_by>\n`
    xmlContent += `  </metadata>\n`
    
    // Projects XML
    if (exportData.data.projects.length > 0) {
      xmlContent += `  <projects>\n`
      exportData.data.projects.forEach((project: any) => {
        xmlContent += `    <project>\n`
        Object.entries(project).forEach(([key, value]) => {
          const safeValue = value === null || value === undefined ? '' : escapeXml(String(value))
          xmlContent += `      <${key}>${safeValue}</${key}>\n`
        })
        xmlContent += `    </project>\n`
      })
      xmlContent += `  </projects>\n`
    }

    // Tasks XML
    if (exportData.data.tasks.length > 0) {
      xmlContent += `  <tasks>\n`
      exportData.data.tasks.forEach((task: any) => {
        xmlContent += `    <task>\n`
        Object.entries(task).forEach(([key, value]) => {
          const safeValue = value === null || value === undefined ? '' : escapeXml(String(value))
          xmlContent += `      <${key}>${safeValue}</${key}>\n`
        })
        xmlContent += `    </task>\n`
      })
      xmlContent += `  </tasks>\n`
    }

    // Users XML
    if (exportData.data.users.length > 0) {
      xmlContent += `  <users>\n`
      exportData.data.users.forEach((user: any) => {
        xmlContent += `    <user>\n`
        Object.entries(user).forEach(([key, value]) => {
          const safeValue = value === null || value === undefined ? '' : escapeXml(String(value))
          xmlContent += `      <${key}>${safeValue}</${key}>\n`
        })
        xmlContent += `    </user>\n`
      })
      xmlContent += `  </users>\n`
    }

    // Files XML
    if (exportData.data.files.length > 0) {
      xmlContent += `  <files>\n`
      exportData.data.files.forEach((file: any) => {
        xmlContent += `    <file>\n`
        Object.entries(file).forEach(([key, value]) => {
          const safeValue = value === null || value === undefined ? '' : escapeXml(String(value))
          xmlContent += `      <${key}>${safeValue}</${key}>\n`
        })
        xmlContent += `    </file>\n`
      })
      xmlContent += `  </files>\n`
    }

    xmlContent += '</nexapro_export>'
    return xmlContent
  }

  // Helper function to escape XML special characters
  const escapeXml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  // Create backup
  const handleCreateBackup = async () => {
    if (!hasPermission("manage_settings")) {
      setSaveStatus({type: 'error', message: 'You don\'t have permission to create backup'})
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }

    setBackupLoading(true)
    try {
      const response = await fetch("http://localhost:8000/api/admin/settings/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSaveStatus({type: 'success', message: `Backup created successfully: ${data.data.filename}`})
          setTimeout(() => setSaveStatus(null), 3000)
          // Reload statistics to update last backup time
          loadStatistics()
        } else {
          throw new Error(data.message || 'Backup failed')
        }
      } else {
        throw new Error('Backup failed')
      }
    } catch (error) {
      setSaveStatus({type: 'error', message: 'Failed to create backup'})
      setTimeout(() => setSaveStatus(null), 3000)
    } finally {
      setBackupLoading(false)
    }
  }

  // Tab navigation
  const tabs = [
    { id: "general", name: "General", icon: User, permission: "manage_settings" },
    { id: "notifications", name: "Notifications", icon: Bell, permission: "manage_settings" },
    { id: "security", name: "Security", icon: Shield, permission: "manage_settings" },
    { id: "appearance", name: "Appearance", icon: Palette, permission: "manage_settings" },
    { id: "integrations", name: "Integrations", icon: Globe, permission: "manage_integrations" },
    { id: "data", name: "Data & Backup", icon: Database, permission: "manage_settings" },
  ]

  const filteredTabs = tabs.filter(tab => hasPermission(tab.permission))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading settings...</span>
      </div>
    )
  }

  if (!hasPermission("manage_settings")) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access settings.</p>
          <p className="text-sm text-gray-500 mt-2">
            Required: manage_settings | Your role: {currentUser?.role}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your application preferences and configurations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleResetSettings}
            className="text-gray-600 hover:text-gray-800"
          >
            Reset to Default
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Notification */}
      {saveStatus && (
        <div className={`mb-6 p-4 rounded-lg ${
          saveStatus.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {saveStatus.type === 'success' ? '✅' : '❌'}
            </span>
            {saveStatus.message}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 mb-8 overflow-x-auto">
        {filteredTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-green-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Icon size={16} />
              <span>{tab.name}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* General Settings */}
        {activeTab === "general" && (
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <Input
                  value={settings.companyName}
                  onChange={(e) => updateSetting("companyName", e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Email
                </label>
                <Input
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) => updateSetting("companyEmail", e.target.value)}
                  placeholder="Enter company email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => updateSetting("timezone", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => updateSetting("dateFormat", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting("language", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="en">English</option>
                  <option value="id">Bahasa Indonesia</option>
                </select>
              </div>
            </div>
          </Card>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive browser push notifications</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Task Reminders</h3>
                  <p className="text-sm text-gray-500">Get reminded about upcoming task deadlines</p>
                </div>
                <Switch
                  checked={settings.taskReminders}
                  onCheckedChange={(checked) => updateSetting("taskReminders", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Project Updates</h3>
                  <p className="text-sm text-gray-500">Receive updates about project changes</p>
                </div>
                <Switch
                  checked={settings.projectUpdates}
                  onCheckedChange={(checked) => updateSetting("projectUpdates", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Weekly Reports</h3>
                  <p className="text-sm text-gray-500">Receive weekly progress reports</p>
                </div>
                <Switch
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => updateSetting("weeklyReports", checked)}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
            </div>
            <div className="space-y-6">
              {/* Two-Factor Authentication */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
                  />
                </div>
                {settings.twoFactorAuth && (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-green-900 mb-2">Setup 2FA</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
                      </p>
                      <div className="bg-white p-4 rounded border text-center">
                        <div className="w-32 h-32 mx-auto bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">QR Code</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-green-900 mb-1">
                          Verification Code
                        </label>
                        <Input
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          className="text-center text-lg tracking-widest"
                        />
                      </div>
                      <Button className="w-full mt-3 bg-green-600 hover:bg-green-700">
                        Verify & Enable 2FA
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Session Management */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Session Management</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <Input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting("sessionTimeout", parseInt(e.target.value))}
                      min="5"
                      max="480"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Users will be automatically logged out after this period of inactivity
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Expiry (days)
                    </label>
                    <Input
                      type="number"
                      value={settings.passwordExpiry}
                      onChange={(e) => updateSetting("passwordExpiry", parseInt(e.target.value))}
                      min="30"
                      max="365"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Users will be prompted to change their password after this period
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Login Attempts
                    </label>
                    <Input
                      type="number"
                      value={settings.loginAttempts}
                      onChange={(e) => updateSetting("loginAttempts", parseInt(e.target.value))}
                      min="3"
                      max="10"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Account will be temporarily locked after exceeding this limit
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Actions */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Security Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="h-4 w-4 mr-2" />
                    Regenerate API Keys
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    View Login History
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <X className="h-4 w-4 mr-2" />
                    Revoke All Sessions
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Appearance Settings */}
        {activeTab === "appearance" && (
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Appearance Settings</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSetting("theme", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Collapsed Sidebar</h3>
                  <p className="text-sm text-gray-500">Start with sidebar collapsed</p>
                </div>
                <Switch
                  checked={settings.sidebarCollapsed}
                  onCheckedChange={(checked) => updateSetting("sidebarCollapsed", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Compact Mode</h3>
                  <p className="text-sm text-gray-500">Use compact spacing for better density</p>
                </div>
                <Switch
                  checked={settings.compactMode}
                  onCheckedChange={(checked) => updateSetting("compactMode", checked)}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Integration Settings */}
        {activeTab === "integrations" && (
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Integration Settings</h2>
            </div>
            <div className="space-y-6">
              {/* Slack Integration */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Slack Integration</h3>
                    <p className="text-sm text-gray-500">Connect with Slack for notifications</p>
                  </div>
                  <Switch
                    checked={settings.slackIntegration}
                    onCheckedChange={(checked) => updateSetting("slackIntegration", checked)}
                  />
                </div>
                {settings.slackIntegration && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slack Webhook URL
                      </label>
                      <Input
                        type="url"
                        placeholder="https://hooks.slack.com/services/..."
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Channel Name
                      </label>
                      <Input
                        placeholder="#general"
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* GitHub Integration */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">GitHub Integration</h3>
                    <p className="text-sm text-gray-500">Connect with GitHub for code tracking</p>
                  </div>
                  <Switch
                    checked={settings.githubIntegration}
                    onCheckedChange={(checked) => updateSetting("githubIntegration", checked)}
                  />
                </div>
                {settings.githubIntegration && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub Personal Access Token
                      </label>
                      <Input
                        type="password"
                        placeholder="ghp_..."
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Repository Name
                      </label>
                      <Input
                        placeholder="username/repository"
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Google Calendar Integration */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Google Calendar</h3>
                    <p className="text-sm text-gray-500">Sync tasks with Google Calendar</p>
                  </div>
                  <Switch
                    checked={settings.googleCalendar}
                    onCheckedChange={(checked) => updateSetting("googleCalendar", checked)}
                  />
                </div>
                {settings.googleCalendar && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Google Calendar ID
                      </label>
                      <Input
                        placeholder="example@gmail.com"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Key
                      </label>
                      <Input
                        type="password"
                        placeholder="AIza..."
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Jira Integration */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Jira Integration</h3>
                    <p className="text-sm text-gray-500">Connect with Jira for issue tracking</p>
                  </div>
                  <Switch
                    checked={settings.jiraIntegration}
                    onCheckedChange={(checked) => updateSetting("jiraIntegration", checked)}
                  />
                </div>
                {settings.jiraIntegration && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jira URL
                      </label>
                      <Input
                        type="url"
                        placeholder="https://your-domain.atlassian.net"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="your-email@domain.com"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Token
                      </label>
                      <Input
                        type="password"
                        placeholder="Your Jira API token"
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Test Connection Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button variant="outline" className="flex-1">
                  Test All Connections
                </Button>
                <Button variant="outline" className="flex-1">
                  Sync Now
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Data Settings */}
        {activeTab === "data" && (
          <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data & Backup Settings</h2>
            </div>
            
            {/* System Statistics */}
            {statistics && (
              <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{statistics.total_users}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{statistics.total_projects}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{statistics.total_tasks}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{statistics.active_projects}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Active Projects</div>
                  </div>
                </div>
                
                {/* Storage Usage */}
                {statistics.storage_used && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <span>Storage Usage</span>
                      <span>{statistics.storage_used.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${statistics.storage_used.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>{Math.round(statistics.storage_used.used / 1024 / 1024 / 1024)} GB used</span>
                      <span>{Math.round(statistics.storage_used.total / 1024 / 1024 / 1024)} GB total</span>
                    </div>
                  </div>
                )}
                
                {/* Last Backup */}
                {statistics.last_backup && (
                  <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Last Backup:</span> {new Date(statistics.last_backup).toLocaleString()}
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Auto Backup</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Automatically backup your data</p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => updateSetting("autoBackup", checked)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Backup Frequency
                </label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) => updateSetting("backupFrequency", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Retention (days)
                </label>
                <Input
                  type="number"
                  value={settings.dataRetention}
                  onChange={(e) => updateSetting("dataRetention", parseInt(e.target.value))}
                  min="30"
                  max="1095"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Export Format
                </label>
                <select
                  value={settings.exportFormat}
                  onChange={(e) => updateSetting("exportFormat", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="excel">Excel (XLSX)</option>
                  <option value="xml">XML</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-300 dark:border-gray-600 dark:text-white"
                  onClick={handleExportData}
                  disabled={exportLoading}
                >
                  {exportLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Export Data
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-300 dark:border-gray-600 dark:text-white"
                  onClick={handleCreateBackup}
                  disabled={backupLoading}
                >
                  {backupLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Backup Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
} 