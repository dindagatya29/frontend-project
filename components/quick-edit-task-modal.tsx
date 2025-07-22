"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface Task {
  id: number
  title: string
  description?: string
  project: string
  project_id: number
  assignee: string
  assignee_id?: number
  status: "Todo" | "In Progress" | "Completed"
  priority: "Low" | "Medium" | "High"
  dueDate?: string
  progress: number
  tags: string[]
}

interface QuickEditTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (id: number, updates: any) => Promise<void>
  task: Task | null
}

export default function QuickEditTaskModal({ isOpen, onClose, onSubmit, task }: QuickEditTaskModalProps) {
  const [taskStatus, setTaskStatus] = useState("Todo")
  const [taskPriority, setTaskPriority] = useState("Medium")
  const [progress, setProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Update form when task changes
  useEffect(() => {
    if (task) {
      setTaskStatus(task.status)
      setTaskPriority(task.priority)
      setProgress(task.progress)
    }
  }, [task])

  if (!isOpen || !task) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const updates = {
        status: taskStatus,
        priority: taskPriority,
        progress: progress,
      }

      await onSubmit(task.id, updates)
      onClose()
    } catch (error) {
      console.error("❌ Quick edit error:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to update task")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">⚡ Quick Edit Task</h2>
          <p className="text-sm text-gray-600 line-clamp-1">{task.title}</p>
        </div>

        {/* Error Display */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <p className="text-sm">❌ {submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white text-gray-900 disabled:opacity-50"
            >
              <option value="Todo">📋 Todo</option>
              <option value="In Progress">🔄 In Progress</option>
              <option value="Completed">✅ Completed</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white text-gray-900 disabled:opacity-50"
            >
              <option value="Low">🟢 Low Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="High">🔴 High Priority</option>
            </select>
          </div>

          {/* Progress */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Progress ({progress}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              disabled={isSubmitting}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Auto-complete logic */}
          {progress === 100 && taskStatus !== "Completed" && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                💡 <strong>Tip:</strong> Progress is 100%, status will be automatically set to "Completed"
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Updating...</span>
                </div>
              ) : (
                "Update Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
