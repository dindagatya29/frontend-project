"use client"

import { useState, useEffect, useCallback } from "react"

const API_BASE_URL = "https://nexapro.web.id/api"

interface ActivityLog {
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
}

interface ActivityStats {
  total: number
  today: number
  this_week: number
  by_type: {
    task: number
    project: number
    comment: number
    file: number
    team: number
    system: number
  }
  top_users: Array<{
    user_id: number
    user_name: string
    activity_count: number
  }>
}

interface ActivityFilters {
  type?: string
  user_id?: number
  start_date?: string
  end_date?: string
  search?: string
  per_page?: number
  page?: number
}

export function useActivityLogs() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  })

  // Fetch activity logs with filters
  const fetchActivities = useCallback(async (filters: ActivityFilters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })

      const url = `${API_BASE_URL}/activity-logs${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      
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
        setActivities(result.data)
        setPagination(result.pagination)
      } else {
        throw new Error(result.message || "Failed to fetch activities")
      }
    } catch (err) {
      console.error("❌ Error fetching activities:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch activities")
      setActivities([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch activity statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/activity-logs/stats`, {
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
      console.error("❌ Error fetching activity stats:", err)
      setStats(null)
    }
  }, [])

  // Fetch recent activities
  const fetchRecentActivities = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/activity-logs/recent`, {
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
        setActivities(result.data)
      } else {
        throw new Error(result.message || "Failed to fetch recent activities")
      }
    } catch (err) {
      console.error("❌ Error fetching recent activities:", err)
      setActivities([])
    }
  }, [])

  // Create activity log entry
  const createActivityLog = useCallback(async (activityData: {
    action: string
    target: string
    project?: string
    type: "task" | "project" | "comment" | "file" | "team" | "system"
    details?: string
    metadata?: any
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activity-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify(activityData),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        console.log("✅ Activity log created successfully")
        return result.data
      } else {
        throw new Error(result.message || "Failed to create activity log")
      }
    } catch (err) {
      console.error("❌ Error creating activity log:", err)
      throw err
    }
  }, [])

  // Clear all activity logs (no time restriction)
  const clearAllLogs = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/activity-logs/clear-all`, {
        method: 'DELETE',
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
        console.log(`✅ Cleared all activity logs`)
        // Refetch activities after clearing
        fetchActivities()
        fetchStats()
        return result.deleted_count
      } else {
        throw new Error(result.message || "Failed to clear activity logs")
      }
    } catch (err) {
      console.error("❌ Error clearing activity logs:", err)
      throw err
    }
  }, [fetchActivities, fetchStats])

  // Clear old activity logs (with time restriction - kept for backward compatibility)
  const clearOldLogs = useCallback(async (days: number = 30) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activity-logs/clear`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ days }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        console.log(`✅ Cleared ${result.deleted_count} old activity logs`)
        // Refetch activities after clearing
        fetchActivities()
        fetchStats()
        return result.deleted_count
      } else {
        throw new Error(result.message || "Failed to clear activity logs")
      }
    } catch (err) {
      console.error("❌ Error clearing activity logs:", err)
      throw err
    }
  }, [fetchActivities, fetchStats])

  // Helper function to log common activities
  const logActivity = useCallback(async (
    action: string,
    target: string,
    type: "task" | "project" | "comment" | "file" | "team" | "system",
    options?: {
      project?: string
      details?: string
      metadata?: any
    }
  ) => {
    try {
      await createActivityLog({
        action,
        target,
        type,
        project: options?.project,
        details: options?.details,
        metadata: options?.metadata
      })
    } catch (err) {
      console.error("❌ Failed to log activity:", err)
    }
  }, [createActivityLog])

  // Initialize data
  useEffect(() => {
    fetchActivities()
    fetchStats()
  }, [fetchActivities, fetchStats])

  return {
    activities,
    stats,
    loading,
    error,
    pagination,
    fetchActivities,
    fetchStats,
    fetchRecentActivities,
    createActivityLog,
    clearAllLogs,
    clearOldLogs,
    logActivity,
  }
} 