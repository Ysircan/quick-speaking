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

        // 🔥 关键在这，正确读取嵌套字段
        setUserName(data.user?.name ?? 'Creator')
      } catch (err) {
        console.error('❌ 获取用户失败:', err)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="relative text-white min-h-screen overflow-hidden">
      <DefaultBackground />

      <div className="relative z-10 flex">
        <Sidebar userName={userName} />

        <main className="flex-1 px-6 py-16 flex justify-center">
          <div className="max-w-5xl w-full space-y-16">
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
