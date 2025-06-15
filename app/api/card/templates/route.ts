// /app/api/card/templates/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const templates = await prisma.cardTemplate.findMany({
    where: {
      isOfficial: true,
      isAutoDropAllowed: true,
      isHidden: false,
    },
    orderBy: {
      weight: 'desc',
    },
    select: {
      id: true,
      name: true,
      mediaUrl: true,
      mediaType: true,
      rarity: true,
      category: true,
    },
  })

  return NextResponse.json({ success: true, templates })
}
