// File: D:\quick\app\api\create\track\content\group\route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { dayId, goalType } = await req.json()

    if (!dayId || !goalType) {
      return NextResponse.json({ error: 'Missing dayId or goalType' }, { status: 400 })
    }

    // 查找当前 day 下已有的 TaskGroup，用于计算顺序
    const existingGroups = await prisma.taskGroup.findMany({
      where: { dayId },
      orderBy: { order: 'asc' },
    })

    const newOrder = existingGroups.length

    const newGroup = await prisma.taskGroup.create({
      data: {
        dayId,
        goalType,
        order: newOrder,
      },
    })

    return NextResponse.json(newGroup)
  } catch (err) {
    console.error('Failed to create TaskGroup:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
