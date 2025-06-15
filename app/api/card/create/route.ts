// /app/api/card/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { templateId, title, description, mediaUrl, creatorId } = await req.json()

  if (!templateId || !title || !creatorId) {
    return NextResponse.json({ success: false, error: '缺少字段' }, { status: 400 })
  }

  const content = await prisma.cardContent.create({
    data: {
      templateId,
      title,
      description,
      mediaUrl,
      createdById: creatorId,
      tags: [],
    },
  })

  const card = await prisma.card.create({
    data: {
      templateId,
      contentId: content.id,
      creatorId,
      isPublished: false,
    },
  })

  return NextResponse.json({ success: true, cardId: card.id })
}
