'use client'
import type { WordItem } from '../lib/types'

export function ResultItem({
  it,
  active,
  playing,
  onPlay,
  favored,
  onToggleFav,
}: {
  it: WordItem
  active: boolean
  playing: boolean
  onPlay: () => void
  favored: boolean
  onToggleFav: () => void
}) {
  const icon = active ? (playing ? '⏸' : '▶') : '▶'

  return (
    <li className="flex items-center gap-3 px-3 py-2">
      <button
        type="button"
        onClick={onPlay}
        className={`w-8 h-8 rounded-full text-sm flex items-center justify-center border ${
          active ? 'border-[#55f] bg-[#141633]' : 'border-[#2a2a2a] bg-[#161616]'
        }`}
        title={active ? (playing ? 'Pause' : 'Play') : 'Play'}
        aria-pressed={active && playing}
        aria-label={active ? (playing ? 'Pause' : 'Play') : 'Play'}
      >
        {icon}
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-sm truncate" title={it.word}>
          {it.word}
        </div>
        <div className="text-[11px] opacity-60">
          freq: {Number.isFinite(it.freq as any) ? it.freq : 0}
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleFav}
        className="px-2 py-1 text-lg"
        title={favored ? 'Unfavorite' : 'Favorite'}
        aria-pressed={favored}
        aria-label={favored ? 'Unfavorite' : 'Favorite'}
      >
        {favored ? '★' : '☆'}
      </button>
    </li>
  )
}
