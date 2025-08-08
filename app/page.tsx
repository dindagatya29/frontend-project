"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SolusiDropdown from "@/components/solusi-dropdown";
import Footer from "@/components/footer"; // Import the new Footer component
import { ArrowRight, CheckCircle, Users, Zap, Shield, Menu, X, BarChart2, Clock, ClipboardList } from 'lucide-react';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f1a25] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#00d2c6]/20 via-transparent to-transparent blur-3xl"></div>

      {/* Navigation - Higher z-index */}
      <header className="fixed top-0 left-0 z-50 w-full bg-transparent backdrop-blur-sm">
        <nav className="flex items-center justify-between backdrop-blur-sm bg-white/5 px-4 sm:px-6 py-3 sm:py-4 border border-white/10">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 sm:space-x-3 group"
            >
              <div className="h-10 w-10 sm:h-12 sm:w-12 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center">
                  <span className="text-lg sm:text-xl font-bold text-white">
                    N
                  </span>
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-bold">
                <span className="text-white">Nexa</span>
                <span className="text-[#00d2c6]">Pro</span>
              </span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <SolusiDropdown />
            <Link
              href="/bantuan"
              className="text-gray-300 hover:text-[#00d2c6] transition-colors duration-200"
            >
              Bantuan
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-[#00d2c6] transition-colors duration-200"
            >
              Tentang
            </Link>
          </div>
          {/* Desktop Auth Buttons */}
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
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 text-white hover:text-[#00d2c6] transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-4 backdrop-blur-sm bg-white/10 rounded-2xl border border-white/10 p-4">
            <div className="flex flex-col space-y-4">
              <div className="lg:hidden">
                <SolusiDropdown />
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
      {/* Hero Section - Lower z-index so dropdown appears above */}
      <main className="relative z-10 container mx-auto px-4 pt-12 sm:pt-20 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#00d2c6]/20 to-[#00b5ab]/20 rounded-full px-6 py-2 border border-[#00d2c6]/30 mb-6">
              <Zap className="h-4 w-4 text-[#00d2c6]" />
              <span className="text-sm text-gray-300">
                Platform Manajemen Proyek Perusahaan
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Kelola Proyek
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00d2c6] via-[#00b5ab] to-[#009688] bg-clip-text text-transparent">
                Dengan Efisien
              </span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
              NexaPro adalah platform manajemen proyek internal yang membantu
              tim perusahaan mengelola tugas, memantau progres, dan
              berkolaborasi dengan efisiensi maksimal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10">
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] hover:from-[#00b5ab] hover:to-[#009688] text-white py-3 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Mulai Bekerja</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-400">
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
          {/* Hero Image */}
          <div className="relative px-4 sm:px-0">
            <div className="absolute inset-0 from-[#0f172a] via-transparent to-transparent z-10"></div>
            <div className="relative mx-auto max-w-3xl">
              {" "}
              {/* Lebarkan ukuran gambar */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00d2c6]/20 to-[#00b5ab]/20 blur-3xl rounded-3xl"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-2 border border-white/20">
                <Image
                  src="/gambarlanding.jpg"
                  alt="NexaPro Dashboard Preview"
                  width={1000}
                  height={500}
                  className="rounded-2xl w-full h-auto mx-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Mengapa Memilih NexaPro?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
              Platform yang dirancang khusus untuk tim perusahaan dengan
              fitur-fitur canggih
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Kolaborasi Tim */}
            <div className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-[#00d2c6]/50 transition-all duration-300">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">
                Kolaborasi Tim
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Bekerja bersama tim dengan real-time collaboration, chat
                terintegrasi, dan file sharing yang aman.
              </p>
            </div>
            {/* Manajemen Proyek */}
            <div className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-[#00d2c6]/50 transition-all duration-300">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">
                Manajemen Proyek
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Buat, atur, dan pantau proyek secara menyeluruh dengan fitur
                pelacakan progres dan penjadwalan dinamis.
              </p>
            </div>
            {/* Pelacakan Waktu */}
            <div className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-[#00d2c6]/50 transition-all duration-300">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">
                Pelacakan Waktu
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Catat durasi kerja harian dengan sistem time tracker yang
                otomatis terintegrasi ke dalam laporan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-white/20">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Siap Meningkatkan Produktivitas Tim?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Bergabung dengan tim perusahaan yang sudah merasakan efisiensi
              maksimal dengan NexaPro
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] hover:from-[#00b5ab] hover:to-[#009688] text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Akses Dashboard</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto border border-white/30 hover:border-[#00d2c6] text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold transition-all duration-300 hover:bg-white/5"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Add the Footer component here */}
      <Footer />
    </div>
  );
}
