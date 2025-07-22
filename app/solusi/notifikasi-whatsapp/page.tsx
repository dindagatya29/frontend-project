"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Bell,
  Users,
  Smartphone,
  Shield,
  Zap,
  Clock,
  Settings,
  Phone,
  Send,
} from "lucide-react"

export default function NotifikasiWhatsAppPage() {
  const [activeTab, setActiveTab] = useState("features")

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f1a25] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-emerald-500/20 via-transparent to-transparent blur-3xl"></div>

      {/* Navigation */}
      <header className="relative z-50 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between backdrop-blur-sm bg-white/5 rounded-2xl px-6 py-4 border border-white/10">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-12 w-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">N</span>
              </div>
            </div>
            <span className="text-2xl font-bold">
              <span className="text-white">Nexa</span>
              <span className="text-[#00d2c6]">Pro</span>
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 px-4 py-2">
              Kembali ke Beranda
            </Link>
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl px-6 py-3 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Coba Sekarang
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full px-6 py-2 mb-8 border border-emerald-500/30">
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-gray-300">Integrasi WhatsApp Business</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Notifikasi
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                WhatsApp
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Tetap terhubung dengan tim melalui notifikasi WhatsApp real-time. Dapatkan update proyek, reminder
              deadline, dan komunikasi tim langsung di aplikasi WhatsApp Anda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-lg mx-auto mb-16">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Mulai Integrasi</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto border border-white/30 hover:border-emerald-400 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 hover:bg-white/5"
              >
                Lihat Demo
              </Link>
            </div>
          </div>

          {/* Feature Tabs */}
          <div className="mb-16">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setActiveTab("features")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === "features"
                    ? "bg-teal-500 text-white shadow-lg"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                Fitur Utama
              </button>
              <button
                onClick={() => setActiveTab("integration")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === "integration"
                    ? "bg-teal-500 text-white shadow-lg"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                Integrasi
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === "security"
                    ? "bg-teal-500 text-white shadow-lg"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                Keamanan
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              {activeTab === "features" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Bell className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">Notifikasi Real-time</h3>
                    <p className="text-gray-400">
                      Terima notifikasi instan untuk update proyek, task baru, deadline, dan perubahan status.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="h-16 w-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">Grup Tim</h3>
                    <p className="text-gray-400">
                      Buat grup WhatsApp otomatis untuk setiap proyek dengan anggota tim yang relevan.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="h-16 w-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">Reminder Otomatis</h3>
                    <p className="text-gray-400">
                      Pengingat deadline, meeting, dan milestone penting langsung ke WhatsApp Anda.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="h-16 w-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">Template Pesan</h3>
                    <p className="text-gray-400">
                      Template pesan yang dapat disesuaikan untuk berbagai jenis notifikasi dan update.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="h-16 w-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Settings className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">Pengaturan Fleksibel</h3>
                    <p className="text-gray-400">
                      Atur preferensi notifikasi, jadwal pengiriman, dan filter pesan sesuai kebutuhan.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="h-16 w-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">Multi-Device</h3>
                    <p className="text-gray-400">
                      Sinkronisasi notifikasi di semua device WhatsApp Anda untuk akses yang seamless.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "integration" && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Integrasi yang Mudah</h3>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                      Setup integrasi WhatsApp dalam hitungan menit dengan panduan step-by-step yang mudah diikuti.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Hubungkan WhatsApp Business</h4>
                          <p className="text-gray-400">
                            Scan QR code untuk menghubungkan akun WhatsApp Business Anda dengan NexaPro.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Konfigurasi Notifikasi</h4>
                          <p className="text-gray-400">
                            Pilih jenis notifikasi yang ingin Anda terima dan atur preferensi pengiriman.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                          3
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Mulai Menerima Update</h4>
                          <p className="text-gray-400">
                            Langsung terima notifikasi WhatsApp untuk semua aktivitas proyek dan tim Anda.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl p-6 border border-emerald-500/30">
                      <h4 className="text-lg font-semibold text-white mb-4">Fitur Terintegrasi</h4>
                      <ul className="space-y-3">
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                          <span className="text-gray-300">WhatsApp Business API</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                          <span className="text-gray-300">Webhook Real-time</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                          <span className="text-gray-300">Message Templates</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                          <span className="text-gray-300">Group Management</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                          <span className="text-gray-300">Media Sharing</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Keamanan Tingkat Enterprise</h3>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                      Integrasi WhatsApp dengan standar keamanan tinggi untuk melindungi data dan komunikasi perusahaan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <Shield className="h-12 w-12 text-emerald-400 mb-4" />
                      <h4 className="text-lg font-semibold text-white mb-3">End-to-End Encryption</h4>
                      <p className="text-gray-400">
                        Semua pesan dienkripsi end-to-end menggunakan protokol keamanan WhatsApp.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <Phone className="h-12 w-12 text-emerald-400 mb-4" />
                      <h4 className="text-lg font-semibold text-white mb-3">Verifikasi Dua Faktor</h4>
                      <p className="text-gray-400">
                        Perlindungan tambahan dengan verifikasi dua faktor untuk akses WhatsApp Business.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <Settings className="h-12 w-12 text-emerald-400 mb-4" />
                      <h4 className="text-lg font-semibold text-white mb-3">Kontrol Akses</h4>
                      <p className="text-gray-400">
                        Atur siapa yang dapat menerima notifikasi berdasarkan role dan project access.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <Zap className="h-12 w-12 text-emerald-400 mb-4" />
                      <h4 className="text-lg font-semibold text-white mb-3">Audit Trail</h4>
                      <p className="text-gray-400">
                        Log lengkap semua notifikasi yang dikirim untuk keperluan audit dan compliance.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <Bell className="h-12 w-12 text-emerald-400 mb-4" />
                      <h4 className="text-lg font-semibold text-white mb-3">Rate Limiting</h4>
                      <p className="text-gray-400">
                        Pembatasan otomatis untuk mencegah spam dan menjaga kualitas komunikasi.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <Users className="h-12 w-12 text-emerald-400 mb-4" />
                      <h4 className="text-lg font-semibold text-white mb-3">Data Privacy</h4>
                      <p className="text-gray-400">
                        Kepatuhan penuh terhadap GDPR dan regulasi privasi data internasional.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Benefits Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Mengapa Pilih Notifikasi WhatsApp?
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Manfaat yang Anda dapatkan dengan mengintegrasikan WhatsApp ke dalam workflow tim
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-emerald-500/50 transition-all duration-300">
              <div className="h-12 w-12 bg-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Respons Lebih Cepat</h3>
              <p className="text-gray-400 leading-relaxed">
                Tim merespons 3x lebih cepat dengan notifikasi langsung di WhatsApp dibanding email.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-emerald-500/50 transition-all duration-300">
              <div className="h-12 w-12 bg-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Kolaborasi Seamless</h3>
              <p className="text-gray-400 leading-relaxed">
                Komunikasi tim yang lebih natural dengan platform yang sudah familiar untuk semua.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-emerald-500/50 transition-all duration-300">
              <div className="h-12 w-12 bg-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Zero Missed Updates</h3>
              <p className="text-gray-400 leading-relaxed">
                Tidak ada lagi deadline terlewat atau update penting yang tidak terbaca.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Siap Mengintegrasikan WhatsApp?
              </span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Mulai terima notifikasi real-time dan tingkatkan produktivitas tim dengan integrasi WhatsApp
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Mulai Integrasi</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/bantuan"
                className="w-full sm:w-auto border border-white/30 hover:border-emerald-400 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 hover:bg-white/5"
              >
                Butuh Bantuan?
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
