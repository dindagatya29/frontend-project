"use client"

import { useState, useEffect } from "react"
import NewProjectModal from "@/components/new-project-modal"
import AddTaskModal from "@/components/add-task-modal"
import QuickEditTaskModal from "@/components/quick-edit-task-modal"
import { useProjects } from "@/hooks/use-projects"
import { useTasks } from "@/hooks/use-tasks"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Project")
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [isQuickEditModalOpen, setIsQuickEditModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userPermissions, setUserPermissions] = useState<string[]>([])

  // 🔗 Hooks untuk data real dari backend
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    stats: projectStats,
    createProject,
    updateProject,
    deleteProject,
    refetch: refetchProjects,
  } = useProjects()

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    stats: taskStats,
    projects: taskProjects,
    users,
    createTask,
    updateTask,
    deleteTask,
    refetch: refetchTasks,
  } = useTasks()

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

  // Real-time synchronization
  useEffect(() => {
    const handleProjectUpdated = (event: CustomEvent) => {
      console.log("🔄 Real-time project update received in Dashboard:", event.detail)
      // Refetch projects and tasks to get latest data
      refetchProjects()
      refetchTasks()
    }

    const handleTaskUpdated = (event: CustomEvent) => {
      console.log("🔄 Real-time task update received in Dashboard:", event.detail)
      // Refetch projects and tasks to get latest data
      refetchProjects()
      refetchTasks()
    }

    const handleFileUploaded = (event: CustomEvent) => {
      console.log("🔄 Real-time file upload received in Dashboard:", event.detail)
      // Refetch projects and tasks to get latest data
      refetchProjects()
      refetchTasks()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("projectUpdated", handleProjectUpdated as EventListener)
      window.addEventListener("taskUpdated", handleTaskUpdated as EventListener)
      window.addEventListener("fileUploaded", handleFileUploaded as EventListener)
      return () => {
        window.removeEventListener("projectUpdated", handleProjectUpdated as EventListener)
        window.removeEventListener("taskUpdated", handleTaskUpdated as EventListener)
        window.removeEventListener("fileUploaded", handleFileUploaded as EventListener)
      }
    }
  }, [refetchProjects, refetchTasks])

  // Permission check functions
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false
    if (currentUser.role === "admin") return true // Admin has all permissions
    return userPermissions.includes(permission)
  }

  // 🎨 Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-green-100 text-blue-800 border-green-200"
      case "Planning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "On Hold":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-teal-500"
    if (progress >= 75) return "bg-teal-500"
    if (progress >= 50) return "from-yellow-500 to-yellow-600"
    if (progress >= 25) return "from-orange-500 to-orange-600"
    return "from-gray-400 to-gray-500"
  }

  // 📝 Event handlers
  const handleCreateProject = async (projectData: any) => {
    if (!hasPermission("manage_projects")) {
      alert("You don't have permission to create projects")
      return
    }
    
    try {
      await createProject(projectData)
      setIsNewProjectModalOpen(false)
      console.log("✅ Project created successfully!")
    } catch (error) {
      console.error("❌ Failed to create project:", error)
      alert("Failed to create project. Please try again.")
    }
  }

  const handleCreateTask = async (taskData: any) => {
    if (!hasPermission("manage_tasks")) {
      alert("You don't have permission to create tasks")
      return
    }
    
    try {
      await createTask(taskData)
      setIsAddTaskModalOpen(false)
      console.log("✅ Task created successfully!")
    } catch (error) {
      console.error("❌ Failed to create task:", error)
      alert("Failed to create task. Please try again.")
    }
  }

  const handleQuickEdit = (task: any) => {
    if (!hasPermission("manage_tasks") && !hasPermission("manage_own_tasks")) {
      alert("You don't have permission to edit tasks")
      return
    }
    
    setSelectedTask(task)
    setIsQuickEditModalOpen(true)
  }

  const handleQuickEditSubmit = async (id: number, updates: any) => {
    if (!hasPermission("manage_tasks") && !hasPermission("manage_own_tasks")) {
      alert("You don't have permission to edit tasks")
      return
    }
    
    try {
      await updateTask(id, updates)
      setIsQuickEditModalOpen(false)
      setSelectedTask(null)
      console.log("✅ Task updated successfully!")
    } catch (error) {
      console.error("❌ Failed to update task:", error)
      throw error
    }
  }

  const handleDeleteTask = async (id: number) => {
    if (!hasPermission("manage_tasks")) {
      alert("You don't have permission to delete tasks")
      return
    }
    
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id)
        console.log("✅ Task deleted successfully!")
      } catch (error) {
        console.error("❌ Failed to delete task:", error)
        alert("Failed to delete task. Please try again.")
      }
    }
  }

  const handleUpdateProjectStatus = async (projectId: number, newStatus: string) => {
    if (!hasPermission("manage_projects")) {
      alert("You don't have permission to update projects")
      return
    }
    
    try {
      const project = projects.find(p => p.id === projectId)
      if (!project) {
        console.error("❌ Project not found")
        return
      }
      
      let updates: any = { status: newStatus }
      
      // Auto-update progress when status is changed to Completed
      if (newStatus === "Completed") {
        updates.progress = 100
        console.log(`🔄 Auto-setting progress to 100% for project ${project.name} (status: Completed)`)
      }
      
      await updateProject(projectId, updates)
      console.log(`✅ Project status updated to ${newStatus}`)
      
      // Trigger real-time update
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("projectUpdated", {
          detail: { 
            projectId, 
            project: { ...project, ...updates }
          }
        }))
      }
    } catch (error) {
      console.error("❌ Failed to update project status:", error)
      alert("Failed to update project status. Please try again.")
    }
  }

  // 📊 Get upcoming deadlines (tasks due in next 14 days)
  const getUpcomingDeadlines = () => {
    const now = new Date()
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)

    return tasks
      .filter((task) => {
        if (!task.dueDate) return false
        const dueDate = new Date(task.dueDate)
        return dueDate >= now && dueDate <= twoWeeksFromNow && task.status !== "Completed"
      })
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
  }

  // 📋 Group tasks by status
  const getTasksByStatus = () => {
    const todoTasks = tasks.filter((task) => task.status === "Todo")
    const inProgressTasks = tasks.filter((task) => task.status === "In Progress")
    const completedTasks = tasks.filter((task) => task.status === "Completed")

    return { todoTasks, inProgressTasks, completedTasks }
  }

  const renderProjectView = () => {
    if (projectsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Loading projects...</span>
        </div>
      )
    }

    if (projectsError) {
      return (
        <div className="text-center p-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-600 mb-4">
            <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
            <p className="text-sm">{projectsError}</p>
          </div>
          <button
            onClick={() => refetchProjects()}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      )
    }

    const upcomingDeadlines = getUpcomingDeadlines()

    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Projects */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Projects</h2>
                  <p className="text-sm text-gray-600 mt-1">Your active projects overview</p>
                </div>
                <button
                  onClick={() => (window.location.href = "dashboard/projects")}
                  className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-50 border border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md self-start sm:self-auto"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📁</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-500 mb-4">Create your first project to get started</p>
                  {hasPermission("manage_projects") ? (
                    <button
                      onClick={() => setIsNewProjectModalOpen(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Create Project
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">You don't have permission to create projects</p>
                      <p className="text-xs text-gray-400">Contact your administrator for access</p>
                    </div>
                  )}
                </div>
              ) : (
                projects.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    className="group hover:bg-gray-50 p-3 sm:p-4 rounded-xl transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-gray-800 text-sm sm:text-base">
                          {project.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                          {project.description || "No description"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <span
                          className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full border ${getStatusColor(project.status)}`}
                        >
                          {project.status}
                        </span>
                        {project.due_date && (
                          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                            Due {new Date(project.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                      <span
                        className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full border ${getPriorityColor(project.priority)}`}
                      >
                        {project.priority} Priority
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${getProgressColor(project.progress)} h-2 sm:h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs sm:text-sm text-gray-600">
                        📋 {project.tasks.total} tasks • ✅ {project.tasks.completed} completed
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" x2="18" y1="20" y2="10" />
                          <line x1="12" x2="12" y1="20" y2="4" />
                          <line x1="6" x2="6" y1="20" y2="14" />
                        </svg>
                        <span className="text-xs sm:text-sm">Analytics</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Upcoming Deadlines</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Tasks due in the next 14 days</p>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {upcomingDeadlines.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">✅</span>
                  </div>
                  <p className="text-sm text-gray-600">No upcoming deadlines!</p>
                  <p className="text-xs text-gray-500 mt-1">You're all caught up</p>
                </div>
              ) : (
                upcomingDeadlines.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 hover:bg-gray-50 rounded-xl transition-colors group cursor-pointer"
                    onClick={() => handleQuickEdit(task)}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority).includes("red") ? "bg-red-500" : getPriorityColor(task.priority).includes("yellow") ? "bg-yellow-500" : "bg-green-500"} mt-2 flex-shrink-0 shadow-sm`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm group-hover:text-gray-800 line-clamp-1">
                        {task.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2 sm:mb-3 mt-1">
                        {task.project} • Due {new Date(task.dueDate!).toLocaleDateString()}
                      </p>
                      <span
                        className={`inline-block px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTaskView = () => {
    if (tasksLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Loading tasks...</span>
        </div>
      )
    }

    if (tasksError) {
      return (
        <div className="text-center p-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-600 mb-4">
            <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
            <p className="text-sm">{tasksError}</p>
          </div>
          <button
            onClick={() => refetchTasks()}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      )
    }

    const { todoTasks, inProgressTasks, completedTasks } = getTasksByStatus()
    const upcomingDeadlines = getUpcomingDeadlines()

    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Task Board */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-50 p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Task Board</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage your tasks efficiently</p>
                </div>
                {hasPermission("manage_tasks") && (
                  <button
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg text-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl self-start sm:self-auto"
                    onClick={() => setIsAddTaskModalOpen(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    <span>Add Task</span>
                  </button>
                )}
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {/* To Do Column */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-400"></div>
                    <span className="text-sm font-semibold text-gray-700">To Do</span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                      {todoTasks.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {todoTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 group cursor-pointer"
                        onClick={() => handleQuickEdit(task)}
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-gray-900 line-clamp-1">
                            {task.title}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{task.project}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium border self-start ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500">
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {todoTasks.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <span className="text-2xl mb-2 block">📋</span>
                        <p className="text-sm">No tasks to do</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* In Progress Column */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500"></div>
                    <span className="text-sm font-semibold text-gray-700">In Progress</span>
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                      {inProgressTasks.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {inProgressTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="bg-green-50 p-3 sm:p-4 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200 group cursor-pointer"
                        onClick={() => handleQuickEdit(task)}
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-gray-900 line-clamp-1">
                            {task.title}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{task.project}</p>
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Progress</span>
                            <span className="text-xs font-medium text-gray-800">{task.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-green-500 h-1 rounded-full transition-all duration-500"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium border self-start ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500">
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {inProgressTasks.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <span className="text-2xl mb-2 block">⏳</span>
                        <p className="text-sm">No tasks in progress</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Completed Column */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500"></div>
                    <span className="text-sm font-semibold text-gray-700">Completed</span>
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                      {completedTasks.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {completedTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="bg-green-50 p-3 sm:p-4 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200 group cursor-pointer"
                        onClick={() => handleQuickEdit(task)}
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-gray-900 line-clamp-1">
                            {task.title}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{task.project}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium border self-start ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500">
                              Completed {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {completedTasks.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <span className="text-2xl mb-2 block">✅</span>
                        <p className="text-sm">No completed tasks</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines - Same as Project View */}
        <div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Upcoming Deadlines</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Tasks due in the next 14 days</p>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {upcomingDeadlines.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">✅</span>
                  </div>
                  <p className="text-sm text-gray-600">No upcoming deadlines!</p>
                  <p className="text-xs text-gray-500 mt-1">You're all caught up</p>
                </div>
              ) : (
                upcomingDeadlines.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 hover:bg-gray-50 rounded-xl transition-colors group cursor-pointer"
                    onClick={() => handleQuickEdit(task)}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority).includes("red") ? "bg-red-500" : getPriorityColor(task.priority).includes("yellow") ? "bg-yellow-500" : "bg-green-500"} mt-2 flex-shrink-0 shadow-sm`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm group-hover:text-gray-800 line-clamp-1">
                        {task.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2 sm:mb-3 mt-1">
                        {task.project} • Due {new Date(task.dueDate!).toLocaleDateString()}
                      </p>
                      <span
                        className={`inline-block px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTeamView = () => (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      {/* Team Activity */}
      <div className="xl:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-600"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Team Members</h2>
                <p className="text-sm text-gray-600">Your project team</p>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {users.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No team members</h3>
                <p className="text-gray-500">Add team members to collaborate on projects</p>
              </div>
            ) : (
              users.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${
                      index % 5 === 0
                        ? "from-green-400 to-blue-500"
                        : index % 5 === 1
                          ? "from-green-400 to-green-500"
                          : index % 5 === 2
                            ? "from-purple-400 to-purple-500"
                            : index % 5 === 3
                              ? "from-pink-400 to-pink-500"
                              : "from-yellow-400 to-yellow-500"
                    } rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0 shadow-lg`}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                      <span className="font-semibold text-gray-900 group-hover:text-gray-800 text-sm sm:text-base">
                        {user.name}
                      </span>
                      <span className="text-gray-600 text-sm">{user.email}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {tasks.filter((task) => task.assignee_id === user.id).length} assigned tasks
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Team Stats */}
      <div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-indigo-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Team Performance</h2>
                <p className="text-xs sm:text-sm text-gray-600">Current overview</p>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{users.length}</div>
              <div className="text-sm text-gray-600">Team Members</div>
              <div className="text-xs text-green-600 font-medium">Active</div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasks Completed</span>
                <span className="font-semibold text-gray-900">{taskStats?.completed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Projects Active</span>
                <span className="font-semibold text-gray-900">{projectStats?.in_progress || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Tasks</span>
                <span className="font-semibold text-gray-900">{taskStats?.total || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasPermission("manage_projects") && (
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              <span className="font-medium">New Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards - Real Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Active Project Card */}
        <div className="bg-teal-500 p-4 sm:p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white sm:w-6 sm:h-6"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold mb-2">{projectStats?.total || 0}</div>
          <div className="text-blue-100 text-sm">Total Projects</div>
          <div className="text-xs text-blue-200 mt-1">{projectStats?.in_progress || 0} active</div>
        </div>

        {/* Pending Task Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 sm:p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white sm:w-6 sm:h-6"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold mb-2">
            {(taskStats?.todo || 0) + (taskStats?.in_progress || 0)}
          </div>
          <div className="text-orange-100 text-sm">Pending Tasks</div>
          <div className="text-xs text-orange-200 mt-1">{getUpcomingDeadlines().length} due soon</div>
        </div>

        {/* Completed Tasks Card */}
        <div className="bg-teal-500 p-4 sm:p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white sm:w-6 sm:h-6"
              >
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold mb-2">{taskStats?.completed || 0}</div>
          <div className="text-green-100 text-sm">Completed Tasks</div>
          <div className="text-xs text-green-200 mt-1">{projectStats?.completed || 0} projects done</div>
        </div>

        {/* Team Members Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 sm:p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white sm:w-6 sm:h-6"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold mb-2">{users.length}</div>
          <div className="text-purple-100 text-sm">Team Members</div>
          <div className="text-xs text-purple-200 mt-1">All active</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 sm:space-x-2 bg-white p-1 sm:p-2 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <button
          onClick={() => setActiveTab("Project")}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
            activeTab === "Project"
              ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab("Tasks")}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
            activeTab === "Tasks"
              ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setActiveTab("Team")}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
            activeTab === "Team"
              ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
          }`}
        >
          Team
        </button>
      </div>

      {/* Dynamic Content Based on Active Tab */}
      {activeTab === "Project" && renderProjectView()}
      {activeTab === "Tasks" && renderTaskView()}
      {activeTab === "Team" && renderTeamView()}

      {/* Modals */}
      {hasPermission("manage_projects") && (
        <NewProjectModal
          isOpen={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
          onSubmit={handleCreateProject}
        />
      )}

      {hasPermission("manage_tasks") && (
        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={() => setIsAddTaskModalOpen(false)}
          onSubmit={handleCreateTask}
          projects={taskProjects}
          users={users}
        />
      )}

      {(hasPermission("manage_tasks") || hasPermission("manage_own_tasks")) && (
        <QuickEditTaskModal
          isOpen={isQuickEditModalOpen}
          onClose={() => {
            setIsQuickEditModalOpen(false)
            setSelectedTask(null)
          }}
          onSubmit={handleQuickEditSubmit}
          task={selectedTask}
        />
      )}
    </div>
  )
}
