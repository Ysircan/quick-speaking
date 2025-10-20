'use client'
import type { Bucket, SortKey, Mode } from '../lib/types'
import { BUCKETS } from '../lib/constants'

export function Toolbar(props: {
  // 新增：模式切换
  mode: Mode
  onMode: (m: Mode) => void

  // 通用：搜索
  q: string
  onQ: (v: string) => void

  // 仅对 mode==='word' 有效
  bucket: Bucket
  onBucket: (b: Bucket) => void
  sort: SortKey
  onSort: (s: SortKey) => void
  onlyFavs: boolean
  onOnlyFavs: (v: boolean) => void
}) {
  const {
    mode, onMode,
    q, onQ,
    bucket, onBucket, sort, onSort, onlyFavs, onOnlyFavs,
  } = props

  const isWord = mode === 'word'
  const inputPlaceholder =
    isWord ? 'Search words (min 2 letters)…' : 'Search sentences or tokens…'

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {/* 模式切换 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onMode('word')}
          className={`px-3 py-2 rounded-lg border ${
            isWord ? 'bg-[#1f1f1f] border-[#3a3a3a]' : 'bg-[#121212] border-[#2a2a2a]'
          }`}
          aria-pressed={isWord}
        >
          Word
        </button>
        <button
          type="button"
          onClick={() => onMode('sentence')}
          className={`px-3 py-2 rounded-lg border ${
            !isWord ? 'bg-[#1f1f1f] border-[#3a3a3a]' : 'bg-[#121212] border-[#2a2a2a]'
          }`}
          aria-pressed={!isWord}
        >
          Sentence
        </button>
      </div>

      {/* 搜索框 */}
      <input
        value={q}
        onChange={(e) => onQ(e.target.value)}
        placeholder={inputPlaceholder}
        className="px-3 py-2 rounded-lg bg-[#151515] border border-[#2a2a2a] outline-none w-72"
      />

      {/* 仅“单词模式”显示：频率分桶 */}
      {isWord && (
        <div className="flex items-center gap-2">
          {BUCKETS.map((b) => (
            <button
              key={b.key}
              onClick={() => onBucket(b.key)}
              className={`px-3 py-2 rounded-lg border ${
                bucket === b.key
                  ? 'bg-[#1f1f1f] border-[#3a3a3a]'
                  : 'bg-[#121212] border-[#2a2a2a]'
              }`}
              title={b.tooltip}
              type="button"
            >
              {b.label}
            </button>
          ))}
        </div>
      )}

      {/* 仅“单词模式”显示：排序 */}
      {isWord && (
        <div className="flex items-center gap-2">
          <label className="text-sm opacity-80">Sort</label>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortKey)}
            className="px-2 py-2 rounded-lg bg-[#151515] border border-[#2a2a2a]"
          >
            <option value="freq">By Frequency</option>
            <option value="alpha">A → Z</option>
          </select>
        </div>
      )}

      {/* 仅“单词模式”显示：收藏筛选 */}
      {isWord && (
        <label className="flex items-center gap-2 ml-auto text-sm">
          <input
            type="checkbox"
            checked={onlyFavs}
            onChange={(e) => onOnlyFavs(e.target.checked)}
          />
          Only Favorites
        </label>
      )}
    </div>
  )
}
