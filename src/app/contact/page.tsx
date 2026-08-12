"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Mail, Phone, MapPin, Send, CheckCircle2, HelpCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: "Bagaimana cara kerja pembayaran di DaurNusa?",
      a: "Pada tahap MVP saat ini, transaksi dilakukan secara tunai/COD (Cash on Delivery) saat pengambilan barang di lokasi titik temu yang disepakati oleh Seller dan Buyer.",
    },
    {
      q: "Apakah AI Computer Vision Scanner selalu 100% akurat?",
      a: "Model AI kami dirancang untuk mengenali jenis sampah seperti ampas kopi, kardus, plastik PET, dan logam secara cepat. Namun Seller selalu diberikan opsi untuk mengoreksi kategori secara manual jika diperlukan.",
    },
    {
      q: "Bagaimana sistem menghitung estimasi jarak terdekat?",
      a: "Sistem mengonversi alamat lokasi Seller dan Buyer menjadi koordinat geografis untuk menghitung jarak proksimitas dalam satuan kilometer.",
    },
    {
      q: "Siapa saja yang bisa menjadi Seller atau Buyer?",
      a: "Setiap pengguna terdaftar dapat berperan sebagai Seller (saat memposting sampah) maupun Buyer (saat memposting permintaan kebutuhan sampah).",
    },
  ];

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-12 py-4">
        {/* Title Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hubungi Tim DaurNusa</h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Punya pertanyaan, kritik, saran, atau peluang kemitraan daur ulang? Tim kami siap melayani Anda.
          </p>
        </div>

        {/* Form & Contact Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details Column */}
          <div className="space-y-6 md:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-5 shadow-xs">
              <h3 className="font-bold text-base text-slate-900">Informasi Kontak</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Kantor Pusat</span>
                    <span className="text-slate-500">Jl. Tembalang Raya No. 12, Semarang, Jawa Tengah</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Email Resmi</span>
                    <span className="text-slate-500">halo@daurnusa.id</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Telepon / WhatsApp</span>
                    <span className="text-slate-500">+62 812-3456-7890</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-900 text-white rounded-3xl p-6 space-y-2 shadow-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block">
                Jam Operasional
              </span>
              <p className="text-xs text-slate-200">Senin – Sabtu: 08:00 – 17:00 WIB</p>
              <p className="text-[11px] text-slate-400">Tim bantuan online 24/7 via chat aplikasi</p>
            </div>
          </div>

          {/* Form Column */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">Pesan Anda Berhasil Terkirim!</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Terima kasih telah menghubungi DaurNusa. Tim kami akan membalas pesan Anda ke alamat email dalam kurun waktu 1x24 jam.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-bold text-base text-slate-900 mb-4">Kirim Pesan Langsung</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nama Anda"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@domain.com"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subjek Pesan *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Contoh: Kemitraan Daur Ulang Cafe"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Isi Pesan *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tuliskan pertanyaan atau kebutuhan Anda..."
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center space-x-2 transition-colors cursor-pointer"
                    >
                      <span>Kirim Pesan</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6 pt-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <span>Pertanyaan Sering Diajukan (FAQ)</span>
            </h2>
            <p className="text-xs text-slate-500">Jawaban ringkas untuk pertanyaan umum seputar DaurNusa</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 space-y-1.5 shadow-xs">
                <h4 className="font-semibold text-xs text-slate-900">{faq.q}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
