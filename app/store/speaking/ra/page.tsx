'use client'

import { useEffect, useMemo, useState } from 'react'
import type {
  Mode,
  Bucket,
  SortKey,
  SearchResp,
  WordItem,
  SentenceItem,
  NextCursor,
} from '../lib/types'
import { searchSpeaking } from '../lib/api'
import { useFavorites } from '../hooks/useFavorites'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import { Toolbar } from '../components/Toolbar'
import { ResultList } from '../components/ResultList'
import { Pagination } from '../components/Pagination'

const TASK: 'ra' = 'ra'

export default function RAPage() {
  // —— 查询状态 —— //
  const [mode, setMode] = useState<Mode>('sentence') // 默认句子模式
  const [q, setQ] = useState('')
  const [bucket, setBucket] = useState<Bucket>('all')
  const [sort, setSort] = useState<SortKey>('freq')
  const [onlyFavs, setOnlyFavs] = useState(false)

  // —— 数据状态 —— //
  const [items, setItems] = useState<(WordItem | SentenceItem)[]>([])
  const [dict, setDict] = useState<Record<string, { audio?: string; freq: number }> | undefined>(undefined)
  const [nextCursor, setNextCursor] = useState<NextCursor>(null)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // —— 收藏 & 音频 —— //
  const { favs, toggle: toggleFav, has: isFav } = useFavorites(TASK, mode) // 根据模式分别存收藏
  const { currentId, isPlaying, playItem } = useAudioPlayer()

  // 句子模式：可不强制最小搜索字数；单词模式：最少 2 个字符（你可以按需调整）
  const canSearch = mode === 'word' ? q.trim().length >= 2 || onlyFavs : true

  // 当查询条件变化时重置并搜索
  useEffect(() => {
    resetAndLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, q, bucket, sort, onlyFavs])

  async function resetAndLoad() {
    setItems([])
    setDict(undefined)
    setNextCursor(null)
    setTotal(0)
    setError(null)
    if (!canSearch) return
    await load(true)
  }

  function applyWordClientFilters(list: WordItem[]): WordItem[] {
    // 频率分桶（仅 word 模式）
    let out = list
    if (mode === 'word') {
      out = out.filter((it) => {
        const f = it.freq ?? 0
        if (bucket === 'low') return f < 5
        if (bucket === 'med') return f >= 5 && f <= 10
        if (bucket === 'high') return f > 10
        return true
      })
      if (onlyFavs) out = out.filter((it) => favs.has(it.id))
      // 本地排序（后端已按 freq/alpha，大多数情况下不需要，但保留以兼容你原逻辑）
      if (sort === 'alpha') out = out.slice().sort((a, b) => a.word.localeCompare(b.word))
      else out = out.slice().sort((a, b) => (b.freq ?? 0) - (a.freq ?? 0))
    }
    return out
  }

  async function load(reset: boolean) {
    if (loading) return
    setLoading(true)
    try {
      const nextPage = reset ? 1 : (nextCursor?.page ?? 1)
      const pageSize = mode === 'word' ? 30 : 10

      const resp: SearchResp = await searchSpeaking(TASK, mode, {
        q: q.trim() || undefined,
        page: nextPage,
        pageSize,
        // 句子模式返回 tokens & 本页 dict，单词模式忽略
        tokens: mode === 'sentence',
        withDict: mode === 'sentence',
        // 排序（单词模式有意义；句子默认 lesson/order）
        sort: mode === 'word' ? sort : undefined,
      })

      let pageItems = resp.items
      if (mode === 'word') {
        pageItems = applyWordClientFilters(resp.items as WordItem[])
      }

      setItems((prev) => (reset ? pageItems : prev.concat(pageItems)))
      setTotal(
        mode === 'word' && onlyFavs ? (pageItems as WordItem[]).length : resp.total
      )
      setNextCursor(resp.nextCursor)
      // 句子模式：记住随页词典，供点击 token 播放
      if (resp.mode === 'sentence' && resp.dict) setDict(resp.dict)
      setError(null)
    } catch (e) {
      setError('Load failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // —— 渲染 —— //
  return (
    <div className="min-h-screen px-4 py-6 text-white bg-[#0b0b0b]">
      <h1 className="text-2xl font-semibold mb-4">Read Aloud (RA)</h1>

      <Toolbar
        mode={mode} onMode={setMode}
        q={q} onQ={setQ}
        bucket={bucket} onBucket={setBucket}
        sort={sort} onSort={setSort}
        onlyFavs={onlyFavs} onOnlyFavs={setOnlyFavs}
      />

      {!canSearch && mode === 'word' && (
        <p className="text-sm text-gray-400 mb-4">
          Enter at least 2 characters to search words. Nothing is loaded by default.
        </p>
      )}

      {canSearch && (
        <>
          <div className="text-xs text-gray-400 mb-2">
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : (
              <>
                Matched:{' '}
                <span className="text-gray-200">{total}</span>
              </>
            )}
          </div>

          <ResultList
            mode={mode}
            items={items}
            dict={dict}
            currentId={currentId}
            isPlaying={isPlaying}
            onPlay={(audio, id) => playItem(id ?? 'adhoc', audio)}
            isFav={(id) => isFav(id)}
            toggleFav={(id) => toggleFav(id)}
          />

          <Pagination
            mode={mode}
            hasMore={!!nextCursor}
            loading={loading}
            onMore={() => load(false)}
          />
        </>
      )}
    </div>
  )
}
