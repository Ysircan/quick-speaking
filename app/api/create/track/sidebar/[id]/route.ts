import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const trackId = context.params.id
  if (!trackId) return NextResponse.json({ error: 'Missing track ID' }, { status: 400 })

  try {
    const track = await prisma.track.findUnique({
      where: {
        id: trackId,
        createdById: user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        durationDays: true,
        isPublished: true,
      },
    })

    if (!track) return NextResponse.json({ error: 'Track not found.' }, { status: 404 })

    return NextResponse.json(track)
  } catch (err) {
    console.error('❌ Error fetching track sidebar:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
