import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  context: { params: { taskId: string } }
) {
  const { taskId } = context.params

  if (!taskId) {
    return NextResponse.json({ success: false, error: '任务 ID 缺失' }, { status: 400 })
  }

  try {
    await prisma.task.delete({
      where: { id: taskId },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除任务失败:', error)
    return NextResponse.json({ success: false, error: '服务器内部错误' }, { status: 500 })
  }
}
