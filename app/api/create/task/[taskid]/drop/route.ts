// /app/api/create/task/[taskId]/drop/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { taskId: string } }) {
  const taskId = params.taskId
  const drops = await req.json()

  if (!Array.isArray(drops) || drops.length === 0) {
    return NextResponse.json({ success: false, error: '缺少掉卡配置' }, { status: 400 })
  }

  try {
    // 删除旧的绑定（若存在）
    await prisma.taskDrop.deleteMany({ where: { taskId } })

    // 批量写入新卡牌绑定
    await prisma.taskDrop.createMany({
      data: drops.map((d: any) => ({
        taskId,
        cardId: d.cardId,
        probability: d.probability || 1.0,
        description: d.description || '',
        requireCorrectAnswer: d.requireCorrectAnswer || false,
        startAt: d.startAt ? new Date(d.startAt) : null,
        endAt: d.endAt ? new Date(d.endAt) : null,
      })),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('绑定卡牌失败:', err)
    return NextResponse.json({ success: false, error: '服务器错误' }, { status: 500 })
  }
}
