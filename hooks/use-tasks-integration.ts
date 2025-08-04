"use client"

import { useCallback } from "react"
import { useProjects } from "./use-projects"
import { useTasks } from "./use-tasks"

/**
 * Integration hook that connects projects and tasks
 * This ensures proper synchronization between project progress and task completion
 */
export function useProjectTasksIntegration() {
  const { updateProject } = useProjects()
  const { tasks, refetch: refetchTasks } = useTasks()

  // Calculate project progress based on tasks
  const calculateProjectProgress = useCallback(
    (projectId: number) => {
      const projectTasks = tasks.filter((t) => t.project_id === projectId)

      if (projectTasks.length === 0) {
        return { progress: 0, completedTasks: 0, totalTasks: 0 }
      }

      const completedTasks = projectTasks.filter((t) => t.status === "Completed" || t.progress === 100).length

      const totalTasks = projectTasks.length
      const progress = Math.round((completedTasks / totalTasks) * 100)

      console.log(`📊 Project ${projectId} progress calculation:`, {
        completedTasks,
        totalTasks,
        progress,
        tasks: projectTasks.map((t) => ({ id: t.id, title: t.title, status: t.status, progress: t.progress })),
      })

      return { progress, completedTasks, totalTasks }
    },
    [tasks],
  )

  // Update project progress when tasks change
  const syncProjectProgress = useCallback(
    async (projectId: number) => {
      try {
        const { progress, completedTasks, totalTasks } = calculateProjectProgress(projectId)

        console.log(`🔄 Syncing project ${projectId} progress: ${progress}%`)

        await updateProject(projectId, {
          progress,
          tasks: { completed: completedTasks, total: totalTasks },
        })

        // Trigger real-time update
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("projectProgressUpdated", {
              detail: { projectId, progress, completedTasks, totalTasks },
            }),
          )
        }

        console.log(`✅ Project ${projectId} progress synced successfully`)
      } catch (error) {
        console.error(`❌ Failed to sync project ${projectId} progress:`, error)
      }
    },
    [calculateProjectProgress, updateProject],
  )

  // Get tasks for a specific project
  const getProjectTasks = useCallback(
    (projectId: number) => {
      const projectTasks = tasks.filter((t) => t.project_id === projectId)
      console.log(`🔍 Getting tasks for project ${projectId}:`, projectTasks.length, "tasks found")
      return projectTasks
    },
    [tasks],
  )

  // Handle task creation with project sync
  const handleTaskCreated = useCallback(
    async (task: any) => {
      console.log(`🎉 Task created for project ${task.project_id}:`, task)

      // Refetch tasks to ensure we have the latest data
      await refetchTasks()

      // Sync project progress
      await syncProjectProgress(task.project_id)
    },
    [refetchTasks, syncProjectProgress],
  )

  // Handle task update with project sync
  const handleTaskUpdated = useCallback(
    async (taskId: number, projectId: number) => {
      console.log(`🔄 Task ${taskId} updated for project ${projectId}`)

      // Refetch tasks to ensure we have the latest data
      await refetchTasks()

      // Sync project progress
      await syncProjectProgress(projectId)
    },
    [refetchTasks, syncProjectProgress],
  )

  return {
    calculateProjectProgress,
    syncProjectProgress,
    getProjectTasks,
    handleTaskCreated,
    handleTaskUpdated,
  }
}
