// File: app/api/create/tracklist/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const trackId = params.id

  try {
    // 校验权限
    const track = await prisma.track.findUnique({
      where: { id: trackId },
    })

    if (!track || track.createdById !== user.id) {
      return NextResponse.json({ error: 'Track not found or unauthorized' }, { status: 404 })
    }

    // 开始级联删除所有关联内容 ↓↓↓

    // 删除掉落记录（TaskDrop 关联 Task → Task 属于 Track）
    await prisma.taskDrop.deleteMany({
      where: {
        task: {
          trackId,
        },
      },
    })

    // 删除任务（Task）
    await prisma.task.deleteMany({
      where: {
        trackId,
      },
    })

    // 删除天数配置（TrackDayMeta）
    await prisma.trackDayMeta.deleteMany({
      where: {
        trackId,
      },
    })

    // 删除报名进度（EnrolledDayProgress）
    await prisma.enrolledDayProgress.deleteMany({
      where: {
        trackId,
      },
    })

    // 删除报名记录（EnrolledTrack）
    await prisma.enrolledTrack.deleteMany({
      where: {
        trackId,
      },
    })

    // 最后删除 Track 本体
    await prisma.track.delete({
      where: {
        id: trackId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ 删除失败:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
