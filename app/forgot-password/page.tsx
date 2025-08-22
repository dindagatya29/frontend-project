"use client"

import Link from "next/link"
import { Mail, Phone, MessageCircle } from "lucide-react" // Import Mail icon

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-6 z-10">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="h-12 w-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl font-bold text-white">N</span>
            </div>
          </div>
          <span className="text-2xl font-bold">
            <span className="text-white">Nexa</span>
            <span className="text-[#00d2c6]">Pro</span>
          </span>
        </Link>
        <div className="flex items-center space-x-3">
          <span className="text-white">Ingat akun Anda?</span>
          <Link href="/login">
            <button className="bg-[#00d2c6] hover:bg-[#00b5ab] text-white rounded-lg px-6 py-2 transition-colors">
              Masuk
            </button>
          </Link>
        </div>
      </header>
      <main className="w-full max-w-md z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Lupa Kata Sandi?</h1>
            <p className="text-gray-600">Untuk mereset kata sandi Anda, silakan hubungi admin.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <MessageCircle className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-blue-800">Hubungi Admin</h3>
              </div>
              <p className="text-blue-700 mb-4">
                Silakan hubungi administrator untuk mereset kata sandi Anda melalui kontak berikut:
              </p>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-blue-800">admin@nexapro.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-blue-800">+62 812-3456-7890</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Admin akan membantu Anda mereset kata sandi dalam waktu 1x24 jam.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-[#00d2c6] hover:text-[#00b5ab] transition-colors">
              Kembali ke Halaman Login
            </Link>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00d2c6]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </main>
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
