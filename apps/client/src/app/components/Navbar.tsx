"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Home, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 shadow-lg relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-10 left-1/3 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo dengan Icon */}
          <div className="flex-shrink-0 group">
            <Link href="/" className="flex items-center space-x-3 transition-transform duration-300 hover:scale-105">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
                <div className="relative bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <Calendar className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold text-white tracking-tight">
                  Manajemen<span className="text-purple-200">Jadwal</span>
                </span>
                <div className="h-0.5 bg-gradient-to-r from-white/0 via-white/50 to-white/0 group-hover:via-white/80 transition-all"></div>
              </div>
            </Link>
          </div>

          {/* Menu Navigasi Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              <Link href="/" className="group relative text-white/90 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20">
                <span className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>

              {user && (
                <Link
                  href="/schedules"
                  className="group relative text-white/90 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                >
                  <span className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Schedules</span>
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </Link>
              )}
            </div>
          </div>

          {/* Tombol Aksi Desktop */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/profile"
                    className="group flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30"
                  >
                    <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-all">
                      <User className="h-4 w-4" />
                    </div>
                    <span>Hi, {user.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="group flex items-center space-x-2 bg-red-500/90 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/50 hover:scale-105"
                  >
                    <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login" className="bg-white/10 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 hover:scale-105">
                    Login
                  </Link>
                  <Link href="/register" className="bg-white text-indigo-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-white/50 hover:scale-105">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fadeIn">
            <Link href="/" className="flex items-center space-x-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl text-sm font-medium transition-all" onClick={() => setMobileMenuOpen(false)}>
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            {user && (
              <Link href="/schedules" className="flex items-center space-x-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl text-sm font-medium transition-all" onClick={() => setMobileMenuOpen(false)}>
                <Calendar className="h-4 w-4" />
                <span>Schedules</span>
              </Link>
            )}

            <div className="pt-2 space-y-2">
              {user ? (
                <>
                  <Link href="/profile" className="flex items-center space-x-2 bg-white/10 text-white px-4 py-3 rounded-xl text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                    <User className="h-4 w-4" />
                    <span>Hi, {user.username}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 bg-red-500 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block bg-white/10 text-white px-4 py-3 rounded-xl text-sm font-medium text-center" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="block bg-white text-indigo-700 px-4 py-3 rounded-xl text-sm font-bold text-center" onClick={() => setMobileMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom gradient line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </nav>
  );
}
