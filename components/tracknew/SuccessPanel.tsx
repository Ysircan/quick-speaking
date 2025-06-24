'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SuccessPanel({ trackId }: { trackId: string | null }) {
  const router = useRouter()

  useEffect(() => {
    if (trackId) {
      const timer = setTimeout(() => {
        router.push(`/creator/dashboard/track/${trackId}/edit`)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [trackId, router])

  if (!trackId) {
    return (
      <div className="w-full max-w-md mx-auto bg-white text-black p-8 rounded-3xl shadow-2xl space-y-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">❌ Creation Failed</h2>
        <p className="text-gray-600">Something went wrong and the track was not saved.</p>
        <button
          onClick={() => router.refresh()}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white text-black p-8 rounded-3xl shadow-2xl space-y-6 text-center">
      <h2 className="text-3xl font-bold">🎉 Track Created!</h2>
      <p className="text-gray-700">Your training camp has been saved successfully.</p>
      <p className="text-sm text-gray-500">Redirecting to editor...</p>

      <button
        onClick={() => router.push(`/creator/dashboard/track/${trackId}/edit`)}
        className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Go to Editor Now →
      </button>
    </div>
  )
}
