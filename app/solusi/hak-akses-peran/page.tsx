"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Users, Key, Eye, Lock, UserCheck, Settings, FileText } from "lucide-react"

export default function HakAksesPenanPage() {
  const [activeTab, setActiveTab] = useState("overview")

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
            <Shield className="w-5 h-5 mr-3" />
            Sistem Hak Akses & Peran
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white">Kelola Hak Akses</span>
            <br />
            <span className="text-teal-400">dengan Presisi</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-200 mb-20 max-w-3xl mx-auto leading-relaxed">
            Sistem manajemen hak akses dan peran yang komprehensif untuk mengontrol akses data, fitur, dan operasional
            perusahaan dengan keamanan tingkat enterprise dan fleksibilitas maksimal.
          </p>
        </div>
      </section>

      {/* Interactive Tabs Section */}
      <section className="py-24 bg-slate-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Kontrol Akses <span className="text-teal-400">Menyeluruh</span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Platform manajemen hak akses terdepan dengan kontrol granular untuk setiap aspek sistem perusahaan
            </p>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-16 bg-slate-700/50 backdrop-blur-xl rounded-3xl p-3 max-w-4xl mx-auto border border-slate-600/30 shadow-2xl">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg transform scale-105"
                  : "text-gray-200 hover:text-white hover:bg-slate-600/50"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("roles")}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === "roles"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg transform scale-105"
                  : "text-gray-200 hover:text-white hover:bg-slate-600/50"
              }`}
            >
              Manajemen Peran
            </button>
            <button
              onClick={() => setActiveTab("permissions")}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === "permissions"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg transform scale-105"
                  : "text-gray-200 hover:text-white hover:bg-slate-600/50"
              }`}
            >
              Kontrol Izin
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
            {activeTab === "overview" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    Hierarki Organisasi
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Buat struktur organisasi yang kompleks dengan hierarki departemen, divisi, dan tim yang dapat
                    dikustomisasi sesuai kebutuhan perusahaan.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-teal-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Key className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors">
                    Kontrol Akses Granular
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Atur hak akses hingga level field dan fungsi spesifik dengan kontrol yang sangat detail untuk setiap
                    pengguna dan peran dalam sistem.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                    Monitoring Real-time
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Pantau aktivitas pengguna secara real-time dengan log akses, tracking perubahan, dan alert otomatis
                    untuk aktivitas mencurigakan.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors">
                    Kustomisasi Fleksibel
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Sesuaikan sistem peran dan hak akses dengan workflow unik perusahaan Anda menggunakan rule engine
                    yang powerful dan intuitif.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-300 transition-colors">
                    Multi-Factor Authentication
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Keamanan berlapis dengan MFA, biometric authentication, dan single sign-on (SSO) untuk proteksi
                    maksimal terhadap akses tidak sah.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-teal-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors">
                    Compliance & Audit
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Memenuhi standar compliance dengan audit trail lengkap, reporting otomatis, dan dokumentasi yang
                    sesuai regulasi industri.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "roles" && (
              <div className="grid md:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <h3 className="text-4xl font-bold text-white mb-8">
                    Manajemen Peran <span className="text-teal-400">Terpusat</span>
                  </h3>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <UserCheck className="w-7 h-7 text-teal-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                        Template Peran Standar
                      </h4>
                      <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                        Gunakan template peran yang sudah terdefinisi seperti Admin, Manager, Staff, atau Guest dengan
                        hak akses yang sudah dikonfigurasi sesuai best practices.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Settings className="w-7 h-7 text-teal-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                        Custom Role Builder
                      </h4>
                      <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                        Buat peran kustom dengan kombinasi hak akses yang spesifik sesuai kebutuhan departemen atau
                        proyek tertentu dalam organisasi.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-7 h-7 text-teal-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                        Inheritance & Delegation
                      </h4>
                      <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                        Sistem pewarisan hak akses otomatis dan delegasi sementara untuk situasi khusus seperti cuti
                        atau perpindahan tugas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-10 rounded-3xl shadow-2xl">
                  <h3 className="text-2xl font-bold text-white mb-8">
                    Struktur Peran <span className="text-teal-400">Hierarkis</span>
                  </h3>
                  <div className="space-y-8">
                    <div className="flex items-start gap-6 group">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        1
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
                          Super Admin
                        </h4>
                        <p className="text-gray-200 text-sm leading-relaxed group-hover:text-gray-100 transition-colors">
                          Akses penuh ke semua sistem, konfigurasi global, dan manajemen pengguna tingkat tertinggi
                          dengan kontrol audit trail.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6 group">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        2
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                          Department Manager
                        </h4>
                        <p className="text-gray-200 text-sm leading-relaxed group-hover:text-gray-100 transition-colors">
                          Kontrol penuh atas departemen tertentu, manajemen tim, approval workflow, dan akses ke data
                          departmental.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6 group">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        3
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                          Team Lead
                        </h4>
                        <p className="text-gray-200 text-sm leading-relaxed group-hover:text-gray-100 transition-colors">
                          Koordinasi tim, assignment tugas, monitoring progress, dan akses ke tools kolaborasi dengan
                          scope terbatas.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6 group">
                      <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        4
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                          Staff Member
                        </h4>
                        <p className="text-gray-200 text-sm leading-relaxed group-hover:text-gray-100 transition-colors">
                          Akses operasional harian, input data, view reports yang relevan, dan kolaborasi dalam tim
                          dengan batasan tertentu.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "permissions" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    View Permissions
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Kontrol akses view untuk setiap modul, dashboard, report, dan data dengan granularitas hingga level
                    field individual.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-300 transition-colors">
                    Edit Permissions
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Atur hak edit, update, dan modifikasi data dengan approval workflow dan version control terintegrasi
                    untuk audit trail.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-300 transition-colors">
                    Delete Permissions
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Kontrol ketat untuk operasi delete dengan multi-level approval, soft delete, dan recovery mechanism
                    untuk data protection.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                    Export Permissions
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Kontrol ekspor data dengan format restrictions, watermarking, dan tracking untuk compliance dan data
                    security.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-yellow-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors">
                    Share Permissions
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Atur sharing internal dan eksternal dengan time-based access, link expiration, dan recipient
                    tracking untuk kolaborasi aman.
                  </p>
                </div>

                <div className="group bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-8 rounded-3xl hover:border-teal-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Key className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors">
                    Admin Permissions
                  </h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                    Hak akses administratif untuk konfigurasi sistem, user management, dan system maintenance dengan
                    segregation of duties.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="grid md:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <h3 className="text-4xl font-bold text-white mb-8">
                    Keamanan <span className="text-teal-400">Enterprise</span>
                  </h3>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-7 h-7 text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-3 group-hover:text-red-300 transition-colors">
                        Zero Trust Architecture
                      </h4>
                      <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                        Implementasi zero trust dengan verifikasi berkelanjutan, least privilege access, dan
                        micro-segmentation untuk proteksi maksimal.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Lock className="w-7 h-7 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                        Advanced Authentication
                      </h4>
                      <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                        Multi-factor authentication dengan biometric, hardware tokens, dan adaptive authentication
                        berdasarkan risk assessment real-time.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-teal-500/20 border border-teal-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Eye className="w-7 h-7 text-teal-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                        Behavioral Analytics
                      </h4>
                      <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                        AI-powered behavioral analysis untuk deteksi anomali, insider threats, dan automated response
                        terhadap aktivitas mencurigakan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 p-10 rounded-3xl shadow-2xl">
                  <h3 className="text-2xl font-bold text-white mb-8">
                    Compliance <span className="text-teal-400">Standards</span>
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-slate-600/30 rounded-xl border border-slate-500/20">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">ISO 27001</h4>
                        <p className="text-gray-300 text-sm">Information Security Management</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-slate-600/30 rounded-xl border border-slate-500/20">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">GDPR</h4>
                        <p className="text-gray-300 text-sm">General Data Protection Regulation</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-slate-600/30 rounded-xl border border-slate-500/20">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">SOC 2</h4>
                        <p className="text-gray-300 text-sm">Service Organization Control</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-slate-600/30 rounded-xl border border-slate-500/20">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">HIPAA</h4>
                        <p className="text-gray-300 text-sm">Health Insurance Portability</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
              Mengapa Memilih <span className="text-cyan-200">Sistem Kami?</span>
            </h2>
            <p className="text-2xl text-teal-100 max-w-4xl mx-auto leading-relaxed">
              Solusi hak akses dan peran yang terpercaya untuk keamanan dan efisiensi operasional perusahaan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center text-white group">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-2xl">
                <Shield className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold mb-6 group-hover:text-cyan-200 transition-colors">Keamanan 99.9%</h3>
              <p className="text-xl text-teal-100 leading-relaxed group-hover:text-white transition-colors">
                Sistem keamanan berlapis dengan enkripsi end-to-end, zero trust architecture, dan monitoring real-time
                untuk proteksi data maksimal.
              </p>
            </div>

            <div className="text-center text-white group">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-2xl">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold mb-6 group-hover:text-cyan-200 transition-colors">
                Skalabilitas Unlimited
              </h3>
              <p className="text-xl text-teal-100 leading-relaxed group-hover:text-white transition-colors">
                Mendukung organisasi dari 10 hingga 100,000+ pengguna dengan performa konsisten dan management yang
                mudah di semua skala.
              </p>
            </div>

            <div className="text-center text-white group">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-2xl">
                <Settings className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold mb-6 group-hover:text-cyan-200 transition-colors">Setup 1 Minggu</h3>
              <p className="text-xl text-teal-100 leading-relaxed group-hover:text-white transition-colors">
                Implementasi cepat dengan migration tools otomatis, training komprehensif, dan support 24/7 untuk
                transisi yang mulus.
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
            Siap Mengamankan <span className="text-teal-400">Akses Perusahaan</span>?
          </h2>
          <p className="text-2xl text-gray-200 mb-12 leading-relaxed max-w-4xl mx-auto">
            Konsultasi dengan security expert kami untuk implementasi sistem hak akses yang sesuai dengan kebutuhan dan
            compliance perusahaan Anda
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-8">
            <Link href="/demo">
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Request Demo
              </Button>
            </Link>
            <Link href="/bantuan">
              <Button
                variant="outline"
                className="border border-slate-500 hover:border-teal-400 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 hover:bg-slate-700/50 bg-transparent"
              >
                Konsultasi Security
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-gray-300">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Security Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Custom Implementation</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>24/7 Security Support</span>
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
              <Link href="/security" className="text-gray-300 hover:text-teal-400 transition-colors text-lg">
                Security
              </Link>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-gray-400">
            <p className="text-lg">
              &copy; 2024 NexaPro Security Solutions. Semua hak dilindungi. Sistem hak akses dan peran terdepan untuk
              keamanan enterprise.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
