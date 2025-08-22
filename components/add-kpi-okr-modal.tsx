"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Target, BarChart3, Plus, Trash2 } from "lucide-react"

interface KPI {
  id: number
  name: string
  description: string
  category: string
  unit: string
  target_value: number
  current_value: number
  baseline_value: number
  progress: number
  frequency: string
  direction: string
  status: string
  start_date: string
  end_date?: string
}

interface KeyResult {
  id?: number
  title: string
  description: string
  unit: string
  target_value: number
  current_value: number
  baseline_value: number
  progress: number
  direction: string
  status: string
  weight: number
}

interface OKR {
  id: number
  objective: string
  description: string
  category: string
  type: string
  status: string
  start_date: string
  end_date?: string
  overall_progress: number
  key_results: KeyResult[]
}

interface AddKpiOkrModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editMode?: boolean
  editingItem?: KPI | OKR | null
}

export default function AddKpiOkrModal({
  isOpen,
  onClose,
  onSuccess,
  editMode = false,
  editingItem = null,
}: AddKpiOkrModalProps) {
  const [activeTab, setActiveTab] = useState<"kpi" | "okr">("kpi")
  const [loading, setLoading] = useState(false)

  // KPI Form State
  const [kpiForm, setKpiForm] = useState({
    name: "",
    description: "",
    category: "Sales",
    unit: "",
    target_value: 0,
    current_value: 0,
    baseline_value: 0,
    frequency: "monthly",
    direction: "increase",
    status: "active",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
  })

  // OKR Form State
  const [okrForm, setOkrForm] = useState({
    objective: "",
    description: "",
    category: "Sales",
    type: "company",
    status: "active",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
  })

  const [keyResults, setKeyResults] = useState<KeyResult[]>([
    {
      title: "",
      description: "",
      unit: "",
      target_value: 0,
      current_value: 0,
      baseline_value: 0,
      progress: 0,
      direction: "increase",
      status: "active",
      weight: 25,
    },
  ])

  useEffect(() => {
    if (editMode && editingItem) {
      if ("name" in editingItem) {
        // It's a KPI
        setActiveTab("kpi")
        setKpiForm({
          name: editingItem.name,
          description: editingItem.description,
          category: editingItem.category,
          unit: editingItem.unit,
          target_value: editingItem.target_value,
          current_value: editingItem.current_value,
          baseline_value: editingItem.baseline_value,
          frequency: editingItem.frequency,
          direction: editingItem.direction,
          status: editingItem.status,
          start_date: editingItem.start_date,
          end_date: editingItem.end_date || "",
        })
      } else {
        // It's an OKR
        setActiveTab("okr")
        setOkrForm({
          objective: editingItem.objective,
          description: editingItem.description,
          category: editingItem.category,
          type: editingItem.type,
          status: editingItem.status,
          start_date: editingItem.start_date,
          end_date: editingItem.end_date || "",
        })
        setKeyResults(editingItem.key_results || [])
      }
    } else {
      // Reset forms for add mode
      resetForms()
    }
  }, [editMode, editingItem, isOpen])

  const resetForms = () => {
    setKpiForm({
      name: "",
      description: "",
      category: "Sales",
      unit: "",
      target_value: 0,
      current_value: 0,
      baseline_value: 0,
      frequency: "monthly",
      direction: "increase",
      status: "active",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
    })

    setOkrForm({
      objective: "",
      description: "",
      category: "Sales",
      type: "company",
      status: "active",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
    })

    setKeyResults([
      {
        title: "",
        description: "",
        unit: "",
        target_value: 0,
        current_value: 0,
        baseline_value: 0,
        progress: 0,
        direction: "increase",
        status: "active",
        weight: 25,
      },
    ])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let endpoint = ""
      let method = "POST"
      let body = {}

      if (activeTab === "kpi") {
        if (editMode && editingItem) {
          endpoint = `/api/kpis/${editingItem.id}`
          method = "PUT"
        } else {
          endpoint = "/api/kpis"
        }
        body = kpiForm
      } else {
        if (editMode && editingItem) {
          endpoint = `/api/okrs/${editingItem.id}`
          method = "PUT"
        } else {
          endpoint = "/api/okrs"
        }
        body = { ...okrForm, key_results: keyResults }
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("nexapro_token")}`,
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        const successMessage = editMode
          ? `${activeTab.toUpperCase()} updated successfully!`
          : `${activeTab.toUpperCase()} created successfully!`
        alert(successMessage)
        onSuccess()
      } else {
        const errorMessage = editMode
          ? `Failed to update ${activeTab.toUpperCase()}`
          : `Failed to create ${activeTab.toUpperCase()}`
        alert(`${errorMessage}: ${data.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error(`Error ${editMode ? "updating" : "creating"} ${activeTab}:`, error)
      const errorMessage = editMode
        ? `Failed to update ${activeTab.toUpperCase()}`
        : `Failed to create ${activeTab.toUpperCase()}`
      alert(`${errorMessage}: Network error or server unavailable`)
    } finally {
      setLoading(false)
    }
  }

  const addKeyResult = () => {
    setKeyResults([
      ...keyResults,
      {
        title: "",
        description: "",
        unit: "",
        target_value: 0,
        current_value: 0,
        baseline_value: 0,
        progress: 0,
        direction: "increase",
        status: "active",
        weight: 25,
      },
    ])
  }

  const removeKeyResult = (index: number) => {
    if (keyResults.length > 1) {
      setKeyResults(keyResults.filter((_, i) => i !== index))
    }
  }

  const updateKeyResult = (index: number, field: keyof KeyResult, value: any) => {
    const updated = keyResults.map((kr, i) => (i === index ? { ...kr, [field]: value } : kr))
    setKeyResults(updated)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editMode ? `Edit ${activeTab.toUpperCase()}` : `Add New ${activeTab.toUpperCase()}`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs - Only show if not in edit mode */}
        {!editMode && (
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("kpi")}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === "kpi"
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Target className="w-4 h-4" />
                KPI
              </div>
            </button>
            <button
              onClick={() => setActiveTab("okr")}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === "okr"
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4" />
                OKR
              </div>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === "kpi" ? (
              // KPI Form
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">KPI Name *</label>
                    <input
                      type="text"
                      required
                      value={kpiForm.name}
                      onChange={(e) => setKpiForm({ ...kpiForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Monthly Revenue Growth"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      value={kpiForm.category}
                      onChange={(e) => setKpiForm({ ...kpiForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Customer Service">Customer Service</option>
                      <option value="Product Development">Product Development</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Quality Assurance">Quality Assurance</option>
                      <option value="Research & Development">Research & Development</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={kpiForm.description}
                    onChange={(e) => setKpiForm({ ...kpiForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe what this KPI measures..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                    <input
                      type="text"
                      required
                      value={kpiForm.unit}
                      onChange={(e) => setKpiForm({ ...kpiForm, unit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., %, $, units"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                    <select
                      required
                      value={kpiForm.frequency}
                      onChange={(e) => setKpiForm({ ...kpiForm, frequency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Direction *</label>
                    <select
                      required
                      value={kpiForm.direction}
                      onChange={(e) => setKpiForm({ ...kpiForm, direction: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="increase">Increase ↗️</option>
                      <option value="decrease">Decrease ↘️</option>
                      <option value="maintain">Maintain →</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Baseline Value *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={kpiForm.baseline_value}
                      onChange={(e) =>
                        setKpiForm({ ...kpiForm, baseline_value: Number.parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Value *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={kpiForm.current_value}
                      onChange={(e) =>
                        setKpiForm({ ...kpiForm, current_value: Number.parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Value *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={kpiForm.target_value}
                      onChange={(e) => setKpiForm({ ...kpiForm, target_value: Number.parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select
                      required
                      value={kpiForm.status}
                      onChange={(e) => setKpiForm({ ...kpiForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={kpiForm.start_date}
                      onChange={(e) => setKpiForm({ ...kpiForm, start_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={kpiForm.end_date}
                      onChange={(e) => setKpiForm({ ...kpiForm, end_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ) : (
              // OKR Form
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Objective *</label>
                    <input
                      type="text"
                      required
                      value={okrForm.objective}
                      onChange={(e) => setOkrForm({ ...okrForm, objective: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Increase customer satisfaction"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      value={okrForm.category}
                      onChange={(e) => setOkrForm({ ...okrForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Customer Service">Customer Service</option>
                      <option value="Product Development">Product Development</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Quality Assurance">Quality Assurance</option>
                      <option value="Research & Development">Research & Development</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={okrForm.description}
                    onChange={(e) => setOkrForm({ ...okrForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe the objective in detail..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select
                      required
                      value={okrForm.type}
                      onChange={(e) => setOkrForm({ ...okrForm, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="company">Company</option>
                      <option value="department">Department</option>
                      <option value="team">Team</option>
                      <option value="individual">Individual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select
                      required
                      value={okrForm.status}
                      onChange={(e) => setOkrForm({ ...okrForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={okrForm.start_date}
                      onChange={(e) => setOkrForm({ ...okrForm, start_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Key Results */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Key Results</h3>
                    <button
                      type="button"
                      onClick={addKeyResult}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Key Result
                    </button>
                  </div>

                  <div className="space-y-4">
                    {keyResults.map((kr, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-800">Key Result {index + 1}</h4>
                          {keyResults.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeKeyResult(index)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input
                              type="text"
                              required
                              value={kr.title}
                              onChange={(e) => updateKeyResult(index, "title", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="e.g., Achieve 95% customer satisfaction"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                            <input
                              type="text"
                              required
                              value={kr.unit}
                              onChange={(e) => updateKeyResult(index, "unit", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="e.g., %, score, units"
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={kr.description}
                            onChange={(e) => updateKeyResult(index, "description", e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Describe this key result..."
                          />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Baseline *</label>
                            <input
                              type="number"
                              required
                              step="0.01"
                              value={kr.baseline_value}
                              onChange={(e) =>
                                updateKeyResult(index, "baseline_value", Number.parseFloat(e.target.value) || 0)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current *</label>
                            <input
                              type="number"
                              required
                              step="0.01"
                              value={kr.current_value}
                              onChange={(e) =>
                                updateKeyResult(index, "current_value", Number.parseFloat(e.target.value) || 0)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target *</label>
                            <input
                              type="number"
                              required
                              step="0.01"
                              value={kr.target_value}
                              onChange={(e) =>
                                updateKeyResult(index, "target_value", Number.parseFloat(e.target.value) || 0)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight *</label>
                            <input
                              type="number"
                              required
                              min="1"
                              max="100"
                              value={kr.weight}
                              onChange={(e) => updateKeyResult(index, "weight", Number.parseInt(e.target.value) || 25)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editMode ? "Update" : "Create"} {activeTab.toUpperCase()}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
