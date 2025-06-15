// 📄 /app/api/ai/modify/route.ts

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { original, instruction } = body

    if (!original || !instruction) {
      return NextResponse.json(
        { success: false, error: "缺少原题或修改指令" },
        { status: 400 }
      )
    }

    // === 🧠 Step 1: 教师意图识别（关键词解析） ===
    let forceType = ""
    let simplify = false
    let rewriteStyle = ""
    let extraNotes = ""

    const lowerInst = instruction.toLowerCase()

    if (instruction.includes("填空")) forceType = "填空题"
    if (instruction.includes("简答")) forceType = "简答题"
    if (instruction.includes("选择")) forceType = "选择题"

    if (instruction.match(/(太难|简化|看不懂|干扰项太多|太长)/)) simplify = true

    if (instruction.match(/文言文|白话文|网络语言|更口语|更书面|更通俗|更高级/)) {
      rewriteStyle = instruction.match(/(文言文|白话文|网络语言|更口语|更书面|更通俗|更高级)/)?.[0] || ""
    }

    extraNotes = instruction.replace(/(填空|简答|选择|太难|简化|看不懂|干扰项太多|太长|文言文|白话文|网络语言|更口语|更书面|更通俗|更高级)/g, "").trim()

    // === 🪄 Step 2: 构造 Prompt ===
    const prompt = `
你是一位中文教育命题专家，请根据老师的修改要求，对原始题目进行调整：

🧾【原始题目】
${JSON.stringify(original, null, 2)}

📌【修改要求】
${instruction}

🎯【出题要求】
- 若教师要求指定题型，请优先使用：${forceType || "（未指定）"}
- 若题目过难、结构复杂或老师有明确提示，请进行简化：${simplify ? "是" : "否"}
- 若老师希望更改语言风格，请修改为：${rewriteStyle || "原风格"}
- 额外说明：${extraNotes || "无"}

✅ 请输出符合以下 JSON 格式的修改后题目（严格结构，禁止任何注释）：
{
  "type": "选择题" | "填空题" | "简答题",
  "question": "题干内容",
  "options": ["选项A", "选项B", "选项C", "选项D"], // 若无可省略
  "answer": "正确答案"
}
    `.trim()

    // === 🤖 Step 3: 调用 AI 接口 ===
    const res = await fetch("https://api.laozhang.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "chatgpt-4o-latest",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    })

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content

    // === 🧪 Step 4: 解析 JSON ===
    let result = null
    try {
      result = JSON.parse(content)

      // 容错补全 type 字段
      if (!result.type) {
        if (Array.isArray(result.options)) result.type = "选择题"
        else if (result.question?.includes("___") || result.question?.includes("（ ）")) result.type = "填空题"
        else result.type = "简答题"
      }
    } catch (e) {
      return NextResponse.json({
        success: false,
        error: "AI返回内容不是合法JSON",
        raw: content,
      })
    }

    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    console.error("[AI_MODIFY_ERROR]", err)
    return NextResponse.json(
      { success: false, error: "服务器错误：" + err.message },
      { status: 500 }
    )
  }
}
