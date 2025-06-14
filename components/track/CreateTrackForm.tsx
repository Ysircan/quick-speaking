"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateTrackForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [durationDays, setDurationDays] = useState(14)
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    const token = localStorage.getItem("token")
    if (!token) return alert("未登录")

    setLoading(true)

    const res = await fetch("/api/create/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        coverImage: "",
        durationDays,
        unlockMode: "DAILY",
        lang: "zh",
        tags: [],
        recommendedFor: [],
        isAIgenerated: false,
        customRules: {},
        isFree: true,
        isPublished: false,
      }),
    })

    const data = await res.json()

    if (data.success) {
      router.push(`/track/${data.track.id}/edit`)
    } else {
      alert("创建失败：" + data.error)
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="训练营标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 rounded bg-neutral-800 border border-neutral-700 text-white"
      />
      <textarea
        placeholder="训练营简介"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-2 rounded bg-neutral-800 border border-neutral-700 text-white"
      />
      <input
        type="number"
        min={1}
        max={30}
        value={durationDays}
        onChange={(e) => setDurationDays(Number(e.target.value))}
        className="w-full px-4 py-2 rounded bg-neutral-800 border border-neutral-700 text-white"
        placeholder="持续天数"
      />
      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded"
      >
        {loading ? "创建中..." : "创建训练营"}
      </button>
    </div>
  )
}
