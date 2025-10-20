"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Bell, Users, Clock, CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 py-12">
        {/* Hero Section */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6 border border-indigo-100">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">Platform Manajemen Jadwal Terbaik</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-6 leading-tight">
            Selamat Datang di
            <br />
            ManajemenJadwal
          </h1>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">Solusi terbaik untuk mengatur semua jadwal Anda, mengirim notifikasi otomatis, dan melacak kehadiran dengan mudah dan efisien.</p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          {user ? (
            <Link href="/schedules" className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              Lihat Jadwal Anda
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link href="/register" className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                Mulai Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-800 rounded-2xl text-lg font-semibold hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200">
                Login
              </Link>
            </>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-indigo-100">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Kelola Jadwal</h3>
            <p className="text-gray-600">Atur dan kelola semua jadwal Anda dalam satu tempat yang terorganisir dengan baik</p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Notifikasi Otomatis</h3>
            <p className="text-gray-600">Dapatkan pengingat otomatis untuk setiap jadwal penting Anda tepat waktu</p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-pink-100">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Lacak Kehadiran</h3>
            <p className="text-gray-600">Monitor dan catat kehadiran dengan sistem yang akurat dan mudah digunakan</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto w-full">
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-indigo-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span className="text-3xl font-bold text-gray-900">1000+</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Pengguna Aktif</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-purple-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">5000+</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Jadwal Dibuat</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-pink-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-pink-600" />
              <span className="text-3xl font-bold text-gray-900">10K+</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Notifikasi Terkirim</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-rose-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-rose-600" />
              <span className="text-3xl font-bold text-gray-900">99.9%</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Uptime</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </main>
  );
}
