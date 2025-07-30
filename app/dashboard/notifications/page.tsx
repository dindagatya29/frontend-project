"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";

interface Notification {
  id: number;
  user: string;
  action: string;
  target: string;
  type: string;
  priority: string;
  read: boolean;
  time: string;
  details: string;
}

interface NotificationStats {
  total: number;
  unread: number;
  highPriority: number;
  read: number;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  tasks: boolean;
  projects: boolean;
  files: boolean;
  team: boolean;
}

interface TeamMember {
  id: number;
  name: string;
  phone?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    highPriority: 0,
    read: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // UI States
  const [showSettings, setShowSettings] = useState(false);
  const [showClearAllWarning, setShowClearAllWarning] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    tasks: true,
    projects: true,
    files: true,
    team: true,
  });

  const [teamMembers, setTeamMembers] = useState<{ id: number; name: string; phone?: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string; phone?: string } | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/team`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTeamMembers(data.data);
        }
      })
      .catch((err) => console.error("Gagal ambil data team:", err));
  }, []);

  // Real-time polling
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "https://nexapro.web.id/api";

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      if (readFilter !== "all") params.append("read", readFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`${API_BASE}/notifications?${params}`);
      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
        setError(null);
      } else {
        throw new Error(data.message || "Failed to fetch notifications");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/notifications/stats`);
      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/mark-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
        fetchStats(); // Refresh stats
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_BASE}/notifications/mark-all-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, read: true }))
        );
        fetchStats(); // Refresh stats
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        fetchStats(); // Refresh stats
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE}/notifications/clear-all`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setNotifications([]);
        setStats({ total: 0, unread: 0, highPriority: 0, read: 0 });
        setShowClearAllWarning(false);
      }
    } catch (err) {
      console.error("Failed to clear all notifications:", err);
    }
  };

  const updateSettings = async (newSettings: NotificationSettings) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        setSettings(newSettings);
        setShowSettings(false);
      }
    } catch (err) {
      console.error("Failed to update settings:", err);
    }
  };

  // Real-time polling effect
  useEffect(() => {
    fetchNotifications();
    fetchStats();

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      fetchStats();
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [typeFilter, priorityFilter, readFilter, searchQuery]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "task":
        return <FileText className="w-4 h-4" />;
      case "project":
        return <Briefcase className="w-4 h-4" />;
      case "file":
        return <FileText className="w-4 h-4" />;
      case "team":
        return <Users className="w-4 h-4" />;
      case "system":
        return <Zap className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (typeFilter !== "all" && notification.type !== typeFilter) return false;
    if (priorityFilter !== "all" && notification.priority !== priorityFilter)
      return false;
    if (readFilter !== "all") {
      const isRead = readFilter === "read";
      if (notification.read !== isRead) return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.user.toLowerCase().includes(query) ||
        notification.action.toLowerCase().includes(query) ||
        notification.target.toLowerCase().includes(query) ||
        notification.details.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
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
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Check className="w-4 h-4" />
            Mark All Read
          </button>

          <button
            onClick={() => setShowClearAllWarning(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Bell className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
            </div>
            <Bell className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.highPriority}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Read</p>
              <p className="text-2xl font-bold text-green-600">{stats.read}</p>
            </div>
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          >
            <option value="all">All Types</option>
            <option value="task">Tasks</option>
            <option value="project">Projects</option>
            <option value="file">Files</option>
            <option value="team">Team</option>
            <option value="system">System</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>

          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications
              </h2>
              <span className="text-sm text-gray-500">
                {filteredNotifications.length} notifications found
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>

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

        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                !notification.read ? "bg-green-50" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`p-2 rounded-lg ${
                      notification.read ? "bg-gray-100" : "bg-green-100"
                    }`}
                  >
                    {getTypeIcon(notification.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {notification.user} {notification.action}
                      </span>
                      <span className="font-semibold text-green-600">
                        {notification.target}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {notification.details}
                    </p>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                          notification.priority
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
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && !loading && (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
      <br></br>

     {/* Form Buat Notifikasi */}
<div className="bg-white p-6 rounded-lg shadow-sm border mb-6 text-black">
  <h2 className="text-lg font-bold mb-4">Create Notification & Send WhatsApp</h2>

  {/* Dropdown pilih user */}
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1 text-black">Pilih User</label>
    <select
      onChange={(e) => {
        const userId = parseInt(e.target.value);
        const user = teamMembers.find((u) => u.id === userId) || null;
        setSelectedUser(user);
      }}
      className="w-full border border-gray-300 p-2 rounded"
    >
      <option value="">-- Pilih User --</option>
      {teamMembers.map((member) => (
        <option key={member.id} value={member.id}>
          {member.name}
        </option>
      ))}
    </select>
  </div>

  <form
    onSubmit={async (e) => {
      e.preventDefault();

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const payload = {
        user_name: formData.get("user_name"),
        action: formData.get("action"),
        target: formData.get("target"),
        type: formData.get("type"),
        details: formData.get("details"),
        priority: formData.get("priority"),
        metadata: {},
        phone: formData.get("phone"),
        send_whatsapp: formData.get("send_whatsapp") === "on",
      };

      try {
        const res = await fetch(`${API_BASE}/notifications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (result.success) {
          alert("✅ Notifikasi berhasil dibuat dan dikirim ke WhatsApp!");
          fetchNotifications();
          fetchStats();
          form.reset();
          setSelectedUser(null);
        } else {
          alert("❌ Gagal: " + result.message);
        }
      } catch (err) {
        alert("❌ Terjadi error: " + err);
      }
    }}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <input
        name="user_name"
        required
        placeholder="User name"
        value={selectedUser?.name || ""}
        readOnly
        className="border border-gray-300 p-2 rounded text-black"
      />
      <input
        name="action"
        required
        placeholder="Action (contoh: membuat task pada)"
        className="border border-gray-300 p-2 rounded text-black"
      />
      <input
        name="target"
        required
        placeholder="Target (contoh: Project A)"
        className="border border-gray-300 p-2 rounded text-black"
      />
      <input
        name="type"
        required
        placeholder="Type (task/project/etc)"
        className="border border-gray-300 p-2 rounded text-black"
      />
      <select
        name="priority"
        required
        className="border border-gray-300 p-2 rounded text-black"
      >
        <option value="">-- Pilih Priority --</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        name="phone"
        required
        placeholder="Nomor WA"
        value={selectedUser?.phone || ""}
        readOnly
        className="border border-gray-300 p-2 rounded text-black"
      />
    </div>

    <textarea
      name="details"
      required
      placeholder="Details"
      className="w-full border border-gray-300 p-2 rounded mb-4 text-black"
      rows={3}
    ></textarea>

    <button
      type="submit"
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Kirim Notifikasi & WhatsApp
    </button>
  </form>
</div>


      {/* Clear All Warning Modal */}
      {showClearAllWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Clear All Notifications
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete all notifications? This will
              permanently remove all {stats.total} notifications from your
              account.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowClearAllWarning(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={clearAllNotifications}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Notification Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Email Notifications
                </span>
                <input
                  type="checkbox"
                  checked={settings.email}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      email: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Push Notifications
                </span>
                <input
                  type="checkbox"
                  checked={settings.push}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, push: e.target.checked }))
                  }
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Task Notifications
                </span>
                <input
                  type="checkbox"
                  checked={settings.tasks}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      tasks: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Project Notifications
                </span>
                <input
                  type="checkbox"
                  checked={settings.projects}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      projects: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  File Notifications
                </span>
                <input
                  type="checkbox"
                  checked={settings.files}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      files: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Team Notifications
                </span>
                <input
                  type="checkbox"
                  checked={settings.team}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, team: e.target.checked }))
                  }
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>
            </div>


            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => updateSettings(settings)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
