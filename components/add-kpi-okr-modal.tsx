'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, Target, TrendingUp, Calendar, Hash, FileText, Users, Building, User, CheckCircle, AlertCircle, Clock, BarChart3 } from 'lucide-react'

interface AddKpiOkrModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface KpiFormData {
  name: string
  description: string
  category: string
  unit: string
  target_value: number
  current_value: number
  baseline_value: number
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  direction: 'increase' | 'decrease' | 'maintain'
  start_date: string
  end_date: string
  project_id?: number
}

interface KeyResult {
  title: string
  description: string
  unit: string
  target_value: number
  current_value: number
  baseline_value: number
  direction: 'increase' | 'decrease' | 'maintain'
  weight: number
}

interface OkrFormData {
  objective: string
  description: string
  category: string
  type: 'company' | 'team' | 'individual'
  start_date: string
  end_date: string
  project_id?: number
  key_results: KeyResult[]
}

export default function AddKpiOkrModal({ isOpen, onClose, onSuccess }: AddKpiOkrModalProps) {
  const [activeTab, setActiveTab] = useState<'kpi' | 'okr'>('kpi')
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])

  // KPI Form State
  const [kpiForm, setKpiForm] = useState<KpiFormData>({
    name: '',
    description: '',
    category: '',
    unit: '',
    target_value: 0,
    current_value: 0,
    baseline_value: 0,
    frequency: 'monthly',
    direction: 'increase',
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  })

  // OKR Form State
  const [okrForm, setOkrForm] = useState<OkrFormData>({
    objective: '',
    description: '',
    category: '',
    type: 'individual',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    key_results: [
      {
        title: '',
        description: '',
        unit: '',
        target_value: 0,
        current_value: 0,
        baseline_value: 0,
        direction: 'increase',
        weight: 1
      }
    ]
  })

  // Fetch projects and categories on mount
  useEffect(() => {
    if (isOpen) {
      fetchProjects()
      fetchCategories()
    }
  }, [isOpen])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      if (data.success) {
        setProjects(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/kpis/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleKpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!kpiForm.name.trim() || !kpiForm.category.trim() || !kpiForm.unit.trim() || kpiForm.target_value <= 0) {
        alert('Please fill in all required fields (Name, Category, Unit, Target Value)')
        setLoading(false)
        return
      }

      const response = await fetch('/api/kpis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('nexapro_token')}`,
        },
        body: JSON.stringify(kpiForm),
      })

      const data = await response.json()

      if (data.success) {
        onSuccess()
        onClose()
        resetKpiForm()
      } else {
        alert('Failed to create KPI: ' + (data.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating KPI:', error)
      alert('Failed to create KPI: Network error or server unavailable')
    } finally {
      setLoading(false)
    }
  }

  const handleOkrSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!okrForm.objective.trim() || !okrForm.category.trim()) {
        alert('Please fill in all required fields (Objective, Category)')
        setLoading(false)
        return
      }

      // Validate key results
      const validKeyResults = okrForm.key_results.filter(kr => 
        kr.title.trim() !== '' && kr.unit.trim() !== '' && kr.target_value > 0
      )

      if (validKeyResults.length === 0) {
        alert('Please add at least one valid key result with Title, Unit, and Target Value')
        setLoading(false)
        return
      }

      const submitData = {
        ...okrForm,
        key_results: validKeyResults
      }

      const response = await fetch('/api/okrs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('nexapro_token')}`,
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        onSuccess()
        onClose()
        resetOkrForm()
      } else {
        alert('Failed to create OKR: ' + (data.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating OKR:', error)
      alert('Failed to create OKR: Network error or server unavailable')
    } finally {
      setLoading(false)
    }
  }

  const resetKpiForm = () => {
    setKpiForm({
      name: '',
      description: '',
      category: '',
      unit: '',
      target_value: 0,
      current_value: 0,
      baseline_value: 0,
      frequency: 'monthly',
      direction: 'increase',
      start_date: new Date().toISOString().split('T')[0],
      end_date: ''
    })
  }

  const resetOkrForm = () => {
    setOkrForm({
      objective: '',
      description: '',
      category: '',
      type: 'individual',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      key_results: [
        {
          title: '',
          description: '',
          unit: '',
          target_value: 0,
          current_value: 0,
          baseline_value: 0,
          direction: 'increase',
          weight: 1
        }
      ]
    })
  }

  const addKeyResult = () => {
    setOkrForm(prev => ({
      ...prev,
      key_results: [
        ...prev.key_results,
        {
          title: '',
          description: '',
          unit: '',
          target_value: 0,
          current_value: 0,
          baseline_value: 0,
          direction: 'increase',
          weight: 1
        }
      ]
    }))
  }

  const removeKeyResult = (index: number) => {
    if (okrForm.key_results.length > 1) {
      setOkrForm(prev => ({
        ...prev,
        key_results: prev.key_results.filter((_, i) => i !== index)
      }))
    }
  }

  const updateKeyResult = (index: number, field: keyof KeyResult, value: any) => {
    setOkrForm(prev => ({
      ...prev,
      key_results: prev.key_results.map((kr, i) => 
        i === index ? { ...kr, [field]: value } : kr
      )
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add KPI/OKR</h2>
              <p className="text-sm text-gray-600">Create new performance indicators or objectives</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('kpi')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
              activeTab === 'kpi'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Target className="w-4 h-4" />
              KPI
            </div>
          </button>
          <button
            onClick={() => setActiveTab('okr')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
              activeTab === 'okr'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BarChart3 className="w-4 h-4" />
              OKR
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'kpi' ? (
            <form onSubmit={handleKpiSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KPI Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={kpiForm.name}
                    onChange={(e) => setKpiForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="e.g., Monthly Sales Revenue, Customer Satisfaction Score"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={kpiForm.category}
                    onChange={(e) => setKpiForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  >
                    <option value="" className="text-gray-500">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category} className="text-gray-900">{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={kpiForm.description}
                  onChange={(e) => setKpiForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Describe what this KPI measures and why it's important..."
                />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={kpiForm.unit}
                    onChange={(e) => setKpiForm(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="e.g., %, $, number, customers, hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={kpiForm.target_value}
                    onChange={(e) => setKpiForm(prev => ({ ...prev, target_value: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="e.g., 100000, 90, 5.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Value
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={kpiForm.current_value}
                    onChange={(e) => setKpiForm(prev => ({ ...prev, current_value: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="e.g., 85000, 87, 4.2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Baseline Value
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={kpiForm.baseline_value}
                    onChange={(e) => setKpiForm(prev => ({ ...prev, baseline_value: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="e.g., 75000, 85, 3.8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Direction *
                  </label>
                  <select
                    required
                    value={kpiForm.direction}
                    onChange={(e) => setKpiForm(prev => ({ ...prev, direction: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  >
                    <option value="increase">Increase (Higher is better)</option>
                    <option value="decrease">Decrease (Lower is better)</option>
                    <option value="maintain">Maintain (Stay within range)</option>
                  </select>
                </div>
              </div>

              {/* Frequency and Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <select
                    required
                    value={kpiForm.frequency}
                    onChange={(e) => setKpiForm(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={kpiForm.start_date}
                    onChange={(e) => setKpiForm(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={kpiForm.end_date}
                    onChange={(e) => setKpiForm(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Create KPI
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOkrSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objective *
                  </label>
                  <input
                    type="text"
                    required
                    value={okrForm.objective}
                    onChange={(e) => setOkrForm(prev => ({ ...prev, objective: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="e.g., Increase Market Share by 25%, Launch New Product Successfully"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    required
                    value={okrForm.type}
                    onChange={(e) => setOkrForm(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  >
                    <option value="individual">Individual</option>
                    <option value="team">Team</option>
                    <option value="company">Company</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={okrForm.description}
                  onChange={(e) => setOkrForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Describe your objective and why it's important..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={okrForm.category}
                    onChange={(e) => setOkrForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="e.g., Business Growth, Product Development, Operations"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={okrForm.start_date}
                    onChange={(e) => setOkrForm(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={okrForm.end_date}
                    onChange={(e) => setOkrForm(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              {/* Key Results */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Key Results *</h3>
                  <button
                    type="button"
                    onClick={addKeyResult}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Key Result
                  </button>
                </div>

                <div className="space-y-4">
                  {okrForm.key_results.map((kr, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Key Result {index + 1}</h4>
                        {okrForm.key_results.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeKeyResult(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={kr.title}
                            onChange={(e) => updateKeyResult(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            placeholder="e.g., Increase Sales Revenue, Complete Product Development"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unit *
                          </label>
                          <input
                            type="text"
                            required
                            value={kr.unit}
                            onChange={(e) => updateKeyResult(index, 'unit', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            placeholder="e.g., %, $, number, customers, days"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={kr.description}
                          onChange={(e) => updateKeyResult(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                          placeholder="Describe this key result and how it will be measured..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Target Value *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={kr.target_value}
                            onChange={(e) => updateKeyResult(index, 'target_value', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            placeholder="e.g., 100000, 90, 5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Value
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={kr.current_value}
                            onChange={(e) => updateKeyResult(index, 'current_value', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            placeholder="e.g., 85000, 87, 3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Direction *
                          </label>
                          <select
                            required
                            value={kr.direction}
                            onChange={(e) => updateKeyResult(index, 'direction', e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                          >
                            <option value="increase">Increase</option>
                            <option value="decrease">Decrease</option>
                            <option value="maintain">Maintain</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Weight
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={kr.weight}
                            onChange={(e) => updateKeyResult(index, 'weight', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            placeholder="1-10"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Create OKR
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
} 