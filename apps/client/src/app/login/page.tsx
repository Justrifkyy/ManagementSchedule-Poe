"use client";

import { useState } from "react";
import axios, { isAxiosError } from "axios";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post("http://localhost:4000/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setMessage("Login successful! Redirecting to profile...");
      setEmail("");
      setPassword("");
      window.location.href = "/"; // Redirect ke halaman profil
    } catch (error) {
      // Perbaikan: Penanganan error yang lebih aman
      if (isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Login failed. Please try again.");
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Sign In</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            {/* Perbaikan: Menambahkan htmlFor */}
            <label htmlFor="email-login" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email-login" // Perbaikan: Menambahkan id
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div>
            {/* Perbaikan: Menambahkan htmlFor */}
            <label htmlFor="password-login" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password-login" // Perbaikan: Menambahkan id
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div>
            <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Login
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
        <p className="text-center text-sm text-gray-600">
          {/* Perbaikan: Menggunakan &apos; */}
          Don&apos;t have an account?{" "}
          <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
