"use client"

import CreateTrackForm from "@/components/track/CreateTrackForm"
import useAuth from "@/hooks/useAuth"

export default function NewTrackPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        加载中...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        未授权访问，请先登录。
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-white">
      <h1 className="text-2xl font-bold mb-6">🎯 创建新的训练营</h1>
      <CreateTrackForm />
    </div>
  )
}
