"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NotificationSystem from "./notification-system";
import LogoutConfirmationModal from "./logout-confirmation-modal";
import ReportsPage from "@/app/dashboard/reports/page";
import clsx from "clsx";

// Real role access implementation
const useRoleAccess = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

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

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === "admin") return true; // Admin has all permissions
    return userPermissions.includes(permission);
  };

  return { currentUser, hasPermission };
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Add try-catch for useRoleAccess
  let currentUser = null;
  let hasPermission = (p0: string) => false;

  const roleAccess = useRoleAccess();
  currentUser = roleAccess?.currentUser;
  hasPermission = roleAccess?.hasPermission || (() => false);

  useEffect(() => {
    // Check if user is logged in via token
    const token = localStorage.getItem("nexapro_token");
    const userStr = localStorage.getItem("nexapro_user");
    if (!token) {
      router.push("/login");
      return;
    }
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserEmail(user.email);
      setUserName(user.name);
      // set currentUser if needed
    }
  }, [router]);

  // Load and apply settings
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem("nexapro_settings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);

        // Apply theme
        const root = document.documentElement;
        if (parsedSettings.theme === "dark") {
          root.classList.add("dark");
        } else if (parsedSettings.theme === "light") {
          root.classList.remove("dark");
        } else if (parsedSettings.theme === "auto") {
          if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        }

        // Apply compact mode
        if (parsedSettings.compactMode) {
          root.classList.add("compact-mode");
        } else {
          root.classList.remove("compact-mode");
        }

        // Apply sidebar collapsed
        setSidebarCollapsed(parsedSettings.sidebarCollapsed || false);
      }
    };

    loadSettings();

    // Listen for settings changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "nexapro_settings") {
        loadSettings();
      }
    };

    // Listen for custom settings change events
    const handleSettingsChange = (e: CustomEvent) => {
      if (e.detail.key === "sidebarCollapsed") {
        setSidebarCollapsed(e.detail.value);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "settingsChanged",
      handleSettingsChange as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "settingsChanged",
        handleSettingsChange as EventListener
      );
    };
  }, []);

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("nexapro_token");
    localStorage.removeItem("nexapro_user");
    setLogoutModalOpen(false);
    router.push("/");
  };

  const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "Projects", href: "/dashboard/projects", icon: "projects" },
    { name: "Tasks", href: "/dashboard/tasks", icon: "task" },
    { name: "Team", href: "/dashboard/team", icon: "team" },
    { name: "Calendar", href: "/dashboard/calendar", icon: "calendar" },
    { name: "Reports", href: "/dashboard/reports", icon: "report" },
    { name: "Documents", href: "/dashboard/documents", icon: "documents" },
    { name: "Time Tracker", href: "/dashboard/time-tracker", icon: "time" },
    { name: "KPI & OKR", href: "/dashboard/kpi-okr", icon: "kpi" },
    {
      name: "Integrations",
      href: "/dashboard/integrations",
      icon: "integrations",
    },
    { name: "Activity Log", href: "/dashboard/activity", icon: "activity" },
    { name: "Settings", href: "/dashboard/settings", icon: "settings" },
    {
      name: "Notification",
      href: "/dashboard/notifications",
      icon: "notifications",
    },
  ];

  const filteredSidebarItems = sidebarItems.filter((item) => {
    // Strict permission checks for all items
    switch (item.name) {
      case "Dashboard":
        return true; // Everyone can access dashboard
      case "Projects":
        return hasPermission("view_projects");
      case "Tasks":
        return (
          hasPermission("manage_tasks") || hasPermission("manage_own_tasks")
        );
      case "Team":
        return hasPermission("manage_team");
      case "Calendar":
        return hasPermission("view_projects");
      case "Reports":
      case "KPI & OKR":
        return hasPermission("view_reports");
      case "Documents":
        return hasPermission("upload_files") || hasPermission("view_projects");
      case "Time Tracker":
        return hasPermission("track_time");
      case "Integrations":
        return hasPermission("manage_integrations");
      case "Activity Log":
        return hasPermission("view_projects");
      case "Settings":
        return hasPermission("manage_settings");
      case "Notification":
        return true; // Everyone can see notifications
      default:
        return false; // Deny by default
    }
  });

  // Only show Role and Permission for admin with manage_roles permission
  if (
    currentUser &&
    currentUser.role === "admin" &&
    hasPermission("manage_roles")
  ) {
    filteredSidebarItems.push({
      name: "Role and Permission",
      href: "/dashboard/role-and-permission",
      icon: "admin",
    });
  }

  const getIcon = (iconName: string) => {
    const icons = {
      dashboard: (
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
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
      projects: (
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
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      task: (
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
          <path d="M9 12l2 2 4-4" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      ),
      calendar: (
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
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      ),
      team: (
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
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      report: (
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
          <line x1="18" x2="18" y1="20" y2="10" />
          <line x1="12" x2="12" y1="20" y2="4" />
          <line x1="6" x2="6" y1="20" y2="14" />
        </svg>
      ),
      documents: (
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
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14,2 14,8 20,8" />
        </svg>
      ),
      settings: (
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
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      admin: (
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="m22 21-2-2-2-2" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      time: (
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
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      ),
      kpi: (
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
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ),
      integrations: (
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
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      activity: (
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
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      notifications: (
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
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      ),
    };

    return icons[iconName as keyof typeof icons] || icons.dashboard;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              {/* New N Logo */}
              <div className="h-10 w-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                Nexa Pro
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
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
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {filteredSidebarItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center space-x-3 px-2 py-2 text-sm font-medium rounded-md text-gray-600 active:bg-gray-200 active:text-gray-900 transition-all duration-150 ease-in-out"
                onClick={() => setSidebarOpen(false)}
              >
                {getIcon(item.icon)}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4">
            {/* New N Logo */}
            <div className="h-10 w-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">
              Nexa Pro
            </span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {filteredSidebarItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center space-x-3 px-2 py-2 text-sm font-medium rounded-md text-gray-600 active:bg-gray-200 active:text-gray-900 transition-all duration-150 ease-in-out"
                onClick={() => setSidebarOpen(false)}
              >
                {getIcon(item.icon)}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-500 hover:text-gray-600 lg:hidden"
              >
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
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <div className="relative">
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
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-80 bg-gray-50"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Enhanced Notifications */}
              <NotificationSystem />

              <div
                onClick={() => setShowProfilePopup(!showProfilePopup)}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
              >
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-800">
                    {userName || currentUser?.name || "User"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentUser?.role?.replace("_", " ") || "Role"}
                  </div>
                </div>
              </div>

              {showProfilePopup && !showEditProfile && (
                <div className="absolute top-16 right-4 w-64 bg-white border rounded-lg shadow-lg z-50 p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    👤 Hello, {userName || currentUser?.name}
                  </h3>
                  <button
                    onClick={() => {
                      setShowProfilePopup(false);
                      router.push("/dashboard/profile");
                    }}
                    className="w-full text-left px-4 py-2 mb-2 rounded hover:bg-gray-100 text-sm text-gray-800"
                  >
                    ✏️ Profile
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-sm text-red-600"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        userName={userName || currentUser?.name || "User"}
      />
    </div>
  );
}
