'use client'

import { useState } from 'react'
import {
  Store,
  Library,
  BookOpenCheck,
  LayoutDashboard,
  BarChart2,
} from 'lucide-react'

import StoreTrackList from './StoreTrackList'
import LibraryPanel from './LibraryPanel'
import CardGallery from './CardGallery'
import MistakeNotebook from './MistakeNotebook'
import GrowthStats from './GrowthStats'

const navItems = [
  { key: 'store', label: '商城首页', icon: Store },
  { key: 'library', label: '我的训练营', icon: Library },
  { key: 'cards', label: '卡牌图册', icon: BookOpenCheck },
  { key: 'mistakes', label: '错题本', icon: LayoutDashboard },
  { key: 'stats', label: '成长轨迹', icon: BarChart2 },
]

export default function StoreShell() {
  const [activeKey, setActiveKey] = useState('store')

  const renderPanel = () => {
    switch (activeKey) {
      case 'store':
        return <StoreTrackList />
      case 'library':
        return <LibraryPanel />
      case 'cards':
        return <CardGallery />
      case 'mistakes':
        return <MistakeNotebook />
      case 'stats':
        return <GrowthStats />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部横幅 */}
      <div className="w-full h-56 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
        🎉 学习节启动！限时训练营上线中
      </div>

      {/* 顶部横向导航栏 */}
      <nav className="bg-white shadow-sm border-b px-8 py-3 flex gap-6">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveKey(item.key)}
            className={`flex items-center gap-2 text-sm font-medium transition px-3 py-1.5 rounded ${
              activeKey === item.key
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-800 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* 主内容区域 */}
      <main className="p-8">{renderPanel()}</main>
    </div>
  )
}
