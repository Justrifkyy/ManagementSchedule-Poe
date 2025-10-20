"use client";

import { useState, useEffect, useMemo, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface UserSchedule {
  id: number;
  title: string;
  description: string;
  schedule_time: string;
  status: "ATTENDING" | "NOT_ATTENDING" | "PENDING" | null;
}

interface UserProfileData {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "ORGANIZER" | "PARTICIPANT";
  full_name: string | null;
  address: string | null;
  bio: string | null;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [schedules, setSchedules] = useState<UserSchedule[]>([]);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const response = await axios.get("http://localhost:4000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);
      } catch (err) {
        setError("Gagal memuat data profil.");
      }
    };
    fetchProfile();
  }, [router]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const response = await axios.get("http://localhost:4000/attendances/my-schedules", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(response.data);
      } catch (err) {
        setError("Gagal memuat data jadwal.");
      }
    };
    fetchSchedules();
  }, [router]);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "http://localhost:4000/auth/profile",
        {
          full_name: profileData?.full_name,
          address: profileData?.address,
          bio: profileData?.bio,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
      alert("Profil berhasil diperbarui!");
    } catch (err) {
      setError("Gagal memperbarui profil.");
    }
  };

  const { eventLists, stats } = useMemo(() => {
    const now = new Date();
    const finished: UserSchedule[] = [];
    const upcoming: UserSchedule[] = [];
    const rejected: UserSchedule[] = [];
    let attendedCount = 0,
      finishedCount = 0,
      rejectedCount = 0;
    for (const schedule of schedules) {
      const scheduleTime = new Date(schedule.schedule_time);
      if (schedule.status === "NOT_ATTENDING") {
        rejected.push(schedule);
        rejectedCount++;
      } else if (scheduleTime < now) {
        finished.push(schedule);
        finishedCount++;
        if (schedule.status === "ATTENDING") {
          attendedCount++;
        }
      } else {
        upcoming.push(schedule);
      }
    }
    return { eventLists: { finished, upcoming, rejected }, stats: { finished: finishedCount, attended: attendedCount, rejected: rejectedCount } };
  }, [schedules]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard Profil</h1>
          <p className="text-gray-500 mt-2">Kelola informasi dan aktivitas Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Profil</h2>
                <button onClick={() => setIsEditing(!isEditing)} className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                  {isEditing ? "Batal" : "Edit"}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label htmlFor="full_name" className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      value={profileData.full_name || ""}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                      Alamat
                    </label>
                    <textarea
                      id="address"
                      value={profileData.address || ""}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={profileData.bio || ""}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold text-sm transition-colors">
                    Simpan Perubahan
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold uppercase">Username</p>
                    <p className="text-gray-800 font-medium mt-1">{profileData.username}</p>
                  </div>
                  <div className="py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold uppercase">Email</p>
                    <p className="text-gray-800 font-medium mt-1">{profileData.email}</p>
                  </div>
                  <div className="py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold uppercase">Nama Lengkap</p>
                    <p className="text-gray-800 font-medium mt-1">{profileData.full_name || "-"}</p>
                  </div>
                  <div className="py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold uppercase">Alamat</p>
                    <p className="text-gray-800 font-medium mt-1 text-sm">{profileData.address || "-"}</p>
                  </div>
                  <div className="py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold uppercase">Bio</p>
                    <p className="text-gray-800 font-medium mt-1 text-sm">{profileData.bio || "-"}</p>
                  </div>
                  <div className="py-3">
                    <p className="text-xs text-gray-500 font-semibold uppercase">Peran</p>
                    <p className="mt-1">
                      <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-semibold rounded-full">{profileData.role.toLowerCase()}</span>
                    </p>
                  </div>
                  <button onClick={handleLogout} className="w-full mt-6 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-semibold text-sm transition-colors">
                    Logout
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Statistik Event</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">Selesai</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.finished}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">Dihadiri</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{stats.attended}</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">Ditolak</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{stats.rejected}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-5">Event Akan Datang</h3>
              {eventLists.upcoming.length > 0 ? (
                <div className="space-y-3">
                  {eventLists.upcoming.map((s) => (
                    <EventCard key={s.id} schedule={s} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">Tidak ada event yang akan datang.</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-5">Event Selesai</h3>
              {eventLists.finished.length > 0 ? (
                <div className="space-y-3">
                  {eventLists.finished.map((s) => (
                    <EventCard key={s.id} schedule={s} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">Belum ada event yang selesai.</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-5">Event Ditolak</h3>
              {eventLists.rejected.length > 0 ? (
                <div className="space-y-3">
                  {eventLists.rejected.map((s) => (
                    <EventCard key={s.id} schedule={s} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">Tidak ada event yang ditolak.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ schedule }: { schedule: UserSchedule }) {
  const getStatusBadge = (status: UserSchedule["status"]) => {
    if (status === "ATTENDING") return <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Dihadiri</span>;
    if (status === "NOT_ATTENDING") return <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">Ditolak</span>;
    return <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">Menunggu</span>;
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-sm">{schedule.title}</h4>
          <p className="text-xs text-gray-500 mt-2">📅 {new Date(schedule.schedule_time).toLocaleString("id-ID")}</p>
        </div>
        {getStatusBadge(schedule.status)}
      </div>
    </div>
  );
}
