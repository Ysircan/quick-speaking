'use client'

import { useRef, useState, ReactNode } from 'react'

export default function VerticalSplitPanel({
  top,
  bottom,
  initialTopHeight = 60,
}: {
  top: ReactNode
  bottom: ReactNode
  initialTopHeight?: number
}) {
  const [topHeight, setTopHeight] = useState(initialTopHeight)
  const isDragging = useRef(false)

  const startDrag = () => {
    isDragging.current = true
  }

  const stopDrag = () => {
    isDragging.current = false
  }

  const onDrag = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const newHeight = (e.clientY / window.innerHeight) * 100
    if (newHeight > 10 && newHeight < 90) {
      setTopHeight(newHeight)
    }
  }

  return (
    <div
      className="w-full h-full flex flex-col"
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
    >
      {/* 上区 */}
      <div style={{ height: `${topHeight}%` }} className="overflow-auto">
        {top}
      </div>

      {/* 拖动条，自动撑满 main 区域 */}
      <div
        className="h-2 w-full cursor-row-resize bg-white/20 hover:bg-white/40 transition relative z-30"
        onMouseDown={startDrag}
        onMouseUp={stopDrag}
      />

      {/* 下区 */}
      <div className="flex-1 overflow-auto">
        {bottom}
      </div>
    </div>
  )
}
