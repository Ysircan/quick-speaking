'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SidebarProps {
  userName: string
}

export default function Sidebar({ userName }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={`h-screen transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      } shrink-0 bg-white/5 backdrop-blur-lg border-r border-white/10 p-4 space-y-4 flex flex-col`}
    >
      {/* 折叠按钮 */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-white text-2xl ml-auto block"
      >
        ☰
      </button>

      {/* 标题 */}
      {!collapsed && (
        <h1 className="text-lg font-bold text-purple-300">Quick Creator</h1>
      )}

      {/* 用户名 */}
      {!collapsed && (
        <div className="text-white/60 text-sm px-1">Hi, {userName}</div>
      )}

      {/* 导航菜单 */}
      <nav className="space-y-2 text-sm">
        <Link href="#" className="flex items-center space-x-2 text-white/80 hover:text-white">
          <span>🏠</span>
          {!collapsed && <span>Dashboard</span>}
        </Link>
        <Link href="#" className="flex items-center space-x-2 text-white/80 hover:text-white">
          <span>📚</span>
          {!collapsed && <span>Courses</span>}
        </Link>
        <Link href="#" className="flex items-center space-x-2 text-white/80 hover:text-white">
          <span>🛠</span>
          {!collapsed && <span>New Track</span>}
        </Link>
        <Link href="#" className="flex items-center space-x-2 text-white/80 hover:text-white">
          <span>📈</span>
          {!collapsed && <span>Reports</span>}
        </Link>
      </nav>
    </div>
  )
}
