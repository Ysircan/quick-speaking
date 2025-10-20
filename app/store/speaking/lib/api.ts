import { searchUrl, wordsLookupUrl } from './constants'
import type { Task, Mode, SearchResp, WordsLookupResp } from './types'

/**
 * 搜索接口
 * 支持 task = ra|rs|sgd
 * 支持 mode = word|sentence
 */
export async function searchSpeaking(
  task: Task,
  mode: Mode,
  opts: {
    q?: string
    lesson?: string
    page?: number
    pageSize?: number
    shuffle?: boolean
    sort?: string
    tokens?: boolean
    withDict?: boolean
  }
): Promise<SearchResp> {
  const p = new URLSearchParams()
  p.set('mode', mode)
  if (opts.q) p.set('q', opts.q)
  if (opts.lesson) p.set('lesson', opts.lesson)
  if (opts.sort) p.set('sort', opts.sort)
  if (opts.page) p.set('page', String(opts.page))
  if (opts.pageSize) p.set('pageSize', String(opts.pageSize))
  if (opts.shuffle) p.set('shuffle', 'true')
  if (opts.tokens) p.set('tokens', 'true')
  if (opts.withDict) p.set('withDict', 'true')

  const res = await fetch(searchUrl(task, p), { cache: 'no-store' })
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  return res.json()
}

/**
 * 批量查单词音频（句子模式点击单词时用）
 */
export async function lookupWords(
  task: Task,
  words: string[]
): Promise<WordsLookupResp> {
  const res = await fetch(wordsLookupUrl(task), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ words }),
  })
  if (!res.ok) throw new Error(`Lookup failed: ${res.status}`)
  return res.json()
}
