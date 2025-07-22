import Link from "next/link"
import { ArrowLeft, WifiOff, FolderSyncIcon as Sync, Database, Shield, Clock, Download } from "lucide-react"

export default function ModeOfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f1a25] text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-orange-500/20 via-transparent to-transparent blur-3xl"></div>

      {/* Navigation */}
      <header className="relative z-50 container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Kembali ke Beranda
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 pt-16 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-full px-6 py-3 mb-8 border border-orange-500/30">
            <WifiOff className="h-5 w-5 text-orange-400" />
            <span className="text-sm text-gray-300">Solusi Mode Offline</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Bekerja Tanpa
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Batas Koneksi
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Tetap produktif meski tanpa koneksi internet. Semua data tersinkronisasi otomatis saat online kembali dengan
            teknologi offline-first yang canggih.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Fitur Offline
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Teknologi canggih untuk produktivitas tanpa batas</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Offline Sync */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-sm border border-orange-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Sync className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Auto Sync</h3>
              <p className="text-gray-300 leading-relaxed">
                Sinkronisasi otomatis semua perubahan saat koneksi tersedia dengan conflict resolution yang cerdas.
              </p>
            </div>

            {/* Local Storage */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Local Database</h3>
              <p className="text-gray-300 leading-relaxed">
                Penyimpanan lokal yang aman dan efisien untuk akses data cepat tanpa koneksi internet.
              </p>
            </div>

            {/* Data Security */}
            <div className="p-8 rounded-2xl bg-teal-500/10 backdrop-blur-sm border border-teal-500/20">
              <div className="h-16 w-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Keamanan Data</h3>
              <p className="text-gray-300 leading-relaxed">
                Enkripsi end-to-end untuk data offline dengan backup otomatis dan recovery yang handal.
              </p>
            </div>

            {/* Real-time Updates */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Update Real-time</h3>
              <p className="text-gray-300 leading-relaxed">
                Perubahan tersinkronisasi secara real-time begitu koneksi tersedia dengan timestamp yang akurat.
              </p>
            </div>

            {/* Offline Analytics */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 backdrop-blur-sm border border-cyan-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Offline Analytics</h3>
              <p className="text-gray-300 leading-relaxed">
                Track produktivitas dan progress bahkan saat offline dengan laporan yang tersimpan lokal.
              </p>
            </div>

            {/* Smart Caching */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 backdrop-blur-sm border border-indigo-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <WifiOff className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Smart Caching</h3>
              <p className="text-gray-300 leading-relaxed">
                Sistem caching cerdas yang memprediksi data yang dibutuhkan untuk akses offline yang optimal.
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
                Produktivitas Tanpa Batas
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Bekerja kapan saja, di mana saja, dengan atau tanpa koneksi internet
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="/bantuan"
                className="border border-white/30 hover:border-orange-400 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 hover:bg-white/5"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
