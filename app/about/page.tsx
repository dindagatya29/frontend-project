import Link from "next/link"
import SolusiDropdown from "@/components/solusi-dropdown"
import {
  ArrowRight,
  Briefcase,
  Sparkles,
  Users,
  Globe,
  BarChart3,
  MessageCircle,
  WifiOff,
  Lock,
  CheckCircle,
  Building2,
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f1a25] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#00d2c6]/20 via-transparent to-transparent blur-3xl"></div>

      {/* Navigation */}
      <header className="fixed top-0 left-0 z-50 w-full bg-transparent backdrop-blur-sm">
       <nav className="flex items-center justify-between backdrop-blur-sm bg-white/5 px-4 sm:px-6 py-3 sm:py-4 border border-white/10">

          <div className="flex items-center space-x-8">
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
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <SolusiDropdown />
            <Link href="/bantuan" className="text-gray-300 hover:text-[#00d2c6] transition-colors duration-200">
              Bantuan
            </Link>
            <Link href="/about" className="text-[#00d2c6] font-medium">
              Tentang
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors duration-200 px-4 py-2">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] hover:from-[#00b5ab] hover:to-[#009688] text-white rounded-xl px-6 py-3 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Mulai Sekarang
            </Link>
          </div>
        </nav>
      </header><br /><br />

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 pt-16 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full px-6 py-3 mb-8 border border-blue-500/30">
            <Building2 className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-300">Solusi Enterprise • Untuk Perusahaan Anda</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Solusi Lengkap
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#00d2c6] via-[#00b5ab] to-[#009688] bg-clip-text text-transparent">
              Manajemen Proyek
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            NexaPro menyediakan solusi manajemen proyek untuk meningkatkan produktivitas dan efisiensi tim
            perusahaan Anda dengan teknologi terdepan.
          </p>
        </div>
      </section>

      {/* Company Benefits */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Mengapa Memilih NexaPro?
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Platform yang dirancang khusus untuk memenuhi kebutuhan manajemen proyek perusahaan modern
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Solusi Enterprise</h3>
              <p className="text-gray-300 leading-relaxed">
                Platform yang dapat diandalkan untuk mengelola proyek-proyek dan tim
                yang tersebar.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-teal-500/10 backdrop-blur-sm border border-teal-500/20 text-center">
              <div className="h-16 w-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Kolaborasi Tim</h3>
              <p className="text-gray-300 leading-relaxed">
                Meningkatkan komunikasi dan koordinasi antar departemen untuk mencapai tujuan perusahaan.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Inovasi Berkelanjutan</h3>
              <p className="text-gray-300 leading-relaxed">
                Teknologi terdepan yang terus berkembang untuk mendukung transformasi digital perusahaan Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Solusi Komprehensif NexaPro
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Semua fitur yang dibutuhkan untuk mengelola proyek perusahaan dengan efisien
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Manajemen Proyek */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Manajemen Proyek</h3>
              <p className="text-gray-400 text-sm">
                Kelola proyek enterprise dengan timeline, milestone, dan resource allocation yang optimal.
              </p>
            </div>

            {/* Pengembangan Agile */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Pengembangan Agile</h3>
              <p className="text-gray-400 text-sm">
                Metodologi Scrum dan Kanban untuk pengembangan produk yang adaptif dan responsif.
              </p>
            </div>

            {/* Kolaborasi Tim */}
            <div className="group p-6 rounded-2xl bg-teal-500/10 backdrop-blur-sm border border-teal-500/20 hover:border-teal-400/50 transition-all duration-300">
              <div className="h-12 w-12 bg-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Kolaborasi Tim</h3>
              <p className="text-gray-400 text-sm">
                Platform komunikasi terintegrasi dengan file sharing dan real-time collaboration tools.
              </p>
            </div>

            {/* Pekerjaan Jarak Jauh */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 to-teal-600/5 backdrop-blur-sm border border-teal-500/20 hover:border-teal-400/50 transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Pekerjaan Jarak Jauh</h3>
              <p className="text-gray-400 text-sm">
                Mendukung hybrid work dengan video conferencing dan remote collaboration yang seamless.
              </p>
            </div>

            {/* Grafik Analisa Kerja */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-sm border border-orange-500/20 hover:border-orange-400/50 transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Analytics & Reporting</h3>
              <p className="text-gray-400 text-sm">
                Dashboard analitik komprehensif untuk monitoring performa dan ROI proyek.
              </p>
            </div>

            {/* Notifikasi WhatsApp */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Notifikasi Terintegrasi</h3>
              <p className="text-gray-400 text-sm">
                Sistem notifikasi multi-channel termasuk WhatsApp untuk update proyek yang penting.
              </p>
            </div>

            {/* Mode Offline */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 backdrop-blur-sm border border-indigo-500/20 hover:border-indigo-400/50 transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <WifiOff className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Mode Offline</h3>
              <p className="text-gray-400 text-sm">
                Produktivitas tetap terjaga dengan kemampuan bekerja offline dan sinkronisasi otomatis.
              </p>
            </div>

            {/* Hak Akses Berbasis Peran */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 hover:border-red-400/50 transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Keamanan Enterprise</h3>
              <p className="text-gray-400 text-sm">
                Sistem keamanan berlapis dengan role-based access control dan audit trail lengkap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      {/* <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Fitur Unggulan NexaPro
                </span>
              </h2>
              <p className="text-xl text-gray-400">Semua yang dibutuhkan untuk kesuksesan proyek perusahaan</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-[#00d2c6] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Scalable Architecture</h4>
                  <p className="text-gray-400 text-sm">Dapat menangani ribuan pengguna dan proyek secara bersamaan</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-[#00d2c6] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Custom Workflows</h4>
                  <p className="text-gray-400 text-sm">
                    Workflow yang dapat disesuaikan dengan proses bisnis perusahaan
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-[#00d2c6] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Enterprise Security</h4>
                  <p className="text-gray-400 text-sm">Keamanan tingkat enterprise dengan enkripsi end-to-end</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-[#00d2c6] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">24/7 Support</h4>
                  <p className="text-gray-400 text-sm">Dukungan teknis profesional kapan saja dibutuhkan</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-[#00d2c6] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">API Integration</h4>
                  <p className="text-gray-400 text-sm">Integrasi mudah dengan sistem existing perusahaan</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-[#00d2c6] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Advanced Analytics</h4>
                  <p className="text-gray-400 text-sm">Business intelligence untuk pengambilan keputusan yang tepat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Transformasi Digital Dimulai Dari Sini
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan perusahaan-perusahaan terdepan yang telah mempercayakan manajemen proyek
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] hover:from-[#00b5ab] hover:to-[#009688] text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>Mulai Sekarang</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/bantuan"
                className="border border-white/30 hover:border-[#00d2c6] text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 hover:bg-white/5"
              >
                Lihat Demo
              </Link>
            </div>
            <p className="text-sm text-gray-400 mt-4">Solusi Enterprise • Dukungan Profesional • Keamanan Terjamin</p>
          </div>
        </div>
      </section>
    </div>
  )
}
