'use client'
import type { WordItem, SentenceItem, Mode } from '../lib/types'
import { ResultItem } from './ResultItem'

function isWordItem(x: any): x is WordItem {
  // 有 word 且没有 text 基本可以认定是单词项
  return x && typeof x === 'object' && typeof x.word === 'string' && x.text === undefined
}
function isSentenceItem(x: any): x is SentenceItem {
  return x && typeof x === 'object' && typeof x.text === 'string'
}

export function ResultList(props: {
  mode: Mode
  items: (WordItem | SentenceItem)[]
  currentId: string | null
  isPlaying: boolean
  onPlay: (audio: string, id?: string) => void
  isFav: (id: string) => boolean
  toggleFav: (id: string) => void
  dict?: Record<string, { audio?: string; freq?: number }>
  onAskToken?: (token: string) => Promise<string | undefined>
}) {
  const { mode, items, currentId, isPlaying, onPlay, isFav, toggleFav, dict, onAskToken } = props

  return (
    <ul className="divide-y divide-[#1e1e1e] rounded-lg overflow-hidden bg-[#0f0f0f] border border-[#1b1b1b]">
      {items.map((it) => {
        // 先按数据实际类型渲染；不要只信 mode，避免切换时的“混合帧”
        if (isWordItem(it)) {
          const w = it
          return (
            <ResultItem
              key={`${w.id}-${w.audio}`}
              it={w}
              active={currentId === w.id}
              playing={isPlaying && currentId === w.id}
              onPlay={() => onPlay(w.audio, w.id)}
              favored={isFav(w.id)}
              onToggleFav={() => toggleFav(w.id)}
            />
          )
        }

        if (isSentenceItem(it)) {
          const s = it
          const active = currentId === s.id
          const icon = active ? (isPlaying ? '⏸' : '▶') : '▶'

          // 优先用后端 tokens；否则用最保守的分词（避免对 undefined 取 split）
          const tokens = (s as any).tokens as string[] | undefined
          const words = Array.isArray(tokens) && tokens.length > 0
            ? tokens
            : (typeof s.text === 'string' ? s.text.split(/\s+/) : [])

          return (
            <li key={s.id} className={`px-3 py-2 ${active ? 'bg-[#161616]' : ''}`}>
              <div className="flex items-start gap-3">
                {/* 句子播放按钮 */}
                <button
                  type="button"
                  onClick={() => onPlay(s.audio, s.id)}
                  className={`mt-1 w-8 h-8 rounded-full text-sm flex items-center justify-center border ${
                    active ? 'border-[#55f] bg-[#141633]' : 'border-[#2a2a2a] bg-[#161616]'
                  }`}
                  title={active ? (isPlaying ? 'Pause' : 'Play') : 'Play'}
                  aria-pressed={active && isPlaying}
                >
                  {icon}
                </button>

                {/* 文本 + 点词播放 */}
                <div className="flex-1 leading-relaxed">
                  <div
                    className="cursor-pointer select-text"
                    onClick={() => onPlay(s.audio, s.id)}
                    title="Play sentence"
                  >
                    {words.map((w, i) => {
                      const norm = String(w).toLowerCase().replace(/^[^a-z']+|[^a-z']+$/gi, '')
                      const d = norm ? dict?.[norm] : undefined

                      const clickToken = async (e: React.MouseEvent) => {
                        e.stopPropagation()
                        // 优先用现有 dict；否则（有 onAskToken 时）尝试即时查询
                        const audio =
                          d?.audio ||
                          (onAskToken ? await onAskToken(norm) : undefined)
                        if (audio) onPlay(audio, `word-${norm}`)
                      }

                      const clickable = !!(d?.audio || onAskToken) && !!norm
                      return (
                        <span
                          key={`${s.id}-${i}-${w}`}
                          onClick={clickable ? clickToken : undefined}
                          className={
                            clickable
                              ? 'text-blue-400 hover:underline cursor-pointer'
                              : ''
                          }
                          title={
                            d?.freq
                              ? `freq ${d.freq}`
                              : clickable
                              ? 'Click to play/lookup'
                              : undefined
                          }
                        >
                          {String(w) + (i === words.length - 1 ? '' : ' ')}
                        </span>
                      )
                    })}
                  </div>

                  <div className="mt-1 text-[11px] opacity-60">
                    {s.lesson ? `Lesson ${s.lesson}` : ''} {s.order ? `· #${s.order}` : ''} {s.tag ? `· ${s.tag}` : ''}
                  </div>
                </div>
              </div>
            </li>
          )
        }

        // 数据既不是 word 也不是 sentence（切换瞬间或异常项）→ 安全跳过
        return null
      })}
    </ul>
  )
}
