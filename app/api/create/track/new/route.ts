// route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function POST(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      title,
      description,
      coverImage,
      durationDays,
      tags,
      recommendedFor,
      lang,
    } = body

    // 基本校验
    if (!title || typeof durationDays !== 'number' || durationDays < 1) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
    }

    // 创建 Track 本体
    const newTrack = await prisma.track.create({
      data: {
        title,
        description: description || '',
        coverImage: coverImage || null,
        durationDays,
        createdById: user.id,
        tags: tags || [],
        recommendedFor: recommendedFor || [],
        lang: lang || 'en',
      },
    })

    // 🧠 创建默认天数配置
    await prisma.trackDayMeta.createMany({
      data: Array.from({ length: durationDays }, (_, i) => ({
        trackId: newTrack.id,
        dayIndex: i + 1,
        goalType: 'CHECKIN',   // 默认任务目标类型
        unlockMode: 'DAILY',   // 默认解锁方式
      })),
    })

    return NextResponse.json({ trackId: newTrack.id }, { status: 201 })
  } catch (error) {
    console.error('❌ Failed to create track:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
