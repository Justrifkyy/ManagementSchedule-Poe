"use client";

import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

export default function EditSchedulePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchScheduleData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/schedules/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const schedule = response.data;
        setTitle(schedule.title);
        setDescription(schedule.description);
        const formattedDate = new Date(schedule.schedule_time).toISOString().slice(0, 16);
        setScheduleTime(formattedDate);
      } catch (_err) {
        // Perbaikan: Variabel tidak terpakai
        setError("Failed to fetch schedule data.");
      }
    };

    fetchScheduleData();
  }, [id, router]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formattedScheduleTime = scheduleTime.replace("T", " ") + ":00"; // Tambah detik

    try {
      await axios.put(`http://localhost:4000/schedules/${id}`, { title, description, schedule_time: formattedScheduleTime }, { headers: { Authorization: `Bearer ${token}` } });
      router.push("/dashboard");
    } catch (_err) {
      // Perbaikan: Variabel tidak terpakai
      setError("Failed to update schedule.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Edit Schedule</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            {/* ## PERBAIKAN UTAMA DI SINI ## */}
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black" />
          </div>
          <div>
            <label htmlFor="schedule_time" className="block text-sm font-medium text-gray-700">
              Schedule Time
            </label>
            <input type="datetime-local" id="schedule_time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black" />
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Save Changes
            </button>
            <button type="button" onClick={() => router.push("/dashboard")} className="w-full px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400">
              Cancel
            </button>
          </div>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </main>
  );
}
