import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border-t border-white/10">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl rotate-6"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold text-white">N</span>
                  </div>
                </div>
                <span className="text-xl font-bold">
                  <span className="text-white">Nexa</span>
                  <span className="text-[#00d2c6]">Pro</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Platform manajemen proyek internal yang membantu tim perusahaan mengelola tugas dan berkolaborasi dengan
                efisiensi maksimal.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Menu Utama</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dashboard"
                    className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200 text-sm"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200 text-sm"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/calendar"
                    className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200 text-sm"
                  >
                    Calendar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/team"
                    className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200 text-sm"
                  >
                    Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reports"
                    className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200 text-sm"
                  >
                    Reports
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Dukungan</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/bantuan"
                    className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200 text-sm"
                  >
                    Bantuan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200 text-sm"
                  >
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200 text-sm"
                  >
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200 text-sm"
                  >
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Kontak</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-[#00d2c6] flex-shrink-0" />
                  <span className="text-gray-400 text-sm">support@nexapro.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-[#00d2c6] flex-shrink-0" />
                  <span className="text-gray-400 text-sm">+62 21 1234 5678</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-[#00d2c6] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-sm">
                    Jakarta, Indonesia
                    <br />
                    Gedung Perkantoran Modern
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-12 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <p className="text-gray-400 text-sm text-center sm:text-left">© 2024 NexaPro. All rights reserved.</p>
              <div className="flex items-center space-x-6">
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200 text-sm"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200 text-sm"
                >
                  Terms
                </Link>
                <Link
                  href="/cookies"
                  className="text-gray-400 hover:text-[#00d2c6] transition-colors duration-200 text-sm"
                >
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
