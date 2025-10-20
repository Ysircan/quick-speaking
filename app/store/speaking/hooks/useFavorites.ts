'use client'
import { useEffect, useState } from 'react'
import { getFavKey } from '../lib/constants'

/**
 * @param module 模块名 (ra, rs, sgd)
 * @param mode 收藏类型 (word | sentence)
 */
export function useFavorites(module: 'ra' | 'rs' | 'sgd' = 'ra', mode: 'word' | 'sentence' = 'word') {
  const KEY = `${getFavKey(module)}_${mode}` // => speaking_ra_favs_v1_word
  const [set_, setSet] = useState<Set<string>>(new Set())

  // 初始化读取 localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setSet(new Set(JSON.parse(raw)))
    } catch {
      console.warn('Failed to load favorites:', KEY)
    }
  }, [KEY])

  // 切换收藏状态
  const toggle = (id: string) => {
    const s = new Set(set_)
    if (s.has(id)) s.delete(id)
    else s.add(id)
    setSet(new Set(s))
    try {
      localStorage.setItem(KEY, JSON.stringify([...s]))
    } catch {
      console.warn('Failed to save favorites:', KEY)
    }
  }

  // 判断是否收藏
  const has = (id: string) => set_.has(id)

  return { favs: set_, toggle, has }
}
