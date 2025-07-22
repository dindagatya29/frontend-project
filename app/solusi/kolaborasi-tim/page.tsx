import Link from "next/link"
import { ArrowLeft, Users, MessageCircle, Share2, Video, FileText, Bell } from "lucide-react"

export default function KolaborasiTimPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f1a25] text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-teal-500/20 blur-3xl"></div>

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
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 rounded-full px-6 py-3 mb-8 border border-teal-500/30">
            <Users className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-300">Solusi Kolaborasi Tim</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Kolaborasi Tim
            </span>
            <br />
            <span className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent">
              yang Efektif
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Tingkatkan produktivitas tim dengan komunikasi real-time, sharing dokumen yang efisien, dan kolaborasi yang
            seamless di satu platform.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Fitur Kolaborasi
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tools lengkap untuk mendukung kerja sama tim yang produktif
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Real-time Chat */}
            <div className="p-8 rounded-2xl bg-teal-500/10 backdrop-blur-sm border border-teal-500/20">
              <div className="h-16 w-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Chat Real-time</h3>
              <p className="text-gray-300 leading-relaxed">
                Komunikasi instan dengan team chat, direct message, dan group discussion yang terorganisir.
              </p>
            </div>

            {/* File Sharing */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Share2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">File Sharing</h3>
              <p className="text-gray-300 leading-relaxed">
                Berbagi file dengan mudah, version control, dan akses terkontrol untuk dokumen penting.
              </p>
            </div>

            {/* Video Conference */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Video Conference</h3>
              <p className="text-gray-300 leading-relaxed">
                Meeting online dengan kualitas HD, screen sharing, dan recording untuk review kemudian.
              </p>
            </div>

            {/* Document Collaboration */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-sm border border-orange-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Kolaborasi Dokumen</h3>
              <p className="text-gray-300 leading-relaxed">
                Edit dokumen bersama secara real-time dengan comment system dan track changes.
              </p>
            </div>

            {/* Team Workspace */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 backdrop-blur-sm border border-cyan-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Team Workspace</h3>
              <p className="text-gray-300 leading-relaxed">
                Workspace khusus untuk setiap tim dengan channel terorganisir dan akses yang disesuaikan.
              </p>
            </div>

            {/* Smart Notifications */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 backdrop-blur-sm border border-indigo-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Smart Notifications</h3>
              <p className="text-gray-300 leading-relaxed">
                Notifikasi cerdas yang dapat dikustomisasi untuk menghindari information overload.
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
                Tingkatkan Kolaborasi Tim Anda
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Mulai berkolaborasi dengan lebih efektif menggunakan NexaPro
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-teal-500 hover:bg-teal-600 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="/bantuan"
                className="border border-white/30 hover:border-green-400 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 hover:bg-white/5"
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
