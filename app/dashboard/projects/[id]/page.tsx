"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

import { useProjects } from "@/hooks/use-projects"
import { useTasks } from '@/hooks/use-tasks';
import {
  Calendar,
  Users,
  BarChart3,
  Clock,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle,
  Circle,
  AlertCircle,
  Pause,
  Grid3X3,
  List,
  Table,
  X,
  User,
  FileText,
  Flag,
  CalendarDays,
  Save,
} from "lucide-react"
import TaskDetailModal from '@/components/task-detail-modal';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Task {
  id: number
  project_id: number
  title: string
  description?: string
  status: 'Todo' | 'In Progress' | 'Completed'
  priority: 'Low' | 'Medium' | 'High'
  assignee?: string
  due_date?: string
  progress: number
  created_at: string
  updated_at: string
  task_number?: string
}

interface NewTaskForm {
  title: string
  description: string
  status: 'Todo' | 'In Progress' | 'Completed'
  priority: 'Low' | 'Medium' | 'High'
  assignee: string
  due_date: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = Number.parseInt(params.id as string)
  const { getProjectById, getProjectTasks } = useProjects()
  const [project, setProject] = useState<any>(null)
  const { tasks: allTasks, refetch: refetchTasks, users, createTask, updateTask } = useTasks();

  // Filter tasks untuk project ini
  const projectTasks = allTasks.filter(t => t.project_id === projectId && ['Todo', 'In Progress', 'Completed'].includes(t.status));
  const [viewMode, setViewMode] = useState<"board" | "list" | "table">("board")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  // Tambahkan state untuk draggedTask
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  // New Task Form State
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
  const [errorMsg, setErrorMsg] = useState('');

  // Get current user and permissions
  useEffect(() => {
    const userStr = localStorage.getItem("nexapro_user")
    if (userStr) {
      const user = JSON.parse(userStr)
      // setCurrentUser(user) // This state doesn't exist in the original file
      
      // Fetch user permissions from backend
      fetch(`http://localhost:8000/api/admin/user-permissions/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            // setUserPermissions(data.data.map((p: any) => p.name)) // This state doesn't exist in the original file
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
          // setUserPermissions(rolePermissions[user.role as keyof typeof rolePermissions] || []) // This state doesn't exist in the original file
        })
    }
  }, [])

  // Real-time synchronization
  useEffect(() => {
    const handleProjectUpdated = (event: CustomEvent) => {
      console.log("🔄 Real-time project update received in Project Detail:", event.detail)
      const { projectId, project } = event.detail
      
      // If this is the current project, update the local state
      if (projectId === parseInt(params.id as string)) {
        setProject(project)
      }
      
      // Refetch tasks to get latest data
      refetchTasks()
    }

    const handleTaskUpdated = (event: CustomEvent) => {
      console.log("🔄 Real-time task update received in Project Detail:", event.detail)
      // Refetch tasks to get latest data
      refetchTasks()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("projectUpdated", handleProjectUpdated as EventListener)
      window.addEventListener("taskUpdated", handleTaskUpdated as EventListener)
      return () => {
        window.removeEventListener("projectUpdated", handleProjectUpdated as EventListener)
        window.removeEventListener("taskUpdated", handleTaskUpdated as EventListener)
      }
    }
  }, [params.id, refetchTasks])

  useEffect(() => {
    if (projectId) {
      const projectData = getProjectById(projectId)
      const projectTasks = getProjectTasks(projectId)
      setProject(projectData)
    }
  }, [projectId, getProjectById, getProjectTasks])

  // Generate next task number
  const generateTaskNumber = () => {
    const taskCount = projectTasks.length + 1
    return `TASK-${taskCount.toString().padStart(3, "0")}`
  }

  // Validate form
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

  // Handle form input changes
  const handleInputChange = (field: keyof NewTaskForm, value: string) => {
    setNewTaskForm((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Handle form submission
  const handleSubmitNewTask = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }
    if (!newTaskForm.assignee || isNaN(Number(newTaskForm.assignee))) {
      setFormErrors((prev) => ({ ...prev, assignee: 'Assignee is required' }));
      return;
    }

    setIsSubmitting(true)
    setErrorMsg('');

    try {
      // Panggil API createTask
      const created = await createTask({
        title: newTaskForm.title,
        description: newTaskForm.description,
        project_id: projectId,
        assignee_id: Number(newTaskForm.assignee),
        status: newTaskForm.status,
        priority: newTaskForm.priority,
        due_date: newTaskForm.due_date,
        progress: 0,
        tags: [],
      });
      // Refetch tasks project dan global
      if (refetchTasks) refetchTasks();
      // Reset form
      setNewTaskForm({
        title: '',
        description: '',
        status: 'Todo',
        priority: 'Medium',
        assignee: '',
        due_date: '',
      });
      setIsNewTaskModalOpen(false);
      // Optionally, refetch project tasks here
    } catch (error) {
      setErrorMsg('Failed to create task. Please check your input and try again.');
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle modal close
  const handleCloseNewTaskModal = () => {
    setIsNewTaskModalOpen(false)
    setNewTaskForm({
      title: "",
      description: "",
      status: "Todo",
      priority: "Medium",
      assignee: "",
      due_date: "",
    })
    setFormErrors({})
  }

  // Tambahkan handler drag and drop
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDrop = async (e: React.DragEvent, newStatus: 'Todo' | 'In Progress' | 'Completed') => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      let updates: any = { status: newStatus }
      
      // Auto-update progress when status is changed to Completed
      if (newStatus === 'Completed') {
        updates.progress = 100
        console.log(`🔄 Auto-setting progress to 100% for task ${draggedTask.title} (status: Completed)`)
      } else if (newStatus === 'In Progress' && draggedTask.progress === 0) {
        updates.progress = 25
        console.log(`🔄 Auto-setting progress to 25% for task ${draggedTask.title} (status: In Progress)`)
      }
      
      await updateTask(draggedTask.id, updates);
      if (refetchTasks) refetchTasks();
    }
    setDraggedTask(null);
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600">The project you're looking for doesn't exist.</p>
          <Link href="/dashboard/projects" className="text-green-600 hover:text-blue-800 mt-4 inline-block">
            ← Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "In Progress":
        return <Circle className="w-4 h-4 text-green-600" />
      case "Review":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case "On hold":
        return <Pause className="w-4 h-4 text-gray-600" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-green-100 text-blue-800 border-green-200"
      case "Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "On hold":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Todo":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
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
    Todo: filteredTasks.filter(t => t.status === 'Todo'),
    'In Progress': filteredTasks.filter(t => t.status === 'In Progress'),
    Completed: filteredTasks.filter(t => t.status === 'Completed'),
  };

  // Pada onDragEnd, hapus semua setTasksByStatus dan update tasksByStatus secara stateless
  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const sourceCol = source.droppableId as keyof typeof tasksByStatus;
    const destCol = destination.droppableId as keyof typeof tasksByStatus;
    const movedTask = tasksByStatus[sourceCol][source.index];
    
    // Apply bidirectional sync logic
    let updates: any = { status: destCol }
    
    // Auto-update progress when status is changed to Completed
    if (destCol === 'Completed') {
      updates.progress = 100
      console.log(`🔄 Auto-setting progress to 100% for task ${movedTask.title} (status: Completed)`)
    } else if (destCol === 'In Progress' && movedTask.progress === 0) {
      updates.progress = 25
      console.log(`🔄 Auto-setting progress to 25% for task ${movedTask.title} (status: In Progress)`)
    }
    
    // Update backend
    await updateTask(movedTask.id, updates);
    if (refetchTasks) refetchTasks();
  };

  // Komentari/disable kolom lama:
  // const boardColumns = [
  //   { id: 'Not started', title: 'Not started' },
  //   { id: 'In progress', title: 'In progress' },
  //   { id: 'Review', title: 'Review' },
  //   { id: 'On hold', title: 'On hold' },
  //   { id: 'Closed', title: 'Closed' },
  // ];
  // Ganti dengan kolom baru:
  const boardColumns = [
    { id: 'Todo', title: 'To Do' },
    { id: 'In Progress', title: 'In Progress' },
    { id: 'Completed', title: 'Completed' },
  ];

  const renderBoardView = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto min-h-[60vh] pb-4">
        {boardColumns.map((column) => (
          <Droppable droppableId={column.id} key={column.id}>
            {(provided: import('@hello-pangea/dnd').DroppableProvided, snapshot: import('@hello-pangea/dnd').DroppableStateSnapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`bg-gray-50 rounded-lg p-4 min-w-[340px] flex-1 flex-shrink-0 border ${snapshot.isDraggingOver ? 'border-blue-400' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    {column.id === 'Todo' && <Circle className="w-4 h-4 text-gray-400" />}
                    {column.id === 'In Progress' && <Circle className="w-4 h-4 text-green-600" />}
                    {column.id === 'Completed' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    <span className="ml-2">{column.title}</span>
                  </h3>
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{tasksByStatus[column.id as keyof typeof tasksByStatus]?.length || 0}</span>
                </div>
                <div className="space-y-3 min-h-[40px]">
                  {tasksByStatus[column.id as keyof typeof tasksByStatus]?.map((task, idx) => (
                    <Draggable draggableId={task.id.toString()} index={idx} key={task.id}>
                      {(provided: import('@hello-pangea/dnd').DraggableProvided, snapshot: import('@hello-pangea/dnd').DraggableStateSnapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${snapshot.isDragging ? 'ring-2 ring-blue-400' : ''}`}
                          onClick={() => {
                            setSelectedTask(task)
                            setIsTaskModalOpen(true)
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{task.title}</h4>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                          {task.description && <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                          </div>
                          {task.progress > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">Progress</span>
                                <span className="text-xs text-gray-900 font-medium">{task.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-green-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${task.progress}%` }}></div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            {task.assignee && (
                              <div className="flex items-center">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-1">
                                  {task.assignee.charAt(0)}
                                </div>
                                <span>{task.assignee}</span>
                              </div>
                            )}
                            {task.due_date && (
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>{new Date(task.due_date).toLocaleDateString()}</span>
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
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 mx-auto" />
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
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => {
            setSelectedTask(task)
            setIsTaskModalOpen(true)
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              {getStatusIcon(task.status)}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              {task.assignee && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2">
                    {task.assignee.charAt(0)}
                  </div>
                  <span>{task.assignee}</span>
                </div>
              )}
              {task.due_date && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(task.due_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderTableView = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    {task.description && <div className="text-sm text-gray-500">{task.description}</div>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {task.assignee && (
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2">
                        {task.assignee.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-900">{task.assignee}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${task.progress}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-900">{task.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTask(task)
                        setIsTaskModalOpen(true)
                      }}
                      className="text-green-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
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
    <div className="max-w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/projects" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{projectTasks.length}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{tasksByStatus["In Progress"].length}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{tasksByStatus["Completed"].length}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{project.team?.length || 0}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
              />
            </div>
            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="Todo">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On hold">On Hold</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("board")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "board" ? "bg-white text-green-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
              title="Board View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "list" ? "bg-white text-green-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "table" ? "bg-white text-green-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Display */}
      <div className="w-full">
        {viewMode === "board" && renderBoardView()}
        {viewMode === "list" && renderListView()}
        {viewMode === "table" && renderTableView()}
      </div>

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Plus size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
                    <p className="text-gray-600 mt-1">Add a new task to {project.name}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseNewTaskModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitNewTask} className="space-y-6">
                {/* Task Title */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <FileText size={16} className="text-green-600" />
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTaskForm.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-200 text-gray-900 ${
                      formErrors.title
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="Enter task title..."
                  />
                  {formErrors.title && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {formErrors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <FileText size={16} className="text-green-600" />
                    Description *
                  </label>
                  <textarea
                    value={newTaskForm.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-200 text-gray-900 resize-none ${
                      formErrors.description
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="Describe the task in detail..."
                  />
                  {formErrors.description && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {formErrors.description}
                    </p>
                  )}
                </div>

                {/* Status and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Circle size={16} className="text-green-600" />
                      Status
                    </label>
                    <select
                      value={newTaskForm.status}
                      onChange={(e) => handleInputChange("status", e.target.value as any)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900"
                    >
                      <option value="Todo">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On hold">On Hold</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Flag size={16} className="text-green-600" />
                      Priority
                    </label>
                    <select
                      value={newTaskForm.priority}
                      onChange={(e) => handleInputChange("priority", e.target.value as any)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                {/* Assignee and Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-900 font-semibold mb-1">Assignee *</label>
                    <select
                      value={newTaskForm.assignee}
                      onChange={e => handleInputChange('assignee', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select team member...</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                      ))}
                    </select>
                    {formErrors.assignee && (
                      <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {formErrors.assignee}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <CalendarDays size={16} className="text-green-600" />
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={newTaskForm.due_date}
                      onChange={(e) => handleInputChange("due_date", e.target.value)}
                      className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-200 text-gray-900 ${
                        formErrors.due_date
                          ? "border-red-300 bg-red-50 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    />
                    {formErrors.due_date && (
                      <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {formErrors.due_date}
                      </p>
                    )}
                  </div>
                </div>

                {/* Task Number Preview */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-green-200">
                  <p className="text-sm text-blue-800 font-medium">
                    Task Number: <span className="font-bold">{generateTaskNumber()}</span>
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseNewTaskModal}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Create Task
                      </>
                    )}
                  </button>
                </div>
                {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
              </form>
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
            await updateTask(taskId, updates);
            setIsTaskModalOpen(false);
            if (refetchTasks) refetchTasks();
          }}
          users={users}
        />
      )}
    </div>
  )
}
