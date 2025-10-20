'use client'
import { useRef, useState } from 'react'

export function useAudioPlayer() {
  const ref = useRef<HTMLAudioElement | null>(null)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string | null>(null)

  const ensure = () => {
    if (!ref.current) {
      ref.current = new Audio()
      ref.current.onended = () => setIsPlaying(false)
      ref.current.onerror = () => setIsPlaying(false)
    }
    return ref.current
  }

  /**
   * 播放某个音频
   * @param id 唯一标识（单词/句子）
   * @param src 音频路径
   * @param autoReset 若切换句子时自动重置状态
   */
  const playItem = (id: string, src: string, autoReset = true) => {
    const a = ensure()

    // 同一个资源，切换播放/暂停
    if (currentId === id && currentSrc === src) {
      if (isPlaying) {
        a.pause()
        setIsPlaying(false)
      } else {
        a.play().then(() => setIsPlaying(true)).catch(() => {})
      }
      return
    }

    // 不同资源：重新播放
    a.pause()
    a.src = src
    a.currentTime = 0
    a.play()
      .then(() => {
        setCurrentId(id)
        setCurrentSrc(src)
        setIsPlaying(true)
      })
      .catch(() => {
        if (autoReset) {
          setCurrentId(id)
          setIsPlaying(false)
        }
      })
  }

  const stop = () => {
    const a = ref.current
    if (!a) return
    a.pause()
    setIsPlaying(false)
  }

  return { currentId, isPlaying, playItem, stop }
}
