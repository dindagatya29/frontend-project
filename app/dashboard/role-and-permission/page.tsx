"use client";

import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRoleAccess } from "@/components/role-access-control";
import ProtectedRoute from "@/components/protected-route";
import PermissionStatus from "@/components/permission-status";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface RolePermission {
  id: number;
  role: string;
  permission_id: number;
  allowed: boolean;
  permission: Permission;
}

const ROLES = ["admin", "project_manager", "member"];

export default function RoleAndPermissionPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersError, setUsersError] = useState<string>("");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("member");
  const [rolePerms, setRolePerms] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Get current user and check permissions
  useEffect(() => {
    const userStr = localStorage.getItem("nexapro_user");
    if (!userStr) {
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(userStr);
    setCurrentUser(user);

    // Check if user is admin
    if (user.role !== "admin") {
      setPageLoading(false);
      return;
    }

    // Fetch users
    fetch("https://nexapro.web.id/api/admin/users/with-role")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          setUsers([]);
          setUsersError("Failed to load users.");
        }
      })
      .catch(() => {
        setUsers([]);
        setUsersError("Failed to load users.");
      })
      .finally(() => setPageLoading(false));
  }, []);

  // Fetch permissions
  useEffect(() => {
    if (currentUser?.role !== "admin") return;
    
    fetch("https://nexapro.web.id/api/admin/permissions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPermissions(data.data);
        } else {
          console.error("Failed to load permissions:", data);
        }
      })
      .catch((error) => {
        console.error("Error loading permissions:", error);
      });
  }, [currentUser]);

  // Fetch role permissions
  useEffect(() => {
    if (!selectedRole || currentUser?.role !== "admin") return;
    setLoading(true);
    fetch(`https://nexapro.web.id/api/admin/role-permissions/${selectedRole}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setRolePerms(data.data);
        } else {
          console.error("Failed to load role permissions:", data);
          setRolePerms([]);
        }
      })
      .catch((error) => {
        console.error("Error loading role permissions:", error);
        setRolePerms([]);
      })
      .finally(() => setLoading(false));
  }, [selectedRole, currentUser]);

  // Update user role
  const handleRoleChange = (userId: number, newRole: string) => {
    fetch(`https://nexapro.web.id/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    })
      .then((res) => res.json())
      .then(() => {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      });
  };

  // Toggle permission for role
  const handlePermissionToggle = (permissionId: number, allowed: boolean) => {
    setRolePerms((prev) => {
      const existing = prev.find((rp) => rp.permission_id === permissionId);
      if (existing) {
        return prev.map((rp) =>
          rp.permission_id === permissionId ? { ...rp, allowed } : rp
        );
      } else {
        // Add new permission if it doesn't exist
        return [...prev, {
          id: Date.now(), // temporary ID
          role: selectedRole,
          permission_id: permissionId,
          allowed,
          permission: permissions.find(p => p.id === permissionId) || {
            id: permissionId,
            name: '',
            description: ''
          }
        }];
      }
    });
  };

  // Save permissions
  const handleSavePermissions = () => {
    setSaving(true);
    fetch(`https://nexapro.web.id/api/admin/role-permissions/${selectedRole}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        permissions: rolePerms.map((rp) => ({
          permission_id: rp.permission_id,
          allowed: rp.allowed,
        })),
      }),
    })
      .then((res) => res.json())
      .finally(() => setSaving(false));
  };

  // Show loading state
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show access denied for non-admin users
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only administrators can access this page.</p>
          <p className="text-sm text-gray-500 mt-2">
            Your role: {currentUser?.role || 'Not logged in'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl text-black font-bold mb-6">Role and Permission Management</h1>
      
      {/* Status Notification */}
      {updateStatus && (
        <div className={`mb-4 p-4 rounded-lg ${
          updateStatus.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {updateStatus.type === 'success' ? '✅' : '❌'}
            </span>
            {updateStatus.message}
          </div>
        </div>
      )}
      <Card>
        <h2 className="text-xl font-semibold mb-4">User Role Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-black">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border border-gray-400">Name</th>
                <th className="p-2 border border-gray-400">Email</th>
                <th className="p-2 border border-gray-400">Role</th>
                <th className="p-2 border border-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {usersError ? (
                <tr><td colSpan={4} className="text-center text-red-500">{usersError}</td></tr>
              ) : Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="p-2 border border-gray-300">{user.name}</td>
                    <td className="p-2 border border-gray-300">{user.email}</td>
                    <td className="p-2 border border-gray-300">{user.role}</td>
                    <td className="p-2 border border-gray-300">
                      <select
                        className="border rounded px-2 py-1 capitalize text-black"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={user.role === "admin"}
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role} className="capitalize text-black">
                            {role.charAt(0).toUpperCase() + role.slice(1).replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="text-center text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Role Permissions</h2>
        <div className="mb-4">
          <label className="mr-2 font-medium">Select Role:</label>
          <select
            className="border text-black rounded px-2 py-1"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1).replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
            <span className="text-gray-600">Loading permissions...</span>
          </div>
        ) : permissions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">📋</div>
            <p>No permissions found.</p>
            <p className="text-sm">Please check if permissions are properly seeded.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-black">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border border-gray-400">Permission</th>
                  <th className="p-2 border border-gray-400">Description</th>
                  <th className="p-2 border border-gray-400">Allowed</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm) => {
                  const rp = rolePerms.find((r) => r.permission_id === perm.id);
                  const isAllowed = rp ? rp.allowed : false;
                  
                  return (
                    <tr key={perm.id} className="hover:bg-gray-100">
                      <td className="p-2 border border-gray-300">{perm.name}</td>
                      <td className="p-2 border border-gray-300">{perm.description}</td>
                      <td className="p-2 border border-gray-300 text-center">
                        <PermissionStatus
                          allowed={isAllowed}
                          onToggle={(val: boolean) => {
                            // Update local state immediately
                            handlePermissionToggle(perm.id, val);
                            
                            // Update backend
                            fetch(`https://nexapro.web.id/api/admin/role-permissions/${selectedRole}`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                permissions: [{ permission_id: perm.id, allowed: val }],
                              }),
                            })
                            .then(res => res.json())
                            .then(data => {
                              if (!data.success) {
                                // Revert if failed
                                handlePermissionToggle(perm.id, !val);
                                setUpdateStatus({type: 'error', message: 'Failed to update permission'});
                                setTimeout(() => setUpdateStatus(null), 3000);
                              } else {
                                setUpdateStatus({type: 'success', message: 'Permission updated successfully'});
                                setTimeout(() => setUpdateStatus(null), 3000);
                              }
                            })
                            .catch(() => {
                              // Revert if failed
                              handlePermissionToggle(perm.id, !val);
                              setUpdateStatus({type: 'error', message: 'Failed to update permission'});
                              setTimeout(() => setUpdateStatus(null), 3000);
                            });
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 text-right">
          <Button onClick={handleSavePermissions} disabled={saving}>
            {saving ? "Saving..." : "Save Permissions"}
          </Button>
        </div>
      </Card>
    </div>
  );
} 