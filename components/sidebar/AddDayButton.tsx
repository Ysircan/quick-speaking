'use client'

import { useState, useEffect } from 'react'

interface AddDayButtonProps {
  trackId: string
  currentDayCount: number
  onSuccess?: () => void
  className?: string
}

export default function AddDayButton({
  trackId,
  currentDayCount,
  onSuccess,
  className = '',
}: AddDayButtonProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [fadeOut, setFadeOut] = useState(false)

  const handleAddDay = async () => {
    setLoading(true)
    setMessage(null)

    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('❌ Please log in first')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/create/track/sidebar/${trackId}/day/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await res.json()

      if (res.ok) {
        const newDayNumber = currentDayCount + 1
        setMessage(`✅ Day ${newDayNumber} added`)
        onSuccess?.()
      } else {
        setMessage(`❌ Failed: ${result.error || 'Unknown error'}`)
      }
    } catch (err) {
      setMessage('❌ Network error')
    } finally {
      setLoading(false)
    }
  }

  // 👇 控制淡出逻辑
  useEffect(() => {
    if (message) {
      setFadeOut(false)
      const timer1 = setTimeout(() => setFadeOut(true), 2000)
      const timer2 = setTimeout(() => setMessage(null), 3000)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [message])

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        onClick={handleAddDay}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 text-sm text-white rounded"
      >
        {loading ? 'Adding...' : '➕ Add Day'}
      </button>

      {message && (
        <p
          className={`text-xs text-white/70 transition-opacity duration-1000 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
