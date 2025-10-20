'use client'

import { useEffect, useRef, useState } from 'react'

type Item = { id: string; word: string; audio: string; freq: number }
type Bucket = 'all' | 'high' | 'med' | 'low'
type SortKey = 'freq' | 'alpha'

const LS_FAV_KEY = 'speaking_ra_favs_v1'

export default function RAPage() {
  // 查询条件
  const [q, setQ] = useState<string>('')
  const [bucket, setBucket] = useState<Bucket>('all')
  const [sort, setSort] = useState<SortKey>('freq')
  const [onlyFavs, setOnlyFavs] = useState<boolean>(false)

  // 结果与分页
  const [items, setItems] = useState<Item[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // 收藏
  const [favs, setFavs] = useState<Set<string>>(new Set())

  // 播放器
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  // 初始化收藏
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_FAV_KEY)
      if (raw) setFavs(new Set(JSON.parse(raw)))
    } catch {
      // ignore
    }
  }, [])

  const persistFavs = (s: Set<string>) => {
    setFavs(new Set(s))
    try {
      localStorage.setItem(LS_FAV_KEY, JSON.stringify(Array.from(s)))
    } catch {
      // ignore
    }
  }

  // 是否可以触发搜索（避免一次渲染 3000+）
  const canSearch = q.trim().length >= 2 || onlyFavs

  // 条件变化时重置并拉取第一页
  useEffect(() => {
    setItems([])
    setNextCursor(null)
    setTotal(0)
    setError(null)

    if (!canSearch) return
    void fetchPage(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, bucket, sort, onlyFavs])

  async function fetchPage(reset: boolean) {
    if (loading) return
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q.trim().length >= 2) params.set('q', q.trim())
      params.set('bucket', bucket)
      params.set('sort', sort)
      params.set('limit', '20')
      if (!reset && nextCursor) params.set('cursor', nextCursor)

      const res = await fetch(`/api/speaking/ra/search?${params.toString()}`)
      if (!res.ok) throw new Error('bad response')
      const data = (await res.json()) as {
        items: Item[]
        nextCursor: string | null
        totalMatched: number
      }

      // 只看收藏：前端对本页做一次过滤（MVP）
      const page = onlyFavs ? data.items.filter((it) => favs.has(it.id)) : data.items

      setItems((prev) => (reset ? page : prev.concat(page)))
      setNextCursor(data.nextCursor)
      setTotal(onlyFavs ? page.length : data.totalMatched)
      setError(null)
    } catch {
      setError('Load failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function toggleFav(id: string) {
    const s = new Set(favs)
    if (s.has(id)) s.delete(id)
    else s.add(id)
    persistFavs(s)
  }

  function ensureAudio() {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.onended = () => setIsPlaying(false)
      audioRef.current.onerror = () => {
        setIsPlaying(false)
        alert('Audio missing or failed to load.')
      }
    }
    return audioRef.current
  }

  function onPlayClick(item: Item) {
    const audio = ensureAudio()

    // 同一条：切换播放/暂停
    if (currentId === item.id) {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        void audio.play().then(() => setIsPlaying(true))
      }
      return
    }

    // 切换到新音频
    audio.pause()
    audio.src = item.audio
    audio.currentTime = 0
    void audio.play()
      .then(() => {
        setCurrentId(item.id)
        setIsPlaying(true)
      })
      .catch(() => {
        setCurrentId(item.id)
        setIsPlaying(false)
      })
  }

  return (
    <div className="min-h-screen px-4 py-6 text-white bg-[#0b0b0b]">
      <h1 className="text-2xl font-semibold mb-4">Read Aloud (RA)</h1>

      {/* 工具条 */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type at least 2 letters to search…"
          className="px-3 py-2 rounded-lg bg-[#151515] border border-[#2a2a2a] outline-none w-72"
        />

        <div className="flex items-center gap-2">
          {(['all', 'high', 'med', 'low'] as const).map((bk) => (
            <button
              key={bk}
              onClick={() => setBucket(bk)}
              className={`px-3 py-2 rounded-lg border ${
                bucket === bk ? 'bg-[#1f1f1f] border-[#3a3a3a]' : 'bg-[#121212] border-[#2a2a2a]'
              }`}
              title={
                bk === 'all'
                  ? 'All'
                  : bk === 'high'
                  ? 'High freq (≥150)'
                  : bk === 'med'
                  ? 'Medium (60–149)'
                  : 'Low (<60)'
              }
            >
              {bk.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm opacity-80">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="px-2 py-2 rounded-lg bg-[#151515] border border-[#2a2a2a]"
          >
            <option value="freq">By Frequency</option>
            <option value="alpha">A → Z</option>
          </select>
        </div>

        <label className="flex items-center gap-2 ml-auto text-sm">
          <input
            type="checkbox"
            checked={onlyFavs}
            onChange={(e) => setOnlyFavs(e.target.checked)}
          />
          Only Favorites
        </label>
      </div>

      {/* 提示 */}
      {!canSearch && (
        <p className="text-sm text-gray-400 mb-4">
          Enter at least 2 characters to search. Nothing is loaded by default.
        </p>
      )}

      {/* 结果区 */}
      {canSearch && (
        <>
          <div className="text-xs text-gray-400 mb-2">
            {error ? <span className="text-red-400">{error}</span> : <>Matched: <span className="text-gray-200">{total}</span></>}
          </div>

          <ul className="divide-y divide-[#1e1e1e] rounded-lg overflow-hidden bg-[#0f0f0f] border border-[#1b1b1b]">
            {items.map((it) => {
              const active = currentId === it.id
              const playingIcon = active ? (isPlaying ? '⏸' : '▶') : '▶'
              return (
                <li key={`${it.id}-${it.audio}`} className="flex items-center gap-3 px-3 py-2">
                  <button
                    onClick={() => onPlayClick(it)}
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center border ${
                      active ? 'border-[#55f] bg-[#141633]' : 'border-[#2a2a2a] bg-[#161616]'
                    }`}
                    title={active ? (isPlaying ? 'Pause' : 'Play') : 'Play'}
                  >
                    {playingIcon}
                  </button>

                  <div className="flex-1">
                    <div className="text-sm">{it.word}</div>
                    <div className="text-[11px] opacity-60">freq: {it.freq}</div>
                  </div>

                  <button
                    onClick={() => toggleFav(it.id)}
                    className="px-2 py-1 text-lg"
                    title={favs.has(it.id) ? 'Unfavorite' : 'Favorite'}
                  >
                    {favs.has(it.id) ? '★' : '☆'}
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 flex items-center gap-3">
            {nextCursor !== null && (
              <button
                onClick={() => fetchPage(false)}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]"
              >
                {loading ? 'Loading…' : 'Load more'}
              </button>
            )}
            {nextCursor === null && items.length > 0 && (
              <span className="text-xs text-gray-500">No more results.</span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
