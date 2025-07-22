"use client"

import { useState, useEffect } from "react"

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [teamStats, setTeamStats] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        // Fetch projects
        const resProjects = await fetch("http://localhost:8000/api/projects")
        const dataProjects = await resProjects.json()
        setProjects(dataProjects.data || [])
        // Fetch tasks
        const resTasks = await fetch("http://localhost:8000/api/tasks")
        const dataTasks = await resTasks.json()
        setTasks(dataTasks.data || [])
        // Fetch team stats
        const resTeam = await fetch("http://localhost:8000/api/team/stats")
        const dataTeam = await resTeam.json()
        setTeamStats(dataTeam.data || null)
      } catch (err) {
        setError("Failed to fetch report data: " + err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8">Loading reports...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  // Example: calculate metrics from fetched data
  const totalProjects = projects.length
  const completedProjects = projects.filter((p) => p.status === "Completed").length
  const activeProjects = projects.filter((p) => p.status === "In Progress").length
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "Completed").length
  const overdueTasks = tasks.filter((t) => {
    if (!t.due_date) return false
    return new Date(t.due_date) < new Date() && t.status !== "Completed"
  }).length
  const teamMembers = teamStats?.totalMembers || 0

  // Tambahkan helper untuk hitung progress project dari tasks
  function getProjectProgress(projectId: number) {
    const projectTasks = tasks.filter(t => t.project_id === projectId);
    if (projectTasks.length === 0) return 0;
    const totalProgress = projectTasks.reduce((sum, t) => sum + (t.progress || 0), 0);
    return Math.round(totalProgress / projectTasks.length);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Projects</h3>
          <p className="text-3xl font-bold text-gray-800">{totalProjects}</p>
        </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Completed Projects</h3>
          <p className="text-3xl font-bold text-green-600">{completedProjects}</p>
        </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Active Projects</h3>
          <p className="text-3xl font-bold text-green-600">{activeProjects}</p>
        </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Team Members</h3>
          <p className="text-3xl font-bold text-purple-600">{teamMembers}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold text-gray-800">{totalTasks}</p>
        </div>
    <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Completed Tasks</h3>
          <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
        </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Overdue Tasks</h3>
          <p className="text-3xl font-bold text-red-600">{overdueTasks}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 mt-8">
        <h2 className="text-lg font-semibold mb-4">Project List</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{project.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${getProjectProgress(project.id)}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-900">{getProjectProgress(project.id)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{project.due_date ? new Date(project.due_date).toLocaleDateString() : '-'}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
