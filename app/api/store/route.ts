// D:\quick\app\api\store\tracks\route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const tracks = await prisma.track.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tracks)
  } catch (err) {
    console.error('❌ 获取商城 track 列表失败:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
