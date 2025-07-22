"use client"

import { useState, useEffect } from "react"
import { Bell, X, CheckCircle, AlertCircle, Info, XCircle } from "lucide-react"

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  taskReminders: boolean
  projectUpdates: boolean
  weeklyReports: boolean
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    projectUpdates: true,
    weeklyReports: false
  })

  // Load notification settings
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem("nexapro_settings")
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings({
          emailNotifications: parsedSettings.emailNotifications ?? true,
          pushNotifications: parsedSettings.pushNotifications ?? true,
          taskReminders: parsedSettings.taskReminders ?? true,
          projectUpdates: parsedSettings.projectUpdates ?? true,
          weeklyReports: parsedSettings.weeklyReports ?? false
        })
      }
    }
    
    loadSettings()
    
    // Listen for settings changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nexapro_settings') {
        loadSettings()
      }
    }
    
    // Listen for custom settings change events
    const handleSettingsChange = (e: CustomEvent) => {
      if (e.detail.key === 'emailNotifications' || 
          e.detail.key === 'pushNotifications' || 
          e.detail.key === 'taskReminders' || 
          e.detail.key === 'projectUpdates' || 
          e.detail.key === 'weeklyReports') {
        loadSettings()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('settingsChanged', handleSettingsChange as EventListener)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('settingsChanged', handleSettingsChange as EventListener)
    }
  }, [])

  // Load notifications from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem("nexapro_notifications")
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
  }, [])

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem("nexapro_notifications", JSON.stringify(notifications))
  }, [notifications])

  // Add notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev])
    
    // Show browser notification if enabled
    if (settings.pushNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/nexapro-logo.png'
      })
    }
  }

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  // Remove notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  // Clear all notifications
  const clearAll = () => {
    setNotifications([])
  }

  // Request notification permission
  const requestPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length

  // Get icon for notification type
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  // Get notification type styles
  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50'
      case 'error':
        return 'border-l-red-500 bg-red-50'
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'info':
        return 'border-l-green-500 bg-green-50'
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-green-600 hover:text-blue-800"
                >
                  Mark all read
                </button>
                <button
                  onClick={clearAll}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Notification Settings Status */}
            <div className="mt-2 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Push: {settings.pushNotifications ? 'On' : 'Off'}</span>
                <span>Email: {settings.emailNotifications ? 'On' : 'Off'}</span>
                {!settings.pushNotifications && (
                  <button
                    onClick={requestPermission}
                    className="text-green-600 hover:text-blue-800"
                  >
                    Enable
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 ${getTypeStyles(notification.type)} ${
                      !notification.read ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {notification.timestamp.toLocaleString()}
                        </p>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-green-600 hover:text-blue-800 mt-1"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
