"use client";

import { motion } from "framer-motion";
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 80, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4"
    >
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-extrabold text-center">创建你的账号 ✨</h1>
        <RegisterForm />

        <p className="text-sm text-center text-gray-400">
          已有账号？
          <Link
            href="/auth/login"
            className="ml-1 underline text-purple-400 hover:text-purple-300 transition"
          >
            去登录
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
