"use client";

import type React from "react";

import { useState, useEffect } from "react";
import AddTaskModal from "@/components/add-task-modal";
import { useTasks } from "@/hooks/use-tasks";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Edit,
  Plus,
} from "lucide-react";
import QuickEditTaskModal from "@/components/quick-edit-task-modal";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export default function TasksPage() {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isQuickEditModalOpen, setIsQuickEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedTask, setDraggedTask] = useState<any>(null);

  const {
    tasks,
    loading,
    error,
    stats,
    projects,
    users,
    createTask,
    updateTask,
    deleteTask,
    refetch,
  } = useTasks();

  // Real-time synchronization
  useEffect(() => {
    const handleTaskUpdated = (event: CustomEvent) => {
      console.log("🔄 Real-time task update received in Tasks page:", event.detail)
      // Refetch tasks to get latest data
      refetch()
    }

    const handleProjectUpdated = (event: CustomEvent) => {
      console.log("🔄 Real-time project update received in Tasks page:", event.detail)
      // Refetch tasks to get latest data (projects might affect tasks)
      refetch()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("taskUpdated", handleTaskUpdated as EventListener)
      window.addEventListener("projectUpdated", handleProjectUpdated as EventListener)
      return () => {
        window.removeEventListener("taskUpdated", handleTaskUpdated as EventListener)
        window.removeEventListener("projectUpdated", handleProjectUpdated as EventListener)
      }
    }
  }, [refetch])

  // Kanban columns configuration
  const kanbanColumns = [
    { id: "Todo", title: "📋 To Do", color: "bg-gray-50 border-gray-200" },
    {
      id: "In Progress",
      title: "🔄 In Progress",
      color: "bg-green-50 border-green-200",
    },
    {
      id: "Completed",
      title: "✅ Completed",
      color: "bg-green-50 border-green-200",
    },
  ];

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-green-100 text-blue-800 border-green-200";
      case "Todo":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High":
        return "🔴";
      case "Medium":
        return "🟡";
      case "Low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  // Filter tasks by status
  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  // Event handlers
  const handleAddTask = async (taskData: any) => {
    try {
      await createTask(taskData);
      setIsAddTaskModalOpen(false);
      console.log("✅ Task created successfully!");
    } catch (error) {
      console.error("❌ Failed to create task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        console.log("✅ Task deleted successfully!");
      } catch (error) {
        console.error("❌ Failed to delete task:", error);
        alert("Failed to delete task. Please try again.");
      }
    }
  };

  const handleQuickEdit = (task: any) => {
    setSelectedTask(task);
    setIsQuickEditModalOpen(true);
  };

  const handleQuickEditSubmit = async (id: number, updates: any) => {
    try {
      if (updates.progress === 100 && updates.status !== "Completed") {
        updates.status = "Completed";
      }
      await updateTask(id, updates);
      setIsQuickEditModalOpen(false);
      setSelectedTask(null);
      console.log("✅ Task updated successfully!");
    } catch (error) {
      console.error("❌ Failed to update task:", error);
      throw error;
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, task: any) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();

    if (draggedTask && draggedTask.status !== newStatus) {
      try {
        // Update progress based on status
        let newProgress = draggedTask.progress;
        if (newStatus === "Completed") {
          newProgress = 100;
        } else if (newStatus === "In Progress" && newProgress === 0) {
          newProgress = 25;
        }

        await updateTask(draggedTask.id, {
          status: newStatus,
          progress: newProgress,
        });
        console.log(`✅ Task moved to ${newStatus}`);
        
        // Trigger real-time update events
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("taskUpdated", {
            detail: { 
              taskId: draggedTask.id, 
              task: { ...draggedTask, status: newStatus, progress: newProgress }
            }
          }))
          window.dispatchEvent(new CustomEvent("projectsNeedRefresh"))
        }
      } catch (error) {
        console.error("❌ Failed to update task status:", error);
        alert("Failed to update task. Please try again.");
      }
    }
    setDraggedTask(null);
  };

  const handleFilterChange = (type: "status" | "priority", value: string) => {
    if (type === "status") {
      setStatusFilter(value);
    } else {
      setPriorityFilter(value);
    }
    refetch({
      status: type === "status" ? value : statusFilter,
      priority: type === "priority" ? value : priorityFilter,
      search: searchTerm,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    refetch({
      status: statusFilter,
      priority: priorityFilter,
      search: value,
    });
  };

  // Buat tasksByStatus stateless
  const tasksByStatus = {
    Todo: tasks.filter((task) => task.status === 'Todo'),
    'In Progress': tasks.filter((task) => task.status === 'In Progress'),
    Completed: tasks.filter((task) => task.status === 'Completed'),
  };

  const boardColumns = [
    { id: 'Todo', title: 'To Do' },
    { id: 'In Progress', title: 'In Progress' },
    { id: 'Completed', title: 'Completed' },
  ];

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const sourceCol = source.droppableId as keyof typeof tasksByStatus;
    const destCol = destination.droppableId as keyof typeof tasksByStatus;
    const movedTask = tasksByStatus[sourceCol][source.index];
    
    // Apply bidirectional sync logic
    let updates: any = { status: destCol }
    
    // Auto-update progress when status is changed to Completed
    if (destCol === 'Completed') {
      updates.progress = 100
      console.log(`🔄 Auto-setting progress to 100% for task ${movedTask.title} (status: Completed)`)
    } else if (destCol === 'In Progress' && movedTask.progress === 0) {
      updates.progress = 25
      console.log(`🔄 Auto-setting progress to 25% for task ${movedTask.title} (status: In Progress)`)
    }
    
    await updateTask(movedTask.id, updates);
    
    // Trigger real-time update events
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("taskUpdated", {
        detail: { 
          taskId: movedTask.id, 
          task: { ...movedTask, ...updates }
        }
      }))
      window.dispatchEvent(new CustomEvent("projectsNeedRefresh"))
    }
    
    if (refetch) refetch();
  };

  // Tambahkan renderBoardView
  const renderBoardView = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto min-h-[60vh] pb-4">
        {boardColumns.map((column) => (
          <Droppable droppableId={column.id} key={column.id}>
            {(provided: import('@hello-pangea/dnd').DroppableProvided, snapshot: import('@hello-pangea/dnd').DroppableStateSnapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`bg-gray-50 rounded-lg p-4 min-w-[340px] flex-1 flex-shrink-0 border ${snapshot.isDraggingOver ? 'border-blue-400' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    {column.title}
                  </h3>
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{tasksByStatus[column.id as keyof typeof tasksByStatus]?.length || 0}</span>
                </div>
                <div className="space-y-3 min-h-[40px]">
                  {tasksByStatus[column.id as keyof typeof tasksByStatus]?.map((task, idx) => (
                    <Draggable draggableId={task.id.toString()} index={idx} key={task.id}>
                      {(provided: import('@hello-pangea/dnd').DraggableProvided, snapshot: import('@hello-pangea/dnd').DraggableStateSnapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${snapshot.isDragging ? 'ring-2 ring-blue-400' : ''}`}
                          onClick={() => handleQuickEdit(task)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{task.title}</h4>
                            <button className="text-gray-400 hover:text-gray-600" onClick={e => { e.stopPropagation(); handleDeleteTask(task.id); }}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {task.description && <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                          </div>
                          {task.progress > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">Progress</span>
                                <span className="text-xs text-gray-900 font-medium">{task.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-green-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${task.progress}%` }}></div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            {task.assignee && (
                              <div className="flex items-center">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-1">
                                  {task.assignee.charAt(0)}
                                </div>
                                <span>{task.assignee}</span>
                              </div>
                            )}
                            {task.due_date && (
                              <div className="flex items-center">
                                <span className="mr-1">📅</span>
                                <span>{new Date(task.due_date).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <button
                    onClick={() => setIsAddTaskModalOpen(true)}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading tasks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <div className="text-red-600 mb-4">
          <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            📋 Tasks Kanban
          </h1>
          <p className="text-gray-600 mt-1">
            Drag and drop tasks to update their status
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Connected to API • {tasks.length} tasks loaded
          </p>
        </div>
        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus size={16} />
          <span className="font-medium">New Task</span>
        </button>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.total || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.in_progress || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.completed || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">High Priority</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.high_priority || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔴</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            <select
              value={priorityFilter}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 shadow-sm"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500 text-black shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {renderBoardView()}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📋</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first task
          </p>
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Create Your First Task
          </button>
        </div>
      )}

      {/* Modals */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={handleAddTask}
        projects={projects}
        users={users}
      />

      <QuickEditTaskModal
        isOpen={isQuickEditModalOpen}
        onClose={() => {
          setIsQuickEditModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleQuickEditSubmit}
        task={selectedTask}
      />
    </div>
  );
}
