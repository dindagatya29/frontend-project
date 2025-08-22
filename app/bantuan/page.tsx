"use client"

import Link from "next/link"
import { useState } from "react"
import SolusiDropdown from "@/components/solusi-dropdown"
import SupportModal from "@/components/support-modal"
import {
  Search,
  MessageCircle,
  BookOpen,
  Settings,
  Users,
  Shield,
  ChevronDown,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react"
import Footer from "@/components/footer"

export default function BantuanPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const helpCategories = [
    {
      icon: BookOpen,
      title: "Panduan Memulai",
      description: "Pelajari dasar-dasar menggunakan NexaPro",
      articles: "12 artikel",
    },
    {
      icon: Settings,
      title: "Pengaturan Akun",
      description: "Kelola profil dan preferensi Anda",
      articles: "8 artikel",
    },
    {
      icon: Users,
      title: "Manajemen Tim",
      description: "Cara mengelola anggota tim",
      articles: "10 artikel",
    },
    {
      icon: Shield,
      title: "Keamanan & Privasi",
      description: "Perlindungan data dan keamanan",
      articles: "5 artikel",
    },
  ]

  const faqs = [
    {
      question: "Bagaimana cara memulai menggunakan NexaPro?",
      answer:
        "Anda dapat memulai dengan mendaftar akun, kemudian mengikuti tutorial onboarding yang akan memandu Anda melalui fitur-fitur dasar NexaPro.",
    },
    {
      question: "Apakah ada batasan jumlah proyek?",
      answer: "Tidak ada batasan jumlah proyek yang dapat Anda buat dalam sistem perusahaan ini.",
    },
    {
      question: "Bagaimana cara mengundang anggota tim?",
      answer: "Masuk ke pengaturan proyek, pilih 'Anggota Tim', lalu klik 'Undang Anggota' dan masukkan email mereka.",
    },
    {
      question: "Apakah data saya aman di NexaPro?",
      answer:
        "Ya, kami menggunakan enkripsi end-to-end dan mematuhi standar keamanan internasional untuk melindungi data Anda.",
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredCategories = helpCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a2a3a] to-[#0f1a25] text-white">
      {/* Navigation */}
      <header className="fixed top-0 left-0 z-50 w-full bg-transparent backdrop-blur-sm">
        <nav className="flex items-center justify-between backdrop-blur-sm bg-white/5 px-4 sm:px-6 py-3 sm:py-4 border border-white/10">
          <div className="flex items-center space-x-8">
            <div className="flex-1"></div>
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">N</span>
              </div>
              <span className="text-2xl font-bold">
                <span className="text-white">Nexa</span>
                <span className="text-[#00d2c6]">Pro</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <SolusiDropdown />
            <Link href="/bantuan" className="text-white hover:text-[#00d2c6] transition">
              Bantuan
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-[#00d2c6] transition">
              Tentang
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-300 hover:text-white transition px-4 py-2">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-[#00d2c6] hover:bg-[#00b5ab] text-white rounded-lg px-6 py-2 transition"
            >
              Daftar
            </Link>
          </div>
        </nav>
      </header>
      <br />
      <br />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Pusat </span>
            <span className="text-[#00d2c6]">Bantuan</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan Anda atau hubungi tim support kami
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Cari bantuan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2c6] focus:border-transparent placeholder-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Kategori Bantuan</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredCategories.map((category, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#00d2c6]/50 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-[#00d2c6] rounded-lg flex items-center justify-center flex-shrink-0">
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#00d2c6] transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">{category.description}</p>
                    <span className="text-xs text-gray-500">{category.articles}</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#00d2c6] transition-colors" />
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-gray-400">Tidak ada kategori yang ditemukan untuk "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">FAQ</h2>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-gray-400">Tidak ada FAQ yang ditemukan untuk "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Hubungi Kami</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors">
              <div className="h-12 w-12 bg-[#00d2c6] rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
              <p className="text-gray-400 text-sm mb-4">Bantuan instan dari tim kami</p>
              <button
                onClick={openModal}
                className="bg-[#00d2c6] hover:bg-[#00b5ab] text-white px-4 py-2 rounded-lg transition"
              >
                Mulai Chat
              </button>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors">
              <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <p className="text-gray-400 text-sm mb-4">Kirim pertanyaan via email</p>
              <a
                href="mailto:support@nexapro.com"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition inline-block"
              >
                Kirim Email
              </a>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors">
              <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Telepon</h3>
              <p className="text-gray-400 text-sm mb-4">Hubungi langsung tim kami</p>
              <a
                href="tel:+62-21-1234-5678"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition inline-block"
              >
                Hubungi
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Support Modal */}
      <SupportModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Add the Footer component here */}
      <Footer />
    </div>
  )
}
