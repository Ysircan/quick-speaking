import type { Bucket } from './types'

// 收藏 key（保持原逻辑）
export const FAV_KEYS = {
  ra: 'speaking_ra_favs_v1',
  rs: 'speaking_rs_favs_v1',
  sgd: 'speaking_sgd_favs_v1',
} as const

export const getFavKey = (mod: keyof typeof FAV_KEYS) => FAV_KEYS[mod]

// =======================
// 统一 API 路径前缀
// =======================
export const SPEAKING_BASE = '/api/speaking'

/**
 * 构造搜索接口 URL
 * @param task ra | rs | sgd
 * @param params URLSearchParams
 */
export const searchUrl = (
  task: 'ra' | 'rs' | 'sgd',
  params: URLSearchParams
) => `${SPEAKING_BASE}/${task}/search?${params.toString()}`

/**
 * 批量查单词音频 URL（句子模式用）
 */
export const wordsLookupUrl = (task: 'ra' | 'rs' | 'sgd') =>
  `${SPEAKING_BASE}/${task}/words`

// =======================
// 频率分桶（保持原逻辑）
// =======================
export const BUCKETS: { key: Bucket; label: string; tooltip: string }[] = [
  { key: 'all', label: 'All', tooltip: 'All frequencies' },
  { key: 'low', label: '< 5', tooltip: 'Frequency below 5' },
  { key: 'med', label: '5–10', tooltip: 'Frequency between 5 and 10' },
  { key: 'high', label: '> 10', tooltip: 'Frequency above 10' },
]
