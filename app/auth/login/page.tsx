'use client'

import DefaultBackground from '@/components/default/background'
import AuthPanel from '@/components/auth/AuthPanel'
import Navbar from '@/components/default/Navbar'

export default function LoginPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* 背景层 */}
      <div className="absolute inset-0 z-0">
        <DefaultBackground />
      </div>

      {/* 顶部导航栏 */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* 登录注册 UI 面板 */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 py-8 sm:py-0">
        <AuthPanel />
      </div>
    </div>
  )
}

