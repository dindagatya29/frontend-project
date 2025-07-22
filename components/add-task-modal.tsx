"use client"

import type React from "react"
import { useState } from "react"

interface Project {
  id: number
  name: string
}

interface User {
  id: number
  name: string
  email: string
}

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    description: string
    project_id: number
    assignee_id?: number
    status: string
    priority: string
    due_date: string
    progress: number
    tags: string[]
  }) => Promise<void>
  projects?: Project[]
  users?: User[]
}

export default function AddTaskModal({ isOpen, onClose, onSubmit, projects = [], users = [] }: AddTaskModalProps) {
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [selectedProject, setSelectedProject] = useState<number | "">("")
  const [selectedAssignee, setSelectedAssignee] = useState<number | "">("")
  const [taskStatus, setTaskStatus] = useState("Todo")
  const [taskPriority, setTaskPriority] = useState("Medium")
  const [dueDate, setDueDate] = useState("")
  const [progress, setProgress] = useState(0)
  const [tagsInput, setTagsInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      if (!taskTitle.trim()) {
        throw new Error("Task title is required")
      }

      if (!selectedProject) {
        throw new Error("Project is required")
      }

      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const taskData = {
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        project_id: Number(selectedProject),
        assignee_id: selectedAssignee ? Number(selectedAssignee) : undefined,
        status: taskStatus,
        priority: taskPriority,
        due_date: dueDate || "",
        progress: progress,
        tags: tags,
      }

      await onSubmit(taskData)

      // Reset form
      setTaskTitle("")
      setTaskDescription("")
      setSelectedProject("")
      setSelectedAssignee("")
      setTaskStatus("Todo")
      setTaskPriority("Medium")
      setDueDate("")
      setProgress(0)
      setTagsInput("")

      onClose()
    } catch (error) {
      console.error("❌ Form submission error:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to create task")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-100 rounded-full p-2 disabled:opacity-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">📋 Add New Task</h2>
          <p className="text-gray-700">Create a new task and assign it to a project and team member</p>
        </div>

        {/* Error Display */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            <p className="text-sm font-medium">❌ {submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Task Title *</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white text-gray-900 font-medium transition-all duration-200 placeholder:text-gray-500 disabled:opacity-50"
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              disabled={isSubmitting}
              rows={3}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white text-gray-900 font-medium transition-all duration-200 placeholder:text-gray-500 disabled:opacity-50 resize-none"
              placeholder="Enter task description (optional)"
            />
          </div>

          {/* Project Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Project *</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value ? Number(e.target.value) : "")}
              disabled={isSubmitting}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white appearance-none text-gray-900 font-medium transition-all duration-200 disabled:opacity-50"
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  📁 {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assignee Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Assignee</label>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value ? Number(e.target.value) : "")}
              disabled={isSubmitting}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white appearance-none text-gray-900 font-medium transition-all duration-200 disabled:opacity-50"
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  👤 {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Status</label>
              <select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white appearance-none text-gray-900 font-medium transition-all duration-200 disabled:opacity-50"
              >
                <option value="Todo">📋 Todo</option>
                <option value="In Progress">🔄 In Progress</option>
                <option value="Completed">✅ Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white appearance-none text-gray-900 font-medium transition-all duration-200 disabled:opacity-50"
              >
                <option value="Low">🟢 Low Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="High">🔴 High Priority</option>
              </select>
            </div>
          </div>

          {/* Due Date and Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSubmitting}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white text-gray-900 font-medium transition-all duration-200 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Progress ({progress}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                disabled={isSubmitting}
                className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white text-gray-900 font-medium transition-all duration-200 placeholder:text-gray-500 disabled:opacity-50"
              placeholder="Enter tags separated by commas (e.g., design, frontend, urgent)"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !taskTitle.trim() || !selectedProject}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-semibold text-lg shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Creating Task...</span>
              </div>
            ) : (
              "Create Task"
            )}
          </button>
        </form>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 p-3 bg-gray-50 rounded-xl text-xs text-gray-600">
            <p>
              <strong>Debug:</strong>
            </p>
            <p>Projects available: {projects.length}</p>
            <p>Users available: {users.length}</p>
            <p>Selected project: {selectedProject}</p>
            <p>Selected assignee: {selectedAssignee}</p>
          </div>
        )}
      </div>
    </div>
  )
}
