"use client"

import { useEffect, useState } from "react"
import { UserIcon } from "@heroicons/react/24/solid"

export default function ProfilePage() {
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const userStr = localStorage.getItem("nexapro_user")
    if (userStr) {
      const user = JSON.parse(userStr)
      setUserName(user.name || "")
      setUserEmail(user.email || "")
    }
  }, [])

  const handleSave = async () => {
    const formData = new FormData()
    formData.append("name", userName)
    formData.append("email", userEmail)

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("nexapro_token")}`,
        },
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        alert("Profil berhasil diperbarui!")
        localStorage.setItem("nexapro_user", JSON.stringify(data.user))
      } else {
        alert("Gagal memperbarui profil.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Terjadi kesalahan saat menyimpan.")
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">👤 Profil Saya</h1>

      <div className="flex items-center justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center shadow-md">
          <UserIcon className="w-12 h-12 text-teal-600" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Lengkap
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Masukkan nama kamu"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Masukkan email kamu"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition duration-200"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  )
}
