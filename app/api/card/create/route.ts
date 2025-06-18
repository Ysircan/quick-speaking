// /app/api/card/create/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const {
      templateId,
      title,
      description,
      mediaUrl,
      mediaType,
      extraUrl,
      tags = [],
      language = 'zh',
      icon,
      creatorId,
      blocks, // 👈 blocks 内容（老师拖拽设计的组件）
    } = await req.json()

    if (!templateId || !title || !creatorId || !blocks) {
      return NextResponse.json(
        { success: false, error: '缺少字段' },
        { status: 400 }
      )
    }

    // 创建 CardContent（样板内容）
    const content = await prisma.cardContent.create({
      data: {
        templateId,
        title,
        description,
        mediaUrl,
        mediaType,
        extraUrl,
        tags,
        icon,
        language,
        createdById: creatorId,
        // 将 blocks 存为 JSON 格式
        // ⚠️ 你需要在数据库中添加 blocks 字段（Json 类型）
        blocks,
      },
    })

    // 创建 Card（卡牌本体）
    const card = await prisma.card.create({
      data: {
        templateId,
        contentId: content.id,
        creatorId,
        isPublished: false,
      },
    })

    return NextResponse.json({
      success: true,
      cardId: card.id,
      contentId: content.id,
    })
  } catch (err) {
    console.error('[CARD_CREATE_ERROR]', err)
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
