// 📄 /app/api/ai/generate/route.ts

import { NextResponse } from "next/server"
import { generatePrompt } from "@/components/ai/generatePrompt"
import { PromptParams } from "@/components/ai/type"

export async function POST(req: Request) {
  try {
    const body: PromptParams = await req.json()

    if (!body.topic || !body.structure || !Array.isArray(body.structure)) {
      return NextResponse.json(
        { success: false, error: "缺少必要参数" },
        { status: 400 }
      )
    }

    const prompt = generatePrompt(body)

    const response = await fetch("https://api.laozhang.ai/v1/chat/completions", {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "chatgpt-4o-latest",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        
      }),
    })

    const data = await response.json()
    console.log("[🧠 AI fetch status]", response.status)
console.log("[🧠 AI fetch body]", data)

    const content = data.choices?.[0]?.message?.content
console.log("[🧠 AI 原始返回内容]", content)

    let questions = []
    try {
      questions = JSON.parse(content)
    } catch (err) {
      return NextResponse.json({
        success: false,
        error: "AI返回内容不是合法JSON，请重试。",
        raw: content,
      })
    }

    return NextResponse.json({ success: true, questions })
  } catch (err: any) {
    console.error("[AI_GENERATE_ERROR]", err)
    return NextResponse.json({
      success: false,
      error: "服务器错误",
    }, { status: 500 })
  }
}