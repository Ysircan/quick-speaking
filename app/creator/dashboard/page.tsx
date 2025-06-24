'use client'

import { useEffect, useState } from 'react'
import DefaultBackground from '@/components/default/background'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import RecentTracks from '@/components/dashboard/RecentTracks'
import StatsOverview from '@/components/dashboard/StatsOverview'
import RecentEnrollments from '@/components/dashboard/RecentEnrollments'

export default function CreatorDashboardPage() {
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        console.log('✅ 当前用户信息:', data)
        setUserName(data.user?.name ?? 'Creator')
      } catch (err) {
        console.error('❌ 获取用户失败:', err)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden">
      {/* 背景层 - z-0 */}
      <DefaultBackground />

      {/* 内容层 - z-10 */}
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        {/* Sidebar 区域 */}
        <aside className="hidden md:block">
          <Sidebar userName={userName} />
        </aside>

        {/* 主内容区域 */}
        <main className="flex-1 px-4 sm:px-6 py-12 sm:py-16 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-16">
            <DashboardHeader userName={userName} />
            <RecentTracks />
            <StatsOverview />
            <RecentEnrollments />
          </div>
        </main>
      </div>
    </div>
  )
}
