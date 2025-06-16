// app/api/create/track/daymeta/route.ts

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import getCurrentUserFromRequest from "@/lib/getCurrentUser"

export async function POST(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { trackId, dayIndex, goalType, unlockMode, note } = body

    if (!trackId || !dayIndex || !goalType || !unlockMode) {
      return NextResponse.json({ error: "缺少必要字段" }, { status: 400 })
    }

    // 判断是否存在记录（唯一索引）
    const existing = await prisma.trackDayMeta.findUnique({
      where: {
        trackId_dayIndex: {
          trackId,
          dayIndex,
        },
      },
    })

    let savedMeta

    if (existing) {
      // 更新
      savedMeta = await prisma.trackDayMeta.update({
        where: {
          trackId_dayIndex: {
            trackId,
            dayIndex,
          },
        },
        data: {
          goalType,
          unlockMode,
          note,
        },
      })
    } else {
      // 新建
      savedMeta = await prisma.trackDayMeta.create({
        data: {
          trackId,
          dayIndex,
          goalType,
          unlockMode,
          note,
        },
      })
    }

    return NextResponse.json({ success: true, meta: savedMeta })
  } catch (error) {
    console.error("保存 dayMeta 失败：", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
