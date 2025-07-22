"use client"

import { useState, useEffect } from "react"

interface TimeEntry {
  id: number
  taskId: number
  taskName: string
  projectName: string
  startTime: string
  endTime?: string
  duration: number // in minutes
  description: string
  user: string
  date: string
  isRunning: boolean
}

export default function TimeTracker() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: 1,
      taskId: 1,
      taskName: "Design new landing page",
      projectName: "Website Redesign",
      startTime: "09:00",
      endTime: "11:30",
      duration: 150,
      description: "Working on wireframes and initial mockups",
      user: "John Doe",
      date: "2024-02-15",
      isRunning: false,
    },
    {
      id: 2,
      taskId: 2,
      taskName: "API Documentation",
      projectName: "Mobile App Development",
      startTime: "13:00",
      endTime: "15:45",
      duration: 165,
      description: "Documenting REST API endpoints",
      user: "Jane Smith",
      date: "2024-02-15",
      isRunning: false,
    },
  ])

  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null)
  const [currentTime, setCurrentTime] = useState(0) // in seconds
  const [selectedTask, setSelectedTask] = useState("")
  const [description, setDescription] = useState("")
  const [isPaused, setIsPaused] = useState(false);

  // Update timer every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer && !isPaused) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const startTimer = () => {
    if (!selectedTask) return

    const newTimer: TimeEntry = {
      id: Date.now(),
      taskId: Number.parseInt(selectedTask),
      taskName: "Selected Task",
      projectName: "Current Project",
      startTime: new Date().toLocaleTimeString("en-US", { hour12: false }),
      duration: 0,
      description,
      user: "Current User",
      date: new Date().toISOString().split("T")[0],
      isRunning: true,
    }

    setActiveTimer(newTimer)
    setCurrentTime(0)
  }

  const stopTimer = () => {
    if (!activeTimer) return

    const endTime = new Date().toLocaleTimeString("en-US", { hour12: false })
    const duration = Math.floor(currentTime / 60)

    const completedEntry: TimeEntry = {
      ...activeTimer,
      endTime,
      duration,
      isRunning: false,
    }

    setTimeEntries((prev) => [completedEntry, ...prev])
    setActiveTimer(null)
    setCurrentTime(0)
    setSelectedTask("")
    setDescription("")
  }

  const pauseTimer = () => {
    if (activeTimer) {
      setIsPaused(true);
    }
  }

  const resumeTimer = () => {
    if (activeTimer && isPaused) {
      setIsPaused(false);
    }
  }

  const getTotalHoursToday = () => {
    const today = new Date().toISOString().split("T")[0]
    const todayEntries = timeEntries.filter((entry) => entry.date === today)
    const totalMinutes = todayEntries.reduce((sum, entry) => sum + entry.duration, 0)
    return (totalMinutes / 60).toFixed(1)
  }

  const getTotalHoursWeek = () => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekEntries = timeEntries.filter((entry) => new Date(entry.date) >= weekAgo)
    const totalMinutes = weekEntries.reduce((sum, entry) => sum + entry.duration, 0)
    return (totalMinutes / 60).toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Timer Controls */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Time Tracker</h3>

        {activeTimer ? (
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-green-600 mb-4">{formatTime(currentTime)}</div>
            <div className="text-gray-600 mb-4">Working on: {activeTimer.taskName}</div>
            <div className="flex justify-center space-x-3">
              {isPaused ? (
                <button
                  onClick={resumeTimer}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Resume
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                  Pause
                </button>
              )}
              <button onClick={stopTimer} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Stop
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Task</label>
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Choose a task...</option>
                <option value="1">Design new landing page</option>
                <option value="2">API Documentation</option>
                <option value="3">Bug fixes</option>
                <option value="4">Code review</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you working on?"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={startTimer}
              disabled={!selectedTask}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Start Timer
            </button>
          </div>
        )}
      </div>

      {/* Time Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Today</h4>
          <p className="text-2xl font-bold text-green-600">{getTotalHoursToday()}h</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2">This Week</h4>
          <p className="text-2xl font-bold text-green-600">{getTotalHoursWeek()}h</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Average/Day</h4>
          <p className="text-2xl font-bold text-purple-600">
            {(Number.parseFloat(getTotalHoursWeek()) / 7).toFixed(1)}h
          </p>
        </div>
      </div>

      {/* Time Entries */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Time Entries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{entry.taskName}</div>
                    <div className="text-sm text-gray-500">{entry.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.projectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.startTime} - {entry.endTime || "Running"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {formatDuration(entry.duration)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {entry.description || "No description"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-green-600 hover:text-green-900">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
