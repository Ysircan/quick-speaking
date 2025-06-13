// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.error || "登录失败");
      return;
    }

    localStorage.setItem("token", data.token);
   if (data.user.role === "CREATOR") {
  router.push("/creator/dashboard");
} else {
  router.push("/store");
}

  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold">登录</h2>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <input
        type="email"
        placeholder="邮箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded bg-black text-white"
      />
      <input
        type="password"
        placeholder="密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded bg-black text-white"
      />

      <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded">
        登录
      </button>
    </form>
  );
}
