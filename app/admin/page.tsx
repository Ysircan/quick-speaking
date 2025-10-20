"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";

export default function AdminHome() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // 未登录 → 去登录
      if (!user) {
        router.replace("/auth/login?next=/admin");
        return;
      }
      // 已登录但不是管理员 → 回首页
      if (!user.isSystemAccount) {
        router.replace("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !user.isSystemAccount) {
    // 简单占位：加载中或正在重定向
    return (
      <div className="min-h-screen grid place-items-center text-white">
        <div className="opacity-70">Loading…</div>
      </div>
    );
  }

  // ✅ 只有管理员能看到这里
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 opacity-80">只有管理员可见的后台首页。</p>
      {/* 这里以后再逐步加学生学习数据的模块 */}
    </main>
  );
}
