// File: app/api/create/tracklist/[id]/publish/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const trackId = params.id

  try {
    const track = await prisma.track.findUnique({
      where: { id: trackId },
    })

    if (!track || track.createdById !== user.id) {
      return NextResponse.json({ error: 'Track not found or not owned' }, { status: 404 })
    }

    const updated = await prisma.track.update({
      where: { id: trackId },
      data: { isPublished: true },
    })

    return NextResponse.json({ success: true, updated })
  } catch (err) {
    console.error('❌ 发布失败:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
