'use client'

import Link from 'next/link'

export default function NewCardPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold mb-4">🧩 卡牌制作页面</h1>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        此处将支持从模板创建新卡牌，添加标题、描述、媒体资源等。
        <br />
        当前为占位页，功能开发中...
      </p>
      <Link
        href="/creator/dashboard"
        className="text-blue-400 underline hover:text-blue-300"
      >
        ← 返回创作者面板
      </Link>
    </div>
  )
}
