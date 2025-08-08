"use client"

import { useState, useEffect, useCallback } from "react"

const API_BASE_URL = "https://nexapro.web.id/api"

export interface Project {
  team_ids: never[]
  id: number
  name: string
  description?: string
  status: "Planning" | "In Progress" | "Completed" | "On Hold"
  progress: number
  due_date?: string
  priority: "Low" | "Medium" | "High"
  created_at: string
  updated_at: string
  team: any[]
  tasks: {
    total: number
    completed: number
  }
}

interface ProjectStats {
  total: number
  planning: number
  in_progress: number
  completed: number
  on_hold: number
  high_priority: number
  medium_priority: number
  low_priority: number
}

interface Task {
  id: number
  project_id: number
  title: string
  description?: string
  status: "Todo" | "In Progress" | "Completed" | "Review" | "On hold" | "Closed" | "Cancelled"
  priority: "Low" | "Medium" | "High"
  assignee?: string
  due_date?: string
  progress: number
  created_at: string
  updated_at: string
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<ProjectStats | null>(null)

  // Calculate stats from projects data locally
  const calculateStats = useCallback((projectsData: Project[]): ProjectStats => {
    const stats = {
      total: projectsData.length,
      planning: projectsData.filter((p: Project) => p.status === "Planning").length,
      in_progress: projectsData.filter((p: Project) => p.status === "In Progress").length,
      completed: projectsData.filter((p: Project) => p.status === "Completed").length,
      on_hold: projectsData.filter((p: Project) => p.status === "On Hold").length,
      high_priority: projectsData.filter((p: Project) => p.priority === "High").length,
      medium_priority: projectsData.filter((p: Project) => p.priority === "Medium").length,
      low_priority: projectsData.filter((p: Project) => p.priority === "Low").length,
    }
    console.log("📊 Calculated Project Stats:", stats)
    return stats
  }, [])

  // Auto-update project status based on progress
  const updateProjectStatusBasedOnProgress = useCallback((project: Project): Project => {
    let newStatus = project.status
    let newProgress = project.progress
    // Update status based on progress
    if (project.progress >= 100) {
      newStatus = "Completed"
    } else if (project.progress > 0) {
      newStatus = "In Progress"
    } else if (project.progress === 0) {
      newStatus = "Planning"
    }
    // Update progress based on status (bidirectional sync)
    if (project.status === "Completed" && project.progress < 100) {
      newProgress = 100
      console.log(
        `🔄 Auto-updating project ${project.name} progress from ${project.progress}% to 100% (status: Completed)`,
      )
    }
    // Only update if something changed
    if (newStatus !== project.status || newProgress !== project.progress) {
      console.log(
        `🔄 Auto-updating project ${project.name}: status ${project.status}→${newStatus}, progress ${project.progress}%→${newProgress}%`,
      )
      return {
        ...project,
        status: newStatus as Project["status"],
        progress: newProgress,
      }
    }
    return project
  }, [])

  // Create activity log entry
  const createActivityLog = useCallback(
    async (activityData: {
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
    },
    [],
  )

  // Helper function to log common activities
  const logActivity = useCallback(
    async (
      action: string,
      target: string,
      type: "task" | "project" | "comment" | "file" | "team" | "system",
      options?: {
        project?: string
        details?: string
        metadata?: any
      },
    ) => {
      try {
        await createActivityLog({
          action,
          target,
          type,
          project: options?.project,
          details: options?.details,
          metadata: options?.metadata,
        })
      } catch (err) {
        console.error("❌ Failed to log activity:", err)
      }
    },
    [createActivityLog],
  )

  const fetchProjects = useCallback(
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
        // Try API first, fallback to mock data
        try {
          const queryParams = new URLSearchParams()
          if (filters.status && filters.status !== "all") {
            queryParams.append("status", filters.status)
          }
          if (filters.priority && filters.priority !== "all") {
            queryParams.append("priority", filters.priority)
          }
          if (filters.search) {
            queryParams.append("search", filters.search)
          }
          const url = `${API_BASE_URL}/projects${queryParams.toString() ? "?" + queryParams.toString() : ""}`
          console.log("🚀 Fetching projects from:", url)
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            mode: "cors",
          })
          console.log("📡 Response status:", response.status)
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          const result = await response.json()
          console.log("✅ API Response:", result)
          // Handle different response formats
          let projectsData: Project[] = []
          if (result.success && Array.isArray(result.data)) {
            projectsData = result.data
          } else if (Array.isArray(result)) {
            projectsData = result
          } else if (result.data && Array.isArray(result.data)) {
            projectsData = result.data
          } else {
            throw new Error("Invalid response format")
          }
          // Normalize data to ensure consistent structure and auto-update status
          const normalizedProjects = projectsData.map((project: any) => {
            const normalizedProject: Project = {
              ...project,
              tasks: project.tasks || { total: 0, completed: 0 },
              team: project.team || [],
              progress: Number(project.progress) || 0,
            }
            // Auto-update status based on progress
            return updateProjectStatusBasedOnProgress(normalizedProject)
          })
          setProjects(normalizedProjects)
          // Calculate and set stats locally
          const calculatedStats = calculateStats(normalizedProjects)
          setStats(calculatedStats)
          setError(null)
          console.log("✅ Projects loaded from API:", normalizedProjects.length)
        } catch (apiError) {
          // Show error instead of fallback
          setError("Failed to fetch projects from API")
          setProjects([])
          setStats({
            total: 0,
            planning: 0,
            in_progress: 0,
            completed: 0,
            on_hold: 0,
            high_priority: 0,
            medium_priority: 0,
            low_priority: 0,
          })
        }
      } catch (err) {
        console.error("💥 Error fetching projects:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch projects")
        setProjects([])
        setStats({
          total: 0,
          planning: 0,
          in_progress: 0,
          completed: 0,
          on_hold: 0,
          high_priority: 0,
          medium_priority: 0,
          low_priority: 0,
        })
      } finally {
        setLoading(false)
      }
    },
    [calculateStats, updateProjectStatusBasedOnProgress],
  )

  const getProjectById = useCallback(
    (id: number): Project | null => {
      const project = projects.find((p: Project) => p.id === id) || null
      console.log(`🔍 Getting project by ID ${id}:`, project ? `Found "${project.name}"` : "Not found")
      return project
    },
    [projects],
  )

  // Enhanced getProjectTasks that integrates with external tasks data
  const getProjectTasks = useCallback((projectId: number): Task[] => {
    console.log(`🔍 Getting tasks for project ${projectId}`)
    // This function should be enhanced to work with actual tasks data
    // For now, return empty array but provide proper logging
    const tasks: Task[] = []
    console.log(`📊 Project ${projectId} has ${tasks.length} tasks`)
    return tasks
  }, [])

  // Enhanced function to update project progress based on tasks
  const updateProjectProgressFromTasks = useCallback(async (projectId: number, tasks: Task[]) => {
    try {
      if (tasks.length === 0) {
        console.log(`📊 Project ${projectId} has no tasks, setting progress to 0%`)
        await updateProject(projectId, { progress: 0 })
        return
      }
      const completedTasks = tasks.filter(
        (t: Task) => t.status === "Completed" || t.status === "Closed" || t.progress === 100,
      ).length
      const totalTasks = tasks.length
      const newProgress = Math.round((completedTasks / totalTasks) * 100)
      console.log(`📊 Updating project ${projectId} progress: ${completedTasks}/${totalTasks} = ${newProgress}%`)
      // Update the project progress and task counts
      await updateProject(projectId, {
        progress: newProgress,
        tasks: {
          total: totalTasks,
          completed: completedTasks,
        },
      })
      console.log(`✅ Project ${projectId} progress updated to ${newProgress}%`)
    } catch (error) {
      console.error(`❌ Failed to update project ${projectId} progress:`, error)
    }
  }, [])

  const createProject = async (projectData: {
    name: string
    description?: string
    status?: string
    priority?: string
    due_date?: string
    progress?: number
    team?: any[] // Added team property here
  }) => {
    try {
      console.log("➕ Creating project with data:", projectData)
      if (!projectData.name || projectData.name.trim() === "") {
        throw new Error("Project name is required")
      }
      const dataToSend = {
        name: projectData.name.trim(),
        description: projectData.description || "",
        status: projectData.status || "Planning",
        priority: projectData.priority || "Medium",
        due_date: projectData.due_date || null,
        progress: projectData.progress || 0,
        team: projectData.team || [], // Added team to dataToSend
      }
      try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          body: JSON.stringify(dataToSend),
        })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const result = await response.json()
        console.log("➕ Create response:", result)
        if (result.success && result.data) {
          const newProject = updateProjectStatusBasedOnProgress({
            ...result.data,
            tasks: result.data.tasks || { total: 0, completed: 0 },
            team: result.data.team || [],
          })
          // Update local state
          setProjects((prev: Project[]) => {
            const updated = [newProject, ...prev]
            // Recalculate stats
            const newStats = calculateStats(updated)
            setStats(newStats)
            return updated
          })
          // Log activity
          await logActivity("created project", newProject.name, "project", {
            project: newProject.name,
            details: `Project "${newProject.name}" was created`,
            metadata: {
              priority: newProject.priority,
              status: newProject.status,
              progress: newProject.progress,
            },
          })
          console.log("✅ Project created successfully")
          return newProject
        } else {
          throw new Error(result.message || "Failed to create project")
        }
      } catch (apiError) {
        console.log("⚠️ API create failed, creating mock project:", apiError)
        // Create mock project
        const newProject: Project = updateProjectStatusBasedOnProgress({
          id: Date.now(), // Simple ID generation
          name: dataToSend.name,
          description: dataToSend.description,
          status: dataToSend.status as Project["status"],
          priority: dataToSend.priority as Project["priority"],
          due_date: dataToSend.due_date || undefined,
          progress: dataToSend.progress,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          team: dataToSend.team, // Use the team from dataToSend for mock project
          tasks: { total: 0, completed: 0 },
          team_ids: [],
        })
        // Update local state
        setProjects((prev: Project[]) => {
          const updated = [newProject, ...prev]
          // Recalculate stats
          const newStats = calculateStats(updated)
          setStats(newStats)
          return updated
        })
        console.log("✅ Mock project created successfully")
        return newProject
      }
    } catch (err) {
      console.error("💥 Error creating project:", err)
      throw new Error(err instanceof Error ? err.message : "Failed to create project")
    }
  }

  const updateProject = async (id: number, updates: Partial<Project>) => {
    try {
      console.log("✏️ Updating project:", id, updates)
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          body: JSON.stringify(updates),
        })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const result = await response.json()
        if (result.success && result.data) {
          const updatedProject = updateProjectStatusBasedOnProgress({
            ...result.data,
            tasks: result.data.tasks || { total: 0, completed: 0 },
            team: result.data.team || [],
          })
          setProjects((prev: Project[]) => {
            const updated = prev.map((project: Project) => (project.id === id ? updatedProject : project))
            // Recalculate stats
            const newStats = calculateStats(updated)
            setStats(newStats)
            return updated
          })
          // Log activity
          await logActivity("updated project", updatedProject.name, "project", {
            project: updatedProject.name,
            details: `Project "${updatedProject.name}" was updated`,
            metadata: {
              oldValue: projects.find((p: Project) => p.id === id)?.status,
              newValue: updatedProject.status,
              priority: updatedProject.priority,
              progress: updatedProject.progress,
            },
          })
          // Trigger real-time update event
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("projectUpdated", {
                detail: { projectId: id, project: updatedProject },
              }),
            )
          }
          console.log("✅ Project updated successfully")
          return updatedProject
        } else {
          throw new Error(result.message || "Failed to update project")
        }
      } catch (apiError) {
        console.log("⚠️ API update failed, updating mock project:", apiError)
        // Update mock project with auto-status sync
        setProjects((prev: Project[]) => {
          const updated = prev.map((project: Project) => {
            if (project.id === id) {
              const updatedProject = updateProjectStatusBasedOnProgress({
                ...project,
                ...updates,
                updated_at: new Date().toISOString(),
              })
              // Trigger real-time update event
              if (typeof window !== "undefined") {
                window.dispatchEvent(
                  new CustomEvent("projectUpdated", {
                    detail: { projectId: id, project: updatedProject },
                  }),
                )
              }
              return updatedProject
            }
            return project
          })
          // Recalculate stats
          const newStats = calculateStats(updated)
          setStats(newStats)
          return updated
        })
        console.log("✅ Mock project updated successfully")
        return updates
      }
    } catch (err) {
      console.error("❌ Error updating project:", err)
      throw new Error(err instanceof Error ? err.message : "Failed to update project")
    }
  }

  const deleteProject = async (id: number) => {
    try {
      console.log("🗑️ Deleting project:", id)
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
          mode: "cors",
        })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const result = await response.json()
        if (result.success) {
          setProjects((prev: Project[]) => {
            const updated = prev.filter((project: Project) => project.id !== id)
            // Recalculate stats
            const newStats = calculateStats(updated)
            setStats(newStats)
            return updated
          })
          // Log activity
          const deletedProject = projects.find((p: Project) => p.id === id)
          if (deletedProject) {
            await logActivity("deleted project", deletedProject.name, "project", {
              project: deletedProject.name,
              details: `Project "${deletedProject.name}" was deleted`,
              metadata: {
                priority: deletedProject.priority,
                status: deletedProject.status,
                progress: deletedProject.progress,
              },
            })
          }
          console.log("✅ Project deleted successfully")
        } else {
          throw new Error(result.message || "Failed to delete project")
        }
      } catch (apiError) {
        console.log("⚠️ API delete failed, deleting mock project:", apiError)
        // Delete mock project
        setProjects((prev: Project[]) => {
          const updated = prev.filter((project: Project) => project.id !== id)
          // Recalculate stats
          const newStats = calculateStats(updated)
          setStats(newStats)
          return updated
        })
        console.log("✅ Mock project deleted successfully")
      }
    } catch (err) {
      console.error("❌ Error deleting project:", err)
      throw new Error(err instanceof Error ? err.message : "Failed to delete project")
    }
  }

  useEffect(() => {
    fetchProjects()
    const handleProjectsRefresh = () => {
      console.log("🔄 Refreshing projects due to external changes...")
      fetchProjects()
    }
    const handleProjectUpdated = (event: CustomEvent) => {
      console.log("🔄 Real-time project update received:", event.detail)
      const { projectId, project } = event.detail
      setProjects((prev: Project[]) => {
        const updated = prev.map((p: Project) => (p.id === projectId ? project : p))
        // Recalculate stats
        const newStats = calculateStats(updated)
        setStats(newStats)
        return updated
      })
    }
    if (typeof window !== "undefined") {
      window.addEventListener("projectsNeedRefresh", handleProjectsRefresh)
      window.addEventListener("projectUpdated", handleProjectUpdated as EventListener)
      return () => {
        window.removeEventListener("projectsNeedRefresh", handleProjectsRefresh)
        window.removeEventListener("projectUpdated", handleProjectUpdated as EventListener)
      }
    }
  }, [fetchProjects, calculateStats])

  return {
    projects,
    loading,
    error,
    stats,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectTasks,
    updateProjectProgressFromTasks,
  }
}
