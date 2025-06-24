// File: D:\quick\app\api\create\track\sidebar\[id]\day\[dayIndex]\delete\route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; dayIndex: string } }
) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const trackId = params.id
  const dayIndex = parseInt(params.dayIndex, 10)

  if (isNaN(dayIndex)) {
    return NextResponse.json({ error: 'Invalid day index' }, { status: 400 })
  }

  try {
    // 验证 Track 是否归属当前用户
    const track = await prisma.track.findUnique({
      where: {
        id: trackId,
        createdById: user.id,
      },
    })

    if (!track) {
      return NextResponse.json({ error: 'Track not found or unauthorized' }, { status: 404 })
    }

    // 查找要删除的 dayMeta
    const existingDay = await prisma.trackDayMeta.findUnique({
      where: {
        trackId_dayIndex: {
          trackId,
          dayIndex,
        },
      },
    })

    if (!existingDay) {
      return NextResponse.json({ error: 'Day not found' }, { status: 404 })
    }

    await prisma.trackDayMeta.delete({
      where: {
        trackId_dayIndex: {
          trackId,
          dayIndex,
        },
      },
    })

    return NextResponse.json({ success: true, deletedDayIndex: dayIndex })
  } catch (err) {
    console.error('❌ Error deleting day:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
