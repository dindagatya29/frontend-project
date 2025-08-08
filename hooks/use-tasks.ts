"use client"

import { useState, useEffect, useCallback } from "react"

const API_BASE_URL = "https://nexapro.web.id/api"

interface Task {
  project_name: string // This is the correct property
  action: any
  id: number
  title: string
  description?: string
  project: string
  project_id: number
  assignee: string
  assignee_id?: number
  status: "Todo" | "In Progress" | "Completed"
  priority: "Low" | "Medium" | "High"
  todo_list?: { text: string; checked: boolean }[] // ✅ Tambahkan ini


  
  dueDate?: string
  due_date?: string
  progress: number
  tags: string[]
  created_at: string
  updated_at: string
}

interface TaskStats {
  total: number
  todo: number
  in_progress: number
  completed: number
  high_priority: number
  medium_priority: number
  low_priority: number
  overdue: number
}

interface Project {
  id: number
  name: string
}

interface User {
  id: number
  name: string
  email: string
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])

  // Calculate stats locally from tasks data
  const calculateStats = useCallback((tasksData: Task[]): TaskStats => {
    const now = new Date()

    const stats = {
      total: tasksData.length,
      todo: tasksData.filter((t) => t.status === "Todo").length,
      in_progress: tasksData.filter((t) => t.status === "In Progress").length,
      completed: tasksData.filter((t) => t.status === "Completed").length,
      high_priority: tasksData.filter((t) => t.priority === "High").length,
      medium_priority: tasksData.filter((t) => t.priority === "Medium").length,
      low_priority: tasksData.filter((t) => t.priority === "Low").length,
      overdue: tasksData.filter((t) => {
        const dueDate = t.due_date || t.dueDate
        return dueDate && new Date(dueDate) < now && t.status !== "Completed"
      }).length,
    }

    console.log("📊 Calculated Task Stats:", stats)
    return stats
  }, [])

  // Auto-update task status based on progress (bidirectional sync)
  const updateTaskStatusBasedOnProgress = useCallback((task: Task): Task => {
    let newStatus = task.status
    let newProgress = task.progress
    
    // Update status based on progress
    if (task.progress >= 100) {
      newStatus = "Completed"
    } else if (task.progress > 0) {
      newStatus = "In Progress"
    } else if (task.progress === 0) {
      newStatus = "Todo"
    }
    
    // Update progress based on status (bidirectional sync)
    if (task.status === "Completed" && task.progress < 100) {
      newProgress = 100
      console.log(`🔄 Auto-updating task ${task.title} progress from ${task.progress}% to 100% (status: Completed)`)
    }
    
    // Only update if something changed
    if (newStatus !== task.status || newProgress !== task.progress) {
      console.log(`🔄 Auto-updating task ${task.title}: status ${task.status}→${newStatus}, progress ${task.progress}%→${newProgress}%`)
      return { 
        ...task, 
        status: newStatus as Task["status"],
        progress: newProgress
      }
    }
    
    return task
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

  // Fetch all data in parallel
  const fetchAllData = useCallback(
    async (
      filters: {
        status?: string
        priority?: string
        search?: string
      } = {},
    ) => {
      try {
        setLoading(true)
        setError(null)

        // Build tasks URL with filters
        const queryParams = new URLSearchParams()
        if (filters.status && filters.status !== "All") {
          queryParams.append("status", filters.status)
        }
        if (filters.priority && filters.priority !== "All") {
          queryParams.append("priority", filters.priority)
        }
        if (filters.search) {
          queryParams.append("search", filters.search)
        }

        const tasksUrl = `${API_BASE_URL}/tasks${queryParams.toString() ? "?" + queryParams.toString() : ""}`

        console.log("🚀 Fetching all data...")

        // Fetch all data in parallel
        const [tasksResponse, projectsResponse, usersResponse] = await Promise.all([
          fetch(tasksUrl, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            mode: "cors",
          }).catch(() => ({ ok: false, statusText: "Tasks API unavailable" })),

          fetch(`${API_BASE_URL}/projects`, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            mode: "cors",
          }).catch(() => ({ ok: false, statusText: "Projects API unavailable" })),

          fetch(`${API_BASE_URL}/users`, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            mode: "cors",
          }).catch(() => ({ ok: false, statusText: "Users API unavailable" })),
        ])

        // Handle tasks response
        let tasksData: Task[] = []
        if (tasksResponse.ok && typeof (tasksResponse as Response).json === "function") {
          const tasksResult = await (tasksResponse as Response).json()
          if (tasksResult.success && Array.isArray(tasksResult.data)) {
            tasksData = tasksResult.data.map((task: any) => {
              const normalizedTask: Task = {
                ...task,
                tags: Array.isArray(task.tags)
                  ? task.tags
                  : typeof task.tags === "string"
                    ? task.tags.split(",").filter(Boolean)
                    : [],
                dueDate: task.due_date || task.dueDate,
                due_date: task.due_date || task.dueDate,
              }
              
              // Auto-update status based on progress
              return updateTaskStatusBasedOnProgress(normalizedTask)
            })
          }
          console.log("✅ Tasks loaded:", tasksData.length)
        } else {
          console.warn("⚠️ Tasks API failed:", tasksResponse.statusText)
        }

        // Handle projects response
        let projectsData: Project[] = []
        if (projectsResponse.ok && typeof (projectsResponse as Response).json === "function") {
          const projectsResult = await (projectsResponse as Response).json()
          if (projectsResult.success && Array.isArray(projectsResult.data)) {
            projectsData = projectsResult.data
          }
          console.log("✅ Projects loaded:", projectsData.length)
        } else {
          console.warn("⚠️ Projects API failed:", projectsResponse.statusText)
        }

        // Handle users response
        let usersData: User[] = []
        if (
          usersResponse.ok &&
          typeof (usersResponse as Response).json === "function"
        ) {
          const usersResult = await (usersResponse as Response).json()
          if (usersResult.success && Array.isArray(usersResult.data)) {
            usersData = usersResult.data
          }
          console.log("✅ Users loaded:", usersData.length)
        } else {
          console.warn("⚠️ Users API failed:", usersResponse.statusText)
        }

        // Update state
        setTasks(tasksData)
        setProjects(projectsData)
        setUsers(usersData)

        // Calculate and set stats
        const calculatedStats = calculateStats(tasksData)
        setStats(calculatedStats)

        setError(null)

        // Only set error if all APIs failed
        if (!tasksResponse.ok && !projectsResponse.ok && !usersResponse.ok) {
          throw new Error("All API endpoints are unavailable. Please check your Laravel server.")
        }
      } catch (err) {
        console.error("❌ Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch data")

        // Set empty stats on error
        setStats({
          total: 0,
          todo: 0,
          in_progress: 0,
          completed: 0,
          high_priority: 0,
          medium_priority: 0,
          low_priority: 0,
          overdue: 0,
        })
      } finally {
        setLoading(false)
      }
    },
    [calculateStats, updateTaskStatusBasedOnProgress],
  )

  const createTask = async (taskData: {
    title: string
    description?: string
    project_id: number
    assignee_id?: number
    status?: string
    priority?: string
    due_date?: string
    progress?: number
    tags?: string[]
    todo_list?: { text: string; checked: boolean }[]; // ✅ Tambahkan ini
  }) => {
    try {
      if (!taskData.title || taskData.title.trim() === "") {
        throw new Error("Task title is required")
      }

      if (!taskData.project_id) {
        throw new Error("Project is required")
      }

      if (typeof taskData.progress === 'number') {
        if (taskData.progress === 100) taskData.status = 'Completed';
        else if (taskData.progress > 0) taskData.status = 'In Progress';
      }

      const dataToSend = {
        title: taskData.title.trim(),
        description: taskData.description || "",
        project_id: taskData.project_id,
        assignee_id: taskData.assignee_id || null,
        status: taskData.status || "Todo",
        priority: taskData.priority || "Medium",
        due_date: taskData.due_date || null,
        progress: taskData.progress || 0,
        tags: taskData.tags || [],
      }

      console.log("➕ Creating task with data:", dataToSend)

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
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        const newTask = {
          ...result.data,
          tags: Array.isArray(result.data.tags) ? result.data.tags : [],
          dueDate: result.data.due_date || result.data.dueDate,
        }

        // Update local state
        setTasks((prev) => {
          const updated = [newTask, ...prev]
          // Recalculate stats
          const newStats = calculateStats(updated)
          setStats(newStats)
          return updated
        })

        // Log activity
        await logActivity(
          "created task",
          newTask.title,
          "task",
          {
            project: projects.find(p => p.id === newTask.project_id)?.name,
            details: `Task "${newTask.title}" was created`,
            metadata: {
              assignee: users.find(u => u.id === newTask.assignee_id)?.name,
              priority: newTask.priority,
              status: newTask.status
            }
          }
        )

        // Trigger real-time update events
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("taskUpdated", {
            detail: { taskId: newTask.id, task: newTask }
          }))
          window.dispatchEvent(new CustomEvent("projectsNeedRefresh"))
        }

        console.log("✅ Task created successfully")
        return newTask
      } else {
        throw new Error(result.message || "Failed to create task")
      }
    } catch (err) {
      console.error("❌ Error creating task:", err)
      throw new Error(err instanceof Error ? err.message : "Failed to create task")
    }
  }

  const updateTask = async (
    id: number,
    updates: Partial<{
      title: string
      description: string
      project_id: number
      assignee_id: number
      status: string
      priority: string
      due_date: string
      progress: number
      tags: string[]
    }>,
  ) => {
    try {
      console.log("✏️ Updating task:", id, updates)

      // Apply bidirectional sync logic
      let syncUpdates = { ...updates }
      
      // Auto-update status when progress is changed
      if (typeof updates.progress === 'number') {
        if (updates.progress >= 100) {
          syncUpdates.status = 'Completed'
        } else if (updates.progress > 0) {
          syncUpdates.status = 'In Progress'
        } else if (updates.progress === 0) {
          syncUpdates.status = 'Todo'
        }
      }
      
      // Auto-update progress when status is changed to Completed
      if (updates.status === 'Completed' && (typeof updates.progress !== 'number' || updates.progress < 100)) {
        syncUpdates.progress = 100
        console.log(`🔄 Auto-setting progress to 100% for task (status: Completed)`)
      }

      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify(syncUpdates),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to update task")
      }

      const result = await response.json()

      if (result.success && result.data) {
        const updatedTask = updateTaskStatusBasedOnProgress({
          ...result.data,
          tags: Array.isArray(result.data.tags) ? result.data.tags : [],
          dueDate: result.data.due_date || result.data.dueDate,
        })
        
        setTasks((prev) => {
          const updated = prev.map((task) =>
            task.id === id ? updatedTask : task
          )
          // Recalculate stats
          const newStats = calculateStats(updated)
          setStats(newStats)
          return updated
        })

        // Log activity
        await logActivity(
          "updated task",
          updatedTask.title,
          "task",
          {
            project: projects.find(p => p.id === updatedTask.project_id)?.name,
            details: `Task "${updatedTask.title}" was updated`,
            metadata: {
              oldValue: tasks.find(t => t.id === id)?.status,
              newValue: updatedTask.status,
              assignee: users.find(u => u.id === updatedTask.assignee_id)?.name,
              priority: updatedTask.priority
            }
          }
        )

        // Trigger real-time update events
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("taskUpdated", {
            detail: { taskId: id, task: updatedTask }
          }))
          window.dispatchEvent(new CustomEvent("projectsNeedRefresh"))
        }

        console.log("✅ Task updated successfully")
        return updatedTask
      } else {
        throw new Error(result.message || "Failed to update task")
      }
    } catch (err) {
      console.error("❌ Error updating task:", err)
      throw new Error(err instanceof Error ? err.message : "Failed to update task")
    }
  }

  const deleteTask = async (id: number) => {
    try {
      console.log("🗑️ Deleting task:", id)

      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
        mode: "cors",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to delete task")
      }

      const result = await response.json()

      if (result.success) {
        setTasks((prev) => {
          const updated = prev.filter((task) => task.id !== id)
          // Recalculate stats
          const newStats = calculateStats(updated)
          setStats(newStats)
          return updated
        })

        // Log activity
        const deletedTask = tasks.find(t => t.id === id)
        if (deletedTask) {
          await logActivity(
            "deleted task",
            deletedTask.title,
            "task",
            {
              project: projects.find(p => p.id === deletedTask.project_id)?.name,
              details: `Task "${deletedTask.title}" was deleted`,
              metadata: {
                assignee: users.find(u => u.id === deletedTask.assignee_id)?.name,
                priority: deletedTask.priority,
                status: deletedTask.status
              }
            }
          )
        }

        // Trigger real-time update events
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("taskUpdated", {
            detail: { taskId: id, action: "deleted" }
          }))
          window.dispatchEvent(new CustomEvent("projectsNeedRefresh"))
        }

        console.log("✅ Task deleted successfully")
      } else {
        throw new Error(result.message || "Failed to delete task")
      }
    } catch (err) {
      console.error("❌ Error deleting task:", err)
      throw new Error(err instanceof Error ? err.message : "Failed to delete task")
    }
  }

  useEffect(() => {
    console.log("🔄 Component mounted, fetching initial data...")
    fetchAllData()

    // Listen for global refresh event
    if (typeof window !== 'undefined') {
      const handler = () => fetchAllData();
      window.addEventListener('tasksNeedRefresh', handler);
      return () => window.removeEventListener('tasksNeedRefresh', handler);
    }
  }, [fetchAllData])

  return {
    tasks,
    loading,
    error,
    stats,
    projects,
    users,
    refetch: fetchAllData,
    createTask,
    updateTask,
    deleteTask,
  }
}
