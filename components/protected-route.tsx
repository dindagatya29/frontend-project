"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  requiredPermissions?: string[]
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermissions = [], 
  fallback 
}: ProtectedRouteProps) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userPermissions, setUserPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userStr = localStorage.getItem("nexapro_user")
    if (!userStr) {
      router.push("/login")
      return
    }

    const user = JSON.parse(userStr)
    setCurrentUser(user)

    // Fetch user permissions
    fetch(`http://localhost:8000/api/admin/user-permissions/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setUserPermissions(data.data.map((p: any) => p.name))
        }
      })
      .catch(() => {
        // Fallback permissions based on role
        const rolePermissions = {
          admin: [
            "manage_users", "manage_projects", "manage_tasks", "view_reports", 
            "export_data", "manage_settings", "manage_integrations", "manage_roles",
            "track_time", "view_projects", "manage_team"
          ],
          project_manager: [
            "manage_projects", "manage_tasks", "assign_tasks", "view_reports",
            "export_data", "manage_team", "view_time_tracking", "track_time", "view_projects"
          ],
          member: [
            "view_projects", "manage_own_tasks", "comment_tasks", "upload_files",
            "track_time", "view_own_reports"
          ]
        }
        setUserPermissions(rolePermissions[user.role as keyof typeof rolePermissions] || [])
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Check role requirement
  if (requiredRole && currentUser?.role !== requiredRole) {
    return fallback || (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have the required role to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">
            Required: {requiredRole} | Your role: {currentUser?.role}
          </p>
        </div>
      </div>
    )
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      currentUser?.role === 'admin' || userPermissions.includes(permission)
    )
    
    if (!hasAllPermissions) {
      return fallback || (
        <div className="p-8 text-center">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have the required permissions to access this page.</p>
            <p className="text-sm text-gray-500 mt-2">
              Required: {requiredPermissions.join(', ')}
            </p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
} 