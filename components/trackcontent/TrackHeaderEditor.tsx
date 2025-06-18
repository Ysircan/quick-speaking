'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {fetchWithToken} from '@/lib/fetchWithToken'

interface TrackHeaderEditorProps {
  trackId: string
  initialTitle: string
  initialDescription?: string
  initialCoverImage?: string
}

export default function TrackHeaderEditor({
  trackId,
  initialTitle,
  initialDescription,
  initialCoverImage,
}: TrackHeaderEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription || '')
  const [coverImage, setCoverImage] = useState(initialCoverImage || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetchWithToken(`/api/create/track/content/${trackId}`, {
        method: 'PUT',
        body: JSON.stringify({ title, description, coverImage }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('✅ 保存成功')
      } else {
        setMessage(`❌ 保存失败：${data.error}`)
      }
    } catch (err) {
      setMessage('❌ 网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-xl shadow mb-6 space-y-4 bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold">📝 编辑训练营信息</h2>

      <div>
        <label className="block mb-1 font-medium">标题</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">简介</label>
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">封面图链接</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
        />
        {coverImage && (
          <img
            src={coverImage}
            alt="预览图"
            className="mt-2 h-32 object-cover rounded"
          />
        )}
      </div>
      
      {/* ✅ 操作按钮区 */}
      <div className="flex gap-4 mt-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? '保存中...' : '保存修改'}
        </button>

        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => router.push(`/creator/dashboard/track/${trackId}/edit`)}
        >
          ✏️ 前往任务编辑页
        </button>
      </div>

      {message && <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{message}</p>}
    </div>
  )
}
