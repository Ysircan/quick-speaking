// File: app/api/create/track/new/upload-cover/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function POST(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileExt = file.name.split('.').pop()
    const filename = `${randomUUID()}.${fileExt}`
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename)

    await writeFile(filePath, buffer)

    // 返回可访问路径
    const url = `/uploads/${filename}`
    return NextResponse.json({ url })
  } catch (err) {
    console.error('❌ Image upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
