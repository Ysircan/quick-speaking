import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      mediaUrl,
      mediaType,
      rarity,
      isAutoDropAllowed,
      isHidden = false,
      weight = 100,
      category
    } = await req.json()

    // 校验必要字段
    if (!name || !mediaUrl || !mediaType || !rarity || typeof isAutoDropAllowed !== 'boolean') {
      return NextResponse.json(
        { success: false, error: '缺少必要字段' },
        { status: 400 }
      )
    }

    // 写入数据库
    const newTemplate = await prisma.cardTemplate.create({
      data: {
        name,
        mediaUrl,
        mediaType,
        rarity,
        isOfficial: true,           // ✅ 平台模板标记
        isAutoDropAllowed,
        isHidden,
        weight,
        category
      }
    })

    return NextResponse.json({ success: true, template: newTemplate })
  } catch (err) {
    console.error('卡牌模板创建失败:', err)
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    )
  }
}
