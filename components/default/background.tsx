'use client'

import { useEffect } from 'react'
import { tsParticles } from 'tsparticles-engine'
import { loadFull } from 'tsparticles'

export default function Background() {
  useEffect(() => {
    loadFull(tsParticles).then(() => {
      tsParticles.load('tsparticles', {
        fullScreen: { enable: false },
        particles: {
          number: { value: 70 },
          color: { value: ['#60a5fa', '#c084fc', '#facc15'] },
          shape: { type: 'circle' },
          opacity: { value: 0.2 },
          size: { value: 2 },
          move: {
            enable: true,
            speed: 1,
            outModes: { default: 'bounce' }
          },
          links: {
            enable: true,
            color: '#facc15',
            distance: 120,
            opacity: 0.25,
            width: 1
          }
        },
        background: { color: 'transparent' }
      })
    })
  }, [])

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-sky-900 z-0 overflow-hidden">
      <div
        id="tsparticles"
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />
      <div className="absolute top-[10%] left-1/2 w-[600px] h-[600px] transform -translate-x-1/2 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(202, 138, 255, 0.3), transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
    </div>
  )
}
