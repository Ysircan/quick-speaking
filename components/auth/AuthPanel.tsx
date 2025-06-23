'use client'

import { useState } from 'react'
import AuthTabSwitcher from './AuthTabSwitcher'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function AuthPanel() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

  return (
    <div className="w-full max-w-sm bg-[#0a0a23cc] backdrop-blur-md px-8 py-12 shadow-2xl flex flex-col justify-center text-white rounded-2xl border border-white/10">
      <h1 className="text-3xl font-bold text-white mb-2 tracking-widest text-center drop-shadow-lg">
        QUICK
      </h1>
      <p className="text-sm text-white/70 mb-6 text-center">
        Welcome to your card-powered world ✨
      </p>

      <AuthTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>

      <p className="text-center text-xs text-white/40 mt-8">
        © 2025 QUICK Platform · v1.0.0
      </p>
    </div>
  )
}
