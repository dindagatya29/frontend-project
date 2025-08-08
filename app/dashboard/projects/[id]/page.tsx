"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useProjects } from "@/hooks/use-projects"
import { useTasks } from "@/hooks/use-tasks"
import { Calendar, Users, BarChart3, Plus, Search, MoreHorizontal, Edit, Trash2, ArrowLeft, CheckCircle, Circle, AlertCircle, Pause, Grid3X3, List, Table, X, FileText, Flag, Save, Loader2, Target, Activity, Filter, TrendingUp, User } from 'lucide-react'
import TaskDetailModal from "@/components/task-detail-modal"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { cn } from "@/lib/utils" // Import cn utility

interface Task {
  id: number
  project_id: number
  title: string
  description?: string
  status: "Todo" | "In Progress" | "Completed" | "Review" | "On hold" | "Cancelled"
  priority: "Low" | "Medium" | "High"
  assignee?: string
  assignee_id?: number
  due_date?: string
  progress: number
  created_at: string
  updated_at: string
  task_number?: string
}

interface NewTaskForm {
  title: string
  description: string
  status: "Todo" | "In Progress" | "Completed"
  priority: "Low" | "Medium" | "High"
  assignee: string
  due_date: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = Number.parseInt(params.id as string)
  const { getProjectById } = useProjects()
  const [project, setProject] = useState<any>(null)
  const { tasks: allTasks, refetch: refetchTasks, users, createTask, updateTask } = useTasks()
  const [loading, setLoading] = useState(true)

  const projectTasks = useMemo(() => {
    const filtered = allTasks.filter((t) => {
      const isProjectTask = Number(t.project_id) === Number(projectId)
      const hasValidStatus = ["Todo", "In Progress", "Completed", "Review", "On hold", "Cancelled"].includes(t.status)
      return isProjectTask && hasValidStatus
    })
    return filtered
  }, [allTasks, projectId])

  const projectTeamMembers = useMemo(() => {
    console.log("DEBUG: project in useMemo:", project); // Tambahkan ini
    console.log("DEBUG: users in useMemo:", users); // Tambahkan ini
    if (!project || !project.team || !users) return []
    const members = project.team
      .map((member: { id: number; role: string }) => users.find((user) => user.id === member.id))
      .filter(Boolean)
    console.log("DEBUG: projectTeamMembers calculated:", members); // Tambahkan ini
    return members
  }, [project, users])

  const [viewMode, setViewMode] = useState<"board" | "list" | "table">("board")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [newTaskForm, setNewTaskForm] = useState<NewTaskForm>({
    title: "",
    description: "",
    status: "Todo",
    priority: "Medium",
    assignee: "",
    due_date: "",
  })
  const [formErrors, setFormErrors] = useState<Partial<NewTaskForm>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (projectId) {
      const projectData = getProjectById(projectId)
      setProject(projectData)
      setLoading(false)
      console.log("DEBUG: Project data loaded:", projectData); // Tambahkan ini
    }
  }, [projectId, getProjectById])

  useEffect(() => {
    const handleTaskUpdated = (event: CustomEvent) => {
      console.log("🔄 Real-time task update received:", event.detail)
    }
    if (typeof window !== "undefined") {
      window.addEventListener("taskUpdated", handleTaskUpdated as EventListener)
      return () => {
        window.removeEventListener("taskUpdated", handleTaskUpdated as EventListener)
      }
    }
  }, [])

  const generateTaskNumber = () => {
    const taskCount = projectTasks.length + 1
    return `TASK-${taskCount.toString().padStart(3, "0")}`
  }

  const validateForm = () => {
    const errors: Partial<NewTaskForm> = {}
    if (!newTaskForm.title.trim()) {
      errors.title = "Task title is required"
    }
    if (!newTaskForm.description.trim()) {
      errors.description = "Task description is required"
    }
    if (!newTaskForm.assignee.trim()) {
      errors.assignee = "Assignee is required"
    }
    if (!newTaskForm.due_date) {
      errors.due_date = "Due date is required"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof NewTaskForm, value: string) => {
    setNewTaskForm((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmitNewTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    if (!newTaskForm.assignee || isNaN(Number(newTaskForm.assignee))) {
      setFormErrors((prev) => ({ ...prev, assignee: "Assignee is required" }))
      return
    }
    if (!projectId || isNaN(projectId)) {
      setErrorMsg("Invalid project ID. Please refresh the page and try again.")
      return
    }
    setIsSubmitting(true)
    setErrorMsg("")
    try {
      const taskData = {
        title: newTaskForm.title.trim(),
        description: newTaskForm.description.trim(),
        project_id: projectId,
        assignee_id: Number(newTaskForm.assignee),
        status: newTaskForm.status,
        priority: newTaskForm.priority,
        due_date: newTaskForm.due_date,
        progress: newTaskForm.status === "Completed" ? 100 : 0,
        tags: [],
      }
      await createTask(taskData)
      await refetchTasks()
      setNewTaskForm({
        title: "",
        description: "",
        status: "Todo",
        priority: "Medium",
        assignee: "",
        due_date: "",
      })
      setIsNewTaskModalOpen(false)
    } catch (error) {
      console.error("❌ Error creating task:", error)
      setErrorMsg("Failed to create task. Please check your input and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseNewTaskModal = () => {
    setIsNewTaskModalOpen(false)
    setNewTaskForm({
      title: "",
      description: "",
      status: "Todo",
      priority: "Medium",
      due_date: "",
      assignee: "",
    })
    setFormErrors({})
    setErrorMsg("")
  }

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceCol = source.droppableId as keyof typeof tasksByStatus
    const destCol = destination.droppableId as keyof typeof tasksByStatus

    if (!tasksByStatus[sourceCol] || !tasksByStatus[sourceCol][source.index]) {
      console.error("Attempted to drag a non-existent task.")
      return;
    }

    const movedTask = tasksByStatus[sourceCol][source.index]
    const updates: Partial<Task> = { status: destCol }

    if (destCol === "Completed") {
      updates.progress = 100
    } else if (destCol === "In Progress" && movedTask.progress === 0) {
      updates.progress = 25
    }

    try {
      await updateTask(movedTask.id, updates)
      setTimeout(() => {
        refetchTasks()
      }, 300)
    } catch (error) {
      console.error("Error updating task status:", error);
      refetchTasks();
    }
  }

  if (loading || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-3 border-blue-200 rounded-full animate-spin"></div>
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">Loading Project</h3>
          <p className="text-sm text-slate-600">Please wait while we fetch project details...</p>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-3 h-3 text-emerald-600" />
      case "In Progress":
        return <Activity className="w-3 h-3 text-blue-600" />
      case "Review":
        return <AlertCircle className="w-3 h-3 text-amber-600" />
      case "On hold":
        return <Pause className="w-3 h-3 text-slate-600" />
      case "Cancelled":
        return <X className="w-3 h-3 text-red-600" />
      default:
        return <Circle className="w-3 h-3 text-slate-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-700 border-red-200 ring-red-100"
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100"
      case "Low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 ring-slate-100"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100"
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100"
      case "Review":
        return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100"
      case "On hold":
        return "bg-slate-50 text-slate-700 border-slate-200 ring-slate-100"
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200 ring-red-100"
      case "Todo":
        return "bg-purple-50 text-purple-700 border-purple-200 ring-purple-100"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 ring-slate-100"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "from-emerald-500 to-emerald-600"
    if (progress >= 50) return "from-blue-500 to-blue-600"
    if (progress >= 25) return "from-amber-500 to-amber-600"
    return "from-slate-400 to-slate-500"
  }

  const filteredTasks = projectTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const tasksByStatus = {
    Todo: filteredTasks.filter((t) => t.status === "Todo"),
    "In Progress": filteredTasks.filter((t) => t.status === "In Progress"),
    Completed: filteredTasks.filter((t) => t.status === "Completed"),
  }

  const boardColumns = [
    { id: "Todo", title: "To Do", color: "purple" },
    { id: "In Progress", title: "In Progress", color: "blue" },
    { id: "Completed", title: "Completed", color: "emerald" },
  ]

  const renderBoardView = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto min-h-[60vh] pb-4">
        {boardColumns.map((column) => (
          <Droppable droppableId={column.id} key={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "bg-slate-50 rounded-xl p-4 min-w-[300px] flex-1 flex-shrink-0 border-2 transition-all duration-200",
                  snapshot.isDraggingOver
                    ? `border-${column.color}-400 bg-${column.color}-50`
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {column.id === "Todo" && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>}
                    {column.id === "In Progress" && (
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                    {column.id === "Completed" && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>}
                    <h3 className="font-bold text-slate-900 text-base">{column.title}</h3>
                  </div>
                  <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                    {tasksByStatus[column.id as keyof typeof tasksByStatus]?.length || 0}
                  </span>
                </div>
                <div className="space-y-3 min-h-[40px]">
                  {tasksByStatus[column.id as keyof typeof tasksByStatus]?.map((task, idx) => (
                    <Draggable draggableId={task.id.toString()} index={idx} key={task.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer group",
                            snapshot.isDragging && "ring-1 ring-blue-400 shadow-lg rotate-1"
                          )}
                          onClick={() => {
                            setSelectedTask(task)
                            setIsTaskModalOpen(true)
                          }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-slate-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {task.title}
                            </h4>
                            <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all p-0.5 hover:bg-slate-100 rounded-md">
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {task.description && (
                            <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 mb-3">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ring-1",
                                getPriorityColor(task.priority)
                              )}
                            >
                              <Flag className="w-2.5 h-2.5" />
                              {task.priority}
                            </span>
                          </div>
                          {task.progress > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-semibold text-slate-600">Progress</span>
                                <span className="text-sm font-bold text-slate-900">{task.progress}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={cn(
                                    "bg-gradient-to-r h-1.5 rounded-full transition-all duration-500",
                                    getProgressColor(task.progress)
                                  )}
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-xs">
                            {task.assignee && (
                              <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                  {task.assignee.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-slate-700">{task.assignee}</span>
                              </div>
                            )}
                            {task.due_date && (
                              <div className="flex items-center gap-1 text-slate-600">
                                <Calendar className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">
                                  {new Date(task.due_date).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <button
                    onClick={() => setIsNewTaskModalOpen(true)}
                    className="w-full p-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-sm">Add Task</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )

  const renderListView = () => (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
          onClick={() => {
            setSelectedTask(task)
            setIsTaskModalOpen(true)
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex-shrink-0">{getStatusIcon(task.status)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {task.title}
                </h4>
                {task.description && <p className="text-slate-600 mt-0.5 line-clamp-1 text-xs">{task.description}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ring-1",
                  getPriorityColor(task.priority)
                )}
              >
                <Flag className="w-2.5 h-2.5" />
                {task.priority}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ring-1",
                  getStatusColor(task.status)
                )}
              >
                {getStatusIcon(task.status)}
                {task.status}
              </span>
              {task.assignee && (
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {task.assignee.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-700 text-xs">{task.assignee}</span>
                </div>
              )}
              {task.due_date && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{new Date(task.due_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderTableView = () => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Task</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-xs text-slate-600 mt-0.5 line-clamp-1">{task.description}</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border ring-1",
                      getStatusColor(task.status)
                    )}
                  >
                    {getStatusIcon(task.status)}
                    {task.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border ring-1",
                      getPriorityColor(task.priority)
                    )}
                  >
                    <Flag className="w-3 h-3" />
                    {task.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {task.assignee && (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {task.assignee.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-slate-900">{task.assignee}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-xs font-medium text-slate-900">
                  {task.due_date ? (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  ) : (
                    <span className="text-slate-400">No due date</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-200 rounded-full h-2">
                      <div
                        className={cn(
                          "bg-gradient-to-r h-1.5 rounded-full transition-all duration-500",
                          getProgressColor(task.progress)
                        )}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-900 min-w-[2.5rem]">{task.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTask(task)
                        setIsTaskModalOpen(true)
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors p-1.5 hover:bg-blue-50 rounded-md"
                      title="Edit task"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition-colors p-1.5 hover:bg-red-50 rounded-md"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="max-w-full mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/projects"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors group"
            title="Back to Projects"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1.5">{project.name}</h1>
            <p className="text-base text-slate-600 leading-relaxed">{project.description}</p>
            <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                Project ID: {projectId}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5" />
                {projectTasks.length} tasks
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold text-base"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 mb-1.5">Total Tasks</p>
              <p className="text-3xl font-bold text-blue-900">{projectTasks.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-600 mb-1.5">In Progress</p>
              <p className="text-3xl font-bold text-amber-900">{tasksByStatus["In Progress"].length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-200 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-amber-700" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600 mb-1.5">Completed</p>
              <p className="text-3xl font-bold text-emerald-900">{tasksByStatus["Completed"].length}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-200 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-700" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-600 mb-1.5">Team Members</p>
              <p className="text-3xl font-bold text-purple-900">{project.team?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Project Team Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Project Team ({projectTeamMembers.length})
        </h2>
        {projectTeamMembers.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {projectTeamMembers.map((member: any) => (
              <div key={member.id} className="flex items-center gap-2 bg-slate-50 rounded-full pr-4 py-1.5 border border-slate-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-800">{member.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-sm">No team members assigned to this project yet.</p>
        )}
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
          <div className="flex flex-col lg:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full text-sm text-slate-900 placeholder-slate-500 font-medium"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-9 pr-8 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm text-slate-900 appearance-none cursor-pointer font-medium min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="Todo">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="pl-9 pr-8 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm text-slate-900 appearance-none cursor-pointer font-medium min-w-[130px]"
                >
                  <option value="all">All Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-100 rounded-lg p-1.5">
            <button
              onClick={() => setViewMode("board")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-all font-semibold text-sm",
                viewMode === "board"
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-200"
                  : "text-slate-500 hover:text-slate-700"
              )}
              title="Board View"
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-all font-semibold text-sm",
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-200"
                  : "text-slate-500 hover:text-slate-700"
              )}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-all font-semibold text-sm",
                viewMode === "table"
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-200"
                  : "text-slate-500 hover:text-slate-700"
              )}
              title="Table View"
            >
              <Table className="w-4 h-4" />
              <span>Table</span>
            </button>
          </div>
        </div>
        {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 flex-wrap">
            <span className="text-xs font-semibold text-slate-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg font-medium text-xs">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:text-blue-900 p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs rounded-lg font-medium">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="hover:text-emerald-900 p-0.5 hover:bg-emerald-200 rounded-full transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {priorityFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 text-xs rounded-lg font-medium">
                Priority: {priorityFilter}
                <button
                  onClick={() => setPriorityFilter("all")}
                  className="hover:text-amber-900 p-0.5 hover:bg-amber-200 rounded-full transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tasks Display */}
      <div className="w-full">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {projectTasks.length === 0 ? "No tasks yet" : "No tasks match your filters"}
            </h3>
            <p className="text-base text-slate-600 mb-8 max-w-sm mx-auto leading-relaxed">
              {projectTasks.length === 0
                ? "Get started by creating your first task to organize your project work."
                : "Try adjusting your search terms or filters to find the tasks you're looking for."}
            </p>
            {projectTasks.length === 0 ? (
              <button
                onClick={() => setIsNewTaskModalOpen(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-base"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Task</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setPriorityFilter("all")
                }}
                className="inline-flex items-center gap-2 bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors font-semibold text-base"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-600 font-medium">
                Showing <span className="font-bold text-slate-900">{filteredTasks.length}</span> of{" "}
                <span className="font-bold text-slate-900">{projectTasks.length}</span> tasks
              </p>
            </div>
            {viewMode === "board" && renderBoardView()}
            {viewMode === "list" && renderListView()}
            {viewMode === "table" && renderTableView()}
          </>
        )}
      </div>

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Plus size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Create New Task</h2>
                    <p className="text-blue-100 mt-0.5 text-sm">Add a new task to {project.name}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseNewTaskModal}
                  className="p-2.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {errorMsg && (
                <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 font-medium text-sm">{errorMsg}</p>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmitNewTask} className="space-y-6">
                {/* Task Title */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2">
                    <Target size={14} className="text-blue-600" />
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTaskForm.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={cn(
                      "w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-slate-900 font-medium text-sm",
                      formErrors.title
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-500"
                    )}
                    placeholder="Enter a clear and descriptive task title..."
                  />
                  {formErrors.title && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {formErrors.title}
                    </p>
                  )}
                </div>
                {/* Description */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2">
                    <FileText size={14} className="text-blue-600" />
                    Task Description *
                  </label>
                  <textarea
                    value={newTaskForm.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                    className={cn(
                      "w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-slate-900 resize-none text-sm",
                      formErrors.description
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-500"
                    )}
                    placeholder="Describe the task in detail, including requirements and expected outcomes..."
                  />
                  {formErrors.description && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {formErrors.description}
                    </p>
                  )}
                </div>
                {/* Status and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2">
                      <Activity size={14} className="text-blue-600" />
                      Task Status
                    </label>
                    <select
                      value={newTaskForm.status}
                      onChange={(e) => handleInputChange("status", e.target.value as any)}
                      className={cn(
                        "w-full p-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium bg-white text-sm"
                      )}
                    >
                      <option value="Todo">📋 To Do</option>
                      <option value="In Progress">🚀 In Progress</option>
                      <option value="Completed">✅ Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2">
                      <Flag size={14} className="text-blue-600" />
                      Priority Level
                    </label>
                    <select
                      value={newTaskForm.priority}
                      onChange={(e) => handleInputChange("priority", e.target.value as any)}
                      className={cn(
                        "w-full p-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium bg-white text-sm"
                      )}
                    >
                      <option value="Low">🟢 Low Priority</option>
                      <option value="Medium">🟡 Medium Priority</option>
                      <option value="High">🔴 High Priority</option>
                    </select>
                  </div>
                </div>
                {/* Assignee and Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2">
                      <User size={14} className="text-blue-600" />
                      Assignee *
                    </label>
                    <select
                      value={newTaskForm.assignee}
                      onChange={(e) => handleInputChange("assignee", e.target.value)}
                      className={cn(
                        "w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-slate-900 font-medium bg-white text-sm",
                        formErrors.assignee
                          ? "border-red-300 bg-red-50 focus:border-red-500"
                          : "border-slate-200 focus:border-blue-500"
                      )}
                    >
                      <option value="">Select team member...</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          👤 {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                    {formErrors.assignee && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {formErrors.assignee}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2">
                      <Calendar size={14} className="text-blue-600" />
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={newTaskForm.due_date}
                      onChange={(e) => handleInputChange("due_date", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className={cn(
                        "w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-slate-900 font-medium text-sm",
                        formErrors.due_date
                          ? "border-red-300 bg-red-50 focus:border-red-500"
                          : "border-slate-200 focus:border-blue-500"
                      )}
                    />
                    {formErrors.due_date && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {formErrors.due_date}
                      </p>
                    )}
                  </div>
                </div>
                {/* Task Preview */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <Target className="w-4 h-4 text-blue-600" />
                    <h4 className="text-base font-bold text-blue-900">Task Preview</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-semibold text-blue-700">Task Number:</span>
                      <span className="ml-1.5 text-blue-900">{generateTaskNumber()}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-700">Project:</span>
                      <span className="ml-1.5 text-blue-900">{project.name}</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-600">
                  <span className="font-medium">Creating task for:</span> {project.name}
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseNewTaskModal}
                    className="px-6 py-2.5 text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg font-semibold transition-all duration-200 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newTaskForm.title.trim()}
                    onClick={handleSubmitNewTask}
                    className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating Task...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Create Task
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {isTaskModalOpen && selectedTask && (
        <TaskDetailModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          task={selectedTask}
          onUpdate={async (taskId, updates) => {
            await updateTask(taskId, updates)
            setIsTaskModalOpen(false)
            setTimeout(() => {
              refetchTasks()
            }, 300)
          }}
          users={users}
        />
      )}
    </div>
  )
}
