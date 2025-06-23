// File: app/api/store/enroll/status/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req)
    if (!user || user.role !== 'PARTICIPANT') {
      return NextResponse.json(
        { error: '仅学生可查看报名状态' },
        { status: 403 }
      )
    }

    const trackId = req.nextUrl.searchParams.get('trackId')
    if (!trackId) {
      return NextResponse.json({ error: 'Missing trackId' }, { status: 400 })
    }

    const enrolled = await prisma.enrolledTrack.findUnique({
      where: {
        userId_trackId_round: {
          userId: user.id,
          trackId,
          round: 1,
        },
      },
    })

    return NextResponse.json({ success: true, enrolled: Boolean(enrolled) })
  } catch (error) {
    console.error('查询报名状态失败:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
