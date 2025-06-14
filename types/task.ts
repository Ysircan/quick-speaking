export interface TaskItem {
  id?: string             // 保存后数据库生成的 ID（本地未保存时可为空）
  dayIndex: number        // 属于第几天
  type: string            // 题型，如 choice, cloze, short 等
  content?: string        // 题干预览（AI 生成/手动填写）
  options?: string[]      // 如果是选择题
  answer?: string         // 正确答案
}
// 如果没有，加上👇
export interface TrackData {
  id: string
  title: string
  description: string
  durationDays: number
  unlockMode: string
  tags: string[]
  recommendedFor: string[]
  isFree: boolean
  isPublished: boolean
  tasks: TaskItem[]
}