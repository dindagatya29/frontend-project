"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Square,
  Clock,
  Calendar,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Edit3,
  Trash2,
  Timer,
  Plus,
} from "lucide-react";

interface TimeEntry {
  id: number;
  taskId: number;
  taskName: string;
  projectName: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  description: string;
  user: string;
  date: string;
  isRunning: boolean;
}

export default function TimeTrackerPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedTask, setSelectedTask] = useState("");
  const [description, setDescription] = useState("");
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [tasks, setTasks] = useState<
    { id: number; title: string; project: string }[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [manualTask, setManualTask] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [manualStartTime, setManualStartTime] = useState("");
  const [manualEndTime, setManualEndTime] = useState("");
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
const [editDescription, setEditDescription] = useState("")
const [editStartTime, setEditStartTime] = useState("")
const [editEndTime, setEditEndTime] = useState("")

  const [loading, setLoading] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<TimeEntry | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchEntries();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("https://nexapro.web.id/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://nexapro.web.id/api/time-entries");
      if (response.ok) {
        const data = await response.json();
        setTimeEntries(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch time entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const startTimer = () => {
    if (!selectedTask) return;
    setIsRunning(true);
    setCurrentTime(0);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resumeTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = async () => {
    setIsRunning(false);
    const selectedTaskData = tasks.find(
      (t) => t.id.toString() === selectedTask
    );

    if (selectedTaskData && currentTime > 0) {
      const now = new Date();
      const startTime = new Date(now.getTime() - currentTime * 1000); // mundur dari waktu sekarang
      const endTime = now;

      try {
        const response = await fetch("https://nexapro.web.id/api/time-entries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task_id: selectedTaskData.id,
            description: description,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            duration: Math.floor(currentTime / 60),
          }),
        });

        if (response.ok) {
          await fetchEntries(); // Ambil ulang dari server
          setCurrentTime(0);
          setSelectedTask("");
          setDescription("");
        } else {
          const errorData = await response.json();
          console.error("Gagal menyimpan:", errorData);
        }
      } catch (error) {
        console.error("Error saat menyimpan time entry:", error);
      }
    }
  };

  const getTotalHoursToday = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayEntries = timeEntries.filter((entry) => entry.date === today);
    const totalMinutes = todayEntries.reduce(
      (sum, entry) => sum + entry.duration,
      0
    );
    return (totalMinutes / 60).toFixed(1);
  };

  const getTotalHoursWeek = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekEntries = timeEntries.filter(
      (entry) => new Date(entry.date) >= weekAgo
    );
    const totalMinutes = weekEntries.reduce(
      (sum, entry) => sum + entry.duration,
      0
    );
    return (totalMinutes / 60).toFixed(1);
  };

  const deleteEntry = async (id: number) => {
    try {
      const response = await fetch(
        `https://nexapro.web.id/api/time-entries/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Hapus dari state frontend
        setTimeEntries((prev) => prev.filter((entry) => entry.id !== id));
      } else {
        const data = await response.json();
        console.error("Gagal menghapus:", data);
      }
    } catch (error) {
      console.error("Error saat menghapus entry:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <Timer className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ⏱️ Time Tracker
        </h1>
        <p className="text-gray-600">
          Track your time and monitor productivity
        </p>
      </div>

      {/* Timer */}
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-white/20 shadow-xl">
        <div className="text-center mb-8">
          <div className="text-6xl font-mono font-bold text-gray-800 mb-4">
            {formatTime(currentTime)}
          </div>
          <p className="text-gray-600">Current session</p>
        </div>

        {isRunning ? (
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={pauseTimer}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
            <button
              onClick={stopTimer}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
            >
              <Square className="w-5 h-5" />
              Stop
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Task
                </label>
                <select
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className="w-full p-4 text-black border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                >
                  <option value="">Choose a task...</option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title} ({task.project})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What are you working on?"
                  className="w-full p-4 text-black border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            <button
              onClick={startTimer}
              disabled={!selectedTask}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-teal-500 text-white rounded-2xl hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg"
            >
              <Play className="w-6 h-6" />
              Start Timer
            </button>
          </div>
        )}
      </div>

      {/* Time Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Today
              </h4>
              <p className="text-3xl font-bold text-green-600">
                {getTotalHoursToday()}h
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Hours logged today</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                This Week
              </h4>
              <p className="text-3xl font-bold text-green-600">
                {getTotalHoursWeek()}h
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Total hours this week</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Average/Day
              </h4>
              <p className="text-3xl font-bold text-purple-600">
                {(Number.parseFloat(getTotalHoursWeek()) / 7).toFixed(1)}h
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Daily average</p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Add Time Entry</h2>

            <select
              value={manualTask}
              onChange={(e) => setManualTask(e.target.value)}
              className="w-full border rounded-lg p-3 text-black"
            >
              <option value="">Select Task</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title} ({task.project})
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Description (optional)"
              value={manualDescription}
              onChange={(e) => setManualDescription(e.target.value)}
              className="w-full border rounded-lg p-3 text-black"
            />

            <input
              type="datetime-local"
              value={manualStartTime}
              onChange={(e) => setManualStartTime(e.target.value)}
              className="w-full border rounded-lg p-3 text-black"
            />

            <input
              type="datetime-local"
              value={manualEndTime}
              onChange={(e) => setManualEndTime(e.target.value)}
              className="w-full border rounded-lg p-3 text-black"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const durationMinutes = Math.floor(
                    (new Date(manualEndTime).getTime() -
                      new Date(manualStartTime).getTime()) /
                      60000
                  );

                  await fetch("https://nexapro.web.id/api/time-entries", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      task_id: manualTask,
                      description: manualDescription,
                      start_time: new Date(manualStartTime).toISOString(),
                      end_time: new Date(manualEndTime).toISOString(),
                      duration: durationMinutes,
                    }),
                  });

                  setShowModal(false);
                  await fetchEntries();
                  setManualTask("");
                  setManualDescription("");
                  setManualStartTime("");
                  setManualEndTime("");
                }}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}

       {editingEntry && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4 text-black">
      <h2 className="text-xl font-bold">Edit Time Entry</h2>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <input
          type="text"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full p-3 border rounded-lg text-black"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Start Time</label>
        <input
          type="datetime-local"
          value={editStartTime}
          onChange={(e) => setEditStartTime(e.target.value)}
          className="w-full p-3 border rounded-lg text-black"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">End Time</label>
        <input
          type="datetime-local"
          value={editEndTime}
          onChange={(e) => setEditEndTime(e.target.value)}
          className="w-full p-3 border rounded-lg text-black"
        />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setEditingEntry(null)}
          className="px-4 py-2 rounded-lg bg-gray-200 text-black hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            if (!editStartTime || !editEndTime) {
              alert("Start and End time must be filled.")
              return
            }

            const duration = Math.floor(
              (new Date(editEndTime).getTime() - new Date(editStartTime).getTime()) / 60000
            )

            if (duration < 0) {
              alert("End time must be after start time.")
              return
            }

            try {
              const response = await fetch(`https://nexapro.web.id/api/time-entries/${editingEntry.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  description: editDescription,
                  start_time: new Date(editStartTime).toISOString(),
                  end_time: new Date(editEndTime).toISOString(),
                  duration,
                }),
              })

              if (response.ok) {
                await fetchEntries()
                setEditingEntry(null)
              } else {
                const data = await response.json()
                alert(`Update failed: ${data.message || "Unknown error"}`)
              }
            } catch (error) {
              if (error instanceof Error) {
                alert("Error updating entry: " + error.message)
              } else {
                alert("Unknown error occurred.")
              }
            }
          }}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

      {/* Time Entries */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">
                Recent Time Entries
              </h3>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Entry
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Task & Project
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Time Period
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {timeEntries.map((entry, index) => (
                <tr
                  key={entry.id}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                >
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900 group-hover:text-green-900 transition-colors">
                        {entry.taskName}
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        {entry.projectName}
                      </div>
                      <div className="text-xs text-gray-500">{entry.date}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-mono text-gray-900">
                      {entry.startTime} - {entry.endTime || "Running"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-green-200">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(entry.duration)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-xs truncate">
                      {entry.description || (
                        <span className="italic text-gray-400">
                          No description
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
  onClick={() => {
    setEditingEntry(entry)
    setEditDescription(entry.description || "")
    setEditStartTime(new Date(entry.startTime).toISOString().slice(0, 16))
    setEditEndTime(entry.endTime ? new Date(entry.endTime).toISOString().slice(0, 16) : "")
  }}
  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
>
  <Edit3 className="w-4 h-4" />
</button>
                      <button
                        onClick={() => setEntryToDelete(entry)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
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

        {entryToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
              <h2 className="text-xl font-bold text-gray-800">
                Delete Confirmation
              </h2>
              <p className="text-gray-600">
                Are you sure you want to delete this entry for task{" "}
                <span className="font-semibold text-red-500">
                  {entryToDelete.taskName}
                </span>
                ?
              </p>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setEntryToDelete(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(
                        `https://nexapro.web.id/api/time-entries/${entryToDelete.id}`,
                        {
                          method: "DELETE",
                        }
                      );

                      if (response.ok) {
                        setTimeEntries((prev) =>
                          prev.filter((entry) => entry.id !== entryToDelete.id)
                        );
                        setEntryToDelete(null);
                      } else {
                        const data = await response.json();
                        alert(
                          `Failed to delete: ${data.message || "Unknown error"}`
                        );
                      }
                    } catch (error) {
                      if (error instanceof Error) {
                        alert("Error deleting entry: " + error.message);
                      } else {
                        alert("Unknown error occurred.");
                      }
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

       

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Loading Entries...
            </h3>
            <p className="text-gray-500">
              Please wait while we load your time logs.
            </p>
          </div>
        ) : timeEntries.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Timer className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No time entries yet
            </h3>
            <p className="text-gray-500">
              Start tracking your time to see entries here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Tabel timeEntries */}
            <table className="w-full">{/* ... */}</table>
          </div>
        )}
      </div>
    </div>
  );
}
