'use client'

import { useEffect, useState } from 'react'
import StatCard from './StatCard'

interface Stats {
  courses: number
  students: number
  completion: number
  cardsEarned: number
}

export default function StatsOverview() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const res = await fetch('/api/creator/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error('Failed to fetch stats')

        const data = await res.json()
        setStats(data)
      } catch (err) {
        console.error('拉取统计信息失败:', err)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-white/80">Statistics Overview</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Courses" value={stats?.courses ?? '--'} />
        <StatCard label="Students" value={stats?.students ?? '--'} />
        <StatCard label="Completion" value={stats ? `${stats.completion}%` : '--'} />
        <StatCard label="Cards Earned" value={stats?.cardsEarned ?? '--'} />
      </div>
    </div>
  )
}
