// /hooks/useAuth.ts
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useUser from "./useUser";

/**
 * 页面登录校验：未登录自动跳转到 login 页
 * @param redirectTo 默认跳转路径（未登录时）
 */
export default function useAuth(redirectTo: string = "/auth/login") {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, redirectTo, router]);

  return { user, loading };
}
