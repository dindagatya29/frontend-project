"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTasks } from "@/hooks/use-tasks";
import {
  ArrowLeft,
  Calendar,
  User,
  Flag,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Paperclip,
  Eye,
  CheckCircle,
  Circle,
  AlertCircle,
  Pause,
  Save,
  ChevronDown,
  Tag,
  FileText,
} from "lucide-react";

interface TaskComment {
  id: number;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: "comment" | "activity";
}

// Tambahkan util untuk ambil user login
function getCurrentUserName() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('nexapro_user');
    if (user) return JSON.parse(user).name || JSON.parse(user).username || JSON.parse(user).email;
  }
  return 'User';
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = Number.parseInt(params.id as string);
  const { tasks, users, updateTask, deleteTask } = useTasks();

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    assignee_id: 0, // default number, bukan string
    dueDate: "",
    progress: 0,
  });
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<TaskComment[]>([
    {
      id: 1,
      user: "dindagatya51",
      avatar: "D",
      content: "created the task",
      timestamp: "3 days ago",
      type: "activity",
    },
  ]);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8000/api/tasks/${taskId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setTask(data.data);
          setEditForm({
            title: data.data.title,
            description: data.data.description,
            status: data.data.status,
            priority: data.data.priority,
            assignee_id: data.data.assignee_id,
            dueDate: data.data.due_date || '',
            progress: data.data.progress || 0,
          });
        } else {
          setError("Task Not Found");
        }
      } catch (err) {
        setError("Failed to fetch task");
      } finally {
        setLoading(false);
      }
    };
    if (!isNaN(taskId)) fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Task Not Found"}
          </h2>
          <p className="text-gray-600">
            The task you're looking for doesn't exist.
          </p>
          <Link
            href="/dashboard/tasks"
            className="text-green-600 hover:text-blue-800 mt-4 inline-block"
          >
            ← Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "In Progress":
        return <Circle className="w-4 h-4 text-green-600" />;
      case "Todo":
        return <Circle className="w-4 h-4 text-gray-400" />;
      case "Review":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "On Hold":
        return <Pause className="w-4 h-4 text-gray-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 text-white";
      case "In Progress":
        return "bg-green-500 text-white";
      case "Todo":
        return "bg-gray-500 text-white";
      case "Review":
        return "bg-yellow-500 text-white";
      case "On Hold":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleSave = async () => {
    try {
      await updateTask(taskId, editForm);
      setTask({ ...task, ...editForm });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        router.push("/dashboard/tasks");
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: TaskComment = {
        id: Date.now(),
        user: getCurrentUserName(),
        avatar: getCurrentUserName().charAt(0),
        content: newComment,
        timestamp: "Just now",
        type: "comment",
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const handleStatusChange = (newStatus: string) => {
    updateTask(taskId, { ...editForm, status: newStatus });
    setTask({ ...task, status: newStatus });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/tasks"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-green-600" />
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">
                      {task.title}
                    </h1>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">#{task.id}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      Created {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit task"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Description
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-green-600 hover:text-blue-800"
                >
                  Add description
                </button>
              )}
            </div>
            {isEditing ? (
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Add a description..."
                rows={6}
                className="w-full p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            ) : (
              <div className="text-gray-700">
                {task.description || (
                  <span className="text-gray-400 italic">
                    No description provided
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Progress
              </h3>
              <span className="text-sm font-medium text-gray-600">{isEditing ? editForm.progress : task.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${isEditing ? editForm.progress : task.progress}%` }}
              ></div>
            </div>
            {isEditing && (
              <input
                type="range"
                min="0"
                max="100"
                value={editForm.progress}
                onChange={(e) => setEditForm({ ...editForm, progress: Number.parseInt(e.target.value) })}
                className="w-full mt-4"
              />
            )}
          </div>

          {/* Activity & Comments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activity
            </h3>

            {/* Add Comment */}
            <div className="flex space-x-3 mb-6">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                C
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddComment}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {comment.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {comment.user}
                      </span>
                      <span className="text-sm text-gray-500">
                        {comment.content}
                      </span>
                      <span className="text-sm text-gray-400">
                        {comment.timestamp}
                      </span>
                    </div>
                    {comment.type === "comment" && (
                      <div className="bg-gray-50 rounded-lg p-3 text-gray-700">
                        {comment.content}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-4">
          {/* Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Status
              </span>
              <Eye className="w-4 h-4 text-gray-400" />
            </div>
            <div className="relative">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 ${getStatusColor(
                  task.status
                )}`}
              >
                <option value="Todo">NOT STARTED</option>
                <option value="In Progress">IN PROGRESS</option>
                <option value="Review">IN REVIEW</option>
                <option value="On Hold">ON HOLD</option>
                <option value="Completed">COMPLETED</option>
              </select>
            </div>
          </div>

          {/* Action Required */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Action required
              </span>
              <User className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-sm text-gray-600">No Action Required</span>
          </div>

          {/* Assigned to */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Assigned to
              </span>
              <User className="w-4 h-4 text-gray-400" />
            </div>
            {task.assignee ? (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {task.assignee.charAt(0)}
                </div>
                <span className="text-sm text-gray-900">{task.assignee}</span>
              </div>
            ) : (
              <span className="text-sm text-gray-600">Not assigned</span>
            )}
          </div>

          {/* Priority */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Priority
              </span>
              <Flag className="w-4 h-4 text-gray-400" />
            </div>
            {isEditing ? (
              <select
                value={editForm.priority}
                onChange={(e) =>
                  setEditForm({ ...editForm, priority: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            ) : (
              <span
                className={`inline-flex px-2 py-1 text-xs rounded-full border ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            )}
          </div>

          {/* Due Date */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Due date
              </span>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            {isEditing ? (
              <input
                type="date"
                value={editForm.dueDate}
                onChange={(e) =>
                  setEditForm({ ...editForm, dueDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <span className="text-sm text-gray-900">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No due date"}
              </span>
            )}
          </div>

          {/* Task Users */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Task users
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  D
                </div>
                <span className="text-sm text-gray-900">dindagatya51</span>
              </div>
              <button className="flex items-center space-x-2 text-green-600 hover:text-blue-800 text-sm">
                <Plus className="w-4 h-4" />
                <span>Add user</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Quick Actions
            </h4>
            <div className="grid grid-cols-4 gap-2">
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Flag"
              >
                <Flag className="w-4 h-4 mx-auto" />
              </button>
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Attach"
              >
                <Paperclip className="w-4 h-4 mx-auto" />
              </button>
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Calendar"
              >
                <Calendar className="w-4 h-4 mx-auto" />
              </button>
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Tag"
              >
                <Tag className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
