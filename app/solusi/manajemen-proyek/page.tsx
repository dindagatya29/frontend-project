import Link from "next/link"
import { ArrowLeft, CheckCircle, Users, Calendar, BarChart3, Target, Clock, FileText } from "lucide-react"

export default function ManajemenProyekPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f1a25] text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/20 via-transparent to-transparent blur-3xl"></div>

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
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full px-6 py-3 mb-8 border border-blue-500/30">
            <Target className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-300">Solusi Manajemen Proyek</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Manajemen Proyek
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              yang Efektif
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Kelola proyek dari perencanaan hingga eksekusi dengan tools yang lengkap. Timeline yang jelas, milestone
            tracking, dan kolaborasi tim yang seamless.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Fitur Unggulan
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola proyek dengan efisien
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Planning */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Perencanaan Proyek</h3>
              <p className="text-gray-300 leading-relaxed">
                Buat timeline proyek dengan Gantt chart, tentukan dependencies, dan alokasikan resources dengan mudah.
              </p>
            </div>

            {/* Task Management */}
            <div className="p-8 rounded-2xl bg-teal-500/10 backdrop-blur-sm border border-teal-500/20">
              <div className="h-16 w-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Manajemen Task</h3>
              <p className="text-gray-300 leading-relaxed">
                Buat, assign, dan track progress task dengan sistem prioritas dan deadline yang jelas.
              </p>
            </div>

            {/* Team Collaboration */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Kolaborasi Tim</h3>
              <p className="text-gray-300 leading-relaxed">
                Komunikasi real-time, file sharing, dan comment system untuk kolaborasi yang efektif.
              </p>
            </div>

            {/* Progress Tracking */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-sm border border-orange-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Progress Tracking</h3>
              <p className="text-gray-300 leading-relaxed">
                Monitor kemajuan proyek dengan dashboard visual dan laporan progress yang detail.
              </p>
            </div>

            {/* Time Management */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 backdrop-blur-sm border border-cyan-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Time Tracking</h3>
              <p className="text-gray-300 leading-relaxed">
                Lacak waktu yang dihabiskan untuk setiap task dan analisis produktivitas tim.
              </p>
            </div>

            {/* Documentation */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 backdrop-blur-sm border border-indigo-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Dokumentasi</h3>
              <p className="text-gray-300 leading-relaxed">
                Kelola dokumen proyek, wiki, dan knowledge base dalam satu tempat yang terorganisir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Manfaat untuk Tim Anda
                </span>
              </h2>
              <p className="text-xl text-gray-400">Tingkatkan efisiensi dan produktivitas proyek</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">Visibilitas Penuh</h4>
                    <p className="text-gray-300">Lihat status semua proyek dalam satu dashboard yang komprehensif.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">Deadline Management</h4>
                    <p className="text-gray-300">Sistem reminder otomatis dan tracking deadline yang akurat.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">Resource Optimization</h4>
                    <p className="text-gray-300">Alokasi sumber daya yang optimal dengan workload balancing.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">Risk Management</h4>
                    <p className="text-gray-300">Identifikasi dan mitigasi risiko proyek sejak dini.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">Reporting Otomatis</h4>
                    <p className="text-gray-300">Laporan progress dan performance yang dihasilkan secara otomatis.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">Scalable Solution</h4>
                    <p className="text-gray-300">Solusi yang dapat berkembang seiring dengan pertumbuhan tim.</p>
                  </div>
                </div>
              </div>
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
                Siap Mengelola Proyek dengan Lebih Baik?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Mulai gunakan solusi manajemen proyek NexaPro dan rasakan perbedaannya
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="/bantuan"
                className="border border-white/30 hover:border-blue-400 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 hover:bg-white/5"
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
