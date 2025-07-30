"use client"

import { useState, useEffect, useCallback } from "react"

const API_BASE_URL = "https://nexapro.web.id/api"

interface NotificationItem {
  id: number
  user: string
  avatar: string
  color: string
  action: string
  target: string
  project?: string
  timestamp: string
  formatted_time: string
  type: "task" | "project" | "comment" | "file" | "team" | "system"
  details?: string
  metadata?: {
    oldValue?: string
    newValue?: string
    fileSize?: string
    assignee?: string
  }
  read: boolean
  priority: "low" | "medium" | "high"
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  taskUpdates: boolean
  projectUpdates: boolean
  teamUpdates: boolean
  systemUpdates: boolean
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    taskUpdates: true,
    projectUpdates: true,
    teamUpdates: true,
    systemUpdates: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch notifications from activity logs
  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/activity-logs`, {
        headers: {
          Accept: "application/json",
        },
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        // Convert activities to notifications with read status and priority
        const convertedNotifications: NotificationItem[] = result.data.map((activity: any) => ({
          ...activity,
          read: Math.random() > 0.3, // Simulate read status
          priority: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low"
        }))
        
        setNotifications(convertedNotifications)
        console.log("✅ Notifications fetched successfully")
      } else {
        throw new Error(result.message || "Failed to fetch notifications")
      }
    } catch (err) {
      console.error("❌ Error fetching notifications:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch notifications")
    } finally {
      setLoading(false)
    }
  }, [])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: number) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    )
  }, [])

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    setNotifications([])
  }, [])

  // Update notification settings
  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
    
    // Here you could also save settings to backend
    try {
      await fetch(`${API_BASE_URL}/notification-settings`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify(newSettings),
      })
    } catch (err) {
      console.error("❌ Error saving notification settings:", err)
    }
  }, [])

  // Get notification statistics
  const getNotificationStats = useCallback(() => {
    const total = notifications.length
    const unread = notifications.filter(n => !n.read).length
    const highPriority = notifications.filter(n => n.priority === "high").length
    const read = total - unread

    return {
      total,
      unread,
      highPriority,
      read
    }
  }, [notifications])

  // Filter notifications
  const filterNotifications = useCallback((
    filters: {
      type?: string
      priority?: string
      read?: string
      search?: string
    }
  ) => {
    return notifications.filter((notification) => {
      const matchesSearch = !filters.search || 
        notification.user.toLowerCase().includes(filters.search.toLowerCase()) ||
        notification.target.toLowerCase().includes(filters.search.toLowerCase()) ||
        notification.action.toLowerCase().includes(filters.search.toLowerCase()) ||
        (notification.project && notification.project.toLowerCase().includes(filters.search.toLowerCase()))

      const matchesType = !filters.type || filters.type === "all" || notification.type === filters.type
      const matchesPriority = !filters.priority || filters.priority === "all" || notification.priority === filters.priority
      const matchesRead = !filters.read || filters.read === "all" || 
        (filters.read === "read" && notification.read) || 
        (filters.read === "unread" && !notification.read)

      return matchesSearch && matchesType && matchesPriority && matchesRead
    })
  }, [notifications])

  // Initialize notifications
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Real-time updates
  useEffect(() => {
    const handleTaskUpdated = (event: CustomEvent) => {
      console.log("🔄 Real-time task update received in notifications:", event.detail)
      fetchNotifications()
    }

    const handleProjectUpdated = (event: CustomEvent) => {
      console.log("🔄 Real-time project update received in notifications:", event.detail)
      fetchNotifications()
    }

    const handleFileUploaded = (event: CustomEvent) => {
      console.log("🔄 Real-time file upload received in notifications:", event.detail)
      fetchNotifications()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("taskUpdated", handleTaskUpdated as EventListener)
      window.addEventListener("projectUpdated", handleProjectUpdated as EventListener)
      window.addEventListener("fileUploaded", handleFileUploaded as EventListener)
      
      return () => {
        window.removeEventListener("taskUpdated", handleTaskUpdated as EventListener)
        window.removeEventListener("projectUpdated", handleProjectUpdated as EventListener)
        window.removeEventListener("fileUploaded", handleFileUploaded as EventListener)
      }
    }
  }, [fetchNotifications])

  return {
    notifications,
    settings,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    getNotificationStats,
    filterNotifications,
  }
} 