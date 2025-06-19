import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

// PUT /api/create/track/[id]/updateDay
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const trackId = params.id
  const { durationDays } = await req.json()

  if (typeof durationDays !== 'number' || durationDays < 1 || durationDays > 365) {
    return NextResponse.json(
      { error: 'Invalid durationDays' },
      { status: 400 }
    )
  }

  try {
    const updatedTrack = await prisma.track.update({
      where: {
        id: trackId,
        createdById: user.id,
      },
      data: {
        durationDays,
      },
    })

    return NextResponse.json({ success: true, track: updatedTrack })
  } catch (err) {
    console.error('❌ Failed to update durationDays:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
