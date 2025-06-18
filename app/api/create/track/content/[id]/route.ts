// File: app/api/create/track/content/[id]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import getCurrentUserFromRequest from "@/lib/getCurrentUser"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const trackId = params.id

  const track = await prisma.track.findUnique({
    where: {
      id: trackId,
      createdById: user.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      coverImage: true,
      durationDays: true,
      isPublished: true,
    },
  })

  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 })
  }

  return NextResponse.json(track)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const trackId = params.id
  const body = await req.json()
  const { title, description, coverImage } = body

  try {
    const updated = await prisma.track.update({
      where: {
        id: trackId,
        createdById: user.id,
      },
      data: {
        title,
        description,
        coverImage,
      },
    })

    return NextResponse.json({ success: true, track: updated })
  } catch (e) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
