'use client'

import { useRouter } from 'next/navigation'

export default function SpeakingPage() {
  const router = useRouter()

  const sections = [
    { id: 'ra', name: 'Read Aloud (RA)' },
    { id: 'rs', name: 'Repeat Sentence (RS)' },
    { id: 'di', name: 'Describe Image (DI)' },
    { id: 'sgd', name: 'Summarize Graph/Diagram (SGD)' },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f] text-white">
      <h1 className="text-3xl font-bold mb-8">Speaking Module</h1>

      <div className="grid grid-cols-2 gap-6">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => router.push(`/store/speaking/${sec.id}`)}
            className="px-6 py-4 bg-[#1f1f1f] rounded-2xl hover:bg-[#2a2a2a] transition-all shadow-md text-lg"
          >
            {sec.name}
          </button>
        ))}
      </div>
    </div>
  )
}
