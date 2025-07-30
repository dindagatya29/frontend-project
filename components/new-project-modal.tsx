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
      fetch("https://nexapro.web.id/api/users")
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-6">
  <div className="bg-white dark:bg-slate-900 rounded-2xl w-full sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto px-6 py-8 relative shadow-2xl border border-slate-200 dark:border-slate-700 transition-all">
    {/* Close button */}
    <button
      onClick={handleClose}
      disabled={isSubmitting}
      className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full p-2 transition disabled:opacity-50"
      aria-label="Close modal"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div className="mb-6 text-center">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Create New Project</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">Set up your project and invite your team</p>
    </div>

    {submitError && (
      <div className="mb-4 p-4 bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
        <p className="text-sm font-medium">{submitError}</p>
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Parent</label>
        <select
          value={selectedParent}
          onChange={(e) => setSelectedParent(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Projects">📁 Projects</option>
          <option value="Marketing">📁 Marketing</option>
          <option value="Development">📁 Development</option>
          <option value="Design">📁 Design</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Name *</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter project name"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Low">🟢 Low</option>
          <option value="Medium">🟡 Medium</option>
          <option value="High">🔴 High</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Deadline</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Invite Users</label>
        <div className="space-y-2">
          <select
            value={newUserEmail}
            onChange={(e) => {
              const selected = e.target.value;
              if (selected && !invitedUsers.includes(selected)) {
                setInvitedUsers([...invitedUsers, selected]);
                setNewUserEmail("");
              }
            }}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select team member</option>
            {userOptions.map((user) => (
              <option key={user.id} value={user.email}>
                👤 {user.name} ({user.email})
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="Or enter email"
              className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              disabled={isSubmitting || !newUserEmail}
              onClick={() => {
                if (!invitedUsers.includes(newUserEmail)) {
                  setInvitedUsers([...invitedUsers, newUserEmail]);
                  setNewUserEmail("");
                }
              }}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow disabled:opacity-50"
            >
              Invite
            </button>
          </div>

          {invitedUsers.length > 0 && (
            <ul className="space-y-2">
              {invitedUsers.map((user, idx) => (
                <li key={idx} className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-md">
                  <span className="text-sm text-slate-700 dark:text-white">{user}</span>
                  <button
                    onClick={() => setInvitedUsers(invitedUsers.filter((_, i) => i !== idx))}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !projectName.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-base font-semibold shadow-md transition-all disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create Project"}
      </button>
    </form>

    {/* {process.env.NODE_ENV === "development" && (
      <div className="mt-6 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
        <p><strong>Debug:</strong></p>
        <p>Name: {projectName}</p>
        <p>Parent: {selectedParent}</p>
        <p>Priority: {priority}</p>
        <p>Deadline: {deadline}</p>
        <p>Team: {invitedUsers.join(", ") || "None"}</p>
        <p>Submitting: {isSubmitting.toString()}</p>
      </div>
    )} */}
  </div>
</div>
  );
}
