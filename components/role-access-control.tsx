"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"

export type UserRole = "admin" | "project_manager" | "developer" | "designer" | "client"

interface User {
  id: number
  name: string
  email: string
  role: UserRole
  permissions: string[]
  avatar?: string
}

interface RolePermissions {
  [key: string]: {
    name: string
    description: string
    permissions: string[]
  }
}

const rolePermissions: RolePermissions = {
  admin: {
    name: "Administrator",
    description: "Full system access",
    permissions: [
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
    ],
  },
  project_manager: {
    name: "Project Manager",
    description: "Manage projects and teams",
    permissions: [
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
  },
  developer: {
    name: "Developer",
    description: "Work on assigned tasks",
    permissions: [
      "view_projects",
      "manage_own_tasks",
      "comment_tasks",
      "upload_files",
      "track_time",
      "view_own_reports",
    ],
  },
  designer: {
    name: "Designer",
    description: "Design and creative tasks",
    permissions: [
      "view_projects",
      "manage_own_tasks",
      "comment_tasks",
      "upload_files",
      "track_time",
      "view_own_reports",
    ],
  },
  client: {
    name: "Client",
    description: "View project progress",
    permissions: ["view_assigned_projects", "comment_tasks", "view_reports"],
  },
}

interface RoleContextType {
  currentUser: User | null
  hasPermission: (permission: string) => boolean
  hasRole: (role: UserRole) => boolean
  canAccess: (requiredPermissions: string[]) => boolean
  rolePermissions: RolePermissions
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    // Ambil user dari localStorage jika ada
    const userStr = typeof window !== 'undefined' ? localStorage.getItem("nexapro_user") : null
    if (userStr) {
      setCurrentUser(JSON.parse(userStr))
    }
  }, [])

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false
    return currentUser.permissions.includes(permission)
  }

  const hasRole = (role: UserRole): boolean => {
    if (!currentUser) return false
    return currentUser.role === role
  }

  const canAccess = (requiredPermissions: string[]): boolean => {
    if (!currentUser) return false
    return requiredPermissions.every((permission) => currentUser.permissions.includes(permission))
  }

  return (
    <RoleContext.Provider value={{ currentUser, hasPermission, hasRole, canAccess, rolePermissions }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRoleAccess() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRoleAccess must be used within a RoleProvider")
  }
  return context
}

interface ProtectedComponentProps {
  children: React.ReactNode
  requiredPermissions?: string[]
  requiredRole?: UserRole
  fallback?: React.ReactNode
}

export function ProtectedComponent({
  children,
  requiredPermissions = [],
  requiredRole,
  fallback = <div className="text-gray-500 p-4 text-center">Access denied</div>,
}: ProtectedComponentProps) {
  const { hasPermission, hasRole, canAccess } = useRoleAccess()

  if (requiredRole && !hasRole(requiredRole)) {
    return <>{fallback}</>
  }

  if (requiredPermissions.length > 0 && !canAccess(requiredPermissions)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
