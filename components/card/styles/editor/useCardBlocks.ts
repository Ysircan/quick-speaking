'use client'

import { useEffect, useState, RefObject } from 'react'

export type BlockType = 'text' | 'image' | 'audio' | 'gif'

export interface Block {
  id: string
  type: 'text' | 'image' | 'audio' | 'gif'
  content: string
  x: number
  y: number
  width?: number
  height?: number
}

export default function useCardBlocks(containerRef: RefObject<HTMLElement | null>) {

  const [blocks, setBlocks] = useState<Block[]>([])
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // 添加各种块
  const addTextBlock = () => {
    const id = `${Date.now()}`
    setBlocks(prev => [...prev, {
      id, type: 'text', content: '点击编辑文字', x: 40, y: 40, scale: 1
    }])
  }

  const addImageBlock = (url: string) => {
    const id = `${Date.now()}`
    setBlocks(prev => [...prev, {
      id, type: 'image', content: url, x: 50, y: 50, scale: 1
    }])
  }

  const addAudioBlock = (url: string) => {
    const id = `${Date.now()}`
    setBlocks(prev => [...prev, {
      id, type: 'audio', content: url, x: 50, y: 50, scale: 1
    }])
  }

  const addGifBlock = (url: string) => {
    const id = `${Date.now()}`
    setBlocks(prev => [...prev, {
      id, type: 'gif', content: url, x: 50, y: 50, scale: 1
    }])
  }

  // 拖动开始
  const startDrag = (e: React.MouseEvent, id: string) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    const element = e.currentTarget as HTMLElement
    if (!containerRect || !element) return

    const elementRect = element.getBoundingClientRect()
    const offsetX = e.clientX - elementRect.left
    const offsetY = e.clientY - elementRect.top

    setDraggingId(id)
    setOffset({ x: offsetX, y: offsetY })
  }

  // 内容更新
  const updateBlockContent = (id: string, newContent: string) => {
    setBlocks(prev =>
      prev.map(block =>
        block.id === id ? { ...block, content: newContent } : block
      )
    )
  }

  // 缩放更新
  const resizeBlock = (id: string, newScale: number) => {
    setBlocks(prev =>
      prev.map(block =>
        block.id === id ? { ...block, scale: newScale } : block
      )
    )
  }

  // 删除
  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id))
  }

  // 拖动逻辑
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingId || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newX = e.clientX - containerRect.left - offset.x
      const newY = e.clientY - containerRect.top - offset.y

      setBlocks(prev =>
        prev.map(block =>
          block.id === draggingId ? { ...block, x: newX, y: newY } : block
        )
      )
    }

    const handleMouseUp = () => setDraggingId(null)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggingId, offset, containerRef])

  return {
    blocks,
    addTextBlock,
    addImageBlock,
    addAudioBlock,
    addGifBlock,
    updateBlockContent,
    resizeBlock,
    deleteBlock,
    startDrag,
  }
}
