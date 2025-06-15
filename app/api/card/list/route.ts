// /app/api/card/list/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const creatorId = searchParams.get('creatorId')

  if (!creatorId) {
    return NextResponse.json({ success: false, error: '缺少 creatorId' }, { status: 400 })
  }

  const cards = await prisma.card.findMany({
    where: { creatorId },
    include: {
      content: true,
      template: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ success: true, cards })
}
