"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Bell,
  CheckCheck,
  ExternalLink,
  MessageCircle,
  Calendar,
  User,
  TrendingUp,
  Link,
  Settings,
  X,
  Clock,
  AlertTriangle,
  Sparkles,
  ChevronRight,
} from "lucide-react"

interface Notification {
  id: number
  type: "deadline" | "assignment" | "comment" | "progress" | "system" | "integration"
  title: string
  message: string
  time: string
  read: boolean
  priority: "high" | "medium" | "low"
  actionUrl?: string
  assignee?: string
  project?: string
}

// WhatsApp notification function
const sendWhatsAppNotification = async (notification: Notification) => {
  const phoneNumber = "+6281234567890" // Replace with actual phone number
  const message = `🚨 URGENT NOTIFICATION 🚨\n\n${notification.title}\n${notification.message}\n\nTime: ${notification.time}\nProject: ${notification.project || "N/A"}\n\nPlease check the dashboard immediately.`
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  console.log("Sending WhatsApp notification:", message)
  window.open(whatsappUrl, "_blank")
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "deadline",
      title: "Critical Deadline Alert",
      message: "Website Redesign project deadline approaching in 2 days. Immediate action required.",
      time: "5 minutes ago",
      read: false,
      priority: "high",
      actionUrl: "/dashboard/projects/1",
      project: "Website Redesign",
    },
    {
      id: 2,
      type: "assignment",
      title: "New Task Assignment",
      message: "You have been assigned to 'API Documentation' task with high priority.",
      time: "1 hour ago",
      read: false,
      priority: "medium",
      actionUrl: "/dashboard/tasks/5",
      assignee: "John Doe",
    },
    {
      id: 3,
      type: "comment",
      title: "New Comment Received",
      message: "John Doe commented on 'Design Review' task with important feedback.",
      time: "2 hours ago",
      read: true,
      priority: "low",
      actionUrl: "/dashboard/tasks/3",
    },
    {
      id: 4,
      type: "progress",
      title: "Milestone Achievement",
      message: "Mobile App Development reached 75% completion. Great progress!",
      time: "3 hours ago",
      read: true,
      priority: "medium",
      actionUrl: "/dashboard/projects/2",
      project: "Mobile App Development",
    },
    {
      id: 5,
      type: "integration",
      title: "Integration Success",
      message: "GitHub sync completed successfully with all repositories updated.",
      time: "4 hours ago",
      read: false,
      priority: "low",
      actionUrl: "/dashboard/integrations",
    },
    {
      id: 6,
      type: "system",
      title: "System Maintenance",
      message: "Weekly backup completed successfully. All data secured.",
      time: "6 hours ago",
      read: true,
      priority: "low",
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    }
  }, [isOpen])

  const getNotificationIcon = (type: string) => {
    const iconProps = { size: 18, className: "text-current" }
    switch (type) {
      case "deadline":
        return <Calendar {...iconProps} />
      case "assignment":
        return <User {...iconProps} />
      case "comment":
        return <MessageCircle {...iconProps} />
      case "progress":
        return <TrendingUp {...iconProps} />
      case "integration":
        return <Link {...iconProps} />
      case "system":
        return <Settings {...iconProps} />
      default:
        return <Bell {...iconProps} />
    }
  }

  const getNotificationStyle = (type: string, priority: string) => {
    const baseStyle =
      "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110"

    switch (type) {
      case "deadline":
        return `${baseStyle} ${
          priority === "high"
            ? "bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-red-200"
            : "bg-gradient-to-br from-red-50 to-red-100 text-red-600 border-2 border-red-200 shadow-red-100"
        }`
      case "assignment":
        return `${baseStyle} ${
          priority === "high"
            ? "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-blue-200"
            : "bg-gradient-to-br from-blue-50 to-blue-100 text-green-600 border-2 border-green-200 shadow-blue-100"
        }`
      case "comment":
        return `${baseStyle} ${
          priority === "high"
            ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-emerald-200"
            : "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 border-2 border-emerald-200 shadow-emerald-100"
        }`
      case "progress":
        return `${baseStyle} ${
          priority === "high"
            ? "bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white shadow-purple-200"
            : "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 border-2 border-purple-200 shadow-purple-100"
        }`
      case "integration":
        return `${baseStyle} ${
          priority === "high"
            ? "bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white shadow-orange-200"
            : "bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 border-2 border-orange-200 shadow-orange-100"
        }`
      case "system":
        return `${baseStyle} ${
          priority === "high"
            ? "bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 text-white shadow-slate-200"
            : "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 border-2 border-slate-200 shadow-slate-100"
        }`
      default:
        return `${baseStyle} bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 border-2 border-gray-200 shadow-gray-100`
    }
  }

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <AlertTriangle size={8} className="text-white" />
          </div>
        )
      case "medium":
        return (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-md" />
        )
      case "low":
        return (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-md" />
        )
      default:
        return null
    }
  }

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const handleNotificationClick = async (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.priority === "high") {
      await sendWhatsAppNotification(notification)
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 text-slate-600 hover:text-slate-800 hover:bg-white/80 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/20 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl group"
      >
        <Bell
          size={22}
          className={`transition-all duration-300 ${isOpen ? "rotate-12 scale-110" : "group-hover:scale-105"}`}
        />
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center animate-pulse shadow-lg border-2 border-white">
            <span className="relative">
              {unreadCount > 99 ? "99+" : unreadCount}
              <Sparkles size={8} className="absolute -top-1 -right-1 text-yellow-300 animate-spin" />
            </span>
          </div>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          {/* Dropdown Panel */}
          <div
            className={`absolute right-0 mt-4 w-[420px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 z-50 overflow-hidden transition-all duration-500 ${
              isAnimating ? "animate-in slide-in-from-top-4 fade-in-0" : ""
            }`}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-slate-50/80 to-blue-50/80 backdrop-blur-sm border-b border-white/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Bell size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      Notifications
                      <Sparkles size={16} className="text-green-500" />
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {unreadCount > 0
                        ? `${unreadCount} new notification${unreadCount > 1 ? "s" : ""} waiting`
                        : "You're all caught up! ✨"}
                    </p>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 text-sm text-green-600 hover:text-blue-800 font-semibold px-4 py-2.5 rounded-xl hover:bg-green-50 transition-all duration-200 border border-green-200/50 shadow-sm hover:shadow-md"
                  >
                    <CheckCheck size={16} />
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-lg">
                    <Bell size={32} className="text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-700 text-lg mb-2">No notifications</h4>
                  <p className="text-slate-500">You're all caught up! Great work! 🎉</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`relative p-5 border-b border-white/30 hover:bg-gradient-to-r hover:from-white/50 hover:to-slate-50/50 cursor-pointer transition-all duration-300 group ${
                      !notification.read ? "bg-gradient-to-r from-blue-50/30 to-indigo-50/30" : ""
                    } ${index === notifications.length - 1 ? "border-b-0 rounded-b-3xl" : ""}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Delete Button */}
                    <button
                      onClick={(e) => deleteNotification(notification.id, e)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all duration-300 z-10"
                    >
                      <X size={16} />
                    </button>

                    <div className="flex items-start space-x-4">
                      {/* Icon with Priority Indicator */}
                      <div className="relative flex-shrink-0">
                        <div className={getNotificationStyle(notification.type, notification.priority)}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        {getPriorityIndicator(notification.priority)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-12">
                        <div className="flex items-start justify-between mb-2">
                          <h4
                            className={`text-base font-bold leading-tight ${
                              !notification.read ? "text-slate-800" : "text-slate-600"
                            } ${notification.priority === "high" ? "text-red-800" : ""}`}
                          >
                            {notification.title}
                            {notification.priority === "high" && (
                              <span className="ml-3 inline-flex items-center gap-1.5 text-xs bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                                <AlertTriangle size={10} />
                                URGENT
                              </span>
                            )}
                          </h4>
                          {!notification.read && (
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex-shrink-0 mt-1 shadow-lg animate-pulse" />
                          )}
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock size={12} />
                            <span className="font-medium">{notification.time}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {notification.project && (
                              <span className="text-xs bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-3 py-1.5 rounded-full font-semibold border border-green-200/50 shadow-sm">
                                📁 {notification.project}
                              </span>
                            )}
                            {notification.assignee && (
                              <span className="text-xs bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full font-semibold border border-emerald-200/50 shadow-sm">
                                👤 {notification.assignee}
                              </span>
                            )}
                            {notification.actionUrl && (
                              <div className="flex items-center gap-1 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ChevronRight size={14} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-5 bg-gradient-to-r from-slate-50/80 to-blue-50/80 backdrop-blur-sm border-t border-white/30">
                <button className="w-full text-sm text-green-600 hover:text-blue-800 font-bold py-3.5 px-6 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 flex items-center justify-center gap-3 border border-green-200/50 shadow-sm hover:shadow-md group">
                  <span>View all notifications</span>
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
