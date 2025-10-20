"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NameInput from "./NameInput";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import ConfirmPasswordInput from "./ConfirmPasswordInput";
import SubmitButton from "./SubmitButton";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ✅ 发送邮箱验证码
  const handleSendCode = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "SIGNUP" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send code.");
      alert("Verification code sent to your email.");
    } catch (err) {
      setError("Failed to send verification code.");
    } finally {
      setSending(false);
    }
  };

  // ✅ 提交注册
  const handleRegister = async () => {
    setError(null);

    if (!name || !email || !password || !confirm || !code) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, code }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      // ✅ 注册成功：跳转到登录页
      alert("Registration successful. Please log in.");
      router.push("/auth/login?signup=1");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <NameInput value={name} onChange={setName} />
      <EmailInput value={email} onChange={setEmail} />

      {/* 验证码输入框 + 按钮 */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSendCode}
          disabled={sending}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>

      <PasswordInput value={password} onChange={setPassword} />
      <ConfirmPasswordInput value={confirm} onChange={setConfirm} />

      {error && (
        <p className="text-red-400 text-sm text-center font-medium">{error}</p>
      )}

      <SubmitButton onClick={handleRegister} loading={loading}>
        Register
      </SubmitButton>
    </div>
  );
}
