import Link from "next/link"
import { ArrowLeft, Zap, RefreshCw, Users2, Target, Calendar, GitBranch } from "lucide-react"

export default function PengembanganAgilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f1a25] text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/20 via-transparent to-transparent blur-3xl"></div>

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
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 rounded-full px-6 py-3 mb-8 border border-cyan-500/30">
            <Zap className="h-5 w-5 text-cyan-400" />
            <span className="text-sm text-gray-300">Solusi Pengembangan Agile</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Pengembangan
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent">
              Agile & Scrum
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Metodologi Scrum, Kanban, dan Sprint planning untuk pengembangan software yang efektif. Tingkatkan velocity
            tim dengan framework Agile yang terbukti.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Fitur Agile</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tools lengkap untuk implementasi metodologi Agile yang efektif
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Scrum Board */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 backdrop-blur-sm border border-cyan-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Scrum Board</h3>
              <p className="text-gray-300 leading-relaxed">
                Kanban board yang dapat dikustomisasi untuk mengelola backlog, sprint, dan workflow tim Agile.
              </p>
            </div>

            {/* Sprint Planning */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Sprint Planning</h3>
              <p className="text-gray-300 leading-relaxed">
                Tools untuk perencanaan sprint, estimasi story points, dan capacity planning yang akurat.
              </p>
            </div>

            {/* Backlog Management */}
            <div className="p-8 rounded-2xl bg-teal-500/10 backdrop-blur-sm border border-teal-500/20">
              <div className="h-16 w-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <GitBranch className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Backlog Management</h3>
              <p className="text-gray-300 leading-relaxed">
                Kelola product backlog dengan prioritization, user stories, dan acceptance criteria yang jelas.
              </p>
            </div>

            {/* Daily Standup */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Users2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Daily Standup</h3>
              <p className="text-gray-300 leading-relaxed">
                Fasilitasi daily standup dengan template dan tracking untuk impediments dan blockers.
              </p>
            </div>

            {/* Retrospective */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-sm border border-orange-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <RefreshCw className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Sprint Retrospective</h3>
              <p className="text-gray-300 leading-relaxed">
                Tools untuk retrospective meeting dengan template dan action items tracking.
              </p>
            </div>

            {/* Velocity Tracking */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 backdrop-blur-sm border border-indigo-500/20">
              <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Velocity Tracking</h3>
              <p className="text-gray-300 leading-relaxed">
                Monitor velocity tim dengan burndown charts dan predictive analytics untuk planning yang lebih baik.
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
                Accelerate Your Agile Journey
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Implementasikan metodologi Agile dengan tools yang tepat dan tingkatkan delivery tim
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="/bantuan"
                className="border border-white/30 hover:border-cyan-400 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 hover:bg-white/5"
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
