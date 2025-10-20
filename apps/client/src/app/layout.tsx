import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "./components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aplikasi Manajemen Jadwal",
  description: "Dibuat dengan arsitektur Microservice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar /> {/* <-- 2. Letakkan Navbar di sini agar selalu tampil */}
          <main>{children}</main> {/* <-- 3. Bungkus konten halaman dengan <main> untuk struktur yang baik */}
        </AuthProvider>
      </body>
    </html>
  );
}
