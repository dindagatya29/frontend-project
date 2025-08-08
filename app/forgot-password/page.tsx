"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail } from 'lucide-react' // Import Mail icon

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    setError(null)

    try {
      // Simulate API call for password reset request
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In a real application, you would send a request to your backend
      // const res = await fetch("/api/forgot-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });
      // const data = await res.json();
      // if (!res.ok) {
      //   throw new Error(data.message || `HTTP ${res.status}`);
      // }

      setMessage("Link reset password telah dikirim ke email Anda. Silakan cek kotak masuk Anda.")
    } catch (err: any) {
      setError(err.message || "Gagal mengirim link reset password. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

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
            <p className="text-gray-600">Masukkan email Anda untuk mereset kata sandi.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 text-black focus:ring-[#00d2c6] focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Masukkan email Anda"
                  required
                />
              </div>
            </div>
            {message && (
              <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Berhasil!</strong>
                <span className="block sm:inline"> {message}</span>
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] hover:from-[#00b5ab] hover:to-[#009688] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses...
                </div>
              ) : (
                "Kirim Link Reset"
              )}
            </button>
          </form>
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
