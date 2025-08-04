"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Task {
  id: number;
  title: string;
  description?: string;
  project: string;
  project_id: number;
  assignee: string;
  assignee_id?: number;
  status: "Todo" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate?: string;
  progress: number;
  tags: string[];
  todoList?: { text: string; checked: boolean }[]; // ← tambahkan jika belum ada
}

interface QuickEditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, updates: any) => Promise<void>;
  task: Task | null;
}

export default function QuickEditTaskModal({
  isOpen,
  onClose,
  onSubmit,
  task,
}: QuickEditTaskModalProps) {
  const [taskStatus, setTaskStatus] = useState("Todo");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [progress, setProgress] = useState(0);
  const [todoList, setTodoList] = useState<
    { text: string; checked: boolean }[]
  >([]);
  const [newTodo, setNewTodo] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTaskStatus(task.status);
      setTaskPriority(task.priority);
      setProgress(task.progress);
      setTodoList(task.todoList || []); // ← Set todo saat task berubah
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const updates = {
        status: progress === 100 ? "Completed" : taskStatus,
        priority: taskPriority,
        progress,
        todo_list: todoList, // ← pakai snake_case agar cocok dengan Laravel
      };
      await onSubmit(task.id, updates);
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to update task"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "Todo":
        return "bg-gray-200 text-gray-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-green-100 text-green-700";
    }
  };

  const getProgressColor = () => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 30) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-y-auto flex border border-gray-200">
        {/* Left section */}
        <div className="w-2/3 p-6 border-r space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400">
              {task.project}
            </p>
            <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
          </div>

          {/* Task Info */}
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              👤 Assigned to:{" "}
              <span className="font-semibold text-gray-800">
                {task.assignee}
              </span>
            </p>
            <p>
              📌 Status:{" "}
              <span
                className={twMerge(
                  "px-2 py-1 text-xs rounded-full font-medium",
                  getStatusColor(task.status)
                )}
              >
                {task.status}
              </span>
            </p>
            <p>
              📈 Progress:{" "}
              <span className="font-semibold text-gray-800">
                {task.progress}%
              </span>
            </p>
          </div>

          {/* Todo List */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              📝 Todo List
            </h3>
            <ul className="space-y-2">
              {todoList.map((todo, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between text-black"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={todo.checked}
                      onChange={() => {
                        const updatedList = [...todoList];
                        updatedList[index].checked =
                          !updatedList[index].checked;
                        setTodoList(updatedList);
                      }}
                      className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    {editIndex === index ? (
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded px-2 py-1 text-black"
                      />
                    ) : (
                      <span
                        className={
                          todo.checked ? "line-through text-gray-500" : ""
                        }
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 items-center text-xs">
                    {editIndex === index ? (
                      <button
                        onClick={() => {
                          const updatedList = [...todoList];
                          updatedList[index].text = editValue;
                          setTodoList(updatedList);
                          setEditIndex(null);
                        }}
                        className="text-green-500 hover:text-green-700"
                      >
                        Simpan
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditIndex(index);
                          setEditValue(todo.text);
                        }}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setTodoList(todoList.filter((_, i) => i !== index))
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Add Todo */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg text-black"
                placeholder="New todo"
              />
              <button
                type="button"
                onClick={() => {
                  if (newTodo.trim()) {
                    setTodoList([
                      ...todoList,
                      { text: newTodo.trim(), checked: false },
                    ]);
                    setNewTodo("");
                  }
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                + Tambah
              </button>
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="mt-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <p className="text-sm">❌ {submitError}</p>
            </div>
          )}
        </div>

        {/* Right section */}
        <form onSubmit={handleSubmit} className="w-1/3 p-6 space-y-6">
          {/* Status */}
          <div>
            <label className="text-xs font-medium text-gray-500">
              📌 Status
            </label>
            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
              disabled={isSubmitting}
              className="w-full mt-1 border px-3 py-2 rounded-lg text-black"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs font-medium text-gray-500">
              ⚡ Priority
            </label>
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              disabled={isSubmitting}
              className="w-full mt-1 border px-3 py-2 rounded-lg text-black"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Progress */}
          <div>
            <label className="text-xs font-medium text-gray-500">
              📊 Progress: {progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full mt-1"
            />
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div
                className={twMerge("h-2 rounded-full", getProgressColor())}
                style={{ width: `${progress}%` }}
              />
            </div>
            {progress === 100 && taskStatus !== "Completed" && (
              <p className="text-xs text-green-500 mt-1">
                ✅ Task will be marked as Completed
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="pt-4 flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Task"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
