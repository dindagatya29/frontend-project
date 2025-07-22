"use client";

import type React from "react";
import { useState, useEffect } from "react";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
    progress: number;
  }) => Promise<void>;
  initialData?: {
    name: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
    progress: number;
  };
}

export default function NewProjectModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: NewProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [selectedParent, setSelectedParent] = useState("Projects");
  const [deadline, setDeadline] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [userOptions, setUserOptions] = useState<
    { id: number; name: string; email: string }[]
  >([]);

  useEffect(() => {
    if (isOpen && initialData) {
      setProjectName(initialData.name || "");
      setSelectedParent("Projects");
      setDeadline(initialData.due_date || "");
      setPriority(initialData.priority || "Medium");
      // description, status, progress bisa diisi jika ingin
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:8000/api/users")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.data)) setUserOptions(data.data);
        })
        .catch(() => setUserOptions([]));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      console.log("📝 Creating project:", {
        projectName,
        selectedParent,
        deadline,
        invitedUsers,
        priority,
      });

      // Validate required fields
      if (!projectName.trim()) {
        throw new Error("Project name is required");
      }

      // Map form data to backend format
      const projectData = {
        name: projectName.trim(),
        description: `Project under ${selectedParent}${
          invitedUsers.length > 0 ? ` • Team: ${invitedUsers.join(", ")}` : ""
        }`,
        status: "Planning" as const,
        priority: priority as "Low" | "Medium" | "High",
        due_date: deadline || "",
        progress: 0,
      };

      await onSubmit(projectData);

      // Reset form on success
      setProjectName("");
      setSelectedParent("Projects");
      setDeadline("");
      setInvitedUsers([]);
      setNewUserEmail("");
      setPriority("Medium");

      onClose();
    } catch (error) {
      console.error("❌ Form submission error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create project"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSubmitError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl border border-white/20">
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-100 rounded-full p-2 disabled:opacity-50"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Create New Project
          </h2>
          <p className="text-gray-700">
            Set up your project details and invite team members
          </p>
        </div>

        {/* Error Display */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            <p className="text-sm font-medium">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
  {/* Parent Field */}
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      Parent
    </label>
    <div className="relative">
      <select
        value={selectedParent}
        onChange={(e) => setSelectedParent(e.target.value)}
        disabled={isSubmitting}
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm appearance-none text-gray-900 font-medium transition-all duration-200 selection:bg-green-100 selection:text-green-900 disabled:opacity-50"
      >
        <option value="Projects">📁 Projects</option>
        <option value="Marketing">📁 Marketing</option>
        <option value="Development">📁 Development</option>
        <option value="Design">📁 Design</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>

  {/* Name Field */}
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      Name *
    </label>
    <div className="relative">
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        disabled={isSubmitting}
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white text-gray-900 pr-12 font-medium transition-all duration-200 placeholder:text-gray-500 selection:bg-green-100 selection:text-green-900 disabled:opacity-50"
        placeholder="Enter project name"
        required
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>
    </div>
  </div>

  {/* Priority Field */}
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      Priority
    </label>
    <div className="relative">
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        disabled={isSubmitting}
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm appearance-none text-gray-900 font-medium transition-all duration-200 selection:bg-green-100 selection:text-green-900 disabled:opacity-50"
      >
        <option value="Low">🟢 Low Priority</option>
        <option value="Medium">🟡 Medium Priority</option>
        <option value="High">🔴 High Priority</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>

  {/* Deadline Field */}
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      Deadline
    </label>
    <input
      type="date"
      value={deadline}
      onChange={(e) => setDeadline(e.target.value)}
      disabled={isSubmitting}
      min={new Date().toISOString().split("T")[0]}
      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm text-gray-900 font-medium transition-all duration-200 placeholder:text-gray-500 selection:bg-green-100 selection:text-green-900 disabled:opacity-50"
    />
  </div>

  {/* Invite Users Field */}
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      Invite Users
    </label>

    {/* User selection dropdown */}
    <div className="relative">
      <select
        value={newUserEmail}
        onChange={(e) => {
          const selectedUser = e.target.value;
          if (selectedUser && !invitedUsers.includes(selectedUser)) {
            setInvitedUsers([...invitedUsers, selectedUser]);
            setNewUserEmail("");
          }
        }}
        disabled={isSubmitting}
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm appearance-none text-gray-900 font-medium transition-all duration-200 placeholder:text-gray-500 selection:bg-green-100 selection:text-green-900 disabled:opacity-50"
      >
        <option value="">Select team member to invite</option>
        {userOptions.map((user) => (
          <option key={user.id} value={user.email}>
            👤 {user.name} ({user.email})
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    {/* Manual email input */}
    <div className="flex space-x-2">
      <input
        type="email"
        value={newUserEmail}
        onChange={(e) => setNewUserEmail(e.target.value)}
        disabled={isSubmitting}
        className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm text-gray-900 font-medium transition-all duration-200 placeholder:text-gray-500 selection:bg-green-100 selection:text-green-900 disabled:opacity-50"
        placeholder="Or enter email to invite new user"
      />
      <button
        type="button"
        onClick={() => {
          if (newUserEmail && !invitedUsers.includes(newUserEmail)) {
            setInvitedUsers([...invitedUsers, newUserEmail]);
            setNewUserEmail("");
          }
        }}
        disabled={isSubmitting || !newUserEmail}
        className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>

    {/* Invited users list */}
    {invitedUsers.length > 0 && (
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Invited users:</p>
        <div className="space-y-1">
          {invitedUsers.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-green-100"
            >
              <span className="text-sm text-blue-800 font-medium">👤 {user}</span>
              <button
                type="button"
                onClick={() => setInvitedUsers(invitedUsers.filter((_, i) => i !== index))}
                disabled={isSubmitting}
                className="text-green-600 hover:text-blue-800 hover:bg-green-100 rounded-full p-1 transition-all duration-200 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    disabled={isSubmitting || !projectName.trim()}
    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-semibold text-lg shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
  >
    {isSubmitting ? (
      <div className="flex items-center justify-center space-x-2">
        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>Creating Project...</span>
      </div>
    ) : (
      "Create Project"
    )}
  </button>
</form>


        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 p-3 bg-gray-50 rounded-xl text-xs text-gray-600">
            <p>
              <strong>Debug:</strong>
            </p>
            <p>Name: {projectName}</p>
            <p>Parent: {selectedParent}</p>
            <p>Priority: {priority}</p>
            <p>Deadline: {deadline}</p>
            <p>Team: {invitedUsers.join(", ") || "None"}</p>
            <p>Submitting: {isSubmitting.toString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
