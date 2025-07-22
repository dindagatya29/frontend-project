"use client"


import FileManagement from "@/components/file-management"
import DocumentsNavbar from "@/components/documents-navbar"

export default function DocumentsPage() {
  return (
    <div>
      <DocumentsNavbar />
      <FileManagement />
    </div>
  )
}
