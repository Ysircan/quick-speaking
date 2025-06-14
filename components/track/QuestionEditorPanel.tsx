"use client"

import { useState } from "react"

function AIQuestionForm({ trackId, dayIndex, onGenerated }: any) {
  return <div>AI 出题功能（开发中）</div>
}

function UploadAndGenerateForm({ trackId, dayIndex, onGenerated }: any) {
  return <div>上传文档出题功能（开发中）</div>
}

function ManualQuestionForm({ trackId, dayIndex, onAdd }: any) {
  return <div>手动出题功能（开发中）</div>
}

export default function QuestionEditorPanel({
  trackId,
  dayIndex,
  onQuestionsGenerated,
}: {
  trackId: string
  dayIndex: number
  onQuestionsGenerated: (questions: any[]) => void
}) {
  const [tab, setTab] = useState("AI")

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={() => setTab("AI")}
          className={tab === "AI" ? "font-bold" : ""}
        >
          AI 出题
        </button>
        <button
          onClick={() => setTab("UPLOAD")}
          className={tab === "UPLOAD" ? "font-bold" : ""}
        >
          上传文档
        </button>
        <button
          onClick={() => setTab("MANUAL")}
          className={tab === "MANUAL" ? "font-bold" : ""}
        >
          手动出题
        </button>
      </div>

      <div>
        {tab === "AI" && (
          <AIQuestionForm
            trackId={trackId}
            dayIndex={dayIndex}
            onGenerated={onQuestionsGenerated}
          />
        )}
        {tab === "UPLOAD" && (
          <UploadAndGenerateForm
            trackId={trackId}
            dayIndex={dayIndex}
            onGenerated={onQuestionsGenerated}
          />
        )}
        {tab === "MANUAL" && (
          <ManualQuestionForm
            trackId={trackId}
            dayIndex={dayIndex}
            onAdd={onQuestionsGenerated}
          />
        )}
      </div>
    </div>
  )
}
