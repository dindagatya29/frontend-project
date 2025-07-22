"use client"

import { useState } from "react"

interface DailyProgress {
  id: number
  date: string
  user: string
  avatar: string
  color: string
  tasks: {
    completed: number
    inProgress: number
    planned: number
  }
  hoursWorked: number
  achievements: string[]
  blockers: string[]
  nextDayPlan: string[]
  mood: "excellent" | "good" | "average" | "poor"
  notes: string
}

export default function DailyProgressTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isAddingProgress, setIsAddingProgress] = useState(false)

  const dailyProgress: DailyProgress[] = [
    {
      id: 1,
      date: "2024-02-15",
      user: "John Doe",
      avatar: "JD",
      color: "bg-green-500",
      tasks: { completed: 3, inProgress: 2, planned: 5 },
      hoursWorked: 8,
      achievements: ["Completed API documentation", "Fixed critical bug in authentication", "Reviewed 2 pull requests"],
      blockers: ["Waiting for design approval", "Database migration pending"],
      nextDayPlan: ["Implement new user dashboard", "Team standup meeting", "Code review session"],
      mood: "good",
      notes: "Productive day overall. Made good progress on the API documentation.",
    },
    {
      id: 2,
      date: "2024-02-15",
      user: "Jane Smith",
      avatar: "JS",
      color: "bg-green-500",
      tasks: { completed: 4, inProgress: 1, planned: 5 },
      hoursWorked: 7.5,
      achievements: ["Deployed new feature to staging", "Optimized database queries", "Mentored junior developer"],
      blockers: [],
      nextDayPlan: ["Production deployment", "Performance testing", "Client meeting"],
      mood: "excellent",
      notes: "Great day! Successfully deployed the new feature without any issues.",
    },
  ]

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-green-100 text-blue-800"
      case "average":
        return "bg-yellow-100 text-yellow-800"
      case "poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "excellent":
        return "😄"
      case "good":
        return "😊"
      case "average":
        return "😐"
      case "poor":
        return "😞"
      default:
        return "😐"
    }
  }

  const AddProgressModal = () => {
    if (!isAddingProgress) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Add Daily Progress</h2>
              <button onClick={() => setIsAddingProgress(false)} className="text-gray-400 hover:text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"  
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-6">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tasks Completed</label>
                  <input type="number" className="w-full p-2 border border-gray-300 rounded-md" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tasks In Progress</label>
                  <input type="number" className="w-full p-2 border border-gray-300 rounded-md" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked</label>
                  <input
                    type="number"
                    step="0.5"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="8"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Todays Achievements</label>
                <textarea
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="List your achievements for today (one per line)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blockers/Challenges</label>
                <textarea
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Any blockers or challenges faced today"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tomorrows Plan</label>
                <textarea
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="What do you plan to work on tomorrow?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="excellent">😄 Excellent</option>
                  <option value="good">😊 Good</option>
                  <option value="average">😐 Average</option>
                  <option value="poor">😞 Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Any additional notes or thoughts"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingProgress(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Save Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Daily Progress Tracker</h2>
          <p className="text-gray-600">Track daily achievements and plan for tomorrow</p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <button
            onClick={() => setIsAddingProgress(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
          >
            Add Progress
          </button>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Tasks Completed</h3>
          <p className="text-2xl font-bold text-green-600">
            {dailyProgress.reduce((sum, p) => sum + p.tasks.completed, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Hours Worked</h3>
          <p className="text-2xl font-bold text-green-600">
            {dailyProgress.reduce((sum, p) => sum + p.hoursWorked, 0)}h
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Team Members Active</h3>
          <p className="text-2xl font-bold text-purple-600">{dailyProgress.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Average Mood</h3>
          <p className="text-2xl font-bold text-yellow-600">😊 Good</p>
        </div>
      </div>

      {/* Daily Progress Cards */}
      <div className="space-y-4">
        {dailyProgress.map((progress) => (
          <div key={progress.id} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 ${progress.color} rounded-full flex items-center justify-center text-white font-medium`}
                >
                  {progress.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{progress.user}</h3>
                  <p className="text-sm text-gray-600">{new Date(progress.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 text-sm rounded-full ${getMoodColor(progress.mood)}`}>
                  {getMoodIcon(progress.mood)} {progress.mood.charAt(0).toUpperCase() + progress.mood.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Task Summary */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Task Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="text-sm font-medium text-green-600">{progress.tasks.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">In Progress</span>
                    <span className="text-sm font-medium text-green-600">{progress.tasks.inProgress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hours Worked</span>
                    <span className="text-sm font-medium text-purple-600">{progress.hoursWorked}h</span>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Achievements</h4>
                <ul className="space-y-1">
                  {progress.achievements.map((achievement, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Blockers */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Blockers</h4>
                {progress.blockers.length > 0 ? (
                  <ul className="space-y-1">
                    {progress.blockers.map((blocker, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                        <span className="text-red-500 mt-1">⚠</span>
                        <span>{blocker}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No blockers reported</p>
                )}
              </div>
            </div>

            {/* Tomorrow's Plan */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-800 mb-3">Tomorrows Plan</h4>
              <ul className="space-y-1">
                {progress.nextDayPlan.map((plan, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">→</span>
                    <span>{plan}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Notes */}
            {progress.notes && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="font-medium text-gray-800 mb-2">Notes</h4>
                <p className="text-sm text-gray-700">{progress.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <AddProgressModal />
    </div>
  )
}
