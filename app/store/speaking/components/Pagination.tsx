'use client'
import type { Mode } from '../lib/types'

export function Pagination({
  mode,
  hasMore,
  loading,
  onMore,
}: {
  mode: Mode
  hasMore: boolean
  loading: boolean
  onMore: () => void
}) {
  return (
    <div className="mt-4 flex items-center gap-3 justify-center">
      {hasMore ? (
        <button
          onClick={onMore}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]"
        >
          {loading
            ? `Loading ${mode === 'word' ? 'words…' : 'sentences…'}`
            : 'Load more'}
        </button>
      ) : (
        <span className="text-xs text-gray-500">No more {mode}s.</span>
      )}
    </div>
  )
}
