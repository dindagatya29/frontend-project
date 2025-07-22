"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"

export default function SolusiDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleItemClick = () => {
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center text-white hover:text-[#00d2c6] transition"
      >
        Solusi
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
          className="ml-1 h-4 w-4"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[650px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 z-50">
          <div className="grid grid-cols-2 gap-6 p-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Project Management */}
              <Link href="/solusi/manajemen-proyek" onClick={handleItemClick}>
                <div className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
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
                        className="text-white"
                      >
                        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-700">Manajemen Proyek</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Kelola proyek dengan timeline yang jelas, milestone tracking, dan resource allocation yang optimal.
                  </p>
                </div>
              </Link>

              {/* Team Collaboration */}
              <Link href="/solusi/kolaborasi-tim" onClick={handleItemClick}>
                <div className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
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
                        className="text-white"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-green-700">Kolaborasi Tim</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Real-time collaboration dengan chat terintegrasi, file sharing, dan video conference untuk tim
                    remote.
                  </p>
                </div>
              </Link>

              {/* Work Analysis Graphics */}
              <Link href="/solusi/analisa-kerja" onClick={handleItemClick}>
                <div className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
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
                        className="text-white"
                      >
                        <line x1="18" x2="18" y1="20" y2="10" />
                        <line x1="12" x2="12" y1="20" y2="4" />
                        <line x1="6" x2="6" y1="20" y2="14" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-purple-700">
                      Grafik Analisa Kerja
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Dashboard analytics dengan visualisasi data yang interaktif untuk monitoring performa tim dan
                    proyek.
                  </p>
                </div>
              </Link>

              {/* Offline Mode */}
              <Link href="/solusi/mode-offline" onClick={handleItemClick}>
                <div className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
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
                        className="text-white"
                      >
                        <path d="M18.364 5.636a9 9 0 0 1 0 12.728" />
                        <path d="M13.414 10.586a4 4 0 0 1 0 2.828" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-orange-700">Mode Offline</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Bekerja tanpa koneksi internet dengan sinkronisasi otomatis saat online kembali.
                  </p>
                </div>
              </Link>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Agile Development */}
              <Link href="/solusi/pengembangan-agile" onClick={handleItemClick}>
                <div className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
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
                        className="text-white"
                      >
                        <path d="M12 2v4" />
                        <path d="M12 18v4" />
                        <path d="M4.93 4.93l2.83 2.83" />
                        <path d="M16.24 16.24l2.83 2.83" />
                        <path d="M2 12h4" />
                        <path d="M18 12h4" />
                        <path d="M4.93 19.07l2.83-2.83" />
                        <path d="M16.24 7.76l2.83-2.83" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-teal-700">
                      Pengembangan Agile
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Metodologi Scrum dan Kanban dengan sprint planning, daily standup, dan retrospective meetings.
                  </p>
                </div>
              </Link>

              {/* Remote Work */}
              <Link href="/solusi/kerja-remote" onClick={handleItemClick}>
                <div className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
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
                        className="text-white"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" x2="22" y1="12" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-indigo-700">Kerja Remote</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Tools lengkap untuk remote work dengan time tracking, virtual office, dan productivity monitoring.
                  </p>
                </div>
              </Link>

              {/* WhatsApp Notifications */}
              <Link href="/solusi/notifikasi-whatsapp" onClick={handleItemClick}>
                <div className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
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
                        className="text-white"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-emerald-700">
                      Notifikasi WhatsApp
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Integrasi WhatsApp untuk notifikasi real-time, update status proyek, dan komunikasi tim yang
                    efektif.
                  </p>
                </div>
              </Link>

              {/* Role-Based Access */}
              <Link href="/solusi/hak-akses-peran" onClick={handleItemClick}>
                <div className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
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
                        className="text-white"
                      >
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-red-700">
                      Hak Akses Berbasis Peran
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Sistem keamanan berlapis dengan role management, permission control, dan audit trail lengkap.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
