'use client'

import { ReactNode } from 'react'
import StoreNavbar from './StoreNavbar'

export default function StoreShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* 最顶部导航栏 */}
      <StoreNavbar />

      {/* 顶部横幅 */}
      <div className="w-full h-56 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow">
        🎉 学习节启动！限时训练营上线中
      </div>

      {/* 主内容区域 */}
      <main className="p-8 max-w-6xl mx-auto">{children}</main>
    </div>
  )
}
