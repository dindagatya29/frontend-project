"use client"

import { DataTableTemplate } from "@/components/data-table-template"
import { Badge } from "@/components/ui/badge"

// Sample data untuk demo
const sampleData = [
  {
    id: 1,
    name: "Project Alpha",
    status: "Active",
    priority: "High",
    progress: 75,
    assignee: "John Doe",
    dueDate: "2024-01-15",
    budget: 50000,
  },
  {
    id: 2,
    name: "Website Redesign",
    status: "In Progress",
    priority: "Medium",
    progress: 45,
    assignee: "Jane Smith",
    dueDate: "2024-02-20",
    budget: 25000,
  },
  {
    id: 3,
    name: "Mobile App",
    status: "Planning",
    priority: "High",
    progress: 10,
    assignee: "Bob Johnson",
    dueDate: "2024-03-30",
    budget: 75000,
  },
  {
    id: 4,
    name: "Database Migration",
    status: "Completed",
    priority: "Low",
    progress: 100,
    assignee: "Alice Brown",
    dueDate: "2023-12-01",
    budget: 15000,
  },
  {
    id: 5,
    name: "Security Audit",
    status: "Active",
    priority: "High",
    progress: 60,
    assignee: "Charlie Wilson",
    dueDate: "2024-01-25",
    budget: 30000,
  },
]

const columns = [
  {
    key: "id",
    label: "ID",
    sortable: true,
  },
  {
    key: "name",
    label: "Project Name",
    sortable: true,
    filterable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    filterable: true,
    render: (value: string) => {
      const statusColors = {
        Active: "bg-green-100 text-green-800",
        "In Progress": "bg-blue-100 text-blue-800",
        Planning: "bg-yellow-100 text-yellow-800",
        Completed: "bg-gray-100 text-gray-800",
      }
      return (
        <Badge className={statusColors[value as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
          {value}
        </Badge>
      )
    },
  },
  {
    key: "priority",
    label: "Priority",
    sortable: true,
    filterable: true,
    render: (value: string) => {
      const priorityColors = {
        High: "bg-red-100 text-red-800",
        Medium: "bg-orange-100 text-orange-800",
        Low: "bg-green-100 text-green-800",
      }
      return (
        <Badge className={priorityColors[value as keyof typeof priorityColors] || "bg-gray-100 text-gray-800"}>
          {value}
        </Badge>
      )
    },
  },
  {
    key: "progress",
    label: "Progress",
    sortable: true,
    render: (value: number) => (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${value}%` }} />
        </div>
        <span className="text-sm font-medium">{value}%</span>
      </div>
    ),
  },
  {
    key: "assignee",
    label: "Assignee",
    sortable: true,
    filterable: true,
  },
  {
    key: "dueDate",
    label: "Due Date",
    sortable: true,
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    key: "budget",
    label: "Budget",
    sortable: true,
    render: (value: number) => `$${value.toLocaleString()}`,
  },
]

export default function TableDemoPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <DataTableTemplate
        title="Project Management Dashboard"
        description="Comprehensive overview of all active projects with export capabilities"
        columns={columns}
        data={sampleData}
        searchable={true}
        exportable={true}
        filterable={true}
        pagination={true}
        pageSize={5}
      />
    </div>
  )
}
