"use client"

import { useState } from "react"


interface Integration {
  id: number
  name: string
  description: string
  category: string
  status: "connected" | "disconnected" | "error"
  icon: string
  features: string[]
  lastSync?: string
  settings?: {
    apiKey?: string
    webhookUrl?: string
    syncFrequency?: string
  }
}



const ButtonLinks = () => {
  const handleBrowseClick = () => {
    window.location.href = 'https://www.google.com/?hl=id';
  };

  const buttons = [
    {
      label: '🛒 Browse Marketplace',
      onClick: handleBrowseClick,
      bgColor: 'bg-green-700',
      hoverColor: 'hover:bg-green-900',
    },
  ];

  return (
    <div className="flex space-x-2">
      {buttons.map((btn, index) => (
        <button
          key={index}
          onClick={btn.onClick}
          className={`px-4 py-2 text-white rounded-md font-semibold transition-colors inline-flex items-center ${btn.bgColor} ${btn.hoverColor}`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default function IntegrationsPage() {
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 1,
      name: "Google Calendar",
      description: "Sync project deadlines and meetings",
      category: "Calendar",
      status: "connected",
      icon: "📅",
      features: ["Event sync", "Deadline notifications", "Meeting scheduling"],
      lastSync: "2024-02-15T10:30:00Z",
      settings: {
        syncFrequency: "real-time",
      },
    },
    {
      id: 2,
      name: "GitHub",
      description: "Code repository and version control integration",
      category: "Development",
      status: "connected",
      icon: "🐙",
      features: ["Commit tracking", "Pull request updates", "Issue sync"],
      lastSync: "2024-02-15T09:45:00Z",
      settings: {
        apiKey: "ghp_****",
        syncFrequency: "hourly",
      },
    },
    {
      id: 3,
      name: "Trello",
      description: "Kanban board synchronization",
      category: "Project Management",
      status: "disconnected",
      icon: "📋",
      features: ["Board sync", "Card updates", "List management"],
    },
    {
      id: 4,
      name: "Slack",
      description: "Team communication and notifications",
      category: "Communication",
      status: "connected",
      icon: "💬",
      features: ["Real-time notifications", "Task updates", "Team mentions"],
      lastSync: "2024-02-15T08:20:00Z",
    },
    {
      id: 5,
      name: "Figma",
      description: "Design collaboration and file sync",
      category: "Design",
      status: "error",
      icon: "🎨",
      features: ["Design file sync", "Comment notifications", "Version tracking"],
    },
    {
      id: 6,
      name: "Zoom",
      description: "Video conferencing integration",
      category: "Communication",
      status: "disconnected",
      icon: "📹",
      features: ["Meeting scheduling", "Recording sync", "Calendar integration"],
    },
  ])

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "disconnected":
        return "bg-gray-100 text-gray-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return "✅"
      case "disconnected":
        return "⚪"
      case "error":
        return "❌"
      default:
        return "⚪"
    }
  }

  const toggleIntegration = (id: number) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              status: integration.status === "connected" ? "disconnected" : "connected",
              lastSync: integration.status === "disconnected" ? new Date().toISOString() : integration.lastSync,
            }
          : integration,
      ),
    )
  }

  const ConfigModal = () => {
    if (!isConfigModalOpen || !selectedIntegration) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{selectedIntegration.icon}</span>
                <h2 className="text-lg font-semibold text-gray-800">Configure {selectedIntegration.name}</h2>
              </div>
              <button onClick={() => setIsConfigModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                ❌
              </button>
            </div>
          </div>
          <div className="p-6">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🔑 API Key</label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter API key..."
                  defaultValue={selectedIntegration.settings?.apiKey}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🔗 Webhook URL</label>
                <input
                  type="url"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://..."
                  defaultValue={selectedIntegration.settings?.webhookUrl}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">⏰ Sync Frequency</label>
                <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="real-time">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  💾 Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const categories = [...new Set(integrations.map((i) => i.category))]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🔗 Integrations</h1>
          <p className="text-gray-600">Connect with your favorite tools and services</p>
        </div>
        <ButtonLinks />
      </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">📊 Total Integrations</h3>
            <p className="text-3xl font-bold text-gray-800">{integrations.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">✅ Connected</h3>
            <p className="text-3xl font-bold text-green-600">
              {integrations.filter((i) => i.status === "connected").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">⚪ Disconnected</h3>
            <p className="text-3xl font-bold text-gray-600">
              {integrations.filter((i) => i.status === "disconnected").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">❌ Errors</h3>
            <p className="text-3xl font-bold text-red-600">{integrations.filter((i) => i.status === "error").length}</p>
          </div>
        </div>

        {/* Integrations by Category */}
        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📁 {category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations
                .filter((i) => i.category === category)
                .map((integration) => (
                  <div
                    key={integration.id}
                    className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{integration.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-800">{integration.name}</h3>
                          <p className="text-sm text-gray-600">{integration.description}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(integration.status)}`}>
                        {getStatusIcon(integration.status)} {integration.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">✨ Features:</h4>
                      <ul className="space-y-1">
                        {integration.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                            <span className="text-green-500">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {integration.lastSync && (
                      <div className="mb-4 text-xs text-gray-500">
                        🔄 Last sync: {new Date(integration.lastSync).toLocaleString()}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleIntegration(integration.id)}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          integration.status === "connected"
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {integration.status === "connected" ? "🔌 Disconnect" : "🔗 Connect"}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedIntegration(integration)
                          setIsConfigModalOpen(true)
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm transition-colors"
                      >
                        ⚙️ Configure
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <ConfigModal />
    </div>
  )
}