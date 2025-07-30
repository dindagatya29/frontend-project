// "use client"

// import type React from "react"

// import { useEffect, useState, useCallback } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import {
//   Upload,
//   FolderPlus,
//   Folder,
//   File,
//   Trash2,
//   X,
//   Search,
//   Edit,
//   MoreVertical,
//   Download,
//   Eye,
//   Copy,
//   Star,
//   Clock,
//   Grid3X3,
//   List,
//   SortAsc,
//   Plus,
//   FileText,
//   ImageIcon,
//   FileVideo,
//   Music,
//   Archive,
//   Home,
//   Info,
//   Move,
//   CheckCircle,
// } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu"

// interface FolderItem {
//   id: number
//   name: string
//   created_at: string
//   updated_at: string
//   file_count: number
// }

// interface FileItem {
//   id: number
//   name: string
//   size: number
//   folder_id: number
//   created_at: string
//   updated_at: string
//   type: string
// }

// // Initial data - bisa diganti dengan data dari API/controller Anda
// const INITIAL_FOLDERS: FolderItem[] = [
//   {
//     id: 1,
//     name: "Documents",
//     created_at: "2024-01-15T10:30:00Z",
//     updated_at: "2024-01-15T10:30:00Z",
//     file_count: 3,
//   },
//   {
//     id: 2,
//     name: "Images",
//     created_at: "2024-01-16T14:20:00Z",
//     updated_at: "2024-01-16T14:20:00Z",
//     file_count: 5,
//   },
//   {
//     id: 3,
//     name: "Projects",
//     created_at: "2024-01-17T09:15:00Z",
//     updated_at: "2024-01-17T09:15:00Z",
//     file_count: 2,
//   },
//   {
//     id: 4,
//     name: "Archive",
//     created_at: "2024-01-18T16:45:00Z",
//     updated_at: "2024-01-18T16:45:00Z",
//     file_count: 1,
//   },
// ]

// const INITIAL_FILES: FileItem[] = [
//   {
//     id: 1,
//     name: "annual-report.pdf",
//     size: 2048000,
//     folder_id: 1,
//     created_at: "2024-01-15T11:00:00Z",
//     updated_at: "2024-01-15T11:00:00Z",
//     type: "application/pdf",
//   },
//   {
//     id: 2,
//     name: "presentation.pptx",
//     size: 5120000,
//     folder_id: 1,
//     created_at: "2024-01-15T12:30:00Z",
//     updated_at: "2024-01-15T12:30:00Z",
//     type: "application/vnd.ms-powerpoint",
//   },
//   {
//     id: 3,
//     name: "meeting-notes.txt",
//     size: 15360,
//     folder_id: 1,
//     created_at: "2024-01-15T13:45:00Z",
//     updated_at: "2024-01-15T13:45:00Z",
//     type: "text/plain",
//   },
//   {
//     id: 4,
//     name: "team-photo.jpg",
//     size: 3072000,
//     folder_id: 2,
//     created_at: "2024-01-16T15:00:00Z",
//     updated_at: "2024-01-16T15:00:00Z",
//     type: "image/jpeg",
//   },
//   {
//     id: 5,
//     name: "logo-design.png",
//     size: 1536000,
//     folder_id: 2,
//     created_at: "2024-01-16T15:30:00Z",
//     updated_at: "2024-01-16T15:30:00Z",
//     type: "image/png",
//   },
//   {
//     id: 6,
//     name: "screenshot.png",
//     size: 2048000,
//     folder_id: 2,
//     created_at: "2024-01-16T16:00:00Z",
//     updated_at: "2024-01-16T16:00:00Z",
//     type: "image/png",
//   },
//   {
//     id: 7,
//     name: "icon-set.svg",
//     size: 51200,
//     folder_id: 2,
//     created_at: "2024-01-16T16:30:00Z",
//     updated_at: "2024-01-16T16:30:00Z",
//     type: "image/svg+xml",
//   },
//   {
//     id: 8,
//     name: "banner.jpg",
//     size: 4096000,
//     folder_id: 2,
//     created_at: "2024-01-16T17:00:00Z",
//     updated_at: "2024-01-16T17:00:00Z",
//     type: "image/jpeg",
//   },
//   {
//     id: 9,
//     name: "website-source.zip",
//     size: 15360000,
//     folder_id: 3,
//     created_at: "2024-01-17T10:00:00Z",
//     updated_at: "2024-01-17T10:00:00Z",
//     type: "application/zip",
//   },
//   {
//     id: 10,
//     name: "mobile-app.zip",
//     size: 25600000,
//     folder_id: 3,
//     created_at: "2024-01-17T11:30:00Z",
//     updated_at: "2024-01-17T11:30:00Z",
//     type: "application/zip",
//   },
//   {
//     id: 11,
//     name: "database-backup.tar.gz",
//     size: 102400000,
//     folder_id: 4,
//     created_at: "2024-01-18T17:00:00Z",
//     updated_at: "2024-01-18T17:00:00Z",
//     type: "application/gzip",
//   },
//   {
//     id: 12,
//     name: "README.md",
//     size: 4096,
//     folder_id: 0,
//     created_at: "2024-01-19T09:00:00Z",
//     updated_at: "2024-01-19T09:00:00Z",
//     type: "text/markdown",
//   },
//   {
//     id: 13,
//     name: "config.json",
//     size: 2048,
//     folder_id: 0,
//     created_at: "2024-01-19T09:30:00Z",
//     updated_at: "2024-01-19T09:30:00Z",
//     type: "application/json",
//   },
//   {
//     id: 14,
//     name: "demo-video.mp4",
//     size: 51200000,
//     folder_id: 0,
//     created_at: "2024-01-19T10:00:00Z",
//     updated_at: "2024-01-19T10:00:00Z",
//     type: "video/mp4",
//   },
//   {
//     id: 15,
//     name: "background-music.mp3",
//     size: 8192000,
//     folder_id: 0,
//     created_at: "2024-01-19T10:30:00Z",
//     updated_at: "2024-01-19T10:30:00Z",
//     type: "audio/mpeg",
//   },
// ]

// const getFileIcon = (fileName: string) => {
//   const extension = fileName.toLowerCase().split(".").pop()
//   switch (extension) {
//     case "pdf":
//     case "doc":
//     case "docx":
//     case "txt":
//     case "md":
//       return <FileText className="h-5 w-5 text-red-500" />
//     case "jpg":
//     case "jpeg":
//     case "png":
//     case "gif":
//     case "webp":
//     case "svg":
//       return <ImageIcon className="h-5 w-5 text-green-500" />
//     case "mp4":
//     case "avi":
//     case "mov":
//     case "mkv":
//       return <FileVideo className="h-5 w-5 text-purple-500" />
//     case "mp3":
//     case "wav":
//     case "flac":
//       return <Music className="h-5 w-5 text-blue-500" />
//     case "zip":
//     case "rar":
//     case "tar":
//     case "gz":
//     case "7z":
//       return <Archive className="h-5 w-5 text-orange-500" />
//     default:
//       return <File className="h-5 w-5 text-gray-500" />
//   }
// }

// const formatFileSize = (bytes: number) => {
//   if (bytes === 0) return "0 Bytes"
//   const k = 1024
//   const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
// }

// const formatDate = (dateString: string) => {
//   try {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   } catch {
//     return "Unknown"
//   }
// }

// const generateId = () => Date.now() + Math.random()

// export default function DocumentsNavbar() {
//   const [showUploadModal, setShowUploadModal] = useState(false)
//   const [showNewFolderModal, setShowNewFolderModal] = useState(false)
//   const [showEditFolderModal, setShowEditFolderModal] = useState(false)
//   const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
//   const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>(INITIAL_FILES)
//   const [folders, setFolders] = useState<FolderItem[]>(INITIAL_FOLDERS)
//   const [currentFolderId, setCurrentFolderId] = useState<number>(0)
//   const [newFolderName, setNewFolderName] = useState("")
//   const [editingFolder, setEditingFolder] = useState<FolderItem | null>(null)
//   const [editFolderName, setEditFolderName] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
//   const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name")
//   const [dragOver, setDragOver] = useState(false)
//   const [notification, setNotification] = useState<{
//     type: "success" | "error" | "info"
//     message: string
//   } | null>(null)

//   const showNotification = (type: "success" | "error" | "info", message: string) => {
//     setNotification({ type, message })
//     setTimeout(() => setNotification(null), 3000)
//   }

//   const getCurrentFolderName = () => {
//     if (currentFolderId === 0) return "All Files"
//     const folder = folders.find((f) => f.id === currentFolderId)
//     return folder ? folder.name : "All Files"
//   }

//   const getCurrentFolderFiles = () => {
//     let files = uploadedFiles.filter((file) => file.folder_id === currentFolderId)

//     if (searchTerm) {
//       files = files.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
//     }

//     // Sort files
//     files.sort((a, b) => {
//       switch (sortBy) {
//         case "name":
//           return a.name.localeCompare(b.name)
//         case "date":
//           return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//         case "size":
//           return b.size - a.size
//         default:
//           return 0
//       }
//     })

//     return files
//   }

//   const getFilesInFolder = (folderId: number) => {
//     return uploadedFiles.filter((file) => file.folder_id === folderId)
//   }

//   const getTotalStats = () => {
//     const totalFiles = uploadedFiles.length
//     const totalFolders = folders.length
//     const totalSize = uploadedFiles.reduce((acc, file) => acc + file.size, 0)
//     return { totalFiles, totalFolders, totalSize }
//   }

//   const updateFolderFileCounts = useCallback(() => {
//     setFolders((prevFolders) =>
//       prevFolders.map((folder) => ({
//         ...folder,
//         file_count: getFilesInFolder(folder.id).length,
//       })),
//     )
//   }, [uploadedFiles])

//   useEffect(() => {
//     updateFolderFileCounts()
//   }, [uploadedFiles, updateFolderFileCounts])

//   const handleUpload = async () => {
//     if (!selectedFiles) return

//     setIsLoading(true)

//     try {
//       // Simulate upload delay
//       await new Promise((resolve) => setTimeout(resolve, 1500))

//       const newFiles: FileItem[] = Array.from(selectedFiles).map((file) => ({
//         id: generateId(),
//         name: file.name,
//         size: file.size,
//         folder_id: currentFolderId,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         type: file.type || "application/octet-stream",
//       }))

//       setUploadedFiles((prev) => [...prev, ...newFiles])
//       setSelectedFiles(null)
//       setShowUploadModal(false)
//       showNotification("success", `Successfully uploaded ${newFiles.length} file(s) to ${getCurrentFolderName()}`)
//     } catch (error) {
//       showNotification("error", "Failed to upload files")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleCreateFolder = async () => {
//     if (newFolderName.trim() === "") return

//     setIsLoading(true)

//     try {
//       // Simulate API delay
//       await new Promise((resolve) => setTimeout(resolve, 800))

//       const newFolder: FolderItem = {
//         id: generateId(),
//         name: newFolderName.trim(),
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         file_count: 0,
//       }

//       setFolders((prev) => [...prev, newFolder])
//       setNewFolderName("")
//       setShowNewFolderModal(false)
//       showNotification("success", `Folder "${newFolder.name}" created successfully`)
//     } catch (error) {
//       showNotification("error", "Failed to create folder")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleEditFolder = (folder: FolderItem) => {
//     setEditingFolder(folder)
//     setEditFolderName(folder.name)
//     setShowEditFolderModal(true)
//   }

//   const handleUpdateFolder = async () => {
//     if (!editingFolder || editFolderName.trim() === "") return

//     setIsLoading(true)

//     try {
//       // Simulate API delay
//       await new Promise((resolve) => setTimeout(resolve, 600))

//       setFolders((prev) =>
//         prev.map((folder) =>
//           folder.id === editingFolder.id
//             ? {
//                 ...folder,
//                 name: editFolderName.trim(),
//                 updated_at: new Date().toISOString(),
//               }
//             : folder,
//         ),
//       )

//       const oldName = editingFolder.name
//       setEditingFolder(null)
//       setEditFolderName("")
//       setShowEditFolderModal(false)
//       showNotification("success", `Folder renamed from "${oldName}" to "${editFolderName.trim()}"`)
//     } catch (error) {
//       showNotification("error", "Failed to update folder")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleDeleteFolder = async (folderId: number, folderName: string) => {
//     const filesInFolder = getFilesInFolder(folderId)
//     const confirmMessage =
//       filesInFolder.length > 0
//         ? `Are you sure you want to delete folder "${folderName}"? This will also delete ${filesInFolder.length} file(s) in this folder.`
//         : `Are you sure you want to delete folder "${folderName}"?`

//     if (!confirm(confirmMessage)) return

//     setIsLoading(true)

//     try {
//       // Simulate API delay
//       await new Promise((resolve) => setTimeout(resolve, 600))

//       setFolders((prev) => prev.filter((folder) => folder.id !== folderId))
//       setUploadedFiles((prev) => prev.filter((file) => file.folder_id !== folderId))

//       if (currentFolderId === folderId) {
//         setCurrentFolderId(0)
//       }

//       showNotification("success", `Folder "${folderName}" deleted successfully`)
//     } catch (error) {
//       showNotification("error", "Failed to delete folder")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleDeleteFile = async (fileId: number, fileName: string) => {
//     if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return

//     try {
//       setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
//       showNotification("success", `File "${fileName}" deleted successfully`)
//     } catch (error) {
//       showNotification("error", "Failed to delete file")
//     }
//   }

//   const handleDownloadFile = (fileName: string) => {
//     try {
//       // Simulate download - in real app, this would trigger actual download
//       showNotification("info", `Downloading "${fileName}"...`)

//       // You can implement actual download logic here
//       // For example: window.open(`/api/download/${fileName}`)
//     } catch (error) {
//       showNotification("error", "Failed to download file")
//     }
//   }

//   const handleCopyLink = (fileName: string) => {
//     try {
//       // Simulate copy to clipboard
//       const link = `${window.location.origin}/files/${fileName}`
//       navigator.clipboard.writeText(link)
//       showNotification("success", "File link copied to clipboard")
//     } catch (error) {
//       showNotification("error", "Failed to copy link")
//     }
//   }

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault()
//     setDragOver(true)
//   }

//   const handleDragLeave = (e: React.DragEvent) => {
//     e.preventDefault()
//     setDragOver(false)
//   }

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault()
//     setDragOver(false)
//     const files = e.dataTransfer.files
//     if (files.length > 0) {
//       setSelectedFiles(files)
//       setShowUploadModal(true)
//     }
//   }

//   const stats = getTotalStats()

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//       onDrop={handleDrop}
//     >
//       {/* Drag Overlay */}
//       {dragOver && (
//         <div className="fixed inset-0 bg-blue-500/20 backdrop-blur-sm z-50 flex items-center justify-center">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl border-2 border-dashed border-blue-500">
//             <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />
//             <p className="text-xl font-semibold text-slate-900 dark:text-white text-center">Drop files to upload</p>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto p-6">
//         {/* Notification */}
//         {notification && (
//           <div
//             className={`mb-6 rounded-xl p-4 border ${
//               notification.type === "success"
//                 ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
//                 : notification.type === "error"
//                   ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
//                   : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <div
//                 className={`p-2 rounded-lg ${
//                   notification.type === "success"
//                     ? "bg-green-100 dark:bg-green-900/30"
//                     : notification.type === "error"
//                       ? "bg-red-100 dark:bg-red-900/30"
//                       : "bg-blue-100 dark:bg-blue-900/30"
//                 }`}
//               >
//                 <CheckCircle
//                   className={`h-5 w-5 ${
//                     notification.type === "success"
//                       ? "text-green-600 dark:text-green-400"
//                       : notification.type === "error"
//                         ? "text-red-600 dark:text-red-400"
//                         : "text-blue-600 dark:text-blue-400"
//                   }`}
//                 />
//               </div>
//               <p
//                 className={`text-sm font-medium ${
//                   notification.type === "success"
//                     ? "text-green-800 dark:text-green-200"
//                     : notification.type === "error"
//                       ? "text-red-800 dark:text-red-200"
//                       : "text-blue-800 dark:text-blue-200"
//                 }`}
//               >
//                 {notification.message}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Header */}
//         <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8 mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
//                 Document Manager
//               </h1>
//               <p className="text-slate-600 dark:text-slate-400 mt-2">Organize and manage your files with ease</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <Button
//                 onClick={() => setShowUploadModal(true)}
//                 className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
//               >
//                 <Upload className="h-4 w-4 mr-2" />
//                 Upload Files
//               </Button>
//               <Button
//                 onClick={() => setShowNewFolderModal(true)}
//                 variant="outline"
//                 className="border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700/50"
//               >
//                 <FolderPlus className="h-4 w-4 mr-2" />
//                 New Folder
//               </Button>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-500 rounded-lg">
//                   <File className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalFiles}</p>
//                   <p className="text-sm text-blue-600 dark:text-blue-300">Total Files</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200/50 dark:border-green-700/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-green-500 rounded-lg">
//                   <Folder className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.totalFolders}</p>
//                   <p className="text-sm text-green-600 dark:text-green-300">Folders</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-purple-500 rounded-lg">
//                   <Archive className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
//                     {formatFileSize(stats.totalSize)}
//                   </p>
//                   <p className="text-sm text-purple-600 dark:text-purple-300">Storage Used</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200/50 dark:border-orange-700/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-orange-500 rounded-lg">
//                   <Clock className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
//                     {getCurrentFolderFiles().length}
//                   </p>
//                   <p className="text-sm text-orange-600 dark:text-orange-300">Current Folder</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
//               <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
//                 <Folder className="h-5 w-5 text-blue-600" />
//                 Folders
//               </h3>

//               <div className="space-y-2">
//                 {/* All Files */}
//                 <button
//                   onClick={() => setCurrentFolderId(0)}
//                   className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
//                     currentFolderId === 0
//                       ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
//                       : "hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Home className="h-4 w-4" />
//                     <span className="font-medium">All Files</span>
//                   </div>
//                   <Badge variant={currentFolderId === 0 ? "secondary" : "outline"} className="text-xs">
//                     {getFilesInFolder(0).length}
//                   </Badge>
//                 </button>

//                 {/* Folders */}
//                 {folders.map((folder) => (
//                   <div key={folder.id} className="group">
//                     <div className="flex items-center">
//                       <button
//                         onClick={() => setCurrentFolderId(folder.id)}
//                         className={`flex-1 flex items-center justify-between p-3 rounded-xl transition-all ${
//                           folder.id === currentFolderId
//                             ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
//                             : "hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
//                         }`}
//                       >
//                         <div className="flex items-center gap-3">
//                           <Folder className="h-4 w-4" />
//                           <span className="font-medium truncate">{folder.name}</span>
//                         </div>
//                         <Badge variant={folder.id === currentFolderId ? "secondary" : "outline"} className="text-xs">
//                           {folder.file_count}
//                         </Badge>
//                       </button>

//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
//                           >
//                             <MoreVertical className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-48">
//                           <DropdownMenuItem onClick={() => handleEditFolder(folder)}>
//                             <Edit className="h-4 w-4 mr-2" />
//                             Rename Folder
//                           </DropdownMenuItem>
//                           <DropdownMenuItem onClick={() => setCurrentFolderId(folder.id)}>
//                             <Eye className="h-4 w-4 mr-2" />
//                             Open Folder
//                           </DropdownMenuItem>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem
//                             onClick={() => handleDeleteFolder(folder.id, folder.name)}
//                             className="text-red-600 hover:text-red-700"
//                           >
//                             <Trash2 className="h-4 w-4 mr-2" />
//                             Delete Folder
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Main Content Area */}
//           <div className="lg:col-span-3">
//             <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50">
//               {/* Toolbar */}
//               <div className="p-6 border-b border-slate-200 dark:border-slate-700">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//                       <Folder className="h-5 w-5 text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{getCurrentFolderName()}</h2>
//                       <p className="text-sm text-slate-600 dark:text-slate-400">
//                         {getCurrentFolderFiles().length} items
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
//                     >
//                       {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
//                     </Button>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="outline" size="sm">
//                           <SortAsc className="h-4 w-4 mr-1" />
//                           Sort
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent>
//                         <DropdownMenuItem onClick={() => setSortBy("name")}>Sort by Name</DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => setSortBy("date")}>Sort by Date</DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => setSortBy("size")}>Sort by Size</DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <div className="relative flex-1 max-w-md">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                     <Input
//                       placeholder="Search files and folders..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
//                     />
//                   </div>
//                   <Button
//                     onClick={() => setShowUploadModal(true)}
//                     size="sm"
//                     className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
//                   >
//                     <Plus className="h-4 w-4 mr-1" />
//                     Upload
//                   </Button>
//                 </div>
//               </div>

//               {/* Files Grid/List */}
//               <div className="p-6">
//                 {getCurrentFolderFiles().length > 0 ? (
//                   <div
//                     className={
//                       viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-2"
//                     }
//                   >
//                     {getCurrentFolderFiles().map((file) => (
//                       <div
//                         key={file.id}
//                         className={`group ${
//                           viewMode === "grid"
//                             ? "bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
//                             : "flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
//                         }`}
//                       >
//                         <div className={`flex items-center gap-3 ${viewMode === "list" ? "flex-1" : ""}`}>
//                           <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">{getFileIcon(file.name)}</div>
//                           <div className="flex-1 min-w-0">
//                             <h3 className="font-medium text-slate-900 dark:text-white truncate">{file.name}</h3>
//                             <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
//                               <span>{formatFileSize(file.size)}</span>
//                               <span>•</span>
//                               <span>{formatDate(file.created_at)}</span>
//                             </div>
//                           </div>
//                         </div>

//                         <div
//                           className={`flex items-center gap-1 ${viewMode === "grid" ? "opacity-0 group-hover:opacity-100 transition-opacity mt-3" : ""}`}
//                         >
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleDownloadFile(file.name)}
//                             className="h-8 w-8 p-0"
//                           >
//                             <Download className="h-3 w-3" />
//                           </Button>
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
//                                 <MoreVertical className="h-3 w-3" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end" className="w-48">
//                               <DropdownMenuItem onClick={() => handleDownloadFile(file.name)}>
//                                 <Download className="h-4 w-4 mr-2" />
//                                 Download
//                               </DropdownMenuItem>
//                               <DropdownMenuItem onClick={() => handleCopyLink(file.name)}>
//                                 <Copy className="h-4 w-4 mr-2" />
//                                 Copy Link
//                               </DropdownMenuItem>
//                               <DropdownMenuItem>
//                                 <Move className="h-4 w-4 mr-2" />
//                                 Move to Folder
//                               </DropdownMenuItem>
//                               <DropdownMenuItem>
//                                 <Star className="h-4 w-4 mr-2" />
//                                 Add to Favorites
//                               </DropdownMenuItem>
//                               <DropdownMenuSeparator />
//                               <DropdownMenuItem>
//                                 <Info className="h-4 w-4 mr-2" />
//                                 File Details
//                               </DropdownMenuItem>
//                               <DropdownMenuSeparator />
//                               <DropdownMenuItem
//                                 onClick={() => handleDeleteFile(file.id, file.name)}
//                                 className="text-red-600 hover:text-red-700"
//                               >
//                                 <Trash2 className="h-4 w-4 mr-2" />
//                                 Delete File
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-16">
//                     <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
//                       <File className="h-10 w-10 text-slate-400" />
//                     </div>
//                     <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No files found</h3>
//                     <p className="text-slate-600 dark:text-slate-400 mb-6">
//                       {searchTerm
//                         ? "No files match your search criteria."
//                         : "This folder is empty. Upload some files to get started."}
//                     </p>
//                     {!searchTerm && (
//                       <Button
//                         onClick={() => setShowUploadModal(true)}
//                         className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
//                       >
//                         <Upload className="h-4 w-4 mr-2" />
//                         Upload your first file
//                       </Button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Upload Modal */}
//       {showUploadModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-white/20 dark:border-slate-700/50">
//             <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
//               <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
//                 <Upload className="h-5 w-5 text-blue-600" />
//                 Upload Files
//               </h3>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setShowUploadModal(false)}
//                 className="text-slate-400 hover:text-slate-600"
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>

//             <div className="p-6 space-y-4">
//               <div className="text-center">
//                 <Badge variant="outline" className="mb-4">
//                   Uploading to: {getCurrentFolderName()}
//                 </Badge>
//               </div>

//               <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-slate-50 dark:bg-slate-700/50">
//                 <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
//                 <p className="text-slate-600 dark:text-slate-300 mb-2 font-medium">Drag and drop files here</p>
//                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">or click to browse</p>
//                 <input
//                   type="file"
//                   multiple
//                   onChange={(e) => setSelectedFiles(e.target.files)}
//                   className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
//                 />
//                 {selectedFiles && (
//                   <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                     <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
//                       {selectedFiles.length} file(s) selected
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
//               <Button variant="outline" onClick={() => setShowUploadModal(false)} disabled={isLoading}>
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleUpload}
//                 disabled={isLoading || !selectedFiles}
//                 className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
//               >
//                 {isLoading ? "Uploading..." : "Upload Files"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* New Folder Modal */}
//       {showNewFolderModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 dark:border-slate-700/50">
//             <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
//               <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
//                 <FolderPlus className="h-5 w-5 text-blue-600" />
//                 Create New Folder
//               </h3>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setShowNewFolderModal(false)}
//                 className="text-slate-400 hover:text-slate-600"
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>

//             <div className="p-6 space-y-4">
//               <Input
//                 type="text"
//                 value={newFolderName}
//                 onChange={(e) => setNewFolderName(e.target.value)}
//                 placeholder="Enter folder name"
//                 className="w-full"
//                 onKeyPress={(e) => e.key === "Enter" && handleCreateFolder()}
//                 autoFocus
//               />
//             </div>

//             <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
//               <Button variant="outline" onClick={() => setShowNewFolderModal(false)} disabled={isLoading}>
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleCreateFolder}
//                 disabled={isLoading || !newFolderName.trim()}
//                 className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
//               >
//                 {isLoading ? "Creating..." : "Create Folder"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Folder Modal */}
//       {showEditFolderModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 dark:border-slate-700/50">
//             <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
//               <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
//                 <Edit className="h-5 w-5 text-blue-600" />
//                 Rename Folder
//               </h3>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setShowEditFolderModal(false)}
//                 className="text-slate-400 hover:text-slate-600"
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>

//             <div className="p-6 space-y-4">
//               <Input
//                 type="text"
//                 value={editFolderName}
//                 onChange={(e) => setEditFolderName(e.target.value)}
//                 placeholder="Enter folder name"
//                 className="w-full"
//                 onKeyPress={(e) => e.key === "Enter" && handleUpdateFolder()}
//                 autoFocus
//               />
//             </div>

//             <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
//               <Button variant="outline" onClick={() => setShowEditFolderModal(false)} disabled={isLoading}>
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleUpdateFolder}
//                 disabled={isLoading || !editFolderName.trim()}
//                 className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
//               >
//                 {isLoading ? "Updating..." : "Update Folder"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
