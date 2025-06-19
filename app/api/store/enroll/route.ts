import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function POST(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: '未登录，请先登录后再报名训练营' }, { status: 401 })
  }

  // ✅ 拦截 creator 报名行为
  if (user.role !== 'PARTICIPANT') {
    return NextResponse.json({ error: '只有学生账号可以报名训练营' }, { status: 403 })
  }

  const body = await req.json()
  const { trackId } = body

  if (!trackId) {
    return NextResponse.json({ error: 'Missing trackId' }, { status: 400 })
  }

  try {
    const existing = await prisma.enrolledTrack.findUnique({
      where: {
        userId_trackId_round: {
          userId: user.id,
          trackId,
          round: 1,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ success: true, enrolled: existing })
    }

    const enrolled = await prisma.enrolledTrack.create({
      data: {
        userId: user.id,
        trackId,
        round: 1,
      },
    })

    await prisma.enrolledDayProgress.create({
      data: {
        userId: user.id,
        trackId,
        round: 1,
        dayIndex: 1,
        isUnlocked: true,
        unlockedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, enrolled })
  } catch (err) {
    console.error('❌ 报名失败:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
