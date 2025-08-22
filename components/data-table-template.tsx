"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Download,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileText,
  FileSpreadsheet,
  Printer,
} from "lucide-react"

interface Column {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableTemplateProps {
  title: string
  description?: string
  columns: Column[]
  data: any[]
  searchable?: boolean
  exportable?: boolean
  filterable?: boolean
  pagination?: boolean
  pageSize?: number
}

export function DataTableTemplate({
  title,
  description,
  columns,
  data,
  searchable = true,
  exportable = true,
  filterable = true,
  pagination = true,
  pageSize = 10,
}: DataTableTemplateProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterColumn, setFilterColumn] = useState<string>("")
  const [filterValue, setFilterValue] = useState<string>("")

  // Filter data based on search and filters
  const filteredData = data.filter((row) => {
    const matchesSearch = searchable
      ? Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
      : true

    const matchesFilter =
      filterColumn && filterValue ? String(row[filterColumn]).toLowerCase().includes(filterValue.toLowerCase()) : true

    return matchesSearch && matchesFilter
  })

  // Sort data
  const sortedData = sortConfig
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    : filteredData

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = pagination ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize) : sortedData

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === "asc" ? { key, direction: "desc" } : null
      }
      return { key, direction: "asc" }
    })
  }

  const exportToCSV = () => {
    const headers = columns.map((col) => col.label).join(",")
    const rows = sortedData
      .map((row) =>
        columns
          .map((col) => {
            const value = row[col.key]
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      )
      .join("\n")

    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    const json = JSON.stringify(sortedData, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const printTable = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      const tableHTML = `
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; font-weight: bold; }
              h1 { color: #333; margin-bottom: 10px; }
              .meta { color: #666; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            ${description ? `<p class="meta">${description}</p>` : ""}
            <p class="meta">Generated on: ${new Date().toLocaleDateString()}</p>
            <p class="meta">Total Records: ${sortedData.length}</p>
            <table>
              <thead>
                <tr>
                  ${columns.map((col) => `<th>${col.label}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${sortedData
                  .map(
                    (row) => `
                  <tr>
                    ${columns.map((col) => `<td>${row[col.key] || ""}</td>`).join("")}
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `
      printWindow.document.write(tableHTML)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>

          {exportable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToCSV} className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToJSON} className="gap-2">
                  <FileText className="h-4 w-4" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={printTable} className="gap-2">
                  <Printer className="h-4 w-4" />
                  Print Table
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search all columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {filterable && (
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {columns
                    .filter((col) => col.filterable !== false)
                    .map((col) => (
                      <DropdownMenuItem key={col.key} onClick={() => setFilterColumn(col.key)}>
                        {col.label}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {filterColumn && (
                <Input
                  placeholder={`Filter by ${columns.find((c) => c.key === filterColumn)?.label}...`}
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="w-48"
                />
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {paginatedData.length} of {filteredData.length} results
            {filteredData.length !== data.length && ` (filtered from ${data.length} total)`}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} >
                    {column.sortable !== false ? (
                      <Button
                        variant="ghost"
                        onClick={() => handleSort(column.key)}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        {column.label}
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === "asc" ? (
                            <ArrowUp className="ml-2 h-4 w-4" />
                          ) : (
                            <ArrowDown className="ml-2 h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                        )}
                      </Button>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td colSpan={columns.length} className="text-center py-8 px-4 border-b">
                    <div className="text-muted-foreground">
                      {searchTerm || filterValue ? "No results found" : "No data available"}
                    </div>
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
