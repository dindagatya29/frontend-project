"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Notification, ConfirmationDialog } from "./ui/notification"

interface FileItem {
  id: number
  name: string
  type: string
  size: number
  uploadedBy: string
  uploadedAt: string
  projectId?: number
  taskId?: number
  tags: string[]
  version: number
  isLatest: boolean
  downloadUrl: string
  previewUrl?: string
}

export default function FileManagement() {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: 1,
      name: "Project Requirements.pdf",
      type: "application/pdf",
      size: 2048576,
      uploadedBy: "John Doe",
      uploadedAt: "2024-02-15T10:30:00Z",
      projectId: 1,
      tags: ["requirements", "documentation"],
      version: 1,
      isLatest: true,
      downloadUrl: "#",
    },
    {
      id: 2,
      name: "Design Mockups.figma",
      type: "application/figma",
      size: 5242880,
      uploadedBy: "Jane Smith",
      uploadedAt: "2024-02-14T15:20:00Z",
      projectId: 1,
      taskId: 3,
      tags: ["design", "mockup", "ui"],
      version: 2,
      isLatest: true,
      downloadUrl: "#",
    },
  ])

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [filterType, setFilterType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  
  // Notification states
  const [notification, setNotification] = useState<{
    isOpen: boolean
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  })

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    })
  }

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }))
  }

  const showConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm
    })
  }

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }))
  }

  // Tambahkan useEffect untuk fetch file dari backend
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = getToken();
        const res = await fetch('http://localhost:8000/api/files', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setFiles(data.data.map((f: any) => ({
            id: f.id,
            name: f.name,
            type: f.type,
            size: f.size,
            uploadedBy: f.uploaded_by,
            uploadedAt: f.uploaded_at,
            projectId: f.project_id,
            taskId: f.task_id,
            tags: f.tags || [],
            version: f.version,
            isLatest: f.is_latest,
            downloadUrl: `http://localhost:8000/api/files/${f.id}/download`,
            previewUrl: `http://localhost:8000/api/files/${f.id}/preview`,
          })));
        }
      } catch (error) {
        console.error('Failed to fetch files:', error);
      }
    };
    fetchFiles();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  // Ubah handleUpload agar upload ke backend dan fetch ulang file
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('files[]', file));
    const token = getToken();
    try {
      const res = await fetch('http://localhost:8000/api/files', {
        method: 'POST',
        body: formData,
        headers: token ? { 
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it
        } : {},
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setFiles((prev) => [...prev, ...data.data.map((f: any) => ({
          id: f.id,
          name: f.name,
          type: f.type,
          size: f.size,
          uploadedBy: f.uploaded_by,
          uploadedAt: f.uploaded_at,
          projectId: f.project_id,
          taskId: f.task_id,
          tags: f.tags || [],
          version: f.version,
          isLatest: f.is_latest,
          downloadUrl: `http://localhost:8000/api/files/${f.id}/download`,
          previewUrl: `http://localhost:8000/api/files/${f.id}/preview`,
        }))]);

        // Log activity for file uploads
        selectedFiles.forEach((file) => {
          // Dispatch custom event for file upload
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("fileUploaded", {
              detail: { 
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type
              }
            }))
          }
        });
      }
      setSelectedFiles([]);
      setUploadProgress(100);
    } catch (error) {
      console.error('Failed to upload files:', error);
    }
    setIsUploading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes("image")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      )
    } else if (type.includes("pdf")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-600"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14,2 14,8 20,8" />
        </svg>
      )
    } else if (type.includes("text") || type.includes("markdown")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" x2="8" y1="13" y2="13" />
          <line x1="16" x2="8" y1="17" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      )
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14,2 14,8 20,8" />
        </svg>
      )
    }
  }

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    if (filterType === "all") return matchesSearch
    return matchesSearch && file.type.includes(filterType)
  })

  // Tambahkan handler drag-and-drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Tambahkan handler download, preview, delete
  // Pastikan handleDownload dan handlePreview menggunakan file.downloadUrl/file.previewUrl dari backend
  const handleDownload = (file: FileItem) => {
    window.open(file.downloadUrl, '_blank');
  };
  const handlePreview = (file: FileItem) => {
    if (file.previewUrl) window.open(file.previewUrl, '_blank');
    else if (file.downloadUrl) window.open(file.downloadUrl, '_blank');
  };
  const handleDelete = async (fileId: number, fileName: string) => {
    showConfirmDialog(
      'Delete File',
      `Are you sure you want to delete "${fileName}"? This action cannot be undone.`,
      async () => {
        const token = getToken();
        try {
          const res = await fetch(`http://localhost:8000/api/files/${fileId}`, {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (res.ok) {
            setFiles((prev) => prev.filter((f) => f.id !== fileId));
            showNotification('success', 'File Deleted', `File "${fileName}" has been deleted successfully.`);
          } else {
            showNotification('error', 'Delete Failed', 'Failed to delete file. Please try again.');
          }
        } catch (error) {
          console.error('Failed to delete file:', error);
          showNotification('error', 'Delete Failed', 'Failed to delete file. Please try again.');
        }
        closeConfirmDialog();
      }
    );
  };

  // Tambahkan fungsi deleteFile
  const deleteFile = async (fileId: number) => {
    setFiles(prev => prev.filter(f => f.id !== fileId)); // Optimistic update
    const token = getToken();
    try {
      const res = await fetch(`http://localhost:8000/api/files/${fileId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        console.error('Failed to delete file.');
        // Revert optimistic update if failed
        const fetchFiles = async () => {
          try {
            const token = getToken();
            const res = await fetch('http://localhost:8000/api/files', {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await res.json();
            if (Array.isArray(data.data)) {
              setFiles(data.data.map((f: any) => ({
                id: f.id,
                name: f.name,
                type: f.type,
                size: f.size,
                uploadedBy: f.uploaded_by,
                uploadedAt: f.uploaded_at,
                projectId: f.project_id,
                taskId: f.task_id,
                tags: f.tags || [],
                version: f.version,
                isLatest: f.is_latest,
                downloadUrl: `http://localhost:8000/api/files/${f.id}/download`,
                previewUrl: `http://localhost:8000/api/files/${f.id}/preview`,
              })));
            }
          } catch (error) {
            console.error('Failed to fetch files:', error);
          }
        };
        await fetchFiles();
      }
    } catch (err) {
      console.error('Failed to delete file.');
      // Revert optimistic update if failed
      const fetchFiles = async () => {
        try {
          const token = getToken();
          const res = await fetch('http://localhost:8000/api/files', {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          const data = await res.json();
          if (Array.isArray(data.data)) {
            setFiles(data.data.map((f: any) => ({
              id: f.id,
              name: f.name,
              type: f.type,
              size: f.size,
              uploadedBy: f.uploaded_by,
              uploadedAt: f.uploaded_at,
              projectId: f.project_id,
              taskId: f.task_id,
              tags: f.tags || [],
              version: f.version,
              isLatest: f.is_latest,
              downloadUrl: `http://localhost:8000/api/files/${f.id}/download`,
              previewUrl: `http://localhost:8000/api/files/${f.id}/preview`,
            })));
          }
        } catch (error) {
          console.error('Failed to fetch files:', error);
        }
      };
      await fetchFiles();
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Component */}
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isOpen={notification.isOpen}
        onClose={closeNotification}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
        type="danger"
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">📄</div>
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">156</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Files</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">📁</div>
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">24</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Folders</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">💾</div>
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">2.4GB</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Storage Used</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">🔄</div>
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Recent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Upload Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📤 Quick Upload</h3>

        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input type="file" multiple onChange={handleFileSelect} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17,8 12,3 7,8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Click to upload files or drag and drop</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Support for PDF, images, documents, and more</p>
          </label>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-800 dark:text-white mb-2">Selected Files:</h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file.type)}
                    <span className="text-sm text-gray-700 dark:text-gray-200">{file.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({formatFileSize(file.size)})</span>
                  </div>
                  <button
                    onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {isUploading && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Uploading...</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload Files"}
            </button>
          </div>
        )}
      </div>

      {/* File Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">File Library</h3>
            <div className="flex items-center space-x-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="all">All Files</option>
                <option value="image">Images</option>
                <option value="pdf">PDFs</option>
                <option value="text">Documents</option>
                <option value="application">Applications</option>
              </select>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">File</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.type)}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">v{file.version}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatFileSize(file.size)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{file.uploadedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {file.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs rounded bg-green-100 dark:bg-blue-900 text-green-800 dark:text-blue-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-green-600 hover:text-green-900 dark:text-blue-400 dark:hover:text-blue-300" onClick={() => handleDownload(file)}>Download</button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" onClick={() => handlePreview(file)}>Preview</button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onClick={() => handleDelete(file.id, file.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Helper untuk ambil token
const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('nexapro_token') : null);
