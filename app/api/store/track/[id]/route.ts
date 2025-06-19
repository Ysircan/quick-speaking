// File: app/api/store/track/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const trackId = params.id

  try {
    const track = await prisma.track.findUnique({
      where: { id: trackId },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        durationDays: true,
        isPublished: true,
        createdAt: true,
      },
    })

    if (!track || !track.isPublished) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 })
    }

    return NextResponse.json(track)
  } catch (err) {
    console.error('❌ 获取训练营详情失败:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}