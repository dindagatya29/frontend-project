"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PermissionStatus from "@/components/permission-status";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  ShieldAlert,
  Users,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

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
  const [updateStatus, setUpdateStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("users");

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
        console.log("Fetch role permissions response:", data); // Debug log

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
      .finally(() => {
        setLoading(false);
        console.log("Finished loading role permissions"); // Debug log
      });
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
        setUpdateStatus({
          type: "success",
          message: "User role updated successfully",
        });
        setTimeout(() => setUpdateStatus(null), 3000);
      })
      .catch(() => {
        setUpdateStatus({
          type: "error",
          message: "Failed to update user role",
        });
        setTimeout(() => setUpdateStatus(null), 3000);
      });
  };

  // Toggle permission for role
  const handlePermissionToggle = (permissionId: number, allowed: boolean) => {
    console.log("Toggle perm:", permissionId, allowed);
    setRolePerms((prev) => {
      console.log("Before update:", prev);
      const existing = prev.find(
        (rp) => Number(rp.permission_id) === Number(permissionId)
      );
      if (existing) {
        return prev.map((rp) =>
          Number(rp.permission_id) === Number(permissionId)
            ? { ...rp, allowed }
            : rp
        );
      } else {
        return [
          ...prev,
          {
            id: Date.now(),
            role: selectedRole,
            permission_id: permissionId,
            allowed,
            permission: permissions.find((p) => p.id === permissionId) || {
              id: permissionId,
              name: "",
              description: "",
            },
          },
        ];
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
      .then((data) => {
        if (data.success) {
          setUpdateStatus({
            type: "success",
            message: "All permissions saved successfully",
          });

          // Refetch role permissions supaya state selalu update
          fetch(
            `https://nexapro.web.id/api/admin/role-permissions/${selectedRole}`
          )
            .then((res) => res.json())
            .then((fresh) => {
              if (fresh.success && Array.isArray(fresh.data)) {
                setRolePerms(fresh.data);
              }
            })
            .catch((error) => {
              console.error("Error refetching role permissions:", error);
            });
        } else {
          setUpdateStatus({
            type: "error",
            message: "Failed to save permissions",
          });
        }
        setTimeout(() => setUpdateStatus(null), 3000);
      })
      .catch(() => {
        setUpdateStatus({
          type: "error",
          message: "Failed to save permissions",
        });
        setTimeout(() => setUpdateStatus(null), 3000);
      })
      .finally(() => setSaving(false));
  };

  // Show loading state
  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-medium text-gray-700">
          Loading permissions system...
        </h2>
      </div>
    );
  }

  // Show access denied for non-admin users
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-2" />
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              Only administrators can access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">Your role:</span>
              <Badge variant="outline" className="capitalize">
                {currentUser?.role || "Not logged in"}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Role & Permission Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage user roles and their permissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize px-3 py-1">
            <Users className="h-3.5 w-3.5 mr-1" />
            {users.length} Users
          </Badge>
          <Badge variant="outline" className="capitalize px-3 py-1">
            <Lock className="h-3.5 w-3.5 mr-1" />
            {permissions.length} Permissions
          </Badge>
        </div>
      </div>

      {/* Status Notification */}
      {updateStatus && (
        <Alert
          variant={updateStatus.type === "success" ? "default" : "destructive"}
          className="mb-6 animate-in fade-in slide-in-from-top-5 duration-300"
        >
          {updateStatus.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {updateStatus.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{updateStatus.message}</AlertDescription>
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>User Roles</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Role Permissions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Role Management
              </CardTitle>
              <CardDescription>
                Assign roles to users to control their access to features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="py-3 px-4 text-left font-medium">Name</th>
                      <th className="py-3 px-4 text-left font-medium">Email</th>
                      <th className="py-3 px-4 text-left font-medium">
                        Current Role
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersError ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-6 text-center text-destructive"
                        >
                          <AlertCircle className="h-5 w-5 mx-auto mb-2" />
                          {usersError}
                        </td>
                      </tr>
                    ) : Array.isArray(users) && users.length > 0 ? (
                      users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 px-4">{user.name}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                user.role === "admin"
                                  ? "default"
                                  : user.role === "project_manager"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="capitalize"
                            >
                              {user.role.replace("_", " ")}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Select
                              defaultValue={user.role}
                              disabled={user.role === "admin"}
                              onValueChange={(value) =>
                                handleRoleChange(user.id, value)
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLES.map((role) => (
                                  <SelectItem
                                    key={role}
                                    value={role}
                                    className="capitalize"
                                  >
                                    {role.charAt(0).toUpperCase() +
                                      role.slice(1).replace("_", " ")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 text-center text-muted-foreground"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Role Permissions
              </CardTitle>
              <CardDescription>
                Configure which permissions are granted to each role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Select Role:</label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem
                          key={role}
                          value={role}
                          className="capitalize"
                        >
                          {role.charAt(0).toUpperCase() +
                            role.slice(1).replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1" />

                <Button
                  onClick={handleSavePermissions}
                  disabled={saving || loading}
                  className="sm:self-end"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save All Permissions"
                  )}
                </Button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">
                    Loading permissions...
                  </p>
                </div>
              ) : permissions.length === 0 ? (
                <div className="text-center py-12 border rounded-md bg-muted/20">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">
                    No permissions found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Please check if permissions are properly seeded.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="py-3 px-4 text-left font-medium">
                          Permission
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Description
                        </th>
                        <th className="py-3 px-4 text-center font-medium w-[120px]">
                          Allowed
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissions.map((perm) => {
                        const rp = rolePerms.find(
                          (r) => Number(r.permission_id) === Number(perm.id)
                        );
                        const isAllowed = rp ? rp.allowed : false;

                        return (
                          <tr
                            key={perm.id}
                            className="border-b hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium">
                              {perm.name}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {perm.description}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <PermissionStatus
                                allowed={isAllowed}
                                onToggle={(val: boolean) => {
                                  // Update local state immediately
                                  handlePermissionToggle(perm.id, val);
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
