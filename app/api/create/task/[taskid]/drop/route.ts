// POST: 配置当前题目的掉落内容
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  context: { params: { taskId: string } }
) {
  const { taskId } = context.params
  const body = await req.json()
  const { cardId, probability, requireCorrectAnswer } = body

  try {
    await prisma.taskDrop.create({
      data: {
        taskId,
        cardId,
        probability: parseFloat(probability),
        requireCorrectAnswer,
      },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DROP CONFIG ERROR]', err)
    return NextResponse.json({ success: false, error: '掉落配置失败' }, { status: 500 })
  }
}
