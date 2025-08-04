"use client"
import type React from "react"
import { CommandEmpty } from "@/components/ui/command"

import { Switch } from "@/components/ui/switch"

import { useState, useEffect } from "react"
import {
  Bell,
  Search,
  Filter,
  Settings,
  Check,
  X,
  Trash2,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  Briefcase,
  Zap,
  CheckIcon,
  ChevronsUpDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils" // Import cn for conditional class names

// Import hooks for projects and tasks
import { useProjects } from "@/hooks/use-projects"
import { useTasks } from "@/hooks/use-tasks"
import { useTeam } from "@/hooks/use-team"

interface Notification {
  id: number
  user: string
  action: string
  target: string
  type: string
  priority: string
  read: boolean
  time: string
  details: string
}

interface NotificationStats {
  total: number
  unread: number
  highPriority: number
  read: number
}

interface NotificationSettings {
  email: boolean
  push: boolean
  tasks: boolean
  projects: boolean
  files: boolean
  team: boolean
}

// Gunakan interface TeamMember dari useTeam hook
interface TeamMember {
  id: number
  name: string
  email: string
  role: string
  phone?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    highPriority: 0,
    read: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [readFilter, setReadFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // UI States
  const [showSettings, setShowSettings] = useState(false)
  const [showClearAllWarning, setShowClearAllWarning] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    tasks: true,
    projects: true,
    files: true,
    team: true,
  })

  // Gunakan useTeam hook untuk mendapatkan teamMembers
  const { teamMembers } = useTeam()
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null)
  const [openUserSelect, setOpenUserSelect] = useState(false) // State for combobox open/close

  // Form states for new notification
  const [formUserName, setFormUserName] = useState("")
  const [formAction, setFormAction] = useState("") // Ini akan diisi dengan judul tugas yang dipilih
  const [formTarget, setFormTarget] = useState("")
  const [formType, setFormType] = useState("")
  const [formPriority, setFormPriority] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formDetails, setFormDetails] = useState("")
  const [manualTask, setManualTask] = useState("") // Ini sudah ada, pastikan ada.

  // Tambahkan instance Audio di luar fungsi komponen atau di dalam useEffect dengan cleanup
  // agar tidak membuat instance baru setiap render.
  // Untuk kesederhanaan, kita bisa membuatnya di dalam komponen dan memastikannya hanya dibuat sekali.
  const notificationSound = typeof Audio !== "undefined" ? new Audio("/sounds/deadline.mp3") : null

  // Data from hooks
  const { projects } = useProjects()
  const { tasks } = useTasks()

  // Debugging: Log data from hooks
  useEffect(() => {
    console.log("Projects data:", projects)
    console.log("Tasks data:", tasks)
    console.log("Team Members data (from useTeam):", teamMembers) // Tambahkan log ini
  }, [projects, tasks, teamMembers])

  // Real-time polling
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://nexapro.web.id/api"

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (typeFilter !== "all") params.append("type", typeFilter)
      if (priorityFilter !== "all") params.append("priority", priorityFilter)
      if (readFilter !== "all") params.append("read", readFilter)
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`${API_BASE}/notifications?${params}`)
      if (!response.ok) throw new Error("Failed to fetch notifications")
      const data = await response.json()
      if (data.success) {
        setNotifications(data.data)
        setError(null)
      } else {
        throw new Error(data.message || "Failed to fetch notifications")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/notifications/stats`)
      if (!response.ok) throw new Error("Failed to fetch stats")
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/mark-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
        fetchStats() // Refresh stats
      }
    } catch (err) {
      console.error("Failed to mark as read:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_BASE}/notifications/mark-all-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
        fetchStats() // Refresh stats
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err)
    }
  }

  const deleteNotification = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id))
        fetchStats() // Refresh stats
      }
    } catch (err) {
      console.error("Failed to delete notification:", err)
    }
  }

  const clearAllNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE}/notifications/clear-all`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
        setNotifications([])
        setStats({ total: 0, unread: 0, highPriority: 0, read: 0 })
        setShowClearAllWarning(false)
      }
    } catch (err) {
      console.error("Failed to clear all notifications:", err)
    }
  }

  const updateSettings = async (newSettings: NotificationSettings) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      })
      if (response.ok) {
        setSettings(newSettings)
        setShowSettings(false)
      }
    } catch (err) {
      console.error("Failed to update settings:", err)
    }
  }

  // Real-time polling effect
  useEffect(() => {
    fetchNotifications()
    fetchStats()
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications()
      fetchStats()
      setLastUpdate(new Date())
    }, 30000)
    return () => clearInterval(interval)
  }, [typeFilter, priorityFilter, readFilter, searchQuery])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "task":
        return <FileText className="w-4 h-4" />
      case "project":
        return <Briefcase className="w-4 h-4" />
      case "file":
        return <FileText className="w-4 h-4" />
      case "team":
        return <Users className="w-4 h-4" />
      case "system":
        return <Zap className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
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

  const filteredNotifications = notifications.filter((notification) => {
    if (typeFilter !== "all" && notification.type !== typeFilter) return false
    if (priorityFilter !== "all" && notification.priority !== priorityFilter) return false
    if (readFilter !== "all") {
      const isRead = readFilter === "read"
      if (notification.read !== isRead) return false
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        notification.user.toLowerCase().includes(query) ||
        notification.action.toLowerCase().includes(query) ||
        notification.target.toLowerCase().includes(query) ||
        notification.details.toLowerCase().includes(query)
      )
    }
    return true
  })

  const handleCreateNotification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const currentTime = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })

    // Temukan tugas yang dipilih berdasarkan ID dari manualTask
    const selectedTask = tasks.find((task) => task.id.toString() === manualTask)
    const actionTitle = selectedTask ? selectedTask.title : "Aksi Tidak Dikenal" // Gunakan judul tugas yang dipilih

    // Construct the detailed WhatsApp message template
    const whatsappMessage =
      `🔔 Notifikasi Baru!\n` +
      `👤 Pengguna: ${formUserName}\n` +
      `⚡ Aksi: ${actionTitle} pada ${formTarget}\n` +
      `📝 Detail: ${formDetails}\n` +
      `✨ Tipe: ${formType} | Prioritas: ${formPriority}\n` +
      `⏰ Waktu: ${currentTime}\n` +
      `---\n_Sent via fonnte.com_`

    const payload = {
      user_name: formUserName,
      action: actionTitle, // Pastikan ini menggunakan judul tugas yang dipilih
      target: formTarget,
      type: formType,
      details: whatsappMessage,
      priority: formPriority,
      metadata: {},
      phone: formPhone,
      send_whatsapp: true,
    }

    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (result.success) {
        alert("✅ Notifikasi berhasil dibuat dan dikirim ke WhatsApp!")
        fetchNotifications()
        fetchStats()
        if (notificationSound) {
          notificationSound.play().catch((e) => console.error("Error playing sound:", e))
        }
        // Reset form fields
        setFormUserName("")
        setFormAction("") // Ini tidak lagi digunakan untuk ID, tapi bisa direset
        setFormTarget("")
        setFormType("")
        setFormPriority("")
        setFormPhone("")
        setFormDetails("")
        setSelectedUser(null)
        setManualTask("") // Reset manualTask setelah pengiriman
      } else {
        alert("❌ Gagal: " + result.message)
      }
    } catch (err) {
      alert("❌ Terjadi error: " + err)
    }
  }

  useEffect(() => {
    if (selectedUser) {
      setFormUserName(selectedUser.name)
      setFormPhone(selectedUser.phone || "")
    } else {
      setFormUserName("")
      setFormPhone("")
    }
  }, [selectedUser])

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="w-8 h-8 text-green-600" />
            Notifications
          </h1>
          <p className="text-gray-600 mt-2">Stay updated with all activities</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={markAllAsRead}
            className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
          >
            <Check className="w-4 h-4" />
            Mark All Read
          </Button>
          <Button
            onClick={() => setShowClearAllWarning(true)}
            className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
          <Button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 bg-gray-600 text-white hover:bg-gray-700"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Bell className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
            </div>
            <Bell className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-orange-600">{stats.highPriority}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
        <Card className="p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Read</p>
              <p className="text-2xl font-bold text-green-600">{stats.read}</p>
            </div>
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] text-black">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="task">Tasks</SelectItem>
              <SelectItem value="project">Projects</SelectItem>
              <SelectItem value="file">Files</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px] text-black">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={readFilter} onValueChange={setReadFilter}>
            <SelectTrigger className="w-[180px] text-black">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-black"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <Card className="rounded-lg shadow-sm border">
        <CardHeader className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <CardTitle className="text-lg font-semibold text-gray-900">Notifications</CardTitle>
              <span className="text-sm text-gray-500">{filteredNotifications.length} notifications found</span>
            </div>
            <div className="text-xs text-gray-400">Last updated: {lastUpdate.toLocaleTimeString()}</div>
          </div>
        </CardHeader>
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        <CardContent className="p-0 divide-y divide-gray-200">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-green-50" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-2 rounded-lg ${notification.read ? "bg-gray-100" : "bg-green-100"}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {notification.user} {notification.action}
                      </span>
                      <span className="font-semibold text-green-600">{notification.target}</span>
                      {!notification.read && <div className="w-2 h-2 bg-green-600 rounded-full"></div>}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.details}</p>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                          notification.priority,
                        )}`}
                      >
                        {notification.priority} Priority
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                      className="text-gray-400 hover:text-green-600"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteNotification(notification.id)}
                    title="Delete notification"
                    className="text-gray-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
        {filteredNotifications.length === 0 && !loading && (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </Card>

      <br />

      {/* Form Buat Notifikasi */}
      <Card className="p-6 rounded-lg shadow-sm border mb-6 text-black">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-lg font-bold">Create Notification & Send WhatsApp</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Combobox Pilih User */}
          <div className="mb-4">
            <Label htmlFor="user-select" className="block text-sm font-medium mb-1 text-black">
              Pilih User
            </Label>
            <Popover open={openUserSelect} onOpenChange={setOpenUserSelect}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openUserSelect}
                  className="w-full justify-between text-gray-900 bg-transparent"
                >
                  {selectedUser ? teamMembers.find((member) => member.id === selectedUser.id)?.name : "Pilih User..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                  <CommandInput placeholder="Cari user..." />
                  <CommandList>
                    <CommandEmpty>Tidak ada user ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {teamMembers.map((member) => (
                        <CommandItem
                          key={member.id}
                          value={member.name} // Value for search
                          onSelect={() => {
                            setSelectedUser(member)
                            setOpenUserSelect(false)
                          }}
                        >
                          <CheckIcon
                            className={cn("mr-2 h-4 w-4", selectedUser?.id === member.id ? "opacity-100" : "opacity-0")}
                          />
                          <div className="flex flex-col">
                            <span>{member.name}</span>
                            <span className="text-xs text-gray-500">
                              {member.email} ({member.phone || "No Phone"})
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <form onSubmit={handleCreateNotification}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="user_name" className="sr-only">
                  User Name
                </Label>
                <Input
                  id="user_name"
                  name="user_name"
                  required
                  placeholder="User name"
                  value={formUserName}
                  onChange={(e) => setFormUserName(e.target.value)}
                  readOnly
                  className="text-black"
                />
              </div>
              <div>
                <Label htmlFor="action" className="block text-sm font-medium mb-1 text-black">
                  Action (Task Title)
                </Label>
                <select
                  id="action"
                  name="action"
                  value={manualTask} // Menggunakan manualTask untuk menyimpan ID tugas yang dipilih
                  onChange={(e) => setManualTask(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    -- Pilih Tugas --
                  </option>
                  {tasks.map((task) => {
                    const projectName = projects.find((p) => p.id === task.project_id)?.name || "Tanpa Project"
                    return (
                      <option key={task.id} value={task.id}>
                        {task.title} ({projectName})
                      </option>
                    )
                  })}
                </select>
              </div>
              <div>
                <Label htmlFor="target" className="block text-sm font-medium mb-1 text-black">
                  Target (Project Name)
                </Label>
                <Select value={formTarget} onValueChange={setFormTarget} required>
                  <SelectTrigger id="target" className="w-full text-black">
                    <SelectValue placeholder="Pilih Nama Proyek" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.name}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type" className="sr-only">
                  Type
                </Label>
                <Input
                  id="type"
                  name="type"
                  required
                  placeholder="Type (task/project/etc)"
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="text-black"
                />
              </div>
              <div>
                <Label htmlFor="priority" className="sr-only">
                  Priority
                </Label>
                <Select value={formPriority} onValueChange={setFormPriority} required>
                  <SelectTrigger id="priority" className="w-full text-black">
                    <SelectValue placeholder="-- Pilih Priority --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone" className="sr-only">
                  Nomor WA
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  placeholder="Nomor WA"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  readOnly
                  className="text-black"
                />
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="details" className="sr-only">
                Details
              </Label>
              <Textarea
                id="details"
                name="details"
                required
                placeholder="Details"
                value={formDetails}
                onChange={(e) => setFormDetails(e.target.value)}
                className="w-full text-black"
                rows={3}
              ></Textarea>
            </div>
            <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
              Kirim Notifikasi & WhatsApp
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Clear All Warning Modal */}
      {showClearAllWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Clear All Notifications</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete all notifications? This will permanently remove all {stats.total}{" "}
              notifications from your account.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowClearAllWarning(false)}
                className="flex-1 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button onClick={clearAllNotifications} className="flex-1 bg-red-600 text-white hover:bg-red-700">
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                <Switch
                  checked={settings.email}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      email: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                <Switch
                  checked={settings.push}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, push: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Task Notifications</span>
                <Switch
                  checked={settings.tasks}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      tasks: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Project Notifications</span>
                <Switch
                  checked={settings.projects}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      projects: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">File Notifications</span>
                <Switch
                  checked={settings.files}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      files: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Team Notifications</span>
                <Switch
                  checked={settings.team}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, team: checked }))}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="flex-1 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={() => updateSettings(settings)}
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
