// app/api/speaking/[task]/words/route.ts
import { NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'csv-parse/sync'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type WordRow = {
  id: string
  task?: string
  RAtype?: string
  word: string
  word_norm?: string
  // 兼容两种列名：读取时会统一映射到 freq
  freq?: string | number
  freq_score?: string | number
  audio?: string
  tags?: string
}

let WORDS_CACHE: WordRow[] | null = null
const DATA_DIR = path.join(process.cwd(), 'data')

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status })
}

function toNum(v: any, def = 0): number {
  const n = typeof v === 'number' ? v : Number(String(v ?? '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : def
}

// 与 search 接口一致的规范化：小写、去两端标点，保留内部 ' 和 -
function normalizeToken(s: string): string {
  if (!s) return ''
  s = s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').trim()
  s = s.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '')
  s = s.toLowerCase()
  return /[a-z]/.test(s) ? s : ''
}

function loadWords(): WordRow[] {
  if (WORDS_CACHE) return WORDS_CACHE
  const file = path.join(DATA_DIR, 'word_items_sorted.csv')
  const raw = fs.readFileSync(file, 'utf8')
  const rows = parse(raw, { columns: true, skip_empty_lines: true, trim: true }) as WordRow[]
  for (const r of rows) {
    const task = (r.task || r.RAtype || '').toLowerCase()
    ;(r as any).task = task || 'ra'
    if (!r.word_norm && r.word) (r as any).word_norm = normalizeToken(r.word)
    // 统一词频：优先使用 freq_score，没有再用 freq
    const rawScore = (r as any).freq_score ?? (r as any).freq
    ;(r as any).freq = toNum(rawScore, 0)
  }
  WORDS_CACHE = rows
  return rows
}

// 简单变形：tries->try, studies->study, plurals/ed/ing
function variants(norm: string): string[] {
  const v = new Set<string>()
  v.add(norm)
  if (norm.endsWith('ies') && norm.length > 3) v.add(norm.slice(0, -3) + 'y')
  if (norm.endsWith('es') && norm.length > 2) v.add(norm.slice(0, -2))
  if (norm.endsWith('s') && norm.length > 1) v.add(norm.slice(0, -1))
  if (norm.endsWith('ed') && norm.length > 2) v.add(norm.slice(0, -2))
  if (norm.endsWith('ing') && norm.length > 3) v.add(norm.slice(0, -3))
  return Array.from(v)
}

// ✅ Next 15：第二个参数的 params 需为 Promise<...>
export async function POST(
  req: Request,
  { params }: { params: Promise<{ task: string }> }
) {
  try {
    const { task: rawTask } = await params
    const task = (rawTask || '').toLowerCase()
    if (!['ra', 'rs', 'sgd'].includes(task)) {
      return bad(400, `Invalid task: ${task}. Allowed: ra, rs, sgd`)
    }

    let payload: any = null
    try {
      payload = await req.json()
    } catch {
      return bad(400, 'Body must be JSON: { "words": ["..."] }')
    }

    const wordsInput: unknown = payload?.words
    if (!Array.isArray(wordsInput)) return bad(422, 'Missing "words": string[]')
    if (wordsInput.length === 0) return bad(422, '"words" is empty')
    if (wordsInput.length > 200) return bad(422, '"words" too many; max 200 per request')

    // 建索引：同一个 norm 取最高 freq 的条目
    const rows = loadWords().filter(w => (w.task || '').toLowerCase() === task)
    const index = new Map<string, WordRow>()
    for (const r of rows) {
      const key = (r.word_norm || normalizeToken(r.word || '')).toLowerCase()
      if (!key) continue
      const ex = index.get(key)
      if (!ex || toNum(r.freq, 0) > toNum(ex.freq, 0)) index.set(key, r)
    }

    const result: Record<
      string,
      { exists: boolean; word?: string; word_norm?: string; audio?: string; freq?: number; tags?: string }
    > = {}

    for (const raw of wordsInput) {
      const inputStr = String(raw ?? '')
      const norm = normalizeToken(inputStr)
      let hit: WordRow | undefined

      for (const cand of variants(norm)) {
        const found = index.get(cand)
        if (found) { hit = found; break }
      }

      if (hit) {
        const normKey = (hit.word_norm || normalizeToken(hit.word)).toLowerCase()
        const fallback = `/audio/word/WORD${String(hit.id).padStart(4, '0')}.mp3`
        result[inputStr] = {
          exists: true,
          word: hit.word,
          word_norm: normKey,
          audio: hit.audio || fallback,
          freq: toNum(hit.freq, 0),
          tags: hit.tags || ''
        }
      } else {
        result[inputStr] = { exists: false }
      }
    }

    return NextResponse.json({ task, items: result })
  } catch (err: any) {
    return bad(500, err?.message || 'Internal error')
  }
}
