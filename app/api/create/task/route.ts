// app/api/create/task/route.ts

import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const trackId = searchParams.get("trackId")
  const dayIndex = Number(searchParams.get("dayIndex"))

  if (!trackId) {
    return NextResponse.json({ error: "缺少 trackId" }, { status: 400 })
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        trackId,
        ...(isNaN(dayIndex) ? {} : { dayIndex }),
      },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("任务获取失败：", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
