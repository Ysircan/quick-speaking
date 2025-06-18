// app/auth/login/page.tsx
"use client";

import { motion } from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <motion.div
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -80, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4"
    >
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-extrabold text-center">Welcome back 👋</h1>
        <LoginForm />

        <p className="text-sm text-center text-gray-400">
          Don't have an account?
          <Link
            href="/auth/register"
            className="ml-1 underline text-purple-400 hover:text-purple-300 transition"
          >
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
