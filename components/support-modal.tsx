"use client"

import type React from "react"

import { useState } from "react"

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus("error")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitStatus("success")
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", message: "" })
        setSubmitStatus("idle")
        onClose()
      }, 2000)
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-[#1a2a3a] to-[#0f1a25] rounded-lg w-full max-w-4xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <path d="M50 15 L85 33 L85 67 L50 85 L15 67 L15 33 Z" fill="none" stroke="#00d2c6" strokeWidth="4" />
                <text x="50" y="60" fontSize="40" fontWeight="bold" fill="#00d2c6" textAnchor="middle">
                  N
                </text>
              </svg>
            </div>
            <span className="text-xl font-bold">
              <span className="text-gray-300">Nexa</span>
              <span className="text-[#00d2c6]">Pro</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Form Section */}
            <div className="w-full md:w-1/2">
              {submitStatus === "success" && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                  Pesan berhasil dikirim! Terima kasih atas dukungan Anda.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                  Mohon lengkapi semua field yang wajib diisi.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="sr-only">
                    Nama
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nama *"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 bg-gray-200 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00d2c6]"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 bg-gray-200 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00d2c6]"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">
                    Telepon
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Telepon"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-200 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00d2c6]"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Message *"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 bg-gray-200 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00d2c6]"
                  ></textarea>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#00d2c6] hover:bg-[#00b5ab] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md px-8 py-2 transition-colors"
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim"}
                  </button>
                </div>
              </form>
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 text-center md:text-right">
              <h1 className="text-4xl font-bold mb-2 text-[#e0e0e0]">Dukung Saya</h1>
              <p className="text-xl mb-4">Atau</p>
              <div>
                <p className="text-lg mb-1">Support Email Saya:</p>
                <a href="mailto:akhirp169@gmail.com" className="text-[#00d2c6] hover:underline">
                  akhirp169@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
