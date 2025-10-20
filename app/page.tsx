'use client'

import ParticlesBackground from '@/components/ParticlesBackground'
import Navbar from '@/components/default/Navbar'

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black text-white font-sans">
      {/* 粒子背景层 */}
      <ParticlesBackground />

      {/* 顶部导航栏 */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Hero 区域 */}
      <section className="relative z-10 flex flex-col items-center text-center mt-24 px-4">
        <h1 className="text-5xl font-bold mb-4">Quick</h1>
        <p className="text-sm text-gray-300 mb-2">
           Your AI-powered teaching assistant – instantly generate learning tasks and engage students with gamified progression.
        </p>
        <p className="text-sm text-gray-400 mb-6">
          "I turn lessons into quests. You’re not just a teacher — you’re the guide of an adventure."
        </p>
        <button className="bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-semibold px-6 py-2 rounded-full transition">
          Start Creating Now →
        </button>
        <p className="text-xs text-gray-500 mt-4">
          Ready to grow? Launch your first learning track today.
        </p>
      </section>

      {/* 功能卡片区域 */}
      <section className="relative z-10 mt-20 px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          {
            
            title: 'AI Question Generator',
            desc: 'Upload content or enter a topic — get tailored questions instantly.',
          },
          {
            
            title: 'Task-Driven Learning',
            desc: 'Teachers assign daily tasks; students complete them one by one.',
          },
          {
            
            title: 'Card-Based Progression',
            desc: 'Earn digital cards through learning and collect your growth journey.',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-zinc-900 rounded-xl p-6 text-center border border-zinc-800"
          >
           
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* How It Works 区块 */}
      <section className="relative z-10 mt-24 text-center px-6">
        <h2 className="text-xl font-bold mb-6">How Quick Works</h2>
        <div className="flex flex-wrap justify-center items-center text-sm gap-4">
          <div className="bg-zinc-800 px-4 py-2 rounded-full"> Upload Teaching Material</div>
          <span>→</span>
          <div className="bg-zinc-800 px-4 py-2 rounded-full"> AI Generates Questions</div>
          <span>→</span>
          <div className="bg-zinc-800 px-4 py-2 rounded-full"> Students Receive Tasks</div>
          <span>→</span>
          <div className="bg-zinc-800 px-4 py-2 rounded-full"> Earn Cards & Feedback</div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          12+ students are already using Quick to transform their teaching.
        </p>
      </section>

      {/* 页脚 */}
      <footer className="relative z-10 text-center text-xs text-gray-600 mt-16 pb-8">
        © 2025 Quick Education Platform · Powered by QUICK
      </footer>
    </div>
  )
}
