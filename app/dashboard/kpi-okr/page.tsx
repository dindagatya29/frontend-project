"use client"

import { useState, useEffect } from "react"
import { Plus, Target, CheckCircle, AlertCircle, Clock, BarChart3, RefreshCw, Search, Trash2, Edit } from "lucide-react"
import AddKpiOkrModal from "@/components/add-kpi-okr-modal"
import DeleteConfirmationModal from "@/components/delete-confirmation-modal"

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
  status_color: string
  direction_icon: string
  frequency_label: string
  is_on_track: boolean
  user?: {
    id: number
    name: string
    avatar: string
  }
  project?: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

interface KeyResult {
  id: number
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
  status_color: string
  direction_icon: string
  completion_status: string
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
  status_color: string
  type_label: string
  is_on_track: boolean
  completion_status: string
  key_results: KeyResult[]
  user?: {
    id: number
    name: string
    avatar: string
  }
  project?: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

interface KpiStats {
  total: number
  active: number
  completed: number
  on_track: number
  at_risk: number
  by_category: Record<string, number>
  by_status: Record<string, number>
}

interface OkrStats {
  total: number
  active: number
  completed: number
  on_track: number
  at_risk: number
  by_type: Record<string, number>
  by_status: Record<string, number>
}

export default function KPIOKRPage() {
  const [activeTab, setActiveTab] = useState<"kpis" | "okrs">("kpis")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [kpis, setKpis] = useState<KPI[]>([])
  const [okrs, setOkrs] = useState<OKR[]>([])
  const [kpiStats, setKpiStats] = useState<KpiStats | null>(null)
  const [okrStats, setOkrStats] = useState<OkrStats | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  // Delete confirmation modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteType, setDeleteType] = useState<"kpi" | "okr">("kpi")
  const [deleteItem, setDeleteItem] = useState<{ id: number; name: string } | null>(null)

  // Edit mode states
  const [editMode, setEditMode] = useState(false)
  const [editingItem, setEditingItem] = useState<KPI | OKR | null>(null)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === "kpis") {
        await Promise.all([fetchKPIs(), fetchKpiStats()])
      } else {
        await Promise.all([fetchOKRs(), fetchOkrStats()])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchKPIs = async () => {
    try {
      const response = await fetch("/api/kpis")
      const data = await response.json()

      if (data.success) {
        setKpis(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching KPIs:", error)
    }
  }

  const fetchKpiStats = async () => {
    try {
      const response = await fetch("/api/kpis/stats")
      const data = await response.json()
      if (data.success) {
        setKpiStats(data.data)
      }
    } catch (error) {
      console.error("Error fetching KPI stats:", error)
    }
  }

  const fetchOKRs = async () => {
    try {
      const response = await fetch("/api/okrs")
      const data = await response.json()
      if (data.success) {
        setOkrs(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching OKRs:", error)
    }
  }

  const fetchOkrStats = async () => {
    try {
      const response = await fetch("/api/okrs/stats")
      const data = await response.json()
      if (data.success) {
        setOkrStats(data.data)
      }
    } catch (error) {
      console.error("Error fetching OKR stats:", error)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditMode(false)
    setEditingItem(null)
  }

  const handleModalSuccess = () => {
    fetchData()
    handleModalClose()
  }

  const handleDeleteKPI = (kpi: KPI) => {
    setDeleteType("kpi")
    setDeleteItem({ id: kpi.id, name: kpi.name })
    setDeleteModalOpen(true)
  }

  const handleDeleteOKR = (okr: OKR) => {
    setDeleteType("okr")
    setDeleteItem({ id: okr.id, name: okr.objective })
    setDeleteModalOpen(true)
  }

  const handleEditKPI = (kpi: KPI) => {
    setEditingItem(kpi)
    setEditMode(true)
    setIsModalOpen(true)
  }

  const handleEditOKR = (okr: OKR) => {
    setEditingItem(okr)
    setEditMode(true)
    setIsModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteItem) return

    setDeleteLoading(true)
    try {
      const endpoint = deleteType === "kpi" ? `/api/kpis/${deleteItem.id}` : `/api/okrs/${deleteItem.id}`

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("nexapro_token")}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        if (deleteType === "kpi") {
          setKpis((prev) => prev.filter((kpi) => kpi.id !== deleteItem.id))
          fetchKpiStats()
        } else {
          setOkrs((prev) => prev.filter((okr) => okr.id !== deleteItem.id))
          fetchOkrStats()
        }

        // Show success message
        const successMessage = deleteType === "kpi" ? "KPI deleted successfully" : "OKR deleted successfully"
        alert(successMessage)
      } else {
        const errorMessage = deleteType === "kpi" ? "Failed to delete KPI" : "Failed to delete OKR"
        alert(`${errorMessage}: ${data.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error)
      const errorMessage = deleteType === "kpi" ? "Failed to delete KPI" : "Failed to delete OKR"
      alert(`${errorMessage}: Network error or server unavailable`)
    } finally {
      setDeleteLoading(false)
      setDeleteModalOpen(false)
      setDeleteItem(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-green-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case "increase":
        return "↗️"
      case "decrease":
        return "↘️"
      case "maintain":
        return "→"
      default:
        return "→"
    }
  }

  const filteredKpis = kpis.filter((kpi) => {
    const matchesSearch =
      kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kpi.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kpi.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || kpi.status === filterStatus
    const matchesCategory = filterCategory === "all" || kpi.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const filteredOkrs = okrs.filter((okr) => {
    const matchesSearch =
      okr.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
      okr.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      okr.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || okr.status === filterStatus
    const matchesCategory = filterCategory === "all" || okr.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const renderKPIs = () => (
    <div className="space-y-6">
      {/* KPI Summary */}
      {kpiStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-medium text-gray-600">Total KPIs</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{kpiStats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-medium text-gray-600">On Track</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{kpiStats.on_track}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h3 className="text-sm font-medium text-gray-600">At Risk</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{kpiStats.at_risk}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-medium text-gray-600">Active</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{kpiStats.active}</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKpis.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-lg border border-gray-200 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No KPIs found</h3>
            <p className="text-gray-500 mb-4">Create your first KPI to start tracking performance</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add KPI
            </button>
          </div>
        ) : (
          filteredKpis.map((kpi) => (
            <div
              key={kpi.id}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{kpi.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{kpi.description}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(kpi.status)}`}>{kpi.status}</span>
                    <span className="text-xs text-gray-500">{kpi.category}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getDirectionIcon(kpi.direction)}</span>
                  <button
                    onClick={() => handleEditKPI(kpi)}
                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    title="Edit KPI"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteKPI(kpi)}
                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    title="Delete KPI"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-800">
                    {kpi.current_value} {kpi.unit}
                  </span>
                  <span className="text-sm text-gray-600">
                    Target: {kpi.target_value} {kpi.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(kpi.progress)}`}
                    style={{ width: `${Math.min(kpi.progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{kpi.progress.toFixed(1)}% of target</span>
                  <span>{kpi.frequency_label}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>👤 {kpi.user?.name || "Unknown"}</span>
                <span>📅 {new Date(kpi.start_date).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  const renderOKRs = () => (
    <div className="space-y-6">
      {/* OKR Summary */}
      {okrStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-medium text-gray-600">Total Objectives</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{okrStats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-medium text-gray-600">On Track</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{okrStats.on_track}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h3 className="text-sm font-medium text-gray-600">At Risk</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{okrStats.at_risk}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-medium text-gray-600">Active</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{okrStats.active}</p>
          </div>
        </div>
      )}

      {/* OKR Cards */}
      <div className="space-y-6">
        {filteredOkrs.length === 0 ? (
          <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No OKRs found</h3>
            <p className="text-gray-500 mb-4">Create your first OKR to start tracking objectives</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add OKR
            </button>
          </div>
        ) : (
          filteredOkrs.map((okr) => (
            <div
              key={okr.id}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{okr.objective}</h3>
                  <p className="text-gray-600 mb-2">{okr.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📅 {new Date(okr.start_date).toLocaleDateString()}</span>
                    <span>👤 {okr.user?.name || "Unknown"}</span>
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(okr.status)}`}>{okr.status}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(okr.status)}`}>
                    {okr.type_label}
                  </span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-800">{okr.overall_progress.toFixed(1)}%</div>
                    <div className="text-sm text-gray-500">Complete</div>
                  </div>
                  <button
                    onClick={() => handleEditOKR(okr)}
                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    title="Edit OKR"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteOKR(okr)}
                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    title="Delete OKR"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-300 ${getProgressColor(okr.overall_progress)}`}
                    style={{ width: `${Math.min(okr.overall_progress, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Key Results */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">Key Results:</h4>
                {okr.key_results.map((kr, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{kr.title}</span>
                      <span className="text-sm text-gray-500">{kr.progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(kr.progress)}`}
                        style={{ width: `${Math.min(kr.progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>
                        {kr.current_value} / {kr.target_value} {kr.unit}
                      </span>
                      <span>Weight: {kr.weight}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 KPI & OKR Management</h1>
          <p className="text-gray-600 mt-2">
            Track and manage your Key Performance Indicators and Objectives & Key Results
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add KPI/OKR
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("kpis")}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
            activeTab === "kpis"
              ? "text-green-600 border-b-2 border-green-600 bg-green-50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Target className="w-4 h-4" />
            KPIs
          </div>
        </button>
        <button
          onClick={() => setActiveTab("okrs")}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
            activeTab === "okrs"
              ? "text-green-600 border-b-2 border-green-600 bg-green-50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <BarChart3 className="w-4 h-4" />
            OKRs
          </div>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
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

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-green-600" />
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      ) : (
        <div>{activeTab === "kpis" ? renderKPIs() : renderOKRs()}</div>
      )}

      {/* Add KPI/OKR Modal */}
      <AddKpiOkrModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editMode={editMode}
        editingItem={editingItem}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setDeleteItem(null)
        }}
        onConfirm={confirmDelete}
        title={`Delete ${deleteType.toUpperCase()}`}
        message={`Are you sure you want to delete this ${deleteType.toUpperCase()}?`}
        itemName={deleteItem?.name || ""}
        loading={deleteLoading}
      />
    </div>
  )
}
