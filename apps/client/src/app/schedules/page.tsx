"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Papa from "papaparse";
import { useAuth } from "@/context/AuthContext";
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Clock, Download, Calendar, FileText } from "lucide-react";

// ======== Interface ========
interface Schedule {
  id: number;
  title: string;
  description: string;
  schedule_time: string;
}

// ======== Dashboard Component ========
export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [error, setError] = useState("");

  // ======== Fetch Jadwal ========
  const fetchSchedules = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:4000/schedules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(response.data);
    } catch (err) {
      setError("Gagal memuat data jadwal.");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // ======== Tambah Jadwal (Admin) ========
  const handleCreateSchedule = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formattedTime = scheduleTime.replace("T", " ") + ":00";

    try {
      await axios.post(
        "http://localhost:4000/schedules",
        {
          title,
          description,
          schedule_time: formattedTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle("");
      setDescription("");
      setScheduleTime("");
      fetchSchedules();
    } catch (err) {
      console.error(err);
      setError("Gagal menambahkan jadwal baru.");
    }
  };

  // ======== Hapus Jadwal (Admin) ========
  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:4000/schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(schedules.filter((s) => s.id !== id));
    } catch (err) {
      setError("Gagal menghapus jadwal.");
    }
  };

  // ======== Update Kehadiran ========
  const handleAttendance = async (scheduleId: number, status: "ATTENDING" | "NOT_ATTENDING" | "COMPLETED" | "MISSED") => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("http://localhost:4000/attendances", { schedule_id: scheduleId, status }, { headers: { Authorization: `Bearer ${token}` } });

      alert(response.data.message || "Status kehadiran diperbarui!");
    } catch (err) {
      console.error(err);
      setError("Gagal memperbarui status kehadiran.");
    }
  };

  // ======== Ekspor CSV (Admin) ========
  const handleExport = async (scheduleId: number, title: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:4000/attendances/report/${scheduleId}`, { headers: { Authorization: `Bearer ${token}` } });

      if (!response.data || response.data.length === 0) {
        alert("Tidak ada data kehadiran untuk diekspor.");
        return;
      }

      const csv = Papa.unparse(response.data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `Laporan-Kehadiran-${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Gagal mengekspor laporan ke CSV.");
    }
  };

  // ======== Render ========
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Kelola jadwal dan kehadiran Anda</p>
        </div>

        {/* FORM ADMIN */}
        {user?.role === "ADMIN" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Plus className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Buat Jadwal Baru</h2>
            </div>
            <form onSubmit={handleCreateSchedule} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Judul Jadwal</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Masukkan judul jadwal"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Masukkan deskripsi jadwal"
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Waktu Jadwal</label>
                <input
                  type="datetime-local"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
              <button type="submit" className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Tambah Jadwal
              </button>
            </form>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* DAFTAR JADWAL */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Daftar Jadwal</h2>
          </div>

          {schedules.length > 0 ? (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-shadow bg-gradient-to-br from-slate-50 to-white">
                  {/* HEADER JADWAL */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900 mb-2">{schedule.title}</h3>
                      <p className="text-slate-600 text-sm mb-3">{schedule.description}</p>
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Clock className="w-4 h-4" />
                        <p>{new Date(schedule.schedule_time).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })}</p>
                      </div>
                    </div>

                    {/* ADMIN ACTIONS */}
                    {user?.role === "ADMIN" && (
                      <div className="flex gap-2 ml-4">
                        <Link href={`/dashboard/edit/${schedule.id}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-2 text-sm font-medium">
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(schedule.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center gap-2 text-sm font-medium">
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ATTENDANCE BUTTONS */}
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button onClick={() => handleAttendance(schedule.id, "ATTENDING")} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition font-medium text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Hadir
                      </button>
                      <button onClick={() => handleAttendance(schedule.id, "NOT_ATTENDING")} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-medium text-sm flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Tidak Hadir
                      </button>
                      <button onClick={() => handleAttendance(schedule.id, "COMPLETED")} className="px-4 py-2 bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition font-medium text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Selesai
                      </button>
                      <button onClick={() => handleAttendance(schedule.id, "MISSED")} className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition font-medium text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Terlewat
                      </button>
                    </div>

                    {/* EXPORT BUTTON (ADMIN ONLY) */}
                    {user?.role === "ADMIN" && (
                      <button onClick={() => handleExport(schedule.id, schedule.title)} className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition font-medium text-sm flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Ekspor CSV
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Belum ada jadwal tersedia.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
