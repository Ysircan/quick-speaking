// File: D:\quick\app\api\create\tracklist\route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

// GET /api/create/tracklist
export async function GET(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const tracks = await prisma.track.findMany({
      where: {
        createdById: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        coverImage: true,
        durationDays: true,
        isPublished: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ tracks })
  } catch (error) {
    console.error('❌ 获取 track 列表失败:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
