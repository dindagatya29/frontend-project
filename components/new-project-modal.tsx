"use client"
import type React from "react"
import { useState, useEffect } from "react"
import {
  X,
  Plus,
  Calendar,
  Flag,
  FileText,
  Users,
  Mail,
  FolderOpen,
  Target,
  UserPlus,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react"

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    team_ids: any
    name: string
    description: string
    status: string
    priority: string
    due_date: string
    progress: number
  }) => Promise<void>
  initialData?: {
    name: string
    description: string
    status: string
    priority: string
    due_date: string
    progress: number
  }
}

export default function NewProjectModal({ isOpen, onClose, onSubmit, initialData }: NewProjectModalProps) {
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedParent, setSelectedParent] = useState("Projects")
  const [deadline, setDeadline] = useState("")
  const [invitedUsers, setInvitedUsers] = useState<string[]>([])
  const [newUserEmail, setNewUserEmail] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [userOptions, setUserOptions] = useState<{ id: number; name: string; email: string }[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"details" | "team">("details")

  useEffect(() => {
    if (isOpen && initialData) {
      setProjectName(initialData.name || "")
      setDescription(initialData.description || "")
      setSelectedParent("Projects")
      setDeadline(initialData.due_date || "")
      setPriority(initialData.priority || "Medium")
    }
  }, [isOpen, initialData])

  useEffect(() => {
    if (isOpen) {
      fetch("https://nexapro.web.id/api/users")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.data)) setUserOptions(data.data)
        })
        .catch(() => setUserOptions([]))
    }
  }, [isOpen])

  const resetForm = () => {
    setProjectName("")
    setDescription("")
    setSelectedParent("Projects")
    setDeadline("")
    setInvitedUsers([])
    setNewUserEmail("")
    setPriority("Medium")
    setSearchTerm("")
    setActiveTab("details")
    setSubmitError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!projectName.trim()) {
        throw new Error("Project name is required")
      }

      const invitedUserIds = userOptions.filter((user) => invitedUsers.includes(user.email)).map((user) => user.id)

      // Map form data to backend format
      const projectData = {
        name: projectName.trim(),
        description: description.trim() || `Project under ${selectedParent}`,
        status: "Planning" as const,
        priority: priority as "Low" | "Medium" | "High",
        due_date: deadline || "",
        progress: 0,
        team_ids: invitedUserIds,
      }

      await onSubmit(projectData)
      resetForm()
      onClose()
    } catch (error) {
      console.error("❌ Form submission error:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to create project")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm()
      onClose()
    }
  }

  const handleAddUser = (userEmail: string) => {
    if (userEmail && !invitedUsers.includes(userEmail)) {
      setInvitedUsers([...invitedUsers, userEmail])
      setNewUserEmail("")
      setSearchTerm("")
    }
  }

  const handleRemoveUser = (userEmail: string) => {
    setInvitedUsers(invitedUsers.filter((email) => email !== userEmail))
  }

  const filteredUsers = userOptions.filter(
    (user) =>
      !invitedUsers.includes(user.email) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200"
      case "Medium":
        return "text-amber-600 bg-amber-50 border-amber-200"
      case "Low":
        return "text-emerald-600 bg-emerald-50 border-emerald-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  const getParentIcon = (parent: string) => {
    switch (parent) {
      case "Marketing":
        return "📈"
      case "Development":
        return "💻"
      case "Design":
        return "🎨"
      default:
        return "📁"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Plus size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Create New Project</h2>
                <p className="text-blue-100 mt-1">Set up your project and build your team</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-3 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-slate-50">
          <div className="flex">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 px-8 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === "details"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText size={18} />
                Project Details
              </div>
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`flex-1 px-8 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === "team"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Users size={18} />
                Team Setup ({invitedUsers.length})
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[50vh]">
          {submitError && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 font-medium">{submitError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {activeTab === "details" ? (
              <div className="space-y-8">
                {/* Project Category */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <FolderOpen size={16} className="text-blue-600" />
                    Project Category
                  </label>
                  <select
                    value={selectedParent}
                    onChange={(e) => setSelectedParent(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium bg-white"
                  >
                    <option value="Projects">{getParentIcon("Projects")} General Projects</option>
                    <option value="Marketing">{getParentIcon("Marketing")} Marketing</option>
                    <option value="Development">{getParentIcon("Development")} Development</option>
                    <option value="Design">{getParentIcon("Design")} Design</option>
                  </select>
                </div>

                {/* Project Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <Target size={16} className="text-blue-600" />
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder:text-slate-400"
                    placeholder="Enter a descriptive project name..."
                    required
                  />
                </div>

                {/* Project Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <FileText size={16} className="text-blue-600" />
                    Project Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                    rows={4}
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 resize-none placeholder:text-slate-400"
                    placeholder="Describe what this project is about, its goals, and key objectives..."
                  />
                </div>

                {/* Priority and Deadline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                      <Flag size={16} className="text-blue-600" />
                      Priority Level
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium bg-white"
                    >
                      <option value="Low">🟢 Low Priority</option>
                      <option value="Medium">🟡 Medium Priority</option>
                      <option value="High">🔴 High Priority</option>
                    </select>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(
                          priority,
                        )}`}
                      >
                        <Flag className="w-3 h-3" />
                        {priority} Priority
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                      <Calendar size={16} className="text-blue-600" />
                      Project Deadline
                    </label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      disabled={isSubmitting}
                      className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium"
                    />
                    {deadline && (
                      <p className="mt-2 text-sm text-slate-600">
                        📅 Due in{" "}
                        {Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Team Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-blue-900 mb-1">Team Setup</h3>
                      <p className="text-blue-700">
                        {invitedUsers.length} team member{invitedUsers.length !== 1 ? "s" : ""} invited
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-blue-200 rounded-2xl flex items-center justify-center">
                      <Users className="w-8 h-8 text-blue-700" />
                    </div>
                  </div>
                </div>

                {/* Add Team Members */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <UserPlus className="w-5 h-5 text-slate-600" />
                    <h4 className="text-lg font-bold text-slate-900">Invite Team Members</h4>
                  </div>

                  {/* Search Users */}
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search team members by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>

                    {/* Manual Email Input */}
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="email"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="Or enter email address directly..."
                          className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={isSubmitting || !newUserEmail.trim()}
                        onClick={() => handleAddUser(newUserEmail)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <UserPlus size={18} />
                        Invite
                      </button>
                    </div>
                  </div>

                  {/* Available Users */}
                  {filteredUsers.length > 0 && (
                    <div className="mt-6">
                      <h5 className="text-sm font-semibold text-slate-700 mb-3">Available Team Members:</h5>
                      <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                        {filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all duration-200 group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                <p className="text-xs text-slate-600">{user.email}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddUser(user.email)}
                              className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                              title="Add to team"
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Invited Users */}
                {invitedUsers.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h4 className="text-lg font-bold text-slate-900">Invited Team Members</h4>
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {invitedUsers.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {invitedUsers.map((email, idx) => {
                        const user = userOptions.find((u) => u.email === email)
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-emerald-50 p-4 rounded-xl border border-emerald-200 group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {user ? user.name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {user ? user.name : "External User"}
                                </p>
                                <p className="text-xs text-slate-600">{email}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveUser(email)}
                              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                              title="Remove from team"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {invitedUsers.length === 0 && filteredUsers.length === 0 && !searchTerm && (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                    <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-600 mb-2">No Team Members Yet</h3>
                    <p className="text-slate-500">
                      Start by searching for users or entering email addresses to build your team.
                    </p>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600">
              <span className="font-medium">Step {activeTab === "details" ? "1" : "2"} of 2:</span>{" "}
              {activeTab === "details" ? "Project Details" : "Team Setup"}
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-8 py-3 text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              {activeTab === "details" ? (
                <button
                  type="button"
                  onClick={() => setActiveTab("team")}
                  disabled={!projectName.trim()}
                  className="px-10 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  Next: Team Setup
                  <Users size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !projectName.trim()}
                  onClick={handleSubmit}
                  className="px-10 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Create Project
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
