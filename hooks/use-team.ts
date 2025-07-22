"use client"

import { useState, useEffect } from "react"

interface TeamMember {
  id: number
  name: string
  email: string
  role: string
  department: string
  avatar: string
  color: string
  status: "online" | "away" | "offline"
  joinDate: string
  lastActive: string
  projects: string[]
  skills: string[]
  tasksCompleted: number
  tasksInProgress: number
  performance: number
  bio?: string
  phone?: string
}

interface Department {
  name: string
  count: number
  color: string
}

interface TeamStats {
  totalMembers: number
  onlineMembers: number
  departments: number
  avgPerformance: number
  statusDistribution: {
    online: number
    away: number
    offline: number
  }
}

interface Activity {
  id: number
  user: string
  action: string
  target: string
  project: string
  time: string
  avatar: string
  color: string
}

export function useTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(`${API_BASE}/team`)
      const data = await response.json()

      if (data.success) {
        setTeamMembers(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch team members")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch team members")
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_BASE}/team/departments`)
      const data = await response.json()

      if (data.success) {
        setDepartments(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch departments")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch departments")
    }
  }

  const fetchTeamStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/team/stats`)
      const data = await response.json()

      if (data.success) {
        setTeamStats(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch team stats")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch team stats")
    }
  }

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_BASE}/team/activity`)
      const data = await response.json()

      if (data.success) {
        setActivities(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch activities")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch activities")
    }
  }

  const inviteTeamMember = async (memberData: {
    name: string
    email: string
    role: string
    department: string
    skills?: string[]
    bio?: string
    phone?: string
  }) => {
    try {
      const response = await fetch(`${API_BASE}/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      })

      const data = await response.json()

      if (data.success) {
        await fetchTeamMembers()
        await fetchTeamStats()
        return { success: true, data: data.data }
      } else {
        throw new Error(data.message || "Failed to invite team member")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to invite team member"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const updateTeamMember = async (id: number, memberData: Partial<TeamMember>) => {
    try {
      const response = await fetch(`${API_BASE}/team/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      })

      const data = await response.json()

      if (data.success) {
        await fetchTeamMembers()
        await fetchTeamStats()
        return { success: true, data: data.data }
      } else {
        throw new Error(data.message || "Failed to update team member")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update team member"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const removeTeamMember = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/team/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        await fetchTeamMembers()
        await fetchTeamStats()
        return { success: true }
      } else {
        throw new Error(data.message || "Failed to remove team member")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove team member"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const getTeamMember = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/team/${id}`)
      const data = await response.json()

      if (data.success) {
        return { success: true, data: data.data }
      } else {
        throw new Error(data.message || "Failed to fetch team member")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch team member"
      return { success: false, error: errorMessage }
    }
  }

  const refreshData = async () => {
    setLoading(true)
    setError(null)

    try {
      await Promise.all([fetchTeamMembers(), fetchDepartments(), fetchTeamStats(), fetchActivities()])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  return {
    teamMembers,
    departments,
    teamStats,
    activities,
    loading,
    error,
    inviteTeamMember,
    updateTeamMember,
    removeTeamMember,
    getTeamMember,
    refreshData,
  }
}
