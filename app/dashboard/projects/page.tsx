"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useProjects } from "@/hooks/use-projects"
import { useTasks } from "@/hooks/use-tasks"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  Users,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Pause,
  Grid3X3,
  List,
  Eye,
  X,
  Flag,
  Filter,
  SortAsc,
  Target,
  Activity,
} from "lucide-react"
import EditProjectModal from "@/components/edit-project-modal"
import NewProjectModal from "@/components/new-project-modal"

interface TeamMember {
  name: string
}

interface NewProjectFormType {
  name: string
  description: string
  status: string
  priority: string
  due_date: string
  progress: number
  invite: string
  team: TeamMember[]
}

export default function ProjectsPage() {
  const { projects, loading, error, stats, refetch, createProject, updateProject, deleteProject } = useProjects()
  const { users } = useTasks()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  // New Project Form State
  const [newProjectForm, setNewProjectForm] = useState({
    name: "",
    description: "",
    status: "Planning" as const,
    priority: "Medium" as const,
    due_date: "",
    progress: 0,
    invite: "",
    team: [] as TeamMember[],
  })
  const [formErrors, setFormErrors] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleEditProject = (project: any) => {
    console.log("🔧 Opening edit modal for project:", project)
    setSelectedProject(project)
    setIsEditProjectModalOpen(true)
  }

  const handleUpdateProject = async (projectId: number, updates: any) => {
    try {
      console.log("💾 Updating project:", projectId, updates)
      await updateProject(projectId, updates)
      await refetch()
      console.log("✅ Project updated successfully")
    } catch (error) {
      console.error("❌ Error updating project:", error)
      throw error
    }
  }

  const handleDeleteProject = async (project: any) => {
    const confirmMessage = `Are you sure you want to delete "${project.name}"?\n\nThis action cannot be undone and will remove:\n• All project data\n• Associated tasks\n• Team assignments`
    if (window.confirm(confirmMessage)) {
      try {
        await deleteProject(project.id)
        console.log("✅ Project deleted successfully")
      } catch (error) {
        console.error("❌ Error deleting project:", error)
        alert("Failed to delete project. Please try again.")
      }
    }
  }

  // Filter projects based on search and filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case "In Progress":
        return <Activity className="w-4 h-4 text-blue-600" />
      case "Planning":
        return <Target className="w-4 h-4 text-amber-600" />
      case "On Hold":
        return <Pause className="w-4 h-4 text-slate-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />
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
      case "Planning":
        return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100"
      case "On Hold":
        return "bg-slate-50 text-slate-700 border-slate-200 ring-slate-100"
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

  // Validate form
  const validateForm = () => {
    const errors: any = {}
    if (!newProjectForm.name.trim()) {
      errors.name = "Project name is required"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string | number) => {
    setNewProjectForm((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev: any) => ({ ...prev, [field]: undefined }))
    }
  }

  // Handle form submission
  const handleSubmitNewProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    setIsSubmitting(true)
    setErrorMsg("")
    try {
      const inviteList = newProjectForm.invite
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email !== "")
      const teamEmails = [...new Set([...newProjectForm.team.map((t) => t.name), ...inviteList])]
      const matchedTeam = users
        .filter((user) => teamEmails.includes(user.email))
        .map((user) => ({
          id: user.id,
          role: "Member",
        }))
      const payload = {
        ...newProjectForm,
        invite: inviteList,
        team: matchedTeam,
      }
      console.log("🧠 Payload to send:", payload)
      await createProject(payload)
      setNewProjectForm({
        name: "",
        description: "",
        status: "Planning",
        priority: "Medium",
        due_date: "",
        progress: 0,
        invite: "",
        team: [],
      })
      setIsNewProjectModalOpen(false)
      await refetch()
    } catch (error: any) {
      console.error("❌ Error creating project:", error)
      setErrorMsg(error.message || "Failed to create project. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle modal close
  const handleCloseNewProjectModal = () => {
    setIsNewProjectModalOpen(false)
    setNewProjectForm({
      name: "",
      description: "",
      status: "Planning",
      priority: "Medium",
      due_date: "",
      progress: 0,
      invite: "",
      team: [],
    })
    setFormErrors({})
    setErrorMsg("")
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">Loading Projects</h3>
          <p className="text-slate-600">Please wait while we fetch your projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-3">Connection Error</h3>
          <p className="text-slate-600 mb-8">{error}</p>
          <div className="space-y-4">
            <button
              onClick={() => refetch()}
              className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-slate-600 text-white px-8 py-4 rounded-xl hover:bg-slate-700 transition-colors font-medium"
            >
              Reload Page
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-6">Make sure your server is running and accessible</p>
        </div>
      </div>
    )
  }

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {filteredProjects.map((project) => (
        <div
          key={project.id}
          className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 hover:border-blue-300 hover:-translate-y-1"
        >
          {/* Header with Actions */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h3
                className="text-xl font-bold text-slate-900 mb-3 truncate group-hover:text-blue-600 transition-colors"
                title={project.name}
              >
                {project.name}
              </h3>
              <p className="text-slate-600 line-clamp-2 leading-relaxed">
                {project.description || "No description provided"}
              </p>
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button
                onClick={() => handleEditProject(project)}
                className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                title="Edit project"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeleteProject(project)}
                className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                title="Delete project"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Status & Priority Badges */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border ring-1 ${getStatusColor(
                project.status,
              )}`}
            >
              {getStatusIcon(project.status)}
              <span>{project.status}</span>
            </div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border ring-1 ${getPriorityColor(
                project.priority,
              )}`}
            >
              <Flag className="w-4 h-4" />
              <span>{project.priority}</span>
            </div>
          </div>
          {/* Progress Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700">Progress</span>
              <span className="text-lg font-bold text-slate-900">{project.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${getProgressColor(
                  project.progress,
                )} h-3 rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
          {/* Project Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-semibold text-blue-700">Tasks</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {project.tasks?.completed || 0}/{project.tasks?.total || 0}
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-emerald-600 mr-2" />
                <span className="text-sm font-semibold text-emerald-700">Team</span>
              </div>
              <p className="text-2xl font-bold text-emerald-900">{project.team?.length || 0}</p>
            </div>
          </div>
          {/* Due Date */}
          {project.due_date && (
            <div className="flex items-center text-sm text-slate-600 mb-6 p-3 bg-slate-50 rounded-xl">
              <Calendar className="w-5 h-5 mr-3 text-slate-500" />
              <span className="font-medium">Due: {new Date(project.due_date).toLocaleDateString()}</span>
            </div>
          )}
          {/* Team Avatars & View Link */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center">
              <div className="flex -space-x-3">
                {project.team && project.team.length > 0 ? (
                  <>
                    {project.team.slice(0, 4).map((member: any, index: number) => (
                      <div
                        key={index}
                        className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-3 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg"
                        title={member.name || member.email || "Team Member"}
                      >
                        {member.name
                          ? member.name.charAt(0).toUpperCase()
                          : member.email
                            ? member.email.charAt(0).toUpperCase()
                            : "T"}
                      </div>
                    ))}
                    {project.team.length > 4 && (
                      <div className="w-10 h-10 bg-slate-400 rounded-full border-3 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        +{project.team.length - 4}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-10 h-10 bg-slate-300 rounded-full border-3 border-white flex items-center justify-center text-slate-600">
                    <Users className="w-5 h-5" />
                  </div>
                )}
              </div>
              {project.team && project.team.length > 0 && (
                <span className="ml-4 text-sm font-medium text-slate-600">
                  {project.team.length} member{project.team.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <Link
              href={`/dashboard/projects/${project.id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-semibold hover:underline transition-all duration-200 group"
            >
              <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider min-w-[200px]">
                Project
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider min-w-[120px]">
                Status
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider min-w-[100px]">
                Priority
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider min-w-[120px]">
                Progress
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider min-w-[100px]">
                Team
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider min-w-[120px]">
                Due Date
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider min-w-[120px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredProjects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="min-w-0">
                    <div className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {project.name}
                    </div>
                    <div className="text-sm text-slate-600 truncate mt-1 max-w-[180px]">
                      {project.description || "No description"}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg border ${getStatusColor(
                      project.status,
                    )}`}
                  >
                    {getStatusIcon(project.status)}
                    <span className="hidden sm:inline">{project.status}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg border ${getPriorityColor(
                      project.priority,
                    )}`}
                  >
                    <Flag className="w-3 h-3" />
                    <span className="hidden sm:inline">{project.priority}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="w-16 bg-slate-200 rounded-full h-2 mr-3">
                      <div
                        className={`bg-gradient-to-r ${getProgressColor(
                          project.progress,
                        )} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 min-w-[2.5rem]">{project.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="flex -space-x-1">
                      {project.team && project.team.length > 0 ? (
                        <>
                          {project.team.slice(0, 2).map((member: any, index: number) => (
                            <div
                              key={index}
                              className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border border-white flex items-center justify-center text-white text-xs font-bold shadow-sm"
                              title={member.name || member.email || "Team Member"}
                            >
                              {member.name
                                ? member.name.charAt(0).toUpperCase()
                                : member.email
                                  ? member.email.charAt(0).toUpperCase()
                                  : "T"}
                            </div>
                          ))}
                          {project.team.length > 2 && (
                            <div className="w-6 h-6 bg-slate-400 rounded-full border border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                              +{project.team.length - 2}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-6 h-6 bg-slate-300 rounded-full border border-white flex items-center justify-center text-slate-600">
                          <Users className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <span className="ml-2 text-xs font-semibold text-slate-700">{project.team?.length || 0}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-medium text-slate-900">
                  {project.due_date ? (
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-slate-500" />
                      <span className="text-xs">{new Date(project.due_date).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs">No due date</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded"
                      title="View project details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleEditProject(project)}
                      className="text-slate-600 hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded"
                      title="Edit project"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project)}
                      className="text-slate-600 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded"
                      title="Delete project"
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
    <div className="max-w-7xl mx-auto space-y-10 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Projects</h1>
            <p className="text-lg text-slate-600">Manage and track your project progress with ease</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-700">{projects.length} Projects</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-emerald-700">{users.length} Team Members</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
        >
          <Plus className="w-6 h-6" />
          <span>New Project</span>
        </button>
      </div>
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-2">Total Projects</p>
                <p className="text-4xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="w-16 h-16 bg-blue-200 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-blue-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-600 mb-2">In Progress</p>
                <p className="text-4xl font-bold text-amber-900">{stats.in_progress}</p>
              </div>
              <div className="w-16 h-16 bg-amber-200 rounded-2xl flex items-center justify-center">
                <Activity className="w-8 h-8 text-amber-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-600 mb-2">Completed</p>
                <p className="text-4xl font-bold text-emerald-900">{stats.completed}</p>
              </div>
              <div className="w-16 h-16 bg-emerald-200 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-2">On Hold</p>
                <p className="text-4xl font-bold text-slate-900">{stats.on_hold}</p>
              </div>
              <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center">
                <Pause className="w-8 h-8 text-slate-700" />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Filters and Controls */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-slate-900 placeholder-slate-500 font-medium"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-12 pr-10 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 appearance-none cursor-pointer font-medium min-w-[140px]"
                >
                  <option value="all">All Status</option>
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              <div className="relative">
                <SortAsc className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="pl-12 pr-10 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 appearance-none cursor-pointer font-medium min-w-[150px]"
                >
                  <option value="all">All Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>
          </div>
          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-slate-100 rounded-xl p-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all font-semibold ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-md ring-1 ring-blue-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-5 h-5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all font-semibold ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-md ring-1 ring-blue-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              title="List View"
            >
              <List className="w-5 h-5" />
              <span>List</span>
            </button>
          </div>
        </div>
        {/* Active Filters Display */}
        {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-200">
            <span className="text-sm font-semibold text-slate-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 text-black rounded-xl font-medium">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:text-blue-900 p-1 hover:bg-blue-200 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 text-sm rounded-xl font-medium">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="hover:text-emerald-900 p-1 hover:bg-emerald-200 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priorityFilter !== "all" && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 text-sm rounded-xl font-medium">
                Priority: {priorityFilter}
                <button
                  onClick={() => setPriorityFilter("all")}
                  className="hover:text-amber-900 p-1 hover:bg-amber-200 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
      {/* Projects Display */}
      <div className="w-full">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <BarChart3 className="w-16 h-16 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {projects.length === 0 ? "No projects yet" : "No projects match your filters"}
            </h3>
            <p className="text-slate-600 mb-10 max-w-md mx-auto text-lg leading-relaxed">
              {projects.length === 0
                ? "Get started by creating your first project to organize your work and collaborate with your team."
                : "Try adjusting your search terms or filters to find the projects you're looking for."}
            </p>
            {projects.length === 0 ? (
              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-5 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
              >
                <Plus className="w-6 h-6" />
                <span>Create Your First Project</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setPriorityFilter("all")
                }}
                className="inline-flex items-center gap-3 bg-slate-600 text-white px-8 py-4 rounded-xl hover:bg-slate-700 transition-colors font-semibold"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-slate-600 font-medium">
                Showing <span className="font-bold text-slate-900">{filteredProjects.length}</span> of{" "}
                <span className="font-bold text-slate-900">{projects.length}</span> projects
              </p>
            </div>
            {/* Projects Grid/List */}
            {viewMode === "grid" ? renderGridView() : renderListView()}
          </>
        )}
      </div>
      {/* Modals */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSubmit={async (data) => {
          await createProject(data)
          await refetch()
        }}
      />
      {isEditProjectModalOpen && selectedProject && (
        <EditProjectModal
          isOpen={isEditProjectModalOpen}
          onClose={() => {
            setIsEditProjectModalOpen(false)
            setSelectedProject(null)
          }}
          project={selectedProject}
          onUpdate={handleUpdateProject}
          users={users}
        />
      )}
    </div>
  )
}
