"use client"

import { useState, useEffect } from "react"
import AddTaskModal from "@/components/add-task-modal"
import { useTasks } from "@/hooks/use-tasks"
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter,
  HelpCircle,
  Info,
  MousePointer,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import QuickEditTaskModal from "@/components/quick-edit-task-modal"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

export default function TasksPage() {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [isQuickEditModalOpen, setIsQuickEditModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [draggedTask, setDraggedTask] = useState<any>(null)
  const [showTutorial, setShowTutorial] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const { tasks, loading, error, stats, projects, users, createTask, updateTask, deleteTask, refetch } = useTasks()

  // Check for first-time user
  useEffect(() => {
    const hasSeenTasksTutorial = localStorage.getItem("tasks_tutorial_seen")
    if (!hasSeenTasksTutorial && tasks.length === 0) {
      setShowTutorial(true)
    }
  }, [tasks.length])

  // Update active filters
  useEffect(() => {
    const filters = []
    if (statusFilter !== "All") filters.push(`Status: ${statusFilter}`)
    if (priorityFilter !== "All") filters.push(`Priority: ${priorityFilter}`)
    if (searchTerm) filters.push(`Search: "${searchTerm}"`)
    setActiveFilters(filters)
  }, [statusFilter, priorityFilter, searchTerm])

  // Real-time synchronization
  useEffect(() => {
    const handleTaskUpdated = (event: CustomEvent) => {
      console.log("🔄 Real-time task update received in Tasks page:", event.detail)
      refetch()
    }
    const handleProjectUpdated = (event: CustomEvent) => {
      console.log("🔄 Real-time project update received in Tasks page:", event.detail)
      refetch()
    }
    if (typeof window !== "undefined") {
      window.addEventListener("taskUpdated", handleTaskUpdated as EventListener)
      window.addEventListener("projectUpdated", handleProjectUpdated as EventListener)
      return () => {
        window.removeEventListener("taskUpdated", handleTaskUpdated as EventListener)
        window.removeEventListener("projectUpdated", handleProjectUpdated as EventListener)
      }
    }
  }, [refetch])

  // Kanban columns configuration
  const kanbanColumns = [
    {
      id: "Todo",
      title: "📋 To Do",
      color: "bg-gray-50 border-gray-200",
      description: "Tasks that need to be started",
    },
    {
      id: "In Progress",
      title: "🔄 In Progress",
      color: "bg-blue-50 border-blue-200",
      description: "Tasks currently being worked on",
    },
    {
      id: "Completed",
      title: "✅ Completed",
      color: "bg-green-50 border-green-200",
      description: "Finished tasks",
    },
  ]

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Todo":
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
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High":
        return "🔴"
      case "Medium":
        return "🟡"
      case "Low":
        return "🟢"
      default:
        return "⚪"
    }
  }

  // Event handlers
  const handleAddTask = async (taskData: any) => {
    try {
      await createTask(taskData)
      setIsAddTaskModalOpen(false)
      console.log("✅ Task created successfully!")
      // Hide tutorial after first task
      if (showTutorial) {
        setShowTutorial(false)
        localStorage.setItem("tasks_tutorial_seen", "true")
      }
    } catch (error) {
      console.error("❌ Failed to create task:", error)
      alert("Failed to create task. Please try again.")
    }
  }
  const handleDeleteTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id)
    const confirmMessage = `Are you sure you want to delete "${task?.title}"?\n\nThis action cannot be undone.`
    if (confirm(confirmMessage)) {
      try {
        await deleteTask(id)
        console.log("✅ Task deleted successfully!")
      } catch (error) {
        console.error("❌ Failed to delete task:", error)
        alert("Failed to delete task. Please try again.")
      }
    }
  }
  const handleQuickEdit = (task: any) => {
    setSelectedTask(task)
    setIsQuickEditModalOpen(true)
  }
  const handleQuickEditSubmit = async (id: number, updates: any) => {
    try {
      if (updates.progress === 100 && updates.status !== "Completed") {
        updates.status = "Completed"
      }
      await updateTask(id, updates)
      setIsQuickEditModalOpen(false)
      setSelectedTask(null)
      console.log("✅ Task updated successfully!")
    } catch (error) {
      console.error("❌ Failed to update task:", error)
      throw error
    }
  }
  const clearAllFilters = () => {
    setStatusFilter("All")
    setPriorityFilter("All")
    setSearchTerm("")
  }

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === "All" || task.status === statusFilter
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter
    const matchesSearch =
      !searchTerm ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesPriority && matchesSearch
  })

  // Buat tasksByStatus dari filtered tasks
  const tasksByStatus = {
    Todo: filteredTasks.filter((task) => task.status === "Todo"),
    "In Progress": filteredTasks.filter((task) => task.status === "In Progress"),
    Completed: filteredTasks.filter((task) => task.status === "Completed"),
  }

  const boardColumns = [
    { id: "Todo", title: "To Do", icon: "📋", description: "Tasks to be started" },
    { id: "In Progress", title: "In Progress", icon: "🔄", description: "Currently working on" },
    { id: "Completed", title: "Completed", icon: "✅", description: "Finished tasks" },
  ]

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceCol = source.droppableId as keyof typeof tasksByStatus
    const destCol = destination.droppableId as keyof typeof tasksByStatus

    const movedTask = tasksByStatus[sourceCol][source.index]

    // Apply bidirectional sync logic
    const updates: any = { status: destCol }
    // Auto-update progress when status is changed to Completed
    if (destCol === "Completed") {
      updates.progress = 100
      console.log(`🔄 Auto-setting progress to 100% for task ${movedTask.title} (status: Completed)`)
    } else if (destCol === "In Progress" && movedTask.progress === 0) {
      updates.progress = 25
      console.log(`🔄 Auto-setting progress to 25% for task ${movedTask.title} (status: In Progress)`)
    }

    await updateTask(movedTask.id, updates)

    // Trigger real-time update events
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("taskUpdated", {
          detail: {
            taskId: movedTask.id,
            task: { ...movedTask, ...updates },
          },
        }),
      )
      window.dispatchEvent(new CustomEvent("projectsNeedRefresh"))
    }
    if (refetch) refetch()
  }

  // Tutorial Component
  const TutorialOverlay = () =>
    showTutorial && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-lg w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to Tasks Kanban!</h3>
            <p className="text-gray-600">Learn how to manage your tasks effectively</p>
          </div>
          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Create Tasks</h4>
                <p className="text-sm text-gray-600">Click "New Task" to add tasks to your projects</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Drag & Drop</h4>
                <p className="text-sm text-gray-600">Move tasks between columns to update their status</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Quick Edit</h4>
                <p className="text-sm text-gray-600">Click on any task card to edit details quickly</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Track Progress</h4>
                <p className="text-sm text-gray-600">Monitor task completion and team productivity</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowTutorial(false)
                localStorage.setItem("tasks_tutorial_seen", "true")
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Skip Tutorial
            </button>
            <button
              onClick={() => {
                setShowTutorial(false)
                setIsAddTaskModalOpen(true)
                localStorage.setItem("tasks_tutorial_seen", "true")
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Task
            </button>
          </div>
        </div>
      </div>
    )

  // Render Kanban Board
  const renderBoardView = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[60vh] pb-4 place-content-center">
        {boardColumns.map((column) => (
          <Droppable droppableId={column.id} key={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`bg-white rounded-xl border-2 p-6 flex flex-col transition-all duration-200 ${
                  snapshot.isDraggingOver
                    ? "border-blue-400 bg-blue-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center text-lg">
                      <span className="mr-2">{column.icon}</span>
                      {column.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{column.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-medium">
                      {tasksByStatus[column.id as keyof typeof tasksByStatus]?.length || 0}
                    </span>
                  </div>
                </div>
                <div className="space-y-4 min-h-[200px] flex-grow">
                  {tasksByStatus[column.id as keyof typeof tasksByStatus]?.map((task, idx) => (
                    <Draggable draggableId={task.id.toString()} index={idx} key={task.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group relative ${
                            snapshot.isDragging ? "ring-2 ring-blue-400 shadow-lg rotate-2" : ""
                          }`}
                          onClick={() => handleQuickEdit(task)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {task.title}
                            </h4>
                            <button
                              className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all p-1 rounded"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteTask(task.id)
                              }}
                              title="Delete task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {task.description && (
                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                          )}
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className={`px-2 py-1 text-xs rounded-full border font-medium ${getPriorityColor(task.priority)}`}
                            >
                              {getPriorityIcon(task.priority)} {task.priority}
                            </span>
                            {task.project && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {projects.find((p) => p.id === task.project_id)?.name || task.project}
                              </span>
                            )}
                          </div>
                          {task.progress > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">Progress</span>
                                <span className="text-xs text-gray-900 font-medium">{task.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            {task.assignee && (
                              <div className="flex items-center">
                                <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2">
                                  {task.assignee.charAt(0).toUpperCase()}
                                </div>
                                <span className="truncate max-w-20">{task.assignee}</span>
                              </div>
                            )}
                            {task.due_date && (
                              <div className="flex items-center">
                                <span className="mr-1">📅</span>
                                <span>{new Date(task.due_date).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                          {/* Drag indicator */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MousePointer className="w-3 h-3 text-gray-400" />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {/* Add task button in each column */}
                  <button
                    onClick={() => setIsAddTaskModalOpen(true)}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group mt-auto"
                  >
                    <Plus className="w-5 h-5 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Add Task</span>
                  </button>
                </div>
                {/* Drop zone indicator */}
                {snapshot.isDraggingOver && (
                  <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-xl bg-blue-50 bg-opacity-50 flex items-center justify-center pointer-events-none">
                    <div className="text-blue-600 font-medium flex items-center">
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Drop task here
                    </div>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Tasks</h3>
          <p className="text-gray-600">Fetching your tasks and project data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-white rounded-xl border border-red-200">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <div className="text-red-600 mb-6">
          <h3 className="text-xl font-semibold mb-2">Connection Error</h3>
          <p className="text-sm mb-4">{error}</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
            <h4 className="font-medium mb-2">Troubleshooting Steps:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Check if Laravel server is running on http://localhost:8000</li>
              <li>Verify your internet connection</li>
              <li>Try refreshing the page</li>
              <li>Contact support if the problem persists</li>
            </ul>
          </div>
        </div>
        <div className="space-x-3">
          <button
            onClick={() => refetch()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 inline-flex items-center transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <TutorialOverlay />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              📋 Tasks Kanban Board
              <button
                onClick={() => setShowTutorial(true)}
                className="ml-3 text-gray-400 hover:text-blue-600 transition-colors"
                title="Show tutorial"
              >
                <HelpCircle size={20} />
              </button>
            </h1>
            <p className="text-gray-600 mt-1">Drag and drop tasks to update their status • Visual task management</p>
            <div className="flex items-center space-x-4 mt-2">
              <p className="text-xs text-gray-400">🟢 Connected to API • {tasks.length} tasks loaded</p>
              {activeFilters.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-blue-600">Active filters:</span>
                  {activeFilters.map((filter, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {filter}
                    </span>
                  ))}
                  <button onClick={clearAllFilters} className="text-xs text-red-600 hover:text-red-800 underline">
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={16} />
            <span className="font-medium">New Task</span>
          </button>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total || 0}</p>
                <p className="text-xs text-gray-500 mt-1">All your tasks</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.in_progress || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Currently working</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.completed || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Finished tasks</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">High Priority</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.high_priority || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Urgent tasks</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔴</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search tasks by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-sm w-full sm:w-80"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Filter className="text-gray-400 h-4 w-4" />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 shadow-sm"
                >
                  <option value="All">All Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Quick actions:</span>
              <button
                onClick={() => setIsAddTaskModalOpen(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
              >
                Add Task
              </button>
              <span className="text-gray-300">•</span>
              <button
                onClick={() => setShowTutorial(true)}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium hover:underline"
              >
                Show Tutorial
              </button>
            </div>
          </div>
          {filteredTasks.length !== tasks.length && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Showing {filteredTasks.length} of {tasks.length} tasks
                {activeFilters.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </p>
            </div>
          )}
        </div>

        {/* How to Use Guide */}
        {tasks.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2">How to use the Kanban Board:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <MousePointer className="h-4 w-4 text-blue-600" />
                    <span>
                      <strong>Drag & Drop:</strong> Move tasks between columns
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Edit className="h-4 w-4 text-green-600" />
                    <span>
                      <strong>Quick Edit:</strong> Click on task cards to edit
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span>
                      <strong>Quick Edit:</strong> Click on task cards to edit
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span>
                      <strong>Auto Progress:</strong> Status updates progress automatically
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        {filteredTasks.length > 0 ? (
          renderBoardView()
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {tasks.length === 0 ? <span className="text-4xl">📋</span> : <Search className="h-8 w-8 text-gray-400" />}
            </div>
            {tasks.length === 0 ? (
              <>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Get started by creating your first task. You can organize work, set priorities, and track progress
                  visually.
                </p>
                <button
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Create Your First Task</span>
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No tasks match your filters</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </>
            )}
          </div>
        )}

        {/* Modals */}
        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={() => setIsAddTaskModalOpen(false)}
          onSubmit={handleAddTask}
          projects={projects}
          users={users}
        />
        <QuickEditTaskModal
          isOpen={isQuickEditModalOpen}
          onClose={() => {
            setIsQuickEditModalOpen(false)
            setSelectedTask(null)
          }}
          onSubmit={handleQuickEditSubmit}
          task={selectedTask}
        />
      </div>
    </div>
  )
}
