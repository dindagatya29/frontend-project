"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function KerjaRemotePage() {
  const [activeTab, setActiveTab] = useState("fitur")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Back to Home Header */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 text-white hover:text-teal-400 transition-colors group">
            <svg
              className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-lg font-medium">Kembali ke Beranda</span>
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Subtle Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 z-10">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-teal-600/10 border border-teal-500/20 rounded-full text-teal-300 text-sm font-medium mb-12 backdrop-blur-sm">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" x2="22" y1="12" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Solusi Kerja Remote
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white">Kerja Remote</span>
            <br />
            <span className="text-teal-400">yang Efektif</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-200 mb-20 max-w-3xl mx-auto leading-relaxed">
            Platform manajemen kerja remote yang revolusioner untuk perusahaan modern. Kelola tim, monitor
            produktivitas, dan tingkatkan kolaborasi dengan teknologi terdepan.
          </p>
        </div>
      </section>

      {/* Interactive Tabs Section */}
      <section className="py-24 bg-slate-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Solusi <span className="text-teal-400">Lengkap</span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Platform enterprise terdepan untuk mengelola karyawan remote dengan efisiensi dan produktivitas maksimal
            </p>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-16 bg-slate-700/50 backdrop-blur-xl rounded-3xl p-3 max-w-3xl mx-auto border border-slate-600/30 shadow-2xl">
            <button
              onClick={() => setActiveTab("fitur")}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === "fitur"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg transform scale-105"
                  : "text-gray-200 hover:text-white hover:bg-slate-600/50"
              }`}
            >
              Fitur Utama
            </button>
            <button
              onClick={() => setActiveTab("monitoring")}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === "monitoring"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg transform scale-105"
                  : "text-gray-200 hover:text-white hover:bg-slate-600/50"
              }`}
            >
              Monitoring
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === "security"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg transform scale-105"
                  : "text-gray-200 hover:text-white hover:bg-slate-600/50"
              }`}
            >
              Keamanan
            </button>
          </div>

          {/* Enhanced Tab Content */}
          <div className="transition-all duration-500">
            {activeTab === "fitur" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors">
                    Time Tracking Otomatis
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Lacak waktu kerja karyawan secara otomatis dengan activity monitoring dan laporan produktivitas
                    real-time untuk evaluasi performa yang akurat.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                    Manajemen Tugas
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Assign dan monitor tugas karyawan remote dengan deadline tracking, progress update, dan sistem
                    approval yang terintegrasi sempurna.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                    Komunikasi Internal
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Chat internal perusahaan dengan channel departemen, direct message, dan file sharing untuk
                    komunikasi yang efektif dan terorganisir.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors">
                    Dashboard Analytics
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Monitor produktivitas tim dengan metrics detail, trend analysis, dan insights mendalam untuk
                    optimasi workflow perusahaan.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-300 transition-colors">
                    Document Management
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Kelola dokumen perusahaan dengan version control, access permission, dan collaborative editing untuk
                    tim remote yang efisien.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-teal-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors">
                    Flexible Scheduling
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Atur jadwal kerja fleksibel dengan timezone support, shift management, dan attendance tracking untuk
                    karyawan global.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "monitoring" && (
              <div className="grid md:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <h3 className="text-4xl font-bold text-white mb-8">
                    Sistem Monitoring <span className="text-teal-400">Komprehensif</span>
                  </h3>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                        Activity Monitoring
                      </h4>
                      <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                        Monitor aktivitas karyawan dengan screenshot berkala dan aplikasi usage tracking untuk
                        memastikan produktivitas optimal dan transparansi kerja.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                        Performance Analytics
                      </h4>
                      <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                        Analisis performa karyawan dengan metrics KPI, goal tracking, dan performance review otomatis
                        untuk evaluasi yang objektif dan berkelanjutan.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                        Real-time Reporting
                      </h4>
                      <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                        Laporan real-time tentang status proyek, attendance, dan produktivitas tim untuk decision making
                        yang cepat dan tepat sasaran.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-10 rounded-3xl shadow-2xl">
                  <h3 className="text-2xl font-bold text-white mb-8">
                    Implementasi dalam <span className="text-teal-400">3 Tahap</span>
                  </h3>
                  <div className="space-y-8">
                    <div className="flex items-start gap-6 group">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        1
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                          Setup Infrastructure
                        </h4>
                        <p className="text-gray-200 text-sm leading-relaxed group-hover:text-gray-100 transition-colors">
                          Install sistem di server perusahaan dan konfigurasi database untuk semua karyawan dengan
                          standar keamanan enterprise.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6 group">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        2
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                          Training & Onboarding
                        </h4>
                        <p className="text-gray-200 text-sm leading-relaxed group-hover:text-gray-100 transition-colors">
                          Pelatihan komprehensif untuk manager dan karyawan tentang penggunaan sistem monitoring dan
                          best practices.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6 group">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        3
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                          Go Live & Support
                        </h4>
                        <p className="text-gray-200 text-sm leading-relaxed group-hover:text-gray-100 transition-colors">
                          Sistem aktif dengan full support 24/7 dan maintenance berkelanjutan untuk operasional yang
                          stabil.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-300 transition-colors">
                    Data Encryption
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Semua data perusahaan dienkripsi dengan standar AES-256 untuk melindungi informasi sensitif dari
                    akses tidak sah dan cyber threats.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-yellow-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors">
                    VPN Integration
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Akses aman ke sistem perusahaan melalui VPN terintegrasi dengan authentication berlapis untuk
                    karyawan remote di seluruh dunia.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-300 transition-colors">
                    Role-Based Access
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Kontrol akses berdasarkan jabatan dan departemen dengan permission management yang granular untuk
                    setiap fitur dan data sensitif.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    Audit Trail
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Log lengkap semua aktivitas sistem untuk compliance dan monitoring keamanan dengan retention policy
                    yang dapat dikustomisasi sesuai regulasi.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                    Backup & Recovery
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Sistem backup otomatis dengan disaster recovery plan untuk memastikan kontinuitas bisnis dan data
                    integrity dalam segala kondisi.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-teal-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors">
                    Compliance Ready
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Memenuhi standar keamanan enterprise dan regulasi industri untuk audit compliance yang mudah dan
                    dokumentasi yang lengkap.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Fitur Unggulan</h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola tim remote dengan efisien
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Time Tracking */}
            <div className="bg-slate-700/40 backdrop-blur-sm border border-slate-600/30 p-8 rounded-2xl hover:border-blue-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Time Tracking</h3>
              <p className="text-gray-200 leading-relaxed">
                Lacak waktu kerja karyawan secara otomatis dengan activity monitoring dan laporan produktivitas
                real-time.
              </p>
            </div>

            {/* Task Management */}
            <div className="bg-slate-700/40 backdrop-blur-sm border border-slate-600/30 p-8 rounded-2xl hover:border-green-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Manajemen Tugas</h3>
              <p className="text-gray-200 leading-relaxed">
                Assign dan monitor tugas karyawan remote dengan deadline tracking dan progress update yang terintegrasi.
              </p>
            </div>

            {/* Team Communication */}
            <div className="bg-slate-700/40 backdrop-blur-sm border border-slate-600/30 p-8 rounded-2xl hover:border-purple-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Komunikasi Tim</h3>
              <p className="text-gray-200 leading-relaxed">
                Chat internal perusahaan dengan channel departemen, direct message, dan file sharing yang efektif.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Activity Monitoring */}
            <div className="bg-slate-700/40 backdrop-blur-sm border border-slate-600/30 p-8 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Activity Monitoring</h3>
              <p className="text-gray-200 leading-relaxed">
                Monitor aktivitas karyawan dengan screenshot berkala dan aplikasi usage tracking untuk transparansi
                kerja.
              </p>
            </div>

            {/* Analytics Dashboard */}
            <div className="bg-slate-700/40 backdrop-blur-sm border border-slate-600/30 p-8 rounded-2xl hover:border-orange-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Dashboard Analytics</h3>
              <p className="text-gray-200 leading-relaxed">
                Monitor produktivitas tim dengan metrics detail, trend analysis, dan insights untuk optimasi workflow.
              </p>
            </div>

            {/* Security & Access */}
            <div className="bg-slate-700/40 backdrop-blur-sm border border-slate-600/30 p-8 rounded-2xl hover:border-red-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Keamanan Enterprise</h3>
              <p className="text-gray-200 leading-relaxed">
                Data encryption, VPN integration, dan role-based access control untuk keamanan tingkat enterprise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center text-white mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Mengapa Perusahaan Memilih <span className="text-cyan-200">Platform Ini?</span>
            </h2>
            <p className="text-2xl text-teal-100 max-w-4xl mx-auto leading-relaxed">
              Tingkatkan efisiensi operasional dan produktivitas karyawan remote dengan solusi terpercaya
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center text-white group">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-2xl">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-6 group-hover:text-cyan-200 transition-colors">
                Produktivitas Meningkat 35%
              </h3>
              <p className="text-xl text-teal-100 leading-relaxed group-hover:text-white transition-colors">
                Sistem monitoring dan manajemen tugas yang efektif terbukti meningkatkan produktivitas karyawan remote
                hingga 35% dalam 3 bulan pertama implementasi.
              </p>
            </div>

            <div className="text-center text-white group">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-2xl">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-6 group-hover:text-cyan-200 transition-colors">
                Implementasi 2-3 Minggu
              </h3>
              <p className="text-xl text-teal-100 leading-relaxed group-hover:text-white transition-colors">
                Setup sistem yang cepat dan efisien dalam 2-3 minggu dengan training lengkap dan support berkelanjutan
                dari tim expert berpengalaman.
              </p>
            </div>

            <div className="text-center text-white group">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-2xl">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-6 group-hover:text-cyan-200 transition-colors">
                Uptime 99.9% Guaranteed
              </h3>
              <p className="text-xl text-teal-100 leading-relaxed group-hover:text-white transition-colors">
                Infrastruktur keamanan tingkat enterprise dengan uptime 99.9% dan support 24/7 untuk operasional yang
                stabil dan dapat diandalkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
        {/* Subtle Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/3 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Siap Mengoptimalkan <span className="text-teal-400">Tim Remote</span> Perusahaan?
          </h2>
          <p className="text-2xl text-gray-200 mb-12 leading-relaxed max-w-4xl mx-auto">
            Konsultasi dengan tim ahli kami untuk implementasi sistem yang sesuai dengan kebutuhan dan skala perusahaan
            Anda
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-8">
            <Link href="/register">
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Mulai Sekarang
              </Button>
            </Link>
            <Link href="/bantuan">
              <Button
                variant="outline"
                className="border border-slate-500 hover:border-teal-400 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 hover:bg-slate-700/50 bg-transparent"
              >
                Konsultasi Gratis
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-gray-300">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Konsultasi gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Custom implementation</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Full support 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-950 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="flex items-center space-x-8 mb-6 md:mb-0">
              <Link href="/about" className="text-gray-300 hover:text-teal-400 transition-colors text-lg">
                Tentang
              </Link>
              <Link href="/bantuan" className="text-gray-300 hover:text-teal-400 transition-colors text-lg">
                Bantuan
              </Link>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-gray-400">
            <p className="text-lg">
              &copy; 2024 Platform Kerja Remote. Semua hak dilindungi. Platform kerja remote terdepan untuk perusahaan
              modern.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
