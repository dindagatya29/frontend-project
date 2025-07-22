"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Calendar, ChevronLeft, ChevronRight, Filter, Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Types
interface Task {
  id: string
  title: string
  startDate: Date
  endDate: Date
  progress: number
  priority: "High" | "Medium" | "Low"
  status: "Todo" | "In Progress" | "Completed" | "On Hold"
  assignee: string
  projectId: string
  dependencies?: string[]
  color: string
}

interface Project {
  id: string
  name: string
  color: string
  tasks: Task[]
}

// Mock data
const mockProjects: Project[] = [
  {
    id: "project-1",
    name: "Gulgowski Project",
    color: "#3B82F6",
    tasks: [
      {
        id: "task-1",
        title: "Project Planning & Research",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-02-01"),
        progress: 100,
        priority: "High",
        status: "Completed",
        assignee: "Sarah Wilson",
        projectId: "project-1",
        color: "#10B981",
      },
      {
        id: "task-2",
        title: "UI/UX Design Phase",
        startDate: new Date("2024-01-25"),
        endDate: new Date("2024-02-15"),
        progress: 75,
        priority: "High",
        status: "In Progress",
        assignee: "John Doe",
        projectId: "project-1",
        dependencies: ["task-1"],
        color: "#F59E0B",
      },
      {
        id: "task-3",
        title: "Development Sprint 1",
        startDate: new Date("2024-02-10"),
        endDate: new Date("2024-03-05"),
        progress: 30,
        priority: "Medium",
        status: "In Progress",
        assignee: "Alex Johnson",
        projectId: "project-1",
        dependencies: ["task-2"],
        color: "#3B82F6",
      },
    ],
  },
  {
    id: "project-2",
    name: "SCCC Marketing",
    color: "#8B5CF6",
    tasks: [
      {
        id: "task-4",
        title: "Market Research",
        startDate: new Date("2024-01-20"),
        endDate: new Date("2024-02-10"),
        progress: 90,
        priority: "Medium",
        status: "In Progress",
        assignee: "Jane Smith",
        projectId: "project-2",
        color: "#8B5CF6",
      },
      {
        id: "task-5",
        title: "Campaign Strategy",
        startDate: new Date("2024-02-05"),
        endDate: new Date("2024-02-25"),
        progress: 45,
        priority: "High",
        status: "In Progress",
        assignee: "Mike Brown",
        projectId: "project-2",
        dependencies: ["task-4"],
        color: "#EF4444",
      },
    ],
  },
  {
    id: "project-3",
    name: "Ward Development",
    color: "#10B981",
    tasks: [
      {
        id: "task-6",
        title: "Backend Development",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-03-15"),
        progress: 20,
        priority: "High",
        status: "In Progress",
        assignee: "Tom Wilson",
        projectId: "project-3",
        color: "#10B981",
      },
    ],
  },
]

type ViewMode = "week" | "month" | "quarter"

export default function TimelineView() {
  const [projects] = useState<Project[]>(mockProjects)
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Calculate timeline dimensions
  const getTimelineDates = () => {
    const start = new Date(currentDate)
    const end = new Date(currentDate)

    switch (viewMode) {
      case "week":
        start.setDate(start.getDate() - start.getDay())
        end.setDate(start.getDate() + 6)
        break
      case "month":
        start.setDate(1)
        end.setMonth(end.getMonth() + 1)
        end.setDate(0)
        break
      case "quarter":
        start.setMonth(Math.floor(start.getMonth() / 3) * 3, 1)
        end.setMonth(start.getMonth() + 3)
        end.setDate(0)
        break
    }

    return { start, end }
  }

  const { start: timelineStart, end: timelineEnd } = getTimelineDates()
  const timelineDays = Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24))

  // Generate date headers
  const generateDateHeaders = () => {
    const headers = []
    const current = new Date(timelineStart)

    while (current <= timelineEnd) {
      headers.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return headers
  }

  const dateHeaders = generateDateHeaders()

  // Calculate task position and width
  const getTaskPosition = (task: Task) => {
    const taskStart = Math.max(task.startDate.getTime(), timelineStart.getTime())
    const taskEnd = Math.min(task.endDate.getTime(), timelineEnd.getTime())

    const startOffset = (taskStart - timelineStart.getTime()) / (1000 * 60 * 60 * 24)
    const duration = (taskEnd - taskStart) / (1000 * 60 * 60 * 24)

    const left = (startOffset / timelineDays) * 100
    const width = (duration / timelineDays) * 100

    return { left: `${left}%`, width: `${Math.max(width, 2)}%` }
  }

  // Navigation functions
  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    switch (viewMode) {
      case "week":
        newDate.setDate(newDate.getDate() - 7)
        break
      case "month":
        newDate.setMonth(newDate.getMonth() - 1)
        break
      case "quarter":
        newDate.setMonth(newDate.getMonth() - 3)
        break
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    switch (viewMode) {
      case "week":
        newDate.setDate(newDate.getDate() + 7)
        break
      case "month":
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case "quarter":
        newDate.setMonth(newDate.getMonth() + 3)
        break
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Drag and drop handlers
  const handleTaskDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleTaskDrop = (e: React.DragEvent, newStartDate: Date) => {
    e.preventDefault()
    if (!draggedTask) return

    const duration = draggedTask.endDate.getTime() - draggedTask.startDate.getTime()
    const newEndDate = new Date(newStartDate.getTime() + duration)

    // Update task dates (in real app, this would be an API call)
    console.log("Task moved:", {
      taskId: draggedTask.id,
      newStartDate,
      newEndDate,
    })

    setDraggedTask(null)
  }

  // Export functionality
  const handleExport = () => {
    const exportData = {
      timeline: {
        viewMode,
        startDate: timelineStart,
        endDate: timelineEnd,
        projects: projects.map((project) => ({
          ...project,
          tasks: project.tasks.map((task) => ({
            ...task,
            position: getTaskPosition(task),
          })),
        })),
      },
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `timeline-${viewMode}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDateHeader = (date: Date) => {
    switch (viewMode) {
      case "week":
        return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })
      case "month":
        return date.getDate().toString()
      case "quarter":
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      default:
        return date.getDate().toString()
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

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold">Project Timeline</h2>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={navigatePrevious}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={navigateNext}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Timeline Container */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {timelineStart.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
                {viewMode === "quarter" &&
                  ` - ${timelineEnd.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
              </CardTitle>
              <div className="text-sm text-gray-500">
                {projects.reduce((total, project) => total + project.tasks.length, 0)} tasks across {projects.length}{" "}
                projects
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto" ref={timelineRef}>
              <div className="min-w-[800px]">
                {/* Date Headers */}
                <div className="flex border-b bg-gray-50">
                  <div className="w-64 p-4 border-r bg-white">
                    <span className="font-medium text-sm text-gray-600">Projects & Tasks</span>
                  </div>
                  <div className="flex-1 flex">
                    {dateHeaders.map((date, index) => (
                      <div
                        key={index}
                        className="flex-1 p-2 text-center border-r text-xs font-medium text-gray-600 min-w-[40px]"
                        style={{ width: `${100 / dateHeaders.length}%` }}
                      >
                        {formatDateHeader(date)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Rows */}
                {projects.map((project) => (
                  <div key={project.id} className="border-b">
                    {/* Project Header */}
                    <div className="flex items-center bg-gray-25">
                      <div className="w-64 p-4 border-r bg-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color }} />
                          <span className="font-semibold text-sm">{project.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {project.tasks.length} tasks
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-1 h-12 bg-gray-25 border-r relative">
                        {/* Project timeline background */}
                      </div>
                    </div>

                    {/* Task Rows */}
                    {project.tasks.map((task) => {
                      const position = getTaskPosition(task)
                      return (
                        <div key={task.id} className="flex items-center hover:bg-gray-50">
                          <div className="w-64 p-3 border-r bg-white">
                            <div className="space-y-1">
                              <div className="font-medium text-sm truncate">{task.title}</div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </Badge>
                                <span className="text-xs text-gray-500">{task.assignee}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 h-16 border-r relative bg-white">
                            {/* Task Bar */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="absolute top-1/2 transform -translate-y-1/2 h-6 rounded cursor-pointer hover:opacity-80 transition-opacity"
                                  style={{
                                    left: position.left,
                                    width: position.width,
                                    backgroundColor: task.color,
                                  }}
                                  draggable
                                  onDragStart={() => handleTaskDragStart(task)}
                                  onClick={() => setSelectedTask(task)}
                                >
                                  {/* Progress Bar */}
                                  <div
                                    className="h-full bg-white bg-opacity-30 rounded-l"
                                    style={{ width: `${task.progress}%` }}
                                  />

                                  {/* Task Label */}
                                  <div className="absolute inset-0 flex items-center px-2">
                                    <span className="text-white text-xs font-medium truncate">{task.title}</span>
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  <div className="font-medium">{task.title}</div>
                                  <div className="text-sm">
                                    {task.startDate.toLocaleDateString()} - {task.endDate.toLocaleDateString()}
                                  </div>
                                  <div className="text-sm">Progress: {task.progress}%</div>
                                  <div className="text-sm">Assignee: {task.assignee}</div>
                                </div>
                              </TooltipContent>
                            </Tooltip>

                            {/* Dependencies Lines */}
                            {task.dependencies?.map((depId) => {
                              const depTask = projects.flatMap((p) => p.tasks).find((t) => t.id === depId)
                              if (!depTask) return null

                              return (
                                <div
                                  key={depId}
                                  className="absolute top-1/2 h-0.5 bg-gray-400 opacity-50"
                                  style={{
                                    left: getTaskPosition(depTask).left,
                                    width: `calc(${position.left} - ${getTaskPosition(depTask).left})`,
                                  }}
                                />
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Details Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedTask.title}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTask(null)}>
                  ×
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="outline">{selectedTask.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Priority:</span>
                  <Badge className={getPriorityColor(selectedTask.priority)}>{selectedTask.priority}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Assignee:</span>
                  <span className="text-sm">{selectedTask.assignee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Progress:</span>
                  <span className="text-sm">{selectedTask.progress}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm">
                    {selectedTask.startDate.toLocaleDateString()} - {selectedTask.endDate.toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex space-x-2">
                <Button size="sm" className="flex-1">
                  Edit Task
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
