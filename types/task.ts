// types/track.ts

export interface TaskItem {
  id?: string
  trackId: string
  dayIndex: number
  order?: number
  type: string                // SINGLE_CHOICE, MULTIPLE_CHOICE, FILL_IN_BLANK, etc.
  content: string             // 问题文本
  optionsJson?: string[]      // 选项（如有）
  correctAnswer?: string      // 正确答案（如有）
  explanation?: string        // 解析（可选）
  tags?: string[]             // 标签
  difficulty?: string         // EASY, MEDIUM, HARD
  isAIgenerated?: boolean     // 是否由 AI 生成
  appearanceWeight?: number   // 在题组中出现的权重
}

export interface TrackData {
  id: string
  title: string
  description: string
  durationDays: number
  unlockMode: string           // DAILY, LINEAR, FREE, etc.
  tags: string[]
  recommendedFor: string[]     // 推荐人群（如：初学者、考生等）
  isFree: boolean
  isPublished: boolean
  tasks: TaskItem[]
}
