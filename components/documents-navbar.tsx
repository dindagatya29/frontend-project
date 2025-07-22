"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DocumentsNavbar() {
  const [showUploadModal, setShowUploadModal] = useState(false)

  const breadcrumbs = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Documents", href: "/dashboard/documents" },
  ]

  return (
    <div className="mb-6">
      {/* Simple Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">📁 Documents</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage and organize your project files</p>
        </div>

        <div className="flex items-center space-x-3">
          <Button onClick={() => setShowUploadModal(true)} className="bg-green-600 hover:bg-green-700 text-white">
            📤 Upload Files
          </Button>
          <Button variant="outline" className="border-gray-300 text-gray-600 dark:border-gray-600 dark:text-white">
            📁 New Folder
          </Button>
        </div>
      </div>

      {/* Simple Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
        {breadcrumbs.map((item, index) => (
          <div key={item.name} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-400 dark:text-gray-500">›</span>}
            <a href={item.href} className="hover:text-green-600 dark:hover:text-blue-400">
              {item.name}
            </a>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">📤 Upload Files</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100">
                ✕
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📁</div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Drag and drop files here</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">or</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white">Choose Files</Button>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowUploadModal(false)} className="border-gray-300 dark:border-gray-600 dark:text-white">
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white">Upload</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
