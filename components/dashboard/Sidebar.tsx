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
      className={`
        h-screen transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
        shrink-0 bg-white/5 backdrop-blur-lg border-r border-white/10
        p-4 flex flex-col space-y-4
        fixed sm:static top-0 left-0 z-50
      `}
    >
      {/* 折叠按钮 */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-white text-2xl ml-auto sm:ml-0 sm:self-end"
      >
        ☰
      </button>

      {/* 标题 */}
      {!collapsed && (
        <h1 className="text-lg font-bold text-purple-300">Quick Creator</h1>
      )}

      {/* 用户名 */}
      {!collapsed && (
        <div className="text-white/60 text-sm">Hi, {userName}</div>
      )}

      {/* 导航菜单 */}
      <nav className="space-y-3 mt-4 text-sm">
        <SidebarLink href="/creator/dashboard" icon="🏠" label="Dashboard" collapsed={collapsed} />
        <SidebarLink href="/creator/dashboard/track" icon="📚" label="Courses" collapsed={collapsed} />
        <SidebarLink href="/creator/dashboard/track/new" icon="🛠" label="New Track" collapsed={collapsed} />
        <SidebarLink href="/creator/dashboard/reports" icon="📈" label="Reports" collapsed={collapsed} />
      </nav>
    </div>
  )
}

function SidebarLink({
  href,
  icon,
  label,
  collapsed,
}: {
  href: string
  icon: string
  label: string
  collapsed: boolean
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 text-white/80 hover:text-white transition"
    >
      <span>{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}
