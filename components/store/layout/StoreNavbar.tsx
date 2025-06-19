// components/store/layout/StoreNavbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Store,
  Library,
  BookOpenCheck,
  LayoutDashboard,
  BarChart2,
  User,
} from 'lucide-react'

const navItems = [
  { key: 'store', label: '商城首页', icon: Store, href: '/store' },
  { key: 'library', label: '我的训练营', icon: Library, href: '/login' },
  { key: 'cards', label: '卡牌图册', icon: BookOpenCheck, href: '/login' },
  { key: 'mistakes', label: '错题本', icon: LayoutDashboard, href: '/login' },
  { key: 'stats', label: '成长轨迹', icon: BarChart2, href: '/login' },
]

export default function StoreNavbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-[#1b2838] text-gray-300 px-10 py-3 flex items-center">
      <div className="flex gap-6 mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-2 text-sm font-medium transition ${
                isActive
                  ? 'text-white'
                  : 'hover:text-white hover:underline'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* 右上角用户信息 */}
      <div className="ml-auto flex items-center gap-2 text-sm text-gray-400">
        <User className="w-5 h-5" />
        未登录
      </div>
    </nav>
  )
}
