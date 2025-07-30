"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Users,
  Building,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  Settings,
  X,
  User,
} from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  position: string;
  phone?: string;
  avatar?: string;
  joinedDate: string;
  status: "active" | "inactive";
  skills?: string[];
  bio?: string;
}

interface Department {
  id: number;
  name: string;
  description: string;
  manager?: string;
  memberCount: number;
  color: string;
}

export default function TeamPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"members" | "departments">(
    "members"
  );


  // Department management states
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [departmentForm, setDepartmentForm] = useState({
    name: "",
    description: "",
    manager: "",
    color: "#3B82F6",
  });

  // Team member management states
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    role: "member",
    department: "",
    position: "",
    phone: "",
    bio: "",
  });

  // Get current user and permissions
  useEffect(() => {
    const userStr = localStorage.getItem("nexapro_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);

      // Fetch user permissions from backend
      fetch(`https://nexapro.web.id/api/admin/user-permissions/${user.id}`)
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
  

  // Permission check functions
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === "admin") return true; // Admin has all permissions
    return userPermissions.includes(permission);
  };

  // Load team data
  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    setLoading(true);
    try {
      // Load team members
      const membersRes = await fetch("https://nexapro.web.id/api/team");
      const membersData = await membersRes.json();
      if (membersData.success) {
        setTeamMembers(membersData.data || []);
      }

      // Load departments
      const deptRes = await fetch("https://nexapro.web.id/api/team/departments");
      const deptData = await deptRes.json();
      if (deptData.success) {
        setDepartments(deptData.data || []);
      }
    } catch (error) {
      console.error("Failed to load team data:", error);
      setError("Failed to load team data");

      // Mock data for demo
      setTeamMembers([
        {
          id: 1,
          name: "John Doe",
          email: "john@nexapro.com",
          role: "admin",
          department: "Engineering",
          position: "Senior Developer",
          phone: "+62 812-3456-7890",
          joinedDate: "2024-01-15",
          status: "active",
          skills: ["React", "Node.js", "TypeScript"],
          bio: "Experienced full-stack developer with 5+ years of experience.",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@nexapro.com",
          role: "project_manager",
          department: "Product",
          position: "Product Manager",
          phone: "+62 812-3456-7891",
          joinedDate: "2024-02-01",
          status: "active",
          skills: ["Product Management", "Agile", "User Research"],
          bio: "Product manager passionate about creating user-centric solutions.",
        },
      ]);

      setDepartments([
        {
          id: 1,
          name: "Engineering",
          description: "Software development and technical operations",
          manager: "John Doe",
          memberCount: 8,
          color: "#3B82F6",
        },
        {
          id: 2,
          name: "Product",
          description: "Product management and user experience",
          manager: "Jane Smith",
          memberCount: 4,
          color: "#10B981",
        },
        {
          id: 3,
          name: "Design",
          description: "UI/UX design and creative direction",
          manager: "Mike Johnson",
          memberCount: 3,
          color: "#F59E0B",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Department management functions
  const handleCreateDepartment = async () => {
    if (!hasPermission("manage_team")) {
      alert("You don't have permission to create departments");
      return;
    }

    try {
      const response = await fetch(
        "https://nexapro.web.id/api/team/departments",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // tambahkan Authorization jika perlu
            Authorization: `Bearer ${localStorage.getItem("nexapro_token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDepartments((prev) => [...prev, data.data]);
          setShowDepartmentModal(false);
          setDepartmentForm({
            name: "",
            description: "",
            manager: "",
            color: "#3B82F6",
          });
        }
      }
    } catch (error) {
      console.error("Failed to create department:", error);
      // Mock creation for demo
      const newDept: Department = {
        id: Date.now(),
        name: departmentForm.name,
        description: departmentForm.description,
        manager: departmentForm.manager,
        memberCount: 0,
        color: departmentForm.color,
      };
      setDepartments((prev) => [...prev, newDept]);
      setShowDepartmentModal(false);
      setDepartmentForm({
        name: "",
        description: "",
        manager: "",
        color: "#3B82F6",
      });
    }
  };

  const handleUpdateDepartment = async () => {
    if (!editingDepartment || !hasPermission("manage_team")) return;

    try {
      const response = await fetch(
        `https://nexapro.web.id/api/team/departments/${editingDepartment.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(departmentForm),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDepartments((prev) =>
            prev.map((dept) =>
              dept.id === editingDepartment.id
                ? { ...dept, ...departmentForm }
                : dept
            )
          );
          setShowDepartmentModal(false);
          setEditingDepartment(null);
          setDepartmentForm({
            name: "",
            description: "",
            manager: "",
            color: "#3B82F6",
          });
        }
      }
    } catch (error) {
      console.error("Failed to update department:", error);
      // Mock update for demo
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === editingDepartment.id
            ? { ...dept, ...departmentForm }
            : dept
        )
      );
      setShowDepartmentModal(false);
      setEditingDepartment(null);
      setDepartmentForm({
        name: "",
        description: "",
        manager: "",
        color: "#3B82F6",
      });
    }
  };

  const handleDeleteDepartment = async (deptId: number) => {
    if (!hasPermission("manage_team")) {
      alert("You don't have permission to delete departments");
      return;
    }

    if (!confirm("Are you sure you want to delete this department?")) return;

    try {
      const response = await fetch(
        `https://nexapro.web.id/api/team/departments/${deptId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setDepartments((prev) => prev.filter((dept) => dept.id !== deptId));
      }
    } catch (error) {
      console.error("Failed to delete department:", error);
      // Mock deletion for demo
      setDepartments((prev) => prev.filter((dept) => dept.id !== deptId));
    }
  };

  // Team member management functions
  const handleCreateMember = async () => {
    if (!hasPermission("manage_team")) {
      alert("You don't have permission to add team members");
      return;
    }

    try {
      const response = await fetch("https://nexapro.web.id/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberForm),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTeamMembers((prev) => [...prev, data.data]);
          setShowMemberModal(false);
          setMemberForm({
            name: "",
            email: "",
            role: "member",
            department: "",
            position: "",
            phone: "",
            bio: "",
          });
        }
      }
    } catch (error) {
      console.error("Failed to create team member:", error);
      // Mock creation for demo
      const newMember: TeamMember = {
        id: Date.now(),
        name: memberForm.name,
        email: memberForm.email,
        role: memberForm.role as any,
        department: memberForm.department,
        position: memberForm.position,
        phone: memberForm.phone,
        joinedDate: new Date().toISOString().split("T")[0],
        status: "active",
        bio: memberForm.bio,
      };
      setTeamMembers((prev) => [...prev, newMember]);
      setShowMemberModal(false);
      setMemberForm({
        name: "",
        email: "",
        role: "member",
        department: "",
        position: "",
        phone: "",
        bio: "",
      });
    }
  };

  const handleUpdateMember = async () => {
    if (!editingMember || !hasPermission("manage_team")) return;

    try {
      const response = await fetch(
        `https://nexapro.web.id/api/team/${editingMember.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(memberForm),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTeamMembers((prev) =>
            prev.map((member) =>
              member.id === editingMember.id
                ? { ...member, ...memberForm }
                : member
            )
          );
          setShowMemberModal(false);
          setEditingMember(null);
          setMemberForm({
            name: "",
            email: "",
            role: "member",
            department: "",
            position: "",
            phone: "",
            bio: "",
          });
        }
      }
    } catch (error) {
      console.error("Failed to update team member:", error);
      // Mock update for demo
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === editingMember.id ? { ...member, ...memberForm } : member
        )
      );
      setShowMemberModal(false);
      setEditingMember(null);
      setMemberForm({
        name: "",
        email: "",
        role: "member",
        department: "",
        position: "",
        phone: "",
        bio: "",
      });
    }
  };

  const handleDeleteMember = async (memberId: number) => {
    if (!hasPermission("manage_team")) {
      alert("You don't have permission to remove team members");
      return;
    }

    if (!confirm("Are you sure you want to remove this team member?")) return;

    try {
      const response = await fetch(
        `https://nexapro.web.id/api/team/${memberId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setTeamMembers((prev) =>
          prev.filter((member) => member.id !== memberId)
        );
      }
    } catch (error) {
      console.error("Failed to delete team member:", error);
      // Mock deletion for demo
      setTeamMembers((prev) => prev.filter((member) => member.id !== memberId));
    }
  };

  // Open department modal
  const openDepartmentModal = (dept?: Department) => {
    if (dept) {
      setEditingDepartment(dept);
      setDepartmentForm({
        name: dept.name,
        description: dept.description,
        manager: dept.manager || "",
        color: dept.color,
      });
    } else {
      setEditingDepartment(null);
      setDepartmentForm({
        name: "",
        description: "",
        manager: "",
        color: "#3B82F6",
      });
    }
    setShowDepartmentModal(true);
  };

  // Open member modal
  const openMemberModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setMemberForm({
        name: member.name,
        email: member.email,
        role: member.role,
        department: member.department,
        position: member.position,
        phone: member.phone || "",
        bio: member.bio || "",
      });
    } else {
      setEditingMember(null);
      setMemberForm({
        name: "",
        email: "",
        role: "member",
        department: "",
        position: "",
        phone: "",
        bio: "",
      });
    }
    setShowMemberModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading team data...</span>
      </div>
    );
  }

  if (!hasPermission("manage_team") && !hasPermission("view_projects")) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            You don't have permission to access team management.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Required: manage_team | Your role: {currentUser?.role}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Team Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your team members and departments
          </p>
        </div>
        <div className="flex items-center text-black space-x-3">
          {hasPermission("manage_team") && (
            <>
              <Button
                variant="outline"
                onClick={() => openMemberModal()}
                className="flex items-center space-x-2 border-gray-300 dark:border-gray-600 dark:text-white"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Member</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => openDepartmentModal()}
                className="flex items-center space-x-2 border-gray-300 dark:border-gray-600 dark:text-white"
              >
                <Plus className="h-4 w-4" />
                <span>Add Department</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <button
          onClick={() => setActiveTab("members")}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === "members"
              ? "bg-green-600 text-white shadow-lg"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white"
          }`}
        >
          <Users size={16} />
          <span>Team Members ({teamMembers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("departments")}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === "departments"
              ? "bg-green-600 text-white shadow-lg"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white"
          }`}
        >
          <Building size={16} />
          <span>Departments ({departments.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Team Members Tab */}
        {activeTab === "members" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-green-600 dark:text-blue-300 font-semibold text-lg">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900 dark:text-white">
                          {member.name}
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-300">
                          {member.position}
                        </CardDescription>
                      </div>
                    </div>
                    {hasPermission("manage_team") && (
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openMemberModal(member)}
                          className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMember(member.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="h-4 w-4" />
                    <span>{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Phone className="h-4 w-4" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Building className="h-4 w-4" />
                    <span>{member.department}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined {new Date(member.joinedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        member.status === "active"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {member.status}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-blue-900 text-green-800 dark:text-blue-200`}
                    >
                      {member.role}
                    </span>
                  </div>
                  {member.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {member.bio}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "departments" && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {departments.map((dept, index) => (
      <Card
        key={dept.id || `dept-${index}`}
        className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${dept.color}20` }}
              >
                <Building
                  className="h-6 w-6"
                  style={{ color: dept.color }}
                />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  {dept.name}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {dept.memberCount} members
                </CardDescription>
              </div>
            </div>
            {hasPermission("manage_team") && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openDepartmentModal(dept)}
                  className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteDepartment(dept.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {dept.description}
          </p>
          {dept.manager && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <User className="h-4 w-4" />
              <span>Manager: {dept.manager}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4" />
            <span>{dept.memberCount} team members</span>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)}
      </div>
      {/* Footer */}

      {/* Department Modal */}
      {showDepartmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {editingDepartment ? "Edit Department" : "Add Department"}
              </h3>
              <button
                onClick={() => setShowDepartmentModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department Name
                </label>
                <Input
                  value={departmentForm.name}
                  onChange={(e) =>
                    setDepartmentForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter department name"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <Input
                  value={departmentForm.description}
                  onChange={(e) =>
                    setDepartmentForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter department description"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Manager
                </label>
                <Input
                  value={departmentForm.manager}
                  onChange={(e) =>
                    setDepartmentForm((prev) => ({
                      ...prev,
                      manager: e.target.value,
                    }))
                  }
                  placeholder="Enter manager name"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <Input
                  type="color"
                  value={departmentForm.color}
                  onChange={(e) =>
                    setDepartmentForm((prev) => ({
                      ...prev,
                      color: e.target.value,
                    }))
                  }
                  className="h-10"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDepartmentModal(false)}
                className="border-gray-300 dark:border-gray-600 dark:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={
                  editingDepartment
                    ? handleUpdateDepartment
                    : handleCreateDepartment
                }
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {editingDepartment ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {editingMember ? "Edit Team Member" : "Add Team Member"}
              </h3>
              <button
                onClick={() => setShowMemberModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <Input
                  value={memberForm.name}
                  onChange={(e) =>
                    setMemberForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter full name"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Enter email address"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={memberForm.role}
                  onChange={(e) =>
                    setMemberForm((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="member">Member</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <select
                  value={memberForm.department}
                  onChange={(e) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position
                </label>
                <Input
                  value={memberForm.position}
                  onChange={(e) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      position: e.target.value,
                    }))
                  }
                  placeholder="Enter job position"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <Input
                  value={memberForm.phone}
                  onChange={(e) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="Enter phone number"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  value={memberForm.bio}
                  onChange={(e) =>
                    setMemberForm((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Enter bio"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm h-20 resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowMemberModal(false)}
                className="border-gray-300 dark:border-gray-600 dark:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={
                  editingMember ? handleUpdateMember : handleCreateMember
                }
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {editingMember ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
