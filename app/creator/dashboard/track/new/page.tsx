"use client"

import CreateTrackForm from "@/components/track/CreateTrackForm"
import useAuth from "@/hooks/useAuth"

export default function NewTrackPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Unauthorized access. Please log in first.
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-white">
      <h1 className="text-2xl font-bold mb-6">🎯 Create a New Bootcamp</h1>
      <CreateTrackForm />
    </div>
  )
}
