"use client"

import { useState, useEffect } from "react"
import { useActivityLogs } from "@/hooks/use-activity-logs"
import { Loader2, AlertCircle, RefreshCw, Trash2, Filter, Search } from "lucide-react"
import { Notification, ConfirmationDialog } from "@/components/ui/notification"

interface ActivityLog {
  id: number
  user: string
  avatar: string
  color: string
  action: string
  target: string
  project?: string
  timestamp: string
  formatted_time: string
  type: "task" | "project" | "file" | "team" | "system"
  details?: string
  metadata?: {
    oldValue?: string
    newValue?: string
    fileSize?: string
    assignee?: string
  }
}

export default function ActivityPage() {
  const [filterType, setFilterType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [userFilter, setUserFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Notification states
  const [notification, setNotification] = useState<{
    isOpen: boolean
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  })

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })

  const {
    activities,
    stats,
    loading,
    error,
    pagination,
    fetchActivities,
    fetchStats,
    clearAllLogs
  } = useActivityLogs()

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    })
  }

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }))
  }

  const showConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm
    })
  }

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }))
  }

  // Real-time synchronization
  useEffect(() => {
    const handleTaskUpdated = (event: CustomEvent) => {
      console.log("🔄 Real-time task update received in Activity page:", event.detail)
      // Refetch activities to get latest data
      fetchActivities({ type: filterType, search: searchTerm, per_page: pagination.per_page })
    }

    const handleProjectUpdated = (event: CustomEvent) => {
      console.log("🔄 Real-time project update received in Activity page:", event.detail)
      // Refetch activities to get latest data
      fetchActivities({ type: filterType, search: searchTerm, per_page: pagination.per_page })
    }

    const handleFileUploaded = (event: CustomEvent) => {
      console.log("🔄 Real-time file upload received in Activity page:", event.detail)
      // Refetch activities to get latest data
      fetchActivities({ type: filterType, search: searchTerm, per_page: pagination.per_page })
    }

    if (typeof window !== "undefined") {
      window.addEventListener("taskUpdated", handleTaskUpdated as EventListener)
      window.addEventListener("projectUpdated", handleProjectUpdated as EventListener)
      window.addEventListener("fileUploaded", handleFileUploaded as EventListener)
      return () => {
        window.removeEventListener("taskUpdated", handleTaskUpdated as EventListener)
        window.removeEventListener("projectUpdated", handleProjectUpdated as EventListener)
        window.removeEventListener("fileUploaded", handleFileUploaded as EventListener)
      }
    }
  }, [fetchActivities, filterType, searchTerm, pagination.per_page])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task":
        return "✅"
      case "project":
        return "📁"
      case "file":
        return "📎"
      case "team":
        return "👥"
      case "system":
        return "⚙️"
      default:
        return "📝"
    }
  }

  const handleFilterChange = (type: string) => {
    setFilterType(type)
    setCurrentPage(1)
    fetchActivities({ 
      type: type === "all" ? undefined : type, 
      search: searchTerm, 
      per_page: pagination.per_page 
    })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
    fetchActivities({ 
      type: filterType === "all" ? undefined : filterType, 
      search: value, 
      per_page: pagination.per_page 
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchActivities({ 
      type: filterType === "all" ? undefined : filterType, 
      search: searchTerm, 
      per_page: pagination.per_page,
      page 
    })
  }

  const handleClearOldLogs = async () => {
    showConfirmDialog(
      'Clear All Activity Logs',
      'Are you sure you want to clear ALL activity logs? This action cannot be undone and will remove all activity history.',
      async () => {
        try {
          await clearAllLogs();
          showNotification('success', 'Logs Cleared', 'All activity logs have been cleared successfully.');
        } catch (error) {
          console.error('Failed to clear logs:', error);
          showNotification('error', 'Clear Failed', 'Failed to clear activity logs. Please try again.');
        }
        closeConfirmDialog();
      }
    );
  };

  const handleUserFilter = (userName: string) => {
    // Filter activities by specific user
    const filteredByUser = activities.filter(activity => 
      activity.user.toLowerCase().includes(userName.toLowerCase())
    );
    // You can implement this as a state or pass to parent component
    console.log('Filtered by user:', userName, filteredByUser);
  };

  const handleDateFilter = (startDate: string, endDate: string) => {
    // Filter activities by date range
    const filteredByDate = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return activityDate >= start && activityDate <= end;
    });
    console.log('Filtered by date range:', startDate, 'to', endDate, filteredByDate);
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.project && activity.project.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesUserFilter = userFilter === "" || 
      activity.user.toLowerCase().includes(userFilter.toLowerCase())

    const matchesTypeFilter = filterType === "all" || activity.type === filterType

    return matchesSearch && matchesUserFilter && matchesTypeFilter
  })

  const activityTypes = ["all", "task", "project", "file", "team", "system"]

  if (loading && activities.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading activities...</span>
      </div>
    )
  }

  if (error && activities.length === 0) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <div className="text-red-600 mb-4">
          <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => fetchActivities()}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Notification Component */}
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isOpen={notification.isOpen}
        onClose={closeNotification}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
        type="danger"
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📋 Activity Log</h1>
          <p className="text-gray-600 mt-2">Track all activities and changes across your projects</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleClearOldLogs}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All Logs</span>
          </button>
          <input
            type="text"
            placeholder="Filter by user..."
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border text-gray-600 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {activityTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)} Activities
              </option>
            ))}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="🔍 Search activities..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {activityTypes.slice(1).map((type) => (
            <div key={type} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getActivityIcon(type)}</span>
                  <h3 className="text-sm font-semibold text-gray-700 capitalize">{type}</h3>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.by_type[type as keyof typeof stats.by_type] || 0}</p>
              <p className="text-xs text-gray-500 mt-1">activities</p>
            </div>
          ))}
        </div>
      )}

      {/* Activity Feed */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🕒</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Recent Activities</h3>
                <p className="text-sm text-gray-600">{filteredActivities.length} activities found</p>
              </div>
            </div>
            {loading && (
              <div className="flex items-center text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating...
              </div>
            )}
          </div>
        </div>
        <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-sm`}
                    style={{ backgroundColor: activity.color }}
                  >
                    {activity.avatar.includes('placeholder') ? activity.user.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getActivityIcon(activity.type)}</span>
                      <span className="font-semibold text-gray-900">{activity.user}</span>
                      <span className="text-gray-600">{activity.action}</span>
                      <span className="font-semibold text-green-600">{activity.target}</span>
                    </div>

                    {activity.project && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-green-600 font-medium">📁 {activity.project}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{activity.formatted_time}</span>
                      </div>
                    )}

                    {activity.details && <p className="text-sm text-gray-600 mb-3">{activity.details}</p>}

                    {activity.metadata && (
                      <div className="flex flex-wrap gap-2">
                        {activity.metadata.oldValue && activity.metadata.newValue && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                            {activity.metadata.oldValue} → {activity.metadata.newValue}
                          </span>
                        )}
                        {activity.metadata.fileSize && (
                          <span className="text-xs bg-green-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                            📎 {activity.metadata.fileSize}
                          </span>
                        )}
                        {activity.metadata.assignee && (
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                            👤 Assigned to: {activity.metadata.assignee}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">{activity.formatted_time}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} activities
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
