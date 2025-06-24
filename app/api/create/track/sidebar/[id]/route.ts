import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function GET(
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
      where: {
        id: trackId,
        createdById: user.id,
      },
      include: {
        dayMetas: {
          select: { dayIndex: true },
          orderBy: { dayIndex: 'asc' },
        },
      },
    })

    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 })
    }

    return NextResponse.json({
      title: track.title,
      description: track.description,
      isPublished: track.isPublished,
      dayMetas: track.dayMetas, // ✅ 直接返回 dayIndex 数组
    })
  } catch (err) {
    console.error('❌ Error fetching sidebar data:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
