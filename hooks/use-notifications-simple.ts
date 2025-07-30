"use client"

import { useState, useEffect, useCallback } from "react"

const API_BASE_URL = "https://nexapro.web.id/api"

interface Notification {
  id: number
  user: string
  action: string
  target: string
  type: "task" | "project" | "file" | "team" | "system"
  priority: "high" | "medium" | "low"
  read: boolean
  time: string
  details?: string
}

interface NotificationStats {
  total: number
  unread: number
  highPriority: number
  read: number
}

interface NotificationSettings {
  email: boolean
  push: boolean
  tasks: boolean
  projects: boolean
  files: boolean
  team: boolean
}

export function useNotificationsSimple() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<NotificationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch notifications
  const fetchNotifications = useCallback(async (filters: {
    type?: string
    priority?: string
    read?: string
    search?: string
  } = {}) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value)
        }
      })

      const url = `${API_BASE_URL}/notifications${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        setNotifications(result.data)
      } else {
        throw new Error(result.message || "Failed to fetch notifications")
      }
    } catch (err) {
      console.error("❌ Error fetching notifications:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch notifications")
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/stats`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        setStats(result.data)
      } else {
        throw new Error(result.message || "Failed to fetch stats")
      }
    } catch (err) {
      console.error("❌ Error fetching notification stats:", err)
      setStats(null)
    }
  }, [])

  // Mark as read
  const markAsRead = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark-read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
        console.log("✅ Notification marked as read")
      } else {
        throw new Error(result.message || "Failed to mark notification as read")
      }
    } catch (err) {
      console.error("❌ Error marking notification as read:", err)
    }
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        console.log("✅ All notifications marked as read")
      } else {
        throw new Error(result.message || "Failed to mark all notifications as read")
      }
    } catch (err) {
      console.error("❌ Error marking all notifications as read:", err)
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        setNotifications(prev => prev.filter(n => n.id !== id))
        console.log("✅ Notification deleted")
      } else {
        throw new Error(result.message || "Failed to delete notification")
      }
    } catch (err) {
      console.error("❌ Error deleting notification:", err)
    }
  }, [])

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/clear-all`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        setNotifications([])
        console.log("✅ All notifications cleared")
      } else {
        throw new Error(result.message || "Failed to clear notifications")
      }
    } catch (err) {
      console.error("❌ Error clearing notifications:", err)
    }
  }, [])

  // Update settings
  const updateSettings = useCallback(async (settings: Partial<NotificationSettings>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        console.log("✅ Notification settings updated")
      } else {
        throw new Error(result.message || "Failed to update settings")
      }
    } catch (err) {
      console.error("❌ Error updating notification settings:", err)
    }
  }, [])

  // Initialize
  useEffect(() => {
    fetchNotifications()
    fetchStats()
  }, [fetchNotifications, fetchStats])

  return {
    notifications,
    stats,
    loading,
    error,
    fetchNotifications,
    fetchStats,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
  }
} 