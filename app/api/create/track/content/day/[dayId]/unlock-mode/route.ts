import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
  params: {
    dayId: string
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const { dayId } = params
  const { unlockMode } = await req.json()

  if (!dayId || !unlockMode) {
    return NextResponse.json({ error: 'Missing dayId or unlockMode' }, { status: 400 })
  }

  try {
    const updated = await prisma.trackDayMeta.update({
      where: { id: dayId },
      data: { unlockMode },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('Failed to update unlockMode:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
