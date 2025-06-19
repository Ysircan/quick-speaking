// File: app/api/create/track/content/[id]/day/[dayIndex]/tasks/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; dayIndex: string } }
) {
  try {
    const user = await getCurrentUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: trackId, dayIndex } = params
    const day = parseInt(dayIndex)

    if (isNaN(day)) {
      return NextResponse.json({ error: 'Invalid dayIndex' }, { status: 400 })
    }

    const track = await prisma.track.findUnique({
      where: { id: trackId },
      select: { createdById: true },
    })

    if (!track || track.createdById !== user.id) {
      return NextResponse.json({ error: 'Track not found or access denied' }, { status: 404 })
    }

    const tasks = await prisma.task.findMany({
      where: {
        trackId,
        dayIndex: day,
      },
      orderBy: {
        order: 'asc',
      },
     select: {
  id: true,
  type: true,
  order: true,
  appearanceWeight: true,
  createdAt: true,
  content: true,         // ← 题干
 correctAnswer: true,          // ← 正确答案
  explanation: true,     // ← 可选解释
}
,
    })

    return NextResponse.json(tasks)
  } catch (error: any) {
    console.error('[GET /track/content/:id/day/:dayIndex/tasks] 错误：', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
