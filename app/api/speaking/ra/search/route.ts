import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/** 配置：CSV 路径（项目根目录 /data/word_items_sorted.csv） */
const CSV_FILE = path.resolve('data/word_items_sorted.csv')

type Row = { id: string; word: string; audio: string; freq: number }
let CACHE: Row[] | null = null

/** 读取并解析 CSV（仅首次读取，进程内缓存） */
function loadCSVOnce(): Row[] {
  if (CACHE) return CACHE

  const raw = fs.readFileSync(CSV_FILE, 'utf-8')
  const lines = raw.split(/\r?\n/).filter(Boolean)
  if (lines.length === 0) return (CACHE = [])

  // 解析表头，兼容多种命名
  const headerCells = lines[0].split(',').map(s => s.trim().toLowerCase())
  const hasHeader = ['id', 'rank', 'word', 'audio', 'audio_url', 'filename', 'freq', 'freq_score', 'frequency', 'count']
    .some(h => headerCells.includes(h))

  let startIdx = 0
  // 默认列序：id, word, audio, freq
  let idxId = 0, idxWord = 1, idxAudio = 2, idxFreq = 3

  if (hasHeader) {
    const h = headerCells
    idxId   = h.findIndex(x => x === 'id' || x === 'rank')
    idxWord = h.findIndex(x => x === 'word')
    idxAudio= h.findIndex(x => x === 'audio' || x === 'audio_url' || x === 'file' || x === 'filename' || x === 'path')
    // 频率列更智能：freq / freq_score / frequency / count / *score*
    idxFreq = h.findIndex(x => /(^freq$|freq_score|frequency|count|score)/i.test(x))
    startIdx = 1
  }

  const rows: Row[] = []
  for (let i = startIdx; i < lines.length; i++) {
    const colsRaw = lines[i].split(',')
    if (!colsRaw.length) continue
    const cols = colsRaw.map(s => s.trim())

    // 取字段（越界则兜底）
    const idCell   = (idxId   >= 0 && idxId   < cols.length) ? cols[idxId]   : String(i - startIdx + 1)
    const wordCell = (idxWord >= 0 && idxWord < cols.length) ? cols[idxWord] : cols[0]
    const audioCell= (idxAudio>= 0 && idxAudio< cols.length) ? cols[idxAudio] : ''
    const freqCellIndex = (idxFreq >= 0 && idxFreq < cols.length) ? idxFreq : cols.length - 1
    // 清洗频率为数字（去掉非数字/小数点/负号）
    const freqStr = (cols[freqCellIndex] ?? '').replace(/[^0-9.\-]/g, '')
    const freqNum = Number(freqStr) || 0

    if (!wordCell) continue

    const idNum = Number(idCell)
    const rank = Number.isFinite(idNum) ? idNum : (i - startIdx + 1)
    const pad4 = String(rank).padStart(4, '0')
    const audio = audioCell || `/audio/word/WORD${pad4}.mp3`

    rows.push({
      id: idCell || String(rank),
      word: wordCell,
      audio,
      freq: freqNum,
    })
  }

  // 默认按频率降序
  rows.sort((a, b) => b.freq - a.freq)
  CACHE = rows
  return rows
}

/** 频率分档：low <5，med 5–10，high >10 */
function inBucket(r: Row, bucket: string) {
  if (bucket === 'high') return r.freq > 10
  if (bucket === 'med')  return r.freq >= 5 && r.freq <= 10
  if (bucket === 'low')  return r.freq < 5
  return true // all
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const q = (url.searchParams.get('q') || '').trim().toLowerCase()
    const limit  = Math.max(1, Math.min(100, Number(url.searchParams.get('limit')) || 20))
    const cursor = Math.max(0, Number(url.searchParams.get('cursor')) || 0)
    const bucket = (url.searchParams.get('bucket') || 'all').toLowerCase() // all|low|med|high
    const sort   = (url.searchParams.get('sort') || 'freq').toLowerCase()  // freq|alpha

    const data = loadCSVOnce()

    // 先分档，再搜索（与前端逻辑一致）
    let pool = data.filter(r => inBucket(r, bucket))
    if (q.length >= 2) pool = pool.filter(r => r.word.toLowerCase().includes(q))

    // 排序
    if (sort === 'alpha') {
      pool = [...pool].sort((a, b) => a.word.localeCompare(b.word))
    } // 否则保持 freq 降序

    // 分页
    const totalMatched = pool.length
    const slice = pool.slice(cursor, cursor + limit)
    const nextCursor = cursor + limit < pool.length ? String(cursor + limit) : null

    return NextResponse.json(
      { items: slice, nextCursor, totalMatched },
      { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=600' } }
    )
  } catch (e: any) {
    console.error('RA /search error:', e?.message || e)
    return NextResponse.json({ items: [], nextCursor: null, totalMatched: 0 }, { status: 500 })
  }
}
