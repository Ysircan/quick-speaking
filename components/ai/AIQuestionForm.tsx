"use client"

import { useState } from "react"
import { TaskItem } from "@/types/task" // ✅ 路径视你实际位置可能是 ../../types/task

interface AIQuestionFormProps {
  trackId: string
  dayIndex: number
  onGenerated: (questions: TaskItem[]) => void
}

export default function AIQuestionForm({
  trackId,
  dayIndex,
  onGenerated,
}: AIQuestionFormProps) {
  const [topic, setTopic] = useState("")
  const [type, setType] = useState("选择题")
  const [count, setCount] = useState(3)
  const [loading, setLoading] = useState(false)

const handleGenerate = async () => {
  if (!topic.trim()) {
    alert("请输入关键词")
    return
  }

  if (count <= 0 || count > 10) {
    alert("题目数量需在 1~10 之间")
    return
  }

  setLoading(true)
  try {
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: topic.trim(),
        structure: [
          {
            type,
            count,
          },
        ],
      }),
    })

    const data = await res.json()
console.log("[AI生成返回结果]", data)  // 👈 就是加这一行
if (data.success && Array.isArray(data.questions)) {
  const questions: TaskItem[] = data.questions.map((q: any, i: number) => ({
    id: `${Date.now()}-${i}`,
    trackId,
    dayIndex,
    isAIgenerated: true,
    type,                           // 👈 当前选择的题型
    content: q.question,            // 👈 这一步最关键 ✅
    options: q.options ?? [],
    answer: q.answer ?? "",
  }))
  onGenerated(questions)
}
 else {
      console.warn("生成返回格式异常", data.error)
    }
  } catch (err) {
    console.error("生成题目失败", err)
  } finally {
    setLoading(false)
  }
  
}


  return (
    <div className="space-y-4 p-4 bg-neutral-900 rounded-xl">
      <div>
        <label className="text-sm block mb-1">输入关键词</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="例如：中学历史、简历写作"
          className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700"
        />
      </div>

      <div className="flex gap-4">
        <div>
          <label className="text-sm block mb-1">题型</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 rounded bg-neutral-800 border border-neutral-700"
          >
            <option value="选择题">选择题</option>
            <option value="填空题">填空题</option>
            <option value="简答题">简答题</option>
          </select>
        </div>

        <div>
          <label className="text-sm block mb-1">题目数量</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 px-3 py-2 rounded bg-neutral-800 border border-neutral-700"
            min={1}
            max={10}
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !topic}
        className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-white mt-2"
      >
        {loading ? "生成中..." : "生成题目"}
      </button>
    </div>
  )
}
