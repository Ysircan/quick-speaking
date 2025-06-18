"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PARTICIPANT");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.error || "Registration failed.");
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
      <h2 className="text-2xl font-bold">Create Account</h2>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 border rounded bg-black text-white"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded bg-black text-white"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded bg-black text-white"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full px-4 py-2 border rounded bg-black text-white"
      >
        <option value="PARTICIPANT">Participant</option>
        <option value="CREATOR">Creator</option>
      </select>

      <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded">
        Sign Up
      </button>
    </form>
  );
}
