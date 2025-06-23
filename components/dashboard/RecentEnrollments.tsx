'use client'

import { useEffect, useState } from 'react'

interface Enrollment {
  id: string
  studentName: string
  trackTitle: string
  enrolledAt: string
}

export default function RecentEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const res = await fetch('/api/creator/dashboard/enrollments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error(`请求失败：${res.status}`)
        const data = await res.json()
        setEnrollments(data.enrollments || [])
      } catch (err) {
        console.error('拉取报名信息失败:', err)
      }
    }

    fetchEnrollments()
  }, [])

  return (
    <div className="space-y-4 mt-10">
      <h3 className="text-base font-semibold text-white/80">Recent Enrollments</h3>
      {enrollments.length === 0 ? (
        <p className="text-sm text-white/50">No recent enrollments.</p>
      ) : (
        <ul className="space-y-2">
          {enrollments.map((item) => (
            <li
              key={item.id}
              className="bg-white/5 backdrop-blur-md rounded-lg p-4 text-sm text-white/90 flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{item.studentName}</div>
                <div className="text-white/60">
                  joined <span className="italic">{item.trackTitle}</span>
                </div>
              </div>
              <div className="text-xs text-white/40">
                {new Date(item.enrolledAt).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
