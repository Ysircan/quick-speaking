// File: app/api/create/task/[taskId]/weight/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function PUT(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { taskId } = params

  try {
    const body = await req.json()
    const { appearanceWeight } = body

    console.log('👀 后端收到 appearanceWeight:', appearanceWeight)

    // ✅ 校验值范围：必须为整数，0 ~ 100
    if (
      typeof appearanceWeight !== 'number' ||
      !Number.isInteger(appearanceWeight) ||
      appearanceWeight < 0 ||
      appearanceWeight > 100
    ) {
      return NextResponse.json(
        { error: 'Invalid appearanceWeight. Must be an integer between 0 and 100.' },
        { status: 400 }
      )
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { appearanceWeight },
    })

    return NextResponse.json({
      success: true,
      message: 'Task appearanceWeight updated successfully.',
      task: {
        id: updated.id,
        appearanceWeight: updated.appearanceWeight,
      },
    })
  } catch (error) {
    console.error('❌ Error updating appearanceWeight:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
