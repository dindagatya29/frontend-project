"use client"

import { useState, useEffect, useCallback } from "react"

const API_BASE_URL = "https://nexapro.web.id/api"

interface Task {
  id: number
  project_id: number
  title: string
  description?: string
  status: "Todo" | "In Progress" | "Completed"
  priority: "Low" | "Medium" | "High"
  assignee?: string
  assignee_id?: number
  due_date?: string
  progress: number
  created_at: string
  updated_at: string
  task_number?: string
}

interface User {
  id: number
  name: string
  email: string
}

export function useTasksEnhanced() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🚀 Fetching tasks from API...")

      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "GET",
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
      console.log("✅ Tasks API Response:", result)

      if (result.success && Array.isArray(result.data)) {
        setTasks(result.data)
        console.log(`✅ Loaded ${result.data.length} tasks from API`)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error("❌ Error fetching tasks:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch tasks")
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      console.log("🚀 Fetching users from API...")

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
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
      console.log("✅ Users API Response:", result)

      if (result.success && Array.isArray(result.data)) {
        setUsers(result.data)
        console.log(`✅ Loaded ${result.data.length} users from API`)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error("❌ Error fetching users:", err)
      setUsers([])
    }
  }, [])

  // Create task with proper project_id handling
  const createTask = useCallback(
    async (taskData: {
      title: string
      description: string
      project_id: number
      assignee_id: number
      status: "Todo" | "In Progress" | "Completed"
      priority: "Low" | "Medium" | "High"
      due_date: string
      progress: number
      tags: string[]
    }) => {
      try {
        console.log("🚀 Creating task with data:", taskData)

        // Validate required fields
        if (!taskData.title?.trim()) {
          throw new Error("Task title is required")
        }
        if (!taskData.project_id || isNaN(taskData.project_id)) {
          throw new Error("Valid project ID is required")
        }
        if (!taskData.assignee_id || isNaN(taskData.assignee_id)) {
          throw new Error("Valid assignee ID is required")
        }

        const dataToSend = {
          title: taskData.title.trim(),
          description: taskData.description?.trim() || "",
          project_id: Number(taskData.project_id), // Ensure it's a number
          assignee_id: Number(taskData.assignee_id), // Ensure it's a number
          status: taskData.status,
          priority: taskData.priority,
          due_date: taskData.due_date,
          progress: Number(taskData.progress) || 0,
          tags: taskData.tags || [],
        }

        console.log("📤 Sending task data to API:", dataToSend)

        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          body: JSON.stringify(dataToSend),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("❌ API Error Response:", errorText)
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        console.log("✅ Task creation response:", result)

        if (result.success && result.data) {
          const newTask = result.data

          // Verify the task has the correct project_id
          if (newTask.project_id !== taskData.project_id) {
            console.warn("⚠️ Task created with different project_id:", {
              expected: taskData.project_id,
              actual: newTask.project_id,
            })
          }

          // Update local state
          setTasks((prev) => [newTask, ...prev])

          // Trigger real-time update
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("taskUpdated", {
                detail: {
                  taskId: newTask.id,
                  projectId: newTask.project_id,
                  action: "created",
                  task: newTask,
                },
              }),
            )
          }

          console.log("✅ Task created successfully:", newTask)
          return newTask
        } else {
          throw new Error(result.message || "Failed to create task")
        }
      } catch (err) {
        console.error("❌ Error creating task:", err)
        throw new Error(err instanceof Error ? err.message : "Failed to create task")
      }
    },
    [],
  )

  // Update task
  const updateTask = useCallback(async (taskId: number, updates: Partial<Task>) => {
    try {
      console.log("🔄 Updating task:", taskId, updates)

      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        const updatedTask = result.data

        // Update local state
        setTasks((prev) => prev.map((task) => (task.id === taskId ? updatedTask : task)))

        // Trigger real-time update
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("taskUpdated", {
              detail: {
                taskId: updatedTask.id,
                projectId: updatedTask.project_id,
                action: "updated",
                task: updatedTask,
              },
            }),
          )
        }

        console.log("✅ Task updated successfully:", updatedTask)
        return updatedTask
      } else {
        throw new Error(result.message || "Failed to update task")
      }
    } catch (err) {
      console.error("❌ Error updating task:", err)
      throw new Error(err instanceof Error ? err.message : "Failed to update task")
    }
  }, [])

  // Get tasks for a specific project
  const getProjectTasks = useCallback(
    (projectId: number) => {
      const projectTasks = tasks.filter((t) => t.project_id === projectId)
      console.log(`🔍 Getting tasks for project ${projectId}:`, {
        total: projectTasks.length,
        tasks: projectTasks.map((t) => ({ id: t.id, title: t.title, status: t.status })),
      })
      return projectTasks
    },
    [tasks],
  )

  // Initialize data
  useEffect(() => {
    fetchTasks()
    fetchUsers()
  }, [fetchTasks, fetchUsers])

  return {
    tasks,
    users,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    getProjectTasks,
  }
}
