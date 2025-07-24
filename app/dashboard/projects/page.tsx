"use client";

import { useState, useEffect } from "react";
import NewProjectModal from "@/components/new-project-modal";
import { useProjects, type Project } from "@/hooks/use-projects";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Calendar,
  Users,
  BarChart3,
  Trash2,
  Edit,
} from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const router = useRouter();

  // 🔗 Hook untuk koneksi dengan backend API
  const {
    projects,
    loading,
    error,
    stats,
    createProject,
    updateProject,
    deleteProject,
    refetch,
  } = useProjects();
  const { tasks: allTasks } = useTasks();

  // Get current user and permissions
  useEffect(() => {
    const userStr = localStorage.getItem("nexapro_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);

      // Fetch user permissions from backend
      fetch(`http://localhost:8000/api/admin/user-permissions/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setUserPermissions(data.data.map((p: any) => p.name));
          }
        })
        .catch(() => {
          // Fallback to role-based permissions if API fails
          const rolePermissions = {
            admin: [
              "manage_users",
              "manage_projects",
              "manage_tasks",
              "view_reports",
              "export_data",
              "manage_settings",
              "manage_integrations",
              "manage_roles",
              "track_time",
              "view_projects",
              "manage_team",
            ],
            project_manager: [
              "manage_projects",
              "manage_tasks",
              "assign_tasks",
              "view_reports",
              "export_data",
              "manage_team",
              "view_time_tracking",
              "track_time",
              "view_projects",
            ],
            member: [
              "view_projects",
              "manage_own_tasks",
              "comment_tasks",
              "upload_files",
              "track_time",
              "view_own_reports",
            ],
          };
          setUserPermissions(
            rolePermissions[user.role as keyof typeof rolePermissions] || []
          );
        });
    }
  }, []);

  // Real-time synchronization
  useEffect(() => {
    const handleProjectUpdated = (event: CustomEvent) => {
      console.log(
        "🔄 Real-time project update received in Projects page:",
        event.detail
      );
      // Refetch projects to get latest data
      refetch();
    };

    const handleTaskUpdated = (event: CustomEvent) => {
      console.log(
        "🔄 Real-time task update received in Projects page:",
        event.detail
      );
      // Refetch projects to get latest data (tasks might affect project progress)
      refetch();
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "projectUpdated",
        handleProjectUpdated as EventListener
      );
      window.addEventListener(
        "taskUpdated",
        handleTaskUpdated as EventListener
      );
      return () => {
        window.removeEventListener(
          "projectUpdated",
          handleProjectUpdated as EventListener
        );
        window.removeEventListener(
          "taskUpdated",
          handleTaskUpdated as EventListener
        );
      };
    }
  }, [refetch]);

  // Permission check functions
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === "admin") return true; // Admin has all permissions
    return userPermissions.includes(permission);
  };

  // 🎨 Helper functions untuk styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-green-100 text-blue-800 border-green-200";
      case "Planning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "On Hold":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High":
        return "🔴";
      case "Medium":
        return "🟡";
      case "Low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return "✅";
      case "In Progress":
        return "🔄";
      case "Planning":
        return "📋";
      case "On Hold":
        return "⏸️";
      default:
        return "📋";
    }
  };

  // 📝 Event handlers
  const handleCreateProject = async (projectData: any) => {
    if (!hasPermission("manage_projects")) {
      alert("You don't have permission to create projects");
      return;
    }

    try {
      await createProject(projectData);
      setIsNewProjectModalOpen(false);
      console.log("✅ Project created successfully!");
    } catch (error) {
      console.error("❌ Failed to create project:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!hasPermission("manage_projects")) {
      alert("You don't have permission to delete projects");
      return;
    }

    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        console.log("✅ Project deleted successfully!");
      } catch (error) {
        console.error("❌ Failed to delete project:", error);
        alert("Failed to delete project. Please try again.");
      }
    }
  };

  const handleUpdateProjectStatus = async (
    projectId: number,
    newStatus: string
  ) => {
    if (!hasPermission("manage_projects")) {
      alert("You don't have permission to update projects");
      return;
    }

    try {
      const project = projects.find((p) => p.id === projectId);
      if (!project) {
        console.error("❌ Project not found");
        return;
      }

      let updates: any = { status: newStatus };

      // Auto-update progress when status is changed to Completed
      if (newStatus === "Completed") {
        updates.progress = 100;
        console.log(
          `🔄 Auto-setting progress to 100% for project ${project.name} (status: Completed)`
        );
      }

      await updateProject(projectId, updates);
      console.log(`✅ Project status updated to ${newStatus}`);

      // Trigger real-time update
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("projectUpdated", {
            detail: {
              projectId,
              project: { ...project, ...updates },
            },
          })
        );
      }
    } catch (error) {
      console.error("❌ Failed to update project status:", error);
      alert("Failed to update project status. Please try again.");
    }
  };

  const handleFilterChange = (type: "status" | "priority", value: string) => {
    if (type === "status") {
      setStatusFilter(value);
    } else {
      setPriorityFilter(value);
    }

    // 🔄 Refetch dengan filter baru
    refetch({
      status: type === "status" ? value : statusFilter,
      priority: type === "priority" ? value : priorityFilter,
    });
  };

  // Helper untuk hitung progress akumulasi task
  function getProjectProgress(projectId: number) {
    const projectTasks = allTasks.filter((t) => t.project_id === projectId);
    if (projectTasks.length === 0) return 0;
    const totalProgress = projectTasks.reduce(
      (sum, t) => sum + (t.progress || 0),
      0
    );
    return Math.round(totalProgress / projectTasks.length);
  }

  function getProjectStatus(projectId: number) {
    const progress = getProjectProgress(projectId);
    if (progress === 100) return "Completed";
    if (progress === 0) return "Planning";
    return "In Progress";
  }

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading projects...</span>
      </div>
    );
  }

  // ❌ Error state dengan retry option
  if (error) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <div className="text-red-600 mb-4">
          <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
          <p className="text-sm">{error}</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => refetch()}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Reload Page
          </button>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>
            Make sure your Laravel server is running on http://localhost:8000
          </p>
        </div>
      </div>
    );
  }

  // 📊 Grid view component
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-green-200"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                {project.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {project.description || "No description"}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              {hasPermission("manage_projects") && (
                <>
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setIsEditProjectModalOpen(true);
                    }}
                    className="text-gray-400 hover:text-green-600 p-1 rounded transition-colors"
                    title="Edit project"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Status & Priority */}
          <div className="flex items-center space-x-2 mb-4">
            <span
              className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(
                getProjectStatus(project.id)
              )}`}
            >
              {getStatusIcon(getProjectStatus(project.id))}{" "}
              {getProjectStatus(project.id)}
            </span>
            <span
              className={`px-3 py-1 text-xs rounded-full border ${getPriorityColor(
                project.priority
              )}`}
            >
              {getPriorityIcon(project.priority)} {project.priority}
            </span>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 flex items-center">
                <BarChart3 size={14} className="mr-1" />
                Progress
              </span>
              <span className="text-sm font-medium text-gray-800">
                {getProjectProgress(project.id)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProjectProgress(project.id)}%` }}
              ></div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600 flex items-center">
              <Users size={14} className="mr-1" />
              <span className="font-medium">{project.tasks.completed}</span>/
              {project.tasks.total} tasks
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              <Calendar size={14} className="mr-1" />
              {project.due_date
                ? new Date(project.due_date).toLocaleDateString()
                : "No due date"}
            </div>
          </div>

          {/* Team & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {project.team && project.team.length > 0 ? (
                <>
                  {project.team.slice(0, 3).map((member, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium shadow-sm"
                      title={member.name}
                    >
                      {member.name
                        ? member.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                        : "U"}
                    </div>
                  ))}
                  {project.team.length > 3 && (
                    <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium shadow-sm">
                      +{project.team.length - 3}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-xs">
                  <Users size={14} />
                </div>
              )}
            </div>
            <button
              onClick={() =>
                (window.location.href = `/dashboard/projects/${project.id}`)
              }
              className="text-green-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // 📋 List view component - IMPLEMENTASI LENGKAP
  const renderListView = () => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {project.name}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {project.description || "No description"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 text-xs rounded-full border ${getStatusColor(
                      getProjectStatus(project.id)
                    )}`}
                  >
                    {getStatusIcon(getProjectStatus(project.id))}{" "}
                    {getProjectStatus(project.id)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 text-xs rounded-full border ${getPriorityColor(
                      project.priority
                    )}`}
                  >
                    {getPriorityIcon(project.priority)} {project.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getProjectProgress(project.id)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900 font-medium">
                      {getProjectProgress(project.id)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1 text-gray-400" />
                    {project.due_date
                      ? new Date(project.due_date).toLocaleDateString()
                      : "No due date"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex -space-x-1">
                    {project.team && project.team.length > 0 ? (
                      <>
                        {project.team.slice(0, 3).map((member, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full border border-white flex items-center justify-center text-white text-xs font-medium"
                            title={member.name}
                          >
                            {member.name
                              ? member.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                              : "U"}
                          </div>
                        ))}
                        {project.team.length > 3 && (
                          <div className="w-6 h-6 bg-gray-400 rounded-full border border-white flex items-center justify-center text-white text-xs font-medium">
                            +{project.team.length - 3}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full border border-white flex items-center justify-center text-gray-600">
                        <Users size={12} />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        (window.location.href = `/dashboard/projects/${project.id}`)
                      }
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title="View project"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    {hasPermission("manage_projects") && (
                      <>
                        <button
                          onClick={() => {
                            setEditingProject(project);
                            setIsEditProjectModalOpen(true);
                          }}
                          className="text-green-600 hover:text-blue-800 transition-colors"
                          title="Edit project"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your project progress
          </p>
          {/* 🔍 Debug info - bisa dihapus di production */}
          <p className="text-xs text-gray-400 mt-1">
            Connected to API • {projects.length} projects loaded
          </p>
        </div>
        {hasPermission("manage_projects") ? (
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            <span className="font-medium">New Project</span>
          </button>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-500">
              You don't have permission to create projects
            </p>
            <p className="text-xs text-gray-400">
              Contact your administrator for access
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.total || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.in_progress || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-yellow-600"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.completed || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">On Hold</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.on_hold || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Planning">Planning</option>
            <option value="On Hold">On Hold</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 shadow-sm"
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "grid"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
            title="Grid View"
          >
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
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "list"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
            title="List View"
          >
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
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3.01" y1="6" y2="6" />
              <line x1="3" x2="3.01" y1="12" y2="12" />
              <line x1="3" x2="3.01" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Projects Display */}
      {projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No projects found
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first project
          </p>
          {hasPermission("manage_projects") ? (
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Create Your First Project
            </button>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                You don't have permission to create projects
              </p>
              <p className="text-xs text-gray-400">
                Contact your administrator for access
              </p>
            </div>
          )}
        </div>
      ) : viewMode === "grid" ? (
        renderGridView()
      ) : (
        renderListView()
      )}

      {/* New Project Modal */}
      {hasPermission("manage_projects") && (
        <NewProjectModal
          isOpen={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
          onSubmit={handleCreateProject}
        />
      )}
      {hasPermission("manage_projects") &&
        isEditProjectModalOpen &&
        editingProject && (
          <NewProjectModal
            isOpen={isEditProjectModalOpen}
            onClose={() => setIsEditProjectModalOpen(false)}
            initialData={{
              name: editingProject.name,
              description: editingProject.description || "",
              status: editingProject.status,
              priority: editingProject.priority,
              due_date: editingProject.due_date || "",
              progress: editingProject.progress,
            }}
            onSubmit={async (data) => {
              await updateProject(editingProject.id, {
                name: data.name,
                description: data.description || "",
                status: data.status as
                  | "Planning"
                  | "In Progress"
                  | "Completed"
                  | "On Hold",
                priority: data.priority as "Low" | "Medium" | "High",
                due_date: data.due_date || undefined,
                progress: data.progress || 0,
              });
              setIsEditProjectModalOpen(false);
              setEditingProject(null);
              refetch();
            }}
          />
        )}
    </div>
  );
}
