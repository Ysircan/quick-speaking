'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateTrackForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [durationDays, setDurationDays] = useState(7)
  const [tags, setTags] = useState('')
  const [recommendedFor, setRecommendedFor] = useState('')
  const [isFree, setIsFree] = useState(true)
  const [lang, setLang] = useState('en')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Please enter both title and description.')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      const res = await fetch('/api/create/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          durationDays,
          unlockMode: 'DAILY',
          lang,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          recommendedFor: recommendedFor.split(',').map(r => r.trim()).filter(Boolean),
          isAIgenerated: false,
          customRules: {},
          isFree,
          isPublished: false,
        }),
      })

      const data = await res.json()

      if (data.success && data.track?.id) {
        router.push(`/creator/dashboard/track/${data.track.id}/edit`)
      } else {
        alert('Failed to create track: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Track creation failed', error)
      alert('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 text-white">
      <input
        className="w-full px-4 py-2 bg-neutral-800 rounded border border-neutral-600"
        placeholder="Track Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full px-4 py-2 bg-neutral-800 rounded border border-neutral-600"
        placeholder="Short description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        min={1}
        max={60}
        className="w-full px-4 py-2 bg-neutral-800 rounded border border-neutral-600"
        placeholder="Number of days"
        value={durationDays}
        onChange={(e) => setDurationDays(Number(e.target.value))}
      />

      <input
        className="w-full px-4 py-2 bg-neutral-800 rounded border border-neutral-600"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <input
        className="w-full px-4 py-2 bg-neutral-800 rounded border border-neutral-600"
        placeholder="Recommended for (comma separated)"
        value={recommendedFor}
        onChange={(e) => setRecommendedFor(e.target.value)}
      />

      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
          />
          Free Track
        </label>

        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="bg-neutral-800 border border-neutral-600 px-2 py-1 rounded"
        >
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
      </div>

      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded text-white font-semibold"
      >
        {loading ? 'Creating...' : '🚀 Create Track'}
      </button>
    </div>
  )
}
