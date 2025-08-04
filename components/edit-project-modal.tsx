"use client"
import type React from "react"
import { useState, useEffect } from "react"
import {
  X,
  Edit,
  Save,
  AlertCircle,
  Users,
  Calendar,
  Flag,
  FileText,
  Target,
  Clock,
  CheckCircle2,
  UserPlus,
  UserMinus,
  Search,
} from "lucide-react"

interface Project {
  id: number
  name: string
  description?: string
  status: "Planning" | "In Progress" | "Completed" | "On Hold"
  priority: "Low" | "Medium" | "High"
  due_date?: string
  progress: number
  team: any[]
  tasks: {
    total: number
    completed: number
  }
}

interface User {
  id: number
  name: string
  email: string
}

interface EditProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project
  onUpdate: (projectId: number, updates: Partial<Project>) => Promise<void>
  users: User[]
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, project, onUpdate, users }) => {
  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState(project.status)
  const [priority, setPriority] = useState(project.priority)
  const [dueDate, setDueDate] = useState(project.due_date || "")
  const [progress, setProgress] = useState(project.progress)
  const [teamMembers, setTeamMembers] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"details" | "team">("details")

  // Helper function to clean description from team data
  const cleanDescription = (desc: string) => {
    if (!desc) return ""

    // Remove team information that might be mixed in the description
    const teamPattern = /\s*•\s*Team:\s*[^•]*$/i
    const cleanedDesc = desc.replace(teamPattern, "").trim()

    // Also remove any email patterns that might be in the description
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    return cleanedDesc.replace(emailPattern, "").replace(/\s+/g, " ").trim()
  }

  // Initialize team members when project changes
  useEffect(() => {
    console.log("🔄 Initializing edit modal with project:", project)

    setName(project.name)

    // Clean the description to remove any team data that might be mixed in
    const cleanedDescription = cleanDescription(project.description || "")
    setDescription(cleanedDescription)

    setStatus(project.status)
    setPriority(project.priority)
    setDueDate(project.due_date || "")
    setProgress(project.progress)

    // Extract team member IDs from project.team
    const memberIds: number[] = []
    console.log("🧑‍🤝‍🧑 Processing project team:", project.team)

    if (project.team && Array.isArray(project.team)) {
      project.team.forEach((member) => {
        console.log("👤 Processing team member:", member)

        if (typeof member === "object" && member !== null) {
          // Handle different possible structures
          if (member.id) {
            memberIds.push(Number(member.id))
          } else if (member.user_id) {
            memberIds.push(Number(member.user_id))
          } else if (member.email) {
            // Find user by email if ID is not available
            const user = users.find((u) => u.email === member.email)
            if (user) {
              memberIds.push(user.id)
            }
          }
        } else if (typeof member === "number") {
          memberIds.push(member)
        } else if (typeof member === "string") {
          // If it's an email string, find the user
          const user = users.find((u) => u.email === member)
          if (user) {
            memberIds.push(user.id)
          }
        }
      })
    }

    console.log("✅ Extracted team member IDs:", memberIds)
    setTeamMembers(memberIds)
  }, [project, users])

  const handleAddTeamMember = (userId: number) => {
    if (!teamMembers.includes(userId)) {
      setTeamMembers([...teamMembers, userId])
    }
  }

  const handleRemoveTeamMember = (userId: number) => {
    setTeamMembers(teamMembers.filter((id) => id !== userId))
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    setErrorMsg("")

    try {
      if (!name.trim()) {
        setErrorMsg("Project name is required")
        return
      }

      if (progress < 0 || progress > 100) {
        setErrorMsg("Progress must be between 0 and 100")
        return
      }

      // Build team array with full user objects
      const teamData = teamMembers.map((userId) => {
        const user = users.find((u) => u.id === userId)
        return user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              role: "Member", // Default role
            }
          : { id: userId }
      })

      const updates = {
        name: name.trim(),
        description: description.trim(), // Use cleaned description
        status: status,
        priority: priority,
        due_date: dueDate || undefined,
        progress: Number(progress),
        team: teamData,
        team_ids: teamMembers,
      }

      console.log("💾 Sending updates:", updates)
      await onUpdate(project.id, updates)
      onClose()
    } catch (error: any) {
      console.error("❌ Error updating project:", error)
      setErrorMsg(error.message || "Failed to update project")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />
      case "In Progress":
        return <Clock className="w-5 h-5 text-blue-600" />
      case "Planning":
        return <Target className="w-5 h-5 text-amber-600" />
      case "On Hold":
        return <Flag className="w-5 h-5 text-slate-600" />
      default:
        return <Target className="w-5 h-5 text-slate-400" />
    }
  }

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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "from-emerald-500 to-emerald-600"
    if (progress >= 50) return "from-blue-500 to-blue-600"
    if (progress >= 25) return "from-amber-500 to-amber-600"
    return "from-slate-400 to-slate-500"
  }

  const filteredAvailableUsers = users
    .filter((user) => !teamMembers.includes(user.id))
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  const selectedUsers = users.filter((user) => teamMembers.includes(user.id))

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Edit size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Edit Project</h2>
                <p className="text-blue-100 mt-1">Update project details and manage your team</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
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
                Team Management ({teamMembers.length})
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          {activeTab === "details" ? (
            <div className="space-y-8">
              {/* Project Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                  <FileText size={16} className="text-blue-600" />
                  Project Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium"
                  placeholder="Enter a descriptive project name..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                  <FileText size={16} className="text-blue-600" />
                  Project Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 resize-none"
                  placeholder="Describe what this project is about, its goals, and key objectives..."
                />
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    {getStatusIcon(status)}
                    Project Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium bg-white"
                  >
                    <option value="Planning">📋 Planning</option>
                    <option value="In Progress">🚀 In Progress</option>
                    <option value="Completed">✅ Completed</option>
                    <option value="On Hold">⏸️ On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <Flag size={16} className="text-blue-600" />
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium bg-white"
                  >
                    <option value="Low">🟢 Low Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="High">🔴 High Priority</option>
                  </select>
                </div>
              </div>

              {/* Due Date and Progress */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <Calendar size={16} className="text-blue-600" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <Target size={16} className="text-blue-600" />
                    Progress ({progress}%)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${getProgressColor(progress)} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Team Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 mb-1">Team Overview</h3>
                    <p className="text-blue-700">
                      {teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""} assigned to this project
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-blue-200 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-700" />
                  </div>
                </div>
              </div>

              {/* Current Team Members */}
              {selectedUsers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-slate-600" />
                    <h4 className="text-lg font-bold text-slate-900">Current Team Members</h4>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {selectedUsers.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between bg-emerald-50 p-4 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-all duration-200 group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-slate-900">{user.name}</p>
                            <p className="text-sm text-slate-600">{user.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveTeamMember(user.id)}
                          className="text-red-600 hover:text-red-800 p-3 hover:bg-red-100 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                          title="Remove from team"
                        >
                          <UserMinus className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Team Members */}
              {users.length > teamMembers.length && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <UserPlus className="w-5 h-5 text-slate-600" />
                    <h4 className="text-lg font-bold text-slate-900">Add Team Members</h4>
                    <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {filteredAvailableUsers.length} available
                    </span>
                  </div>

                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search team members by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                    {filteredAvailableUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all duration-200 group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-slate-900">{user.name}</p>
                            <p className="text-sm text-slate-600">{user.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddTeamMember(user.id)}
                          className="text-emerald-600 hover:text-emerald-800 p-3 hover:bg-emerald-100 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                          title="Add to team"
                        >
                          <UserPlus className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {filteredAvailableUsers.length === 0 && searchTerm && (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                      <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 font-medium">No users found matching "{searchTerm}"</p>
                      <p className="text-sm text-slate-500 mt-1">Try adjusting your search terms</p>
                    </div>
                  )}
                </div>
              )}

              {users.length === teamMembers.length && users.length > 0 && (
                <div className="text-center py-12 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-emerald-900 mb-2">All Team Members Added!</h3>
                  <p className="text-emerald-700">Everyone available is already part of this project.</p>
                </div>
              )}

              {users.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                  <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">No Users Available</h3>
                  <p className="text-slate-500">Users will appear here when they are loaded from the system.</p>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 font-medium">{errorMsg}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600">
              <span className="font-medium">Last updated:</span> {new Date().toLocaleDateString()}
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting || !name.trim()}
                onClick={handleSave}
                className="px-10 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  )
}

export default EditProjectModal
