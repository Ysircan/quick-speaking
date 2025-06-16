// pages/api/ai/generate/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  const questions = [
    { id: 'mock-1', type: 'FILL_IN_BLANK', content: '8 + 32 = ?', answer: '40', options: [], explanation: '将 8 和 32 相加，结果是 40。' },
    { id: 'mock-2', type: 'FILL_IN_BLANK', content: '30 + 34 = ?', answer: '64', options: [], explanation: '将 30 和 34 相加，结果是 64。' },
    { id: 'mock-3', type: 'FILL_IN_BLANK', content: '47 + 45 = ?', answer: '92', options: [], explanation: '将 47 和 45 相加，结果是 92。' },
    { id: 'mock-4', type: 'FILL_IN_BLANK', content: '27 + 23 = ?', answer: '50', options: [], explanation: '将 27 和 23 相加，结果是 50。' },
    { id: 'mock-5', type: 'FILL_IN_BLANK', content: '40 + 12 = ?', answer: '52', options: [], explanation: '将 40 和 12 相加，结果是 52。' },
    { id: 'mock-6', type: 'FILL_IN_BLANK', content: '47 + 28 = ?', answer: '75', options: [], explanation: '将 47 和 28 相加，结果是 75。' },
    { id: 'mock-7', type: 'FILL_IN_BLANK', content: '23 + 42 = ?', answer: '65', options: [], explanation: '将 23 和 42 相加，结果是 65。' },
    { id: 'mock-8', type: 'FILL_IN_BLANK', content: '24 + 4 = ?', answer: '28', options: [], explanation: '将 24 和 4 相加，结果是 28。' },
    { id: 'mock-9', type: 'FILL_IN_BLANK', content: '11 + 16 = ?', answer: '27', options: [], explanation: '将 11 和 16 相加，结果是 27。' },
    { id: 'mock-10', type: 'FILL_IN_BLANK', content: '30 + 22 = ?', answer: '52', options: [], explanation: '将 30 和 22 相加，结果是 52。' },
  ]

  return NextResponse.json({ success: true, questions })
}
