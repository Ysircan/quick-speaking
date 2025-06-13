import ParticlesBackground from "@/components/ParticlesBackground";

export default function Page() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black text-white font-sans">
      <ParticlesBackground />

      {/* Top Navigation */}
      <header className="relative z-10 flex justify-between items-center px-6 py-4">
        <div className="text-xl font-bold">Quick</div>
        <nav className="space-x-6 text-sm">
          <a href="#" className="hover:text-purple-300">Home</a>
          <a href="#" className="hover:text-purple-300">Creator</a>
          <a href="#" className="hover:text-purple-300">Store</a>
          <a href="#" className="hover:text-purple-300">About</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center text-center mt-20 px-4">
        <h1 className="text-5xl font-bold mb-4">Quick</h1>
        <p className="text-sm text-gray-300 mb-2">
          🚀 Your AI-powered teaching assistant – instantly generate learning tasks and engage students with gamified progression.
        </p>
        <p className="text-sm text-gray-400 mb-6">
          "I turn lessons into quests. You’re not just a teacher — you’re the guide of an adventure."
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-6 py-2 rounded-full transition">
          Start Creating Now →
        </button>
        <p className="text-xs text-gray-500 mt-4">Ready to grow? Launch your first learning track today.</p>
      </section>

      {/* Feature Cards */}
      <section className="relative z-10 mt-20 px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="bg-zinc-900 rounded-xl p-6 text-center border border-zinc-800">
          <div className="text-2xl mb-2">🎓</div>
          <h3 className="font-bold text-lg">AI Question Generator</h3>
          <p className="text-sm text-gray-400 mt-1">Upload content or enter a topic — get tailored questions instantly.</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-6 text-center border border-zinc-800">
          <div className="text-2xl mb-2">🔁</div>
          <h3 className="font-bold text-lg">Task-Driven Learning</h3>
          <p className="text-sm text-gray-400 mt-1">Teachers assign daily tasks; students complete them one by one.</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-6 text-center border border-zinc-800">
          <div className="text-2xl mb-2">📈</div>
          <h3 className="font-bold text-lg">Card-Based Progression</h3>
          <p className="text-sm text-gray-400 mt-1">Earn digital cards through learning and collect your growth journey.</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 mt-24 text-center px-6">
        <h2 className="text-xl font-bold mb-6">How Quick Works</h2>
        <div className="flex flex-wrap justify-center items-center text-sm gap-4">
          <div className="bg-zinc-800 px-4 py-2 rounded-full">👩‍🏫 Upload Teaching Material</div>
          <span>→</span>
          <div className="bg-zinc-800 px-4 py-2 rounded-full">🧠 AI Generates Questions</div>
          <span>→</span>
          <div className="bg-zinc-800 px-4 py-2 rounded-full">🧑‍🎓 Students Receive Tasks</div>
          <span>→</span>
          <div className="bg-zinc-800 px-4 py-2 rounded-full">🎁 Earn Cards & Feedback</div>
        </div>
        <p className="text-xs text-gray-500 mt-4">✅ 12+ creators are already using Quick to transform their teaching.</p>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-gray-600 mt-16 pb-8">
        © 2025 Quick Education Platform · Powered by QUICK
      </footer>
    </div>
  );
}
