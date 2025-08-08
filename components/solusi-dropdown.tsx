"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, LayoutDashboard, Users, BarChart2, WifiOff, GitPullRequest, Globe, MessageSquare, Lock } from 'lucide-react'

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
        onMouseEnter={() => setIsOpen(true)} // Open on hover for desktop
        className="flex items-center space-x-1 text-gray-300 hover:text-[#00d2c6] transition-colors duration-200 py-2 lg:py-0"
      >
        <span>Solusi</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)} // Close on mouse leave for desktop
          className="absolute left-0 lg:left-1/2 lg:transform lg:-translate-x-1/2 mt-2 w-full lg:w-[650px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6">
            {/* Left Column */}
            <div className="space-y-4 md:space-y-6">
              {/* Project Management */}
              <Link href="/solusi/manajemen-proyek" onClick={handleItemClick}>
                <div className="group p-3 md:p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-1 md:mb-2">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <LayoutDashboard className="text-white w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="font-semibold text-base md:text-lg text-gray-800 group-hover:text-blue-700">Manajemen Proyek</h3>
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed pl-12">
                    Kelola proyek dengan timeline yang jelas, milestone tracking, dan resource allocation yang optimal.
                  </p>
                </div>
              </Link>
              {/* Team Collaboration */}
              <Link href="/solusi/kolaborasi-tim" onClick={handleItemClick}>
                <div className="group p-3 md:p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-1 md:mb-2">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="text-white w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="font-semibold text-base md:text-lg text-gray-800 group-hover:text-green-700">Kolaborasi Tim</h3>
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed pl-12">
                    Real-time collaboration dengan chat terintegrasi, file sharing, dan video conference untuk tim remote.
                  </p>
                </div>
              </Link>
              {/* Work Analysis Graphics */}
              <Link href="/solusi/analisa-kerja" onClick={handleItemClick}>
                <div className="group p-3 md:p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-1 md:mb-2">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart2 className="text-white w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="font-semibold text-base md:text-lg text-gray-800 group-hover:text-purple-700">
                      Grafik Analisa Kerja
                    </h3>
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed pl-12">
                    Dashboard analytics dengan visualisasi data yang interaktif untuk monitoring performa tim dan proyek.
                  </p>
                </div>
              </Link>
              {/* Offline Mode */}
              <Link href="/solusi/mode-offline" onClick={handleItemClick}>
                <div className="group p-3 md:p-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-1 md:mb-2">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <WifiOff className="text-white w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="font-semibold text-base md:text-lg text-gray-800 group-hover:text-orange-700">Mode Offline</h3>
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed pl-12">
                    Bekerja tanpa koneksi internet dengan sinkronisasi otomatis saat online kembali.
                  </p>
                </div>
              </Link>
            </div>
            {/* Right Column */}
            <div className="space-y-4 md:space-y-6">
              {/* Agile Development */}
              <Link href="/solusi/pengembangan-agile" onClick={handleItemClick}>
                <div className="group p-3 md:p-4 rounded-xl hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-1 md:mb-2">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GitPullRequest className="text-white w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="font-semibold text-base md:text-lg text-gray-800 group-hover:text-teal-700">
                      Pengembangan Agile
                    </h3>
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed pl-12">
                    Metodologi Scrum dan Kanban dengan sprint planning, daily standup, dan retrospective meetings.
                  </p>
                </div>
              </Link>
              {/* Remote Work */}
              <Link href="/solusi/kerja-remote" onClick={handleItemClick}>
                <div className="group p-3 md:p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-1 md:mb-2">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="text-white w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="font-semibold text-base md:text-lg text-gray-800 group-hover:text-indigo-700">Kerja Remote</h3>
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed pl-12">
                    Tools lengkap untuk remote work dengan time tracking, virtual office, dan productivity monitoring.
                  </p>
                </div>
              </Link>
              {/* WhatsApp Notifications */}
              <Link href="/solusi/notifikasi-whatsapp" onClick={handleItemClick}>
                <div className="group p-3 md:p-4 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-1 md:mb-2">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="text-white w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="font-semibold text-base md:text-lg text-gray-800 group-hover:text-emerald-700">
                      Notifikasi WhatsApp
                    </h3>
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed pl-12">
                    Integrasi WhatsApp untuk notifikasi real-time, update status proyek, dan komunikasi tim yang efektif.
                  </p>
                </div>
              </Link>
              {/* Role-Based Access */}
              <Link href="/solusi/hak-akses-peran" onClick={handleItemClick}>
                <div className="group p-3 md:p-4 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 mb-1 md:mb-2">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lock className="text-white w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="font-semibold text-base md:text-lg text-gray-800 group-hover:text-red-700">
                      Hak Akses Berbasis Peran
                    </h3>
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed pl-12">
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
