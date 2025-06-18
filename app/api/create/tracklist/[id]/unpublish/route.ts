// File: app/api/create/tracklist/[id]/unpublish/route.ts

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
      return NextResponse.json({ error: 'Track not found or unauthorized' }, { status: 404 })
    }

    const updated = await prisma.track.update({
      where: { id: trackId },
      data: { isPublished: false },
    })

    return NextResponse.json({ success: true, updated })
  } catch (error) {
    console.error('❌ 撤销发布失败:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
