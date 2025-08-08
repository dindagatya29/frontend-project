import Link from "next/link"
import { Mail, Phone, MessageCircle, Send, User, AtSign } from "lucide-react"
import Footer from "@/components/footer"

export default function DukunganPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f1a25] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#00d2c6]/20 via-transparent to-transparent blur-3xl"></div>

      {/* Navigation */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between backdrop-blur-sm bg-white/5 rounded-2xl px-6 py-4 border border-white/10">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
              Home
            </Link>
            <div className="flex-1"></div>
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="h-10 w-10 relative">
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

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#"
              className="flex items-center text-gray-300 hover:text-[#00d2c6] transition-colors duration-200"
            >
              Solusi
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 h-4 w-4"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Link>
            <Link href="/bantuan" className="text-gray-300 hover:text-[#00d2c6] transition-colors duration-200">
              Bantuan
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors duration-200 px-4 py-2">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] hover:from-[#00b5ab] hover:to-[#009688] text-white rounded-xl px-6 py-3 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Daftar
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#00d2c6]/20 to-[#00b5ab]/20 rounded-full px-6 py-2 mb-6 border border-[#00d2c6]/30">
            <MessageCircle className="h-4 w-4 text-[#00d2c6]" />
            <span className="text-sm text-gray-300">Dukungan 24/7</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Hubungi Tim
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#00d2c6] via-[#00b5ab] to-[#009688] bg-clip-text text-transparent">
              Dukungan Kami
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Kami siap membantu Anda dengan pertanyaan, masalah teknis, atau feedback tentang NexaPro
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center">
                  <Send className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Kirim Pesan</h2>
              </div>

              <form className="space-y-6">
                <div className="relative">
                  <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nama lengkap"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00d2c6] focus:border-transparent placeholder-gray-400 transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <AtSign className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00d2c6] focus:border-transparent placeholder-gray-400 transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Nomor telepon"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00d2c6] focus:border-transparent placeholder-gray-400 transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <MessageCircle className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <textarea
                    placeholder="Tulis pesan Anda..."
                    rows={5}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00d2c6] focus:border-transparent placeholder-gray-400 transition-all duration-300 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] hover:from-[#00b5ab] hover:to-[#009688] text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Kirim Pesan</span>
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Email Support</h3>
                </div>
                <p className="text-gray-300 mb-4">Kirim email untuk pertanyaan detail atau laporan bug</p>
                <a
                  href="mailto:akhirp169@gmail.com"
                  className="text-[#00d2c6] hover:text-[#00b5ab] transition-colors duration-200 font-medium"
                >
                  akhirp169@gmail.com
                </a>
              </div>

              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-10 w-10 bg-teal-500 rounded-xl flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Live Chat</h3>
                </div>
                <p className="text-gray-300 mb-4">Chat langsung dengan tim support kami</p>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                  Mulai Chat
                </button>
              </div>

              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Telepon</h3>
                </div>
                <p className="text-gray-300 mb-4">Hubungi kami untuk bantuan urgent</p>
                <p className="text-[#00d2c6] font-medium">+62 812-3456-7890</p>
                <p className="text-sm text-gray-400 mt-2">Senin - Jumat, 09:00 - 18:00 WIB</p>
              </div>
            </div>
          </div>
        </div>
      </main>
 {/* Add the Footer component here */}
      <Footer />

    </div>
  )
}
