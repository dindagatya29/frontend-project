"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import SolusiDropdown from "@/components/solusi-dropdown"
import Footer from "@/components/footer" // Import the new Footer component
import { ArrowRight, CheckCircle, Users, Zap, Shield, Menu, X, BarChart2, Clock, ClipboardList } from "lucide-react"

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    if (isDropdownOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
    } else {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
    }

    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
    }
  }, [isDropdownOpen])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f1a25] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#00d2c6]/20 via-transparent to-transparent blur-3xl"></div>

      <header className="fixed top-0 left-0 z-50 w-full bg-transparent backdrop-blur-sm">
        <nav className="flex items-center justify-between backdrop-blur-sm bg-white/5 px-4 sm:px-6 py-3 sm:py-4 border border-white/10">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="h-10 w-10 sm:h-12 sm:w-12 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center">
                  <span className="text-lg sm:text-xl font-bold text-white">N</span>
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-bold">
                <span className="text-white">Nexa</span>
                <span className="text-[#00d2c6]">Pro</span>
              </span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center space-x-8">
            <SolusiDropdown onOpenChange={setIsDropdownOpen} />
            <Link href="/bantuan" className="text-gray-300 hover:text-[#00d2c6] transition-colors duration-200">
              Bantuan
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-[#00d2c6] transition-colors duration-200">
              Tentang
            </Link>
          </div>
          <div className="hidden sm:flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white transition-colors duration-200 px-3 sm:px-4 py-2"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] hover:from-[#00b5ab] hover:to-[#009688] text-white rounded-xl px-4 sm:px-6 py-2 sm:py-3 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Daftar
            </Link>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 text-white hover:text-[#00d2c6] transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-4 backdrop-blur-sm bg-white/10 rounded-2xl border border-white/10 p-4">
            <div className="flex flex-col space-y-4">
              <div className="lg:hidden">
                <SolusiDropdown onOpenChange={setIsDropdownOpen} />
              </div>
              <Link
                href="/bantuan"
                className="text-gray-300 hover:text-[#00d2c6] transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bantuan
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-[#00d2c6] transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tentang
              </Link>
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] hover:from-[#00b5ab] hover:to-[#009688] text-white rounded-xl px-6 py-3 font-medium transition-all duration-300 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Daftar
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      <br></br>
      <main className="relative z-10 container mx-auto px-4 pt-12 sm:pt-20 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#00d2c6]/20 to-[#00b5ab]/20 rounded-full px-4 sm:px-6 py-2 border border-[#00d2c6]/30 mb-4 sm:mb-6">
              <Zap className="h-4 w-4 text-[#00d2c6]" />
              <span className="text-xs sm:text-sm text-gray-300">Platform Manajemen Proyek Perusahaan</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6 px-2">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Kelola Proyek
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00d2c6] via-[#00b5ab] to-[#009688] bg-clip-text text-transparent">
                Dengan Efisien
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10 px-4">
              NexaPro adalah platform manajemen proyek internal yang membantu tim perusahaan mengelola tugas, memantau
              progres, dan berkolaborasi dengan efisiensi maksimal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-10 px-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] hover:from-[#00b5ab] hover:to-[#009688] text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-base sm:text-lg"
              >
                <span>Mulai Bekerja</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm text-gray-400 px-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-[#00d2c6]" />
                <span>Akses 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-[#00d2c6]" />
                <span>Data Aman</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-[#00d2c6]" />
                <span>Tim Terintegrasi</span>
              </div>
            </div>
          </div>
          <div className="relative px-2 sm:px-4 md:px-0">
            <div className="absolute inset-0 from-[#0f172a] via-transparent to-transparent z-10"></div>
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00d2c6]/20 to-[#00b5ab]/20 blur-3xl rounded-3xl"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-1 sm:p-2 border border-white/20">
                <Image
                  src="/gambarlanding.jpg"
                  alt="NexaPro Dashboard Preview"
                  width={1000}
                  height={500}
                  className="rounded-xl sm:rounded-2xl w-full h-auto mx-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Mengapa Memilih NexaPro?
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Platform yang dirancang khusus untuk tim perusahaan dengan fitur-fitur canggih
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-[#00d2c6]/50 transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Kolaborasi Tim</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Bekerja bersama tim dengan real-time collaboration, chat terintegrasi, dan file sharing yang aman.
              </p>
            </div>
            <div className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-[#00d2c6]/50 transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Manajemen Proyek</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Buat, atur, dan pantau proyek secara menyeluruh dengan fitur pelacakan progres dan penjadwalan dinamis.
              </p>
            </div>
            <div className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-[#00d2c6]/50 transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Pelacakan Waktu</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Catat durasi kerja harian dengan sistem time tracker yang otomatis terintegrasi ke dalam laporan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Cara Menggunakan NexaPro
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Panduan langkah demi langkah untuk memulai menggunakan platform manajemen proyek
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-[#00d2c6]/50 transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Login & Dashboard</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Masuk ke akun Anda dan akses dashboard utama untuk melihat ringkasan proyek dan tugas terbaru.
              </p>
            </div>
            <div className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-[#00d2c6]/50 transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Buat Proyek Baru</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Klik "New Project" untuk membuat proyek baru, atur detail, deadline, dan assign anggota tim.
              </p>
            </div>
            <div className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-[#00d2c6]/50 transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Kelola Tugas</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Tambahkan tugas, set prioritas, track progress, dan update status secara real-time.
              </p>
            </div>
            <div className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-[#00d2c6]/50 transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">4</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Monitor & Laporan</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Pantau progress melalui calendar, lihat laporan detail, dan export data untuk analisis.
              </p>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center px-2">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Menu Utama & Fitur
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-start space-x-3">
                <BarChart2 className="h-5 w-5 text-[#00d2c6] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">Dashboard</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Overview proyek, statistik, dan aktivitas terbaru</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ClipboardList className="h-5 w-5 text-[#00d2c6] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">Projects</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Kelola semua proyek, buat baru, edit status</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-[#00d2c6] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">Calendar</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Jadwal proyek, deadline, dan event penting</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-[#00d2c6] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">Team</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Manajemen anggota tim dan kolaborasi</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BarChart2 className="h-5 w-5 text-[#00d2c6] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">Reports</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Laporan progress, analisis, dan export data</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-[#00d2c6] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">Settings</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Pengaturan akun, notifikasi, dan preferensi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-2">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Siap Meningkatkan Produktivitas Tim?
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Bergabung dengan tim perusahaan yang sudah merasakan efisiensi maksimal dengan NexaPro
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] hover:from-[#00b5ab] hover:to-[#009688] text-white py-4 px-6 sm:px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-base sm:text-lg"
              >
                <span>Akses Dashboard</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto border border-white/30 hover:border-[#00d2c6] text-white py-4 px-6 sm:px-8 rounded-xl font-semibold transition-all duration-300 hover:bg-white/5 text-base sm:text-lg"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
