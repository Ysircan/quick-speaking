"use client";

import { motion } from "framer-motion";
import RegisterForm from "@/components/auth/RegisterForm";

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
        <h1 className="text-3xl font-extrabold text-center">
          Create your account ✨
        </h1>
        <RegisterForm />
      </div>
    </motion.div>
  );
}
