// app/api/speaking/[task]/search/route.ts
import { NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'csv-parse/sync'

type Task = 'ra' | 'rs' | 'sgd' | string

type WordRow = {
  id: string
  task?: string
  RAtype?: string
  word: string
  word_norm?: string
  // 统一到 freq：优先 freq_score，其次 freq
  freq?: string | number
  freq_score?: string | number
  audio?: string
  tags?: string
}

type SentenceRow = {
  id: string
  type?: string   // ra | rs | sgd
  task?: string   // 兼容
  text: string
  audio: string
  lesson?: string
  order?: string | number
  tag?: string
}

// ===== caches =====
let WORDS_CACHE: WordRow[] | null = null
let SENTENCES_CACHE: SentenceRow[] | null = null

const DATA_DIR = path.join(process.cwd(), 'data')

// ===== helpers =====
function toNum(v: any, def = 0): number {
  const n = typeof v === 'number' ? v : Number(String(v ?? '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : def
}
function pad4(n: string | number) {
  return String(n).padStart(4, '0')
}
function shuffleInPlace<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
// 小写、去两端符号；保留内部 ' 和 -
function normalizeToken(s: string): string {
  if (!s) return ''
  s = s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').trim()
  s = s.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '')
  s = s.toLowerCase()
  return /[a-z]/.test(s) ? s : ''
}
// 词形/连字符变体（与 /words 接口一致）
function variants(norm: string): string[] {
  const v = new Set<string>()
  v.add(norm)
  if (norm.endsWith('ies') && norm.length > 3) v.add(norm.slice(0, -3) + 'y')
  if (norm.endsWith('es')  && norm.length > 2) v.add(norm.slice(0, -2))
  if (norm.endsWith('s')   && norm.length > 1) v.add(norm.slice(0, -1))
  if (norm.endsWith('ed')  && norm.length > 2) v.add(norm.slice(0, -2))
  if (norm.endsWith('ing') && norm.length > 3) v.add(norm.slice(0, -3))
  if (norm.includes('-')) v.add(norm.replace(/-/g, ''))
  return Array.from(v)
}
function tokenizeSentence(text: string): string[] {
  if (!text) return []
  return text.split(/\s+/).map(normalizeToken).filter(Boolean)
}
function lessonIndex(lesson?: string) {
  if (!lesson) return 0
  const m = String(lesson).match(/(\d+)/)
  return m ? Number(m[1]) : 0
}
function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status })
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
    // 统一词频
    const rawScore = (r as any).freq_score ?? (r as any).freq
    ;(r as any).freq = toNum(rawScore, 0)
  }
  WORDS_CACHE = rows
  return rows
}

function loadSentences(): SentenceRow[] {
  if (SENTENCES_CACHE) return SENTENCES_CACHE
  const file = path.join(DATA_DIR, 'sentences_pte4.csv')
  const raw = fs.readFileSync(file, 'utf8')
  const rows = parse(raw, { columns: true, skip_empty_lines: true, trim: true }) as SentenceRow[]

  for (const r of rows) {
    ;(r as any).task = (r.type || r.task || '').toLowerCase()
  }
  SENTENCES_CACHE = rows
  return rows
}

// ===== main handler =====
export async function GET(req: Request, ctx: { params: { task: string } }) {
  try {
    const url = new URL(req.url)
    const task = (ctx.params.task || '').toLowerCase() as Task
    const mode = (url.searchParams.get('mode') || '').toLowerCase()

    if (!['ra', 'rs', 'sgd'].includes(task)) {
      return bad(400, `Invalid task: ${task}. Allowed: ra, rs, sgd`)
    }
    if (!['word', 'sentence'].includes(mode)) {
      return bad(400, `Missing or invalid mode. Use mode=word|sentence`)
    }

    const q = (url.searchParams.get('q') || '').trim().toLowerCase()
    const lesson = (url.searchParams.get('lesson') || '').trim()
    const page = Math.max(1, toNum(url.searchParams.get('page'), 1))
    const pageSize = Math.min(100, Math.max(1, toNum(url.searchParams.get('pageSize'), 20)))
    const doShuffle = (url.searchParams.get('shuffle') || '').toLowerCase() === 'true'
    const sort = (url.searchParams.get('sort') || 'fixed').toLowerCase() // fixed | lesson | alpha
    const wantTokens = (url.searchParams.get('tokens') || '').toLowerCase() === 'true'
    const withDict = (url.searchParams.get('withDict') || '').toLowerCase() === 'true'

    if (mode === 'word') {
      // --- 单词模式 ---
      const all = loadWords().filter(w => (w.task || '').toLowerCase() === task)

      let items = all
      if (q) {
        items = items.filter(w => {
          const hay = `${w.word || ''} ${w.word_norm || ''} ${w.tags || ''}`.toLowerCase()
          return hay.includes(q)
        })
      }

      if (doShuffle) shuffleInPlace(items)
      else {
        items = items.slice().sort((a, b) => {
          const fa = toNum(a.freq, 0), fb = toNum(b.freq, 0)
          if (fb !== fa) return fb - fa
          return (a.word_norm || '').localeCompare(b.word_norm || '')
        })
      }

      const total = items.length
      const start = (page - 1) * pageSize
      const pageItems = items.slice(start, start + pageSize)

      const data = pageItems.map(w => {
        const fallback = `/audio/word/WORD${pad4(w.id)}.mp3`
        return {
          id: String(w.id),
          word: w.word,
          word_norm: w.word_norm,
          freq: toNum(w.freq, 0),
          audio: w.audio || fallback,
          tags: w.tags || ''
        }
      })

      return NextResponse.json({
        task, mode, total, page, pageSize,
        items: data,
        nextCursor: start + pageSize < total ? { page: page + 1, pageSize } : null
      })
    }

    // --- 句子模式 ---
    const words = loadWords().filter(w => (w.task || '').toLowerCase() === task)
    const wordDict = new Map<string, { audio?: string; freq: number }>()
    for (const w of words) {
      const base = (w.word_norm || normalizeToken(w.word || '')).toLowerCase()
      if (!base) continue
      const forms = new Set<string>([base, ...variants(base)])
      const freq = toNum(w.freq, 0)
      const fallback = `/audio/word/WORD${pad4(w.id)}.mp3`
      for (const k of forms) {
        const prev = wordDict.get(k)
        if (!prev || freq > prev.freq) {
          wordDict.set(k, { audio: w.audio || fallback, freq })
        }
      }
    }

    let items = loadSentences().filter(s => (s.task || '').toLowerCase() === task)

    if (lesson) items = items.filter(s => (s.lesson || '').toLowerCase() === lesson.toLowerCase())
    if (q) {
      items = items.filter(s => {
        const hay = `${s.text || ''} ${s.tag || ''}`.toLowerCase()
        return hay.includes(q)
      })
    }

    if (doShuffle) shuffleInPlace(items)
    else {
      items = items.slice().sort((a, b) => {
        if (sort === 'alpha') {
          return (a.text || '').localeCompare(b.text || '')
        }
        // default: lesson -> order
        const la = lessonIndex(a.lesson), lb = lessonIndex(b.lesson)
        if (la !== lb) return la - lb
        const oa = toNum(a.order, 0), ob = toNum(b.order, 0)
        return oa - ob
      })
    }

    const total = items.length
    const start = (page - 1) * pageSize
    const pageItems = items.slice(start, start + pageSize)

    const respItems = pageItems.map(s => {
      const base: any = {
        id: String(s.id),
        text: s.text,
        audio: s.audio, // 句子 audio 来自 CSV（/audio/sentences/...）
        lesson: s.lesson || null,
        order: s.order ? toNum(s.order, 0) : null,
        tag: s.tag || ''
      }
      if (wantTokens) base.tokens = tokenizeSentence(s.text)
      return base
    })

    let dict: Record<string, { audio?: string; freq: number }> | undefined
    if (wantTokens && withDict) {
      const set = new Set<string>()
      for (const it of respItems) {
        for (const t of (it.tokens as string[] | undefined) || []) set.add(t)
      }
      dict = {}
      let i = 0
      for (const t of set) {
        const hit = wordDict.get(t)
        if (hit) {
          dict[t] = { audio: hit.audio, freq: hit.freq }
          i++
          if (i >= 1000) break // ← 上限从 200 提到 1000
        }
      }
    }

    return NextResponse.json({
      task, mode, total, page, pageSize,
      items: respItems,
      ...(dict ? { dict } : {}),
      nextCursor: start + pageSize < total ? { page: page + 1, pageSize } : null
    })
  } catch (err: any) {
    return bad(500, err?.message || 'Internal error')
  }
}
