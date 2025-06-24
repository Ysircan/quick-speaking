import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
  params: {
    id: string          // trackId
    dayIndex: string    // day index (string from URL)
  }
}

export async function GET(req: Request, { params }: Params) {
  const { id: trackId, dayIndex } = params

  if (!trackId || !dayIndex) {
    return NextResponse.json({ error: 'Missing trackId or dayIndex' }, { status: 400 })
  }

  const index = parseInt(dayIndex)
  if (isNaN(index)) {
    return NextResponse.json({ error: 'Invalid dayIndex' }, { status: 400 })
  }

  try {
    // 先查找到对应的 TrackDayMeta
    const dayMeta = await prisma.trackDayMeta.findFirst({
      where: {
        trackId,
        dayIndex: index,
      },
    })

    if (!dayMeta) {
      return NextResponse.json({ error: 'Day not found' }, { status: 404 })
    }

    // 查找该 Day 下所有 TaskGroup，按顺序返回
    const groups = await prisma.taskGroup.findMany({
      where: {
        dayId: dayMeta.id,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        goalType: true,
        order: true,
        dayId: true,
        createdAt: true,
      },
    })

    return NextResponse.json(groups)
  } catch (err) {
    console.error('Failed to fetch task groups:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
