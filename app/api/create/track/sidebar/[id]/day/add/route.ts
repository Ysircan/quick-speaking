// File: D:\quick\app\api\create\track\sidebar\[id]\day\add\route.ts

import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const trackId = params.id

  try {
    // 1. 确认 track 是否属于该用户
    const track = await prisma.track.findUnique({
      where: {
        id: trackId,
        createdById: user.id,
      },
    })

    if (!track) {
      return NextResponse.json({ error: 'Track not found or unauthorized' }, { status: 404 })
    }

    // 2. 找当前最大 dayIndex
    const maxDay = await prisma.trackDayMeta.findFirst({
      where: { trackId },
      orderBy: { dayIndex: 'desc' },
    })

    const nextDayIndex = (maxDay?.dayIndex || 0) + 1

    // 3. 创建新的一天
    const newDay = await prisma.trackDayMeta.create({
      data: {
        trackId,
        dayIndex: nextDayIndex,
        goalType: 'EXERCISE',
        unlockMode: 'DAILY',
        unlockParam: {},
        note: null,
      },
    })

    // ✅ 4. 更新 track.durationDays
    await prisma.track.update({
      where: { id: trackId },
      data: { durationDays: nextDayIndex },
    })

    return NextResponse.json({ success: true, newDay })
  } catch (err) {
    console.error('❌ Error adding day:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
