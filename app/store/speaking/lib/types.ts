// speaking/lib/types.ts

// ===== 基础枚举 =====
export type Task = 'ra' | 'rs' | 'sgd'
export type Mode = 'word' | 'sentence'

// 你原来的分桶与排序，保留
export type Bucket = 'all' | 'low' | 'med' | 'high'   // low:<5, med:5–10, high:>10
export type SortKey = 'freq' | 'alpha'

// ===== 数据项类型 =====
export type WordItem = {
  id: string
  word: string
  word_norm: string
  audio: string
  freq: number
  tags: string
}

export type SentenceItem = {
  id: string
  text: string
  audio: string
  lesson: string | null
  order: number | null
  tag: string
  tokens?: string[]     // tokens=true 时后端返回
}

// ===== 统一搜索响应基类 =====
export type NextCursor = { page: number; pageSize: number } | null

export type SearchBase = {
  task: Task
  mode: Mode
  total: number
  page: number
  pageSize: number
  nextCursor: NextCursor
}

// 两种模式的响应
export type WordSearchResp = SearchBase & {
  mode: 'word'
  items: WordItem[]
}

export type SentenceSearchResp = SearchBase & {
  mode: 'sentence'
  items: SentenceItem[]
  // withDict=true 时返回：本页句子中命中的词典映射
  dict?: Record<string, { audio?: string; freq: number }>
}

// 统一联合类型（主搜索接口返回）
export type SearchResp = WordSearchResp | SentenceSearchResp

// ===== 批量词典查询（/words）响应 =====
export type WordsLookupResp = {
  task: Task
  items: Record<
    string,
    {
      exists: boolean
      word?: string
      word_norm?: string
      audio?: string
      freq?: number
      tags?: string
    }
  >
}
