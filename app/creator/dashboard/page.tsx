"use client"; // ⬅️ Required for client-side rendering

import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import LogoutButton from "@/components/auth/LogoutButton";

export default function CreatorDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white space-y-4">
      <h1 className="text-3xl font-bold">🎓 Welcome back, {user?.name}!</h1>
      <p className="text-sm text-gray-400">Your role: {user?.role}</p>

      <button
        onClick={() => router.push("/creator/dashboard/track/new")}
        className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-all"
      >
        + Create New Bootcamp
      </button>

      <LogoutButton />
    </div>
  );
}
