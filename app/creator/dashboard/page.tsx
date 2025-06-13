"use client"; // ⬅️ 必须加这句，让页面运行在客户端

import useAuth from "@/hooks/useAuth";
import LogoutButton from "@/components/auth/LogoutButton";

export default function CreatorDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white space-y-4">
      <h1 className="text-3xl font-bold">🎓 欢迎回来，{user?.name}！</h1>
      <p className="text-sm text-gray-400">您的角色是：{user?.role}</p>
      <LogoutButton />
    </div>
  );
}
