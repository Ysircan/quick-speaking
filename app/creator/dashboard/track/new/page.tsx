'use client'

import DefaultBackground from '@/components/default/background'
import TrackNewWizard from '@/components/tracknew/TrackNewWizard'

export default function NewTrackPage() {
  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden">
      {/* 背景层 - z-0 */}
      <DefaultBackground />

      {/* 内容层 - z-10 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className="w-full max-w-xl">
          <TrackNewWizard />
        </div>
      </div>
    </div>
  )
}
