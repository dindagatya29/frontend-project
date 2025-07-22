"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Check, X, Settings, Trash2, Filter, Search } from "lucide-react"
import { Notification, ConfirmationDialog } from "./ui/notification"
import { useNotifications } from "@/hooks/use-notifications"

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [filterType, setFilterType] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterRead, setFilterRead] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showSettings, setShowSettings] = useState(false)

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
    notifications,
    settings,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    getNotificationStats,
    filterNotifications,
  } = useNotifications()

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

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsRead(notificationId)
    showNotification('success', 'Marked as Read', 'Notification has been marked as read.')
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    showNotification('success', 'All Marked as Read', 'All notifications have been marked as read.')
  }

  const handleDeleteNotification = (notificationId: number) => {
    showConfirmDialog(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      async () => {
        await deleteNotification(notificationId)
        showNotification('success', 'Notification Deleted', 'Notification has been deleted successfully.')
        closeConfirmDialog()
      }
    )
  }

  const handleClearAll = () => {
    showConfirmDialog(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications? This action cannot be undone.',
      async () => {
        await clearAllNotifications()
        showNotification('success', 'All Notifications Cleared', 'All notifications have been cleared successfully.')
        closeConfirmDialog()
      }
    )
  }

  const handleSettingsChange = async (key: string, value: boolean) => {
    await updateSettings({ [key]: value })
    showNotification('success', 'Settings Updated', `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} setting has been updated.`)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task":
        return "✅"
      case "project":
        return "📁"
      case "comment":
        return "💬"
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredNotifications = filterNotifications({
    type: filterType,
    priority: filterPriority,
    read: filterRead,
    search: searchTerm
  })

  const stats = getNotificationStats()

  if (!isOpen) return null

  return (
    <>
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

      {/* Notification Center Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">🔔 Notification Center</h2>
              <p className="text-sm text-gray-600">Stay updated with all activities</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                <Check className="h-3 w-3" />
                <span>Mark All Read</span>
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear All</span>
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors text-sm"
              >
                <Settings className="h-3 w-3" />
                <span>Settings</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
              <div className="text-xs text-gray-600">Unread</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
              <div className="text-xs text-gray-600">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.read}</div>
              <div className="text-xs text-gray-600">Read</div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Types</option>
                <option value="task">Task</option>
                <option value="project">Project</option>
                <option value="comment">Comment</option>
                <option value="file">File</option>
                <option value="team">Team</option>
                <option value="system">System</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-1 border border-gray-300 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex h-96">
            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading notifications...</p>
                  </div>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                    <p className="text-gray-600">You're all caught up!</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-green-50' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0`}
                          style={{ backgroundColor: notification.color }}
                        >
                          {notification.avatar.includes('placeholder') ? notification.user.charAt(0).toUpperCase() : '👤'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                            <span className="font-medium text-gray-800">{notification.user}</span>
                            <span className="text-gray-600">{notification.action}</span>
                            <span className="font-medium text-gray-800">{notification.target}</span>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            )}
                          </div>

                          {notification.details && <p className="text-sm text-gray-600 mb-2">{notification.details}</p>}

                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(notification.priority)}`}>
                              {notification.priority} Priority
                            </span>
                            <span className="text-xs text-gray-500">{notification.formatted_time}</span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete notification"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="w-80 border-l border-gray-200 p-4 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingsChange('emailNotifications', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingsChange('pushNotifications', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Task Updates</span>
                    <input
                      type="checkbox"
                      checked={settings.taskUpdates}
                      onChange={(e) => handleSettingsChange('taskUpdates', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Project Updates</span>
                    <input
                      type="checkbox"
                      checked={settings.projectUpdates}
                      onChange={(e) => handleSettingsChange('projectUpdates', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Team Updates</span>
                    <input
                      type="checkbox"
                      checked={settings.teamUpdates}
                      onChange={(e) => handleSettingsChange('teamUpdates', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">System Updates</span>
                    <input
                      type="checkbox"
                      checked={settings.systemUpdates}
                      onChange={(e) => handleSettingsChange('systemUpdates', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
