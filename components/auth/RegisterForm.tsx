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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async () => {
    setError(null);

    if (!name || !email || !password || !confirm) {
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
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Registration failed.");
      }

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
