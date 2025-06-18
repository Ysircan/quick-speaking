// File: app/api/create/tracklist/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function DELETE(
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

    await prisma.track.delete({
      where: { id: trackId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ 删除失败:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
