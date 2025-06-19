// File: app/api/store/enroll/status/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function POST(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req)
  if (!user || user.role !== 'PARTICIPANT') {
    return NextResponse.json({ error: '仅学生可查看报名状态' }, { status: 403 })
  }

  const body = await req.json()
  const { trackId } = body

  if (!trackId) {
    return NextResponse.json({ error: 'Missing trackId' }, { status: 400 })
  }

  try {
    const enrolled = await prisma.enrolledTrack.findUnique({
      where: {
        userId_trackId_round: {
          userId: user.id,
          trackId,
          round: 1,
        },
      },
    })

    return NextResponse.json({ success: true, enrolled: !!enrolled })
  } catch (err) {
    console.error('❌ 查询报名状态失败:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
