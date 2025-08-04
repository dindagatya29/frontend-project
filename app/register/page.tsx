"use client";

import type React from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      setIsLoading(false);
      return;
    }
    try {
      // Hapus fetch csrf-cookie, langsung POST ke register
      const fullName = [firstName, middleName, lastName]
        .filter(Boolean)
        .join(" ");
      const res = await fetch("https://nexapro.web.id/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          password_confirmation: confirmPassword,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      // Jika register sukses, redirect ke login
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registrasi gagal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", "user@gmail.com");
    document.cookie = `nexapro_token=demo_token; path=/; max-age=${
      7 * 24 * 60 * 60
    }`;
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-6 z-10">
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
        <div className="flex items-center space-x-3">
          <span className="text-white">Sudah Punya Akun</span>
          <Link href="/login">
            <button className="bg-[#00d2c6] hover:bg-[#00b5ab] text-white rounded-lg px-6 py-2 transition-colors">
              Login
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-20 pt-20">
        <div className="w-full max-w-2xl">
          {/* Register Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Selamat Datang
              </h1>
              <p className="text-slate-600">Buat akun untuk memulai</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Depan
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 text-black border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2c6] focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="Nama Depan"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Tengah
                  </label>
                  <input
                    type="text"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 text-black border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2c6] focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="Nama Tengah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Belakang
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 text-black border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2c6] focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="Nama Belakang"
                    required
                  />
                </div>
              </div>
              {/* <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={`${firstName} ${middleName} ${lastName}`}
                  readOnly
                  className="w-full pl-4 pr-4 py-3 text-black bg-gray-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2c6] focus:border-transparent transition-all duration-200"
                /> */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Alamat Email
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-black border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2c6] focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kata Sandi
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-black border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2c6] focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="Minimal 8 karakter"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-black border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2c6] focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="Ulangi kata sandi"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] hover:from-[#00b5ab] hover:to-[#009688] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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
                    Mendaftar...
                  </div>
                ) : (
                  "Buat Akun"
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Dengan mendaftar, Anda menyetujui{" "}
            <Link href="#" className="text-[#00d2c6] hover:underline">
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="#" className="text-[#00d2c6] hover:underline">
              Kebijakan Privasi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
