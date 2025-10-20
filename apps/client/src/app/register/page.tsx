"use client";

import { useState, FormEvent } from "react";
import axios, { isAxiosError } from "axios";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PARTICIPANT"); // Peran default adalah Participant
  const [message, setMessage] = useState("");

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:4000/auth/register", {
        username,
        email,
        password,
        role: role, // Kirim peran yang dipilih ke backend
      });

      setMessage(response.data.message + " Silakan login.");
      // Kosongkan form setelah berhasil
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("PARTICIPANT");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Registration failed. Please try again.");
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Create an Account</h1>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Register as</label>
            <div className="mt-2 flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input type="radio" name="role" value="PARTICIPANT" checked={role === "PARTICIPANT"} onChange={(e) => setRole(e.target.value)} className="form-radio text-indigo-600 text-black" />
                <span className="ml-2 text-gray-800">Participant</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="role" value="ORGANIZER" checked={role === "ORGANIZER"} onChange={(e) => setRole(e.target.value)} className="form-radio text-indigo-600 text-black" />
                <span className="ml-2 text-gray-800">Organizer</span>
              </label>
            </div>
          </div>

          <div>
            <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Register
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
