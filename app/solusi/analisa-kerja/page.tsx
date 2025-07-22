import Link from "next/link"
import { ArrowLeft, BarChart3, TrendingUp, PieChart, Activity, Target, Calendar } from "lucide-react"

export default function AnalisaKerjaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f1a25] text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/20 via-transparent to-transparent blur-3xl"></div>

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
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-full px-6 py-3 mb-8 border border-purple-500/30">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            <span className="text-sm text-gray-300">Solusi Analisa Kerja</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Grafik Analisa
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              Kerja Mendalam
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Dashboard analitik dengan insights mendalam untuk mengoptimalkan performa tim dan proyek. Visualisasi data
            yang komprehensif untuk pengambilan keputusan yang tepat.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Fitur Analitik
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tools analisis yang powerful untuk memahami performa tim dan proyek
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Performance Dashboard */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Dashboard Performa</h3>
              <p className="text-gray-300 leading-relaxed">
                Visualisasi real-time performa tim, produktivitas, dan progress proyek dalam satu dashboard.
              </p>
            </div>

            {/* Trend Analysis */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Analisis Trend</h3>
              <p className="text-gray-300 leading-relaxed">
                Identifikasi pola dan trend dalam performa tim untuk prediksi dan perencanaan yang lebih baik.
              </p>
            </div>

            {/* Resource Analytics */}
            <div className="p-8 rounded-2xl bg-teal-500/10 backdrop-blur-sm border border-teal-500/20">
              <div className="h-16 w-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <PieChart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Analisis Resource</h3>
              <p className="text-gray-300 leading-relaxed">
                Analisis utilisasi resource, workload distribution, dan optimasi alokasi tim.
              </p>
            </div>

            {/* Activity Monitoring */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-sm border border-orange-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Monitoring Aktivitas</h3>
              <p className="text-gray-300 leading-relaxed">
                Track aktivitas tim secara detail dengan timeline dan heatmap produktivitas.
              </p>
            </div>

            {/* Goal Tracking */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 backdrop-blur-sm border border-cyan-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Tracking Target</h3>
              <p className="text-gray-300 leading-relaxed">
                Monitor pencapaian target dan KPI dengan visualisasi progress yang jelas.
              </p>
            </div>

            {/* Time Analytics */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 backdrop-blur-sm border border-indigo-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Analisis Waktu</h3>
              <p className="text-gray-300 leading-relaxed">
                Analisis mendalam penggunaan waktu, estimasi vs aktual, dan optimasi timeline.
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
                Dapatkan Insights yang Actionable
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Mulai analisis performa tim dan proyek dengan dashboard yang powerful
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="/bantuan"
                className="border border-white/30 hover:border-purple-400 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 hover:bg-white/5"
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
