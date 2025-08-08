import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Linkedin, CheckCircle, ArrowRight, Mail, Phone, MapPin } from 'lucide-react' // Added Mail, Phone, MapPin icons

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f1a25] text-white py-12 sm:py-16 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-16">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 group mb-4">
              <div className="h-10 w-10 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00d2c6] to-[#00b5ab] rounded-xl flex items-center justify-center">
                  <span className="text-lg font-bold text-white">N</span>
                </div>
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">Nexa</span>
                <span className="text-[#00d2c6]">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              NexaPro adalah platform manajemen proyek internal yang membantu
              tim perusahaan mengelola tugas, memantau progres, dan
              berkolaborasi dengan efisiensi maksimal.
            </p>
            <div className="flex space-x-3">
              <Link href="#" className="w-9 h-9 rounded-full bg-white/10 text-gray-300 flex items-center justify-center hover:bg-[#00d2c6] hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/10 text-gray-300 flex items-center justify-center hover:bg-[#00d2c6] hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/10 text-gray-300 flex items-center justify-center hover:bg-[#00d2c6] hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/10 text-gray-300 flex items-center justify-center hover:bg-[#00d2c6] hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#00d2c6] transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#00d2c6] transition-colors text-sm">
                  Tentang
                </Link>
              </li>
              <li>
                <Link href="/bantuan" className="text-gray-400 hover:text-[#00d2c6] transition-colors text-sm">
                  Bantuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#00d2c6] transition-colors text-sm">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#00d2c6] transition-colors text-sm">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#00d2c6] transition-colors text-sm">
                  Kebijakan Asuransi
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#00d2c6] transition-colors text-sm">
                  Bantuan & Dukungan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us Section (Replaced Download App) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Hubungi Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-[#00d2c6] flex-shrink-0" />
                <span>info@nexapro.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-[#00d2c6] flex-shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-[#00d2c6] flex-shrink-0 mt-0.5" />
                <span>Jl. Contoh No. 123, Jakarta, Indonesia</span>
              </li>
              <li>
                <Link
                  href="/bantuan" // Assuming a contact page or help page
                  className="inline-flex items-center gap-2 text-[#00d2c6] hover:text-white transition-colors text-sm font-medium mt-2"
                >
                  Kirim Pesan
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/10 text-sm text-gray-400">
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors mb-4 sm:mb-0"
          >
            <CheckCircle className="w-4 h-4 text-[#00d2c6]" />
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <p className="text-center sm:text-right">
            NexaPro &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
